"use server";

import crypto from "node:crypto";
import { and, desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import {
  invitations,
  organizationMembers,
  organizations,
  user,
  type OrgMemberRole,
} from "@/db/schema";
import { requireSession } from "@/server/auth";
import { assertCanManage } from "@/server/memberships";
import { sendEmail } from "@/lib/email";
import { InvitationEmail } from "@/emails/invitation";
import {
  createInvitationSchema,
  type CreateInvitationInput,
} from "@/lib/validations/invitation";

const ROLE_LABELS: Record<string, string> = {
  validator: "validador",
  pr_member: "RR.PP.",
  pr_manager: "responsable de RR.PP.",
  organizer: "organizador",
};

function token() {
  return crypto.randomBytes(24).toString("base64url");
}

async function assertCanInvite(input: {
  organizationId?: string;
  userId: string;
  inviterRole?: string;
}) {
  if (!input.organizationId) {
    if (input.inviterRole !== "admin")
      throw new Error("Selecciona una organización para la invitación");
    return null;
  }
  await assertCanManage(input.organizationId, input.userId, input.inviterRole);
  const [org] = await db
    .select()
    .from(organizations)
    .where(and(eq(organizations.id, input.organizationId), isNull(organizations.deletedAt)))
    .limit(1);
  if (!org) throw new Error("Organización no encontrada");
  return org;
}

// Mapeo del role de invitación al rol de membership (1:1 hoy)
const INVITATION_TO_MEMBER: Record<string, OrgMemberRole> = {
  validator: "validator",
  pr_member: "pr_member",
  pr_manager: "pr_manager",
  organizer: "organizer",
};

export async function createInvitation(input: CreateInvitationInput) {
  const session = await requireSession();
  const data = createInvitationSchema.parse(input);
  const inviterRole = (session.user as { role?: string }).role;

  const org = await assertCanInvite({
    organizationId: data.organizationId,
    userId: session.user.id,
    inviterRole,
  });

  const t = token();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

  const [created] = await db
    .insert(invitations)
    .values({
      email: data.email.toLowerCase().trim(),
      role: data.role,
      organizationId: data.organizationId ?? null,
      token: t,
      invitedBy: session.user.id,
      expiresAt,
      message: data.message || null,
    })
    .returning();

  const url = `${env.NEXT_PUBLIC_APP_URL}/invitacion/${t}`;
  await sendEmail({
    to: created.email,
    subject: `Invitación para colaborar${org ? ` en ${org.name}` : ""}`,
    react: InvitationEmail({
      url,
      inviterName: session.user.name,
      organizationName: org?.name,
      roleLabel: ROLE_LABELS[data.role] ?? data.role,
      message: data.message,
    }),
  });

  revalidatePath("/org");
  if (org) revalidatePath(`/org/${org.slug}`);
  return created;
}

export async function listOrgInvitations(organizationId: string) {
  await requireSession();
  return db
    .select()
    .from(invitations)
    .where(eq(invitations.organizationId, organizationId))
    .orderBy(desc(invitations.createdAt));
}

export async function revokeInvitation(id: string) {
  const session = await requireSession();
  const [inv] = await db.select().from(invitations).where(eq(invitations.id, id)).limit(1);
  if (!inv) throw new Error("Invitación no encontrada");

  const inviterRole = (session.user as { role?: string }).role;
  if (inviterRole !== "admin" && inv.invitedBy !== session.user.id) {
    throw new Error("Sin permisos");
  }

  await db
    .update(invitations)
    .set({ status: "revoked", updatedAt: new Date() })
    .where(eq(invitations.id, id));
  revalidatePath("/org");
}

/**
 * Acepta la invitación: marca como accepted y promociona al usuario al
 * rol invitado (si su rol actual es menor en jerarquía).
 *
 * Devuelve la URL a la que redirigir según el rol asignado.
 */
export async function acceptInvitation(rawToken: string) {
  const session = await requireSession();

  const [inv] = await db
    .select()
    .from(invitations)
    .where(eq(invitations.token, rawToken))
    .limit(1);
  if (!inv) throw new Error("Invitación no encontrada");
  if (inv.status !== "pending") throw new Error("Invitación ya gestionada");
  if (inv.expiresAt < new Date()) {
    await db
      .update(invitations)
      .set({ status: "expired", updatedAt: new Date() })
      .where(eq(invitations.id, inv.id));
    throw new Error("Invitación expirada");
  }
  if (inv.email.toLowerCase() !== session.user.email.toLowerCase()) {
    throw new Error("Esta invitación no es para tu email");
  }

  // Promoción de rol según jerarquía (no degradamos)
  const currentRole = (session.user as { role?: string }).role ?? "user";
  const order = [
    "user",
    "validator",
    "pr_member",
    "pr_manager",
    "organizer",
    "admin",
  ];
  const currentIdx = order.indexOf(currentRole);
  const newIdx = order.indexOf(inv.role);
  if (newIdx > currentIdx) {
    await db
      .update(user)
      .set({ role: inv.role, updatedAt: new Date() })
      .where(eq(user.id, session.user.id));
  }

  // Crear membership en la organización (si la invitación está vinculada)
  if (inv.organizationId) {
    const memberRole = INVITATION_TO_MEMBER[inv.role];
    if (memberRole) {
      await db
        .insert(organizationMembers)
        .values({
          organizationId: inv.organizationId,
          userId: session.user.id,
          role: memberRole,
          status: "active",
        })
        .onConflictDoUpdate({
          target: [organizationMembers.organizationId, organizationMembers.userId],
          set: { role: memberRole, status: "active", updatedAt: new Date() },
        });
    }

    // pr_member / pr_manager → asegurar prMember para comisiones y código
    if (inv.role === "pr_member" || inv.role === "pr_manager") {
      const { ensurePrMemberForUser } = await import("@/server/actions/pr");
      await ensurePrMemberForUser({
        organizationId: inv.organizationId,
        userId: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: inv.role === "pr_manager" ? "rrpp_manager" : "rrpp",
      });
    }
  }

  await db
    .update(invitations)
    .set({
      status: "accepted",
      acceptedAt: new Date(),
      acceptedBy: session.user.id,
      updatedAt: new Date(),
    })
    .where(eq(invitations.id, inv.id));

  revalidatePath("/mi");
  revalidatePath("/org");

  if (inv.role === "validator") return "/validar";
  if (inv.role === "pr_member" || inv.role === "pr_manager") return "/pr";
  if (inv.role === "organizer") return "/org";
  return "/mi";
}

export async function getInvitationByToken(rawToken: string) {
  const [inv] = await db
    .select({
      id: invitations.id,
      email: invitations.email,
      role: invitations.role,
      message: invitations.message,
      status: invitations.status,
      expiresAt: invitations.expiresAt,
      organizationId: invitations.organizationId,
      invitedBy: invitations.invitedBy,
    })
    .from(invitations)
    .where(eq(invitations.token, rawToken))
    .limit(1);
  if (!inv) return null;

  const inviter = await db
    .select({ name: user.name })
    .from(user)
    .where(eq(user.id, inv.invitedBy))
    .limit(1);

  const org = inv.organizationId
    ? (
        await db
          .select({ name: organizations.name, slug: organizations.slug })
          .from(organizations)
          .where(eq(organizations.id, inv.organizationId))
          .limit(1)
      )[0] ?? null
    : null;

  return {
    ...inv,
    inviterName: inviter[0]?.name ?? "Alguien",
    organization: org,
  };
}
