"use server";

import crypto from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  events,
  prMemberEvents,
  prMembers,
  prSales,
  prTeams,
  user,
} from "@/db/schema";
import { requireSession } from "@/server/auth";
import { assertCanManage } from "@/server/memberships";

// ── Equipos ──────────────────────────────────────────────────────────
export async function createPrTeam(input: {
  organizationId: string;
  name: string;
  description?: string;
  allowCommissionModification?: boolean;
  assignToAllEvents?: boolean;
}) {
  const session = await requireSession();
  await assertCanManage(
    input.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  const [created] = await db
    .insert(prTeams)
    .values({
      organizationId: input.organizationId,
      name: input.name,
      description: input.description ?? null,
      allowCommissionModification: input.allowCommissionModification ?? false,
      assignToAllEvents: input.assignToAllEvents ?? false,
    })
    .returning();

  revalidatePath("/org");
  return created;
}

export async function listPrTeams(organizationId: string) {
  const session = await requireSession();
  await assertCanManage(
    organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  return db
    .select()
    .from(prTeams)
    .where(eq(prTeams.organizationId, organizationId))
    .orderBy(desc(prTeams.createdAt));
}

export async function deletePrTeam(teamId: string) {
  const session = await requireSession();
  const [team] = await db.select().from(prTeams).where(eq(prTeams.id, teamId)).limit(1);
  if (!team) throw new Error("Equipo no encontrado");
  await assertCanManage(
    team.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  await db.delete(prTeams).where(eq(prTeams.id, teamId));
  revalidatePath("/org");
}

// ── Miembros ─────────────────────────────────────────────────────────
function generatePrCode(): string {
  // 6 chars base32-like, fácil de compartir
  return crypto.randomBytes(4).toString("base64url").slice(0, 6).toUpperCase();
}

/**
 * Crea (o devuelve si ya existe por email) un PrMember para la organización.
 * Llamado automáticamente al aceptar una invitación pr_member/pr_manager.
 */
export async function ensurePrMemberForUser(input: {
  organizationId: string;
  userId: string;
  name: string;
  email: string;
  role: "rrpp" | "rrpp_manager";
}) {
  const [existing] = await db
    .select()
    .from(prMembers)
    .where(eq(prMembers.email, input.email))
    .limit(1);

  if (existing) {
    // Actualizar si faltan campos clave
    if (existing.userId !== input.userId || !existing.code) {
      await db
        .update(prMembers)
        .set({
          userId: input.userId,
          organizationId: existing.organizationId ?? input.organizationId,
          code: existing.code ?? generatePrCode(),
          status: "approved",
          updatedAt: new Date(),
        })
        .where(eq(prMembers.id, existing.id));
    }
    return existing;
  }

  const [created] = await db
    .insert(prMembers)
    .values({
      userId: input.userId,
      organizationId: input.organizationId,
      name: input.name,
      email: input.email,
      role: input.role,
      code: generatePrCode(),
      status: "approved",
    })
    .returning();
  return created;
}

export async function listOrgPrMembers(organizationId: string) {
  const session = await requireSession();
  await assertCanManage(
    organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  return db
    .select()
    .from(prMembers)
    .where(eq(prMembers.organizationId, organizationId))
    .orderBy(desc(prMembers.createdAt));
}

export async function setPrMemberCommission(memberId: string, bps: number) {
  const session = await requireSession();
  const [member] = await db.select().from(prMembers).where(eq(prMembers.id, memberId)).limit(1);
  if (!member) throw new Error("Miembro no encontrado");
  if (!member.organizationId) throw new Error("Miembro sin organización");
  await assertCanManage(
    member.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  if (bps < 0 || bps > 10000) throw new Error("Comisión fuera de rango (0-10000 bps)");

  await db
    .update(prMembers)
    .set({ commissionBps: bps, updatedAt: new Date() })
    .where(eq(prMembers.id, memberId));
  revalidatePath("/org");
}

export async function assignMemberToEvent(input: {
  memberId: string;
  eventId: string;
  commissionBps?: number;
}) {
  const session = await requireSession();
  const [member] = await db.select().from(prMembers).where(eq(prMembers.id, input.memberId)).limit(1);
  if (!member?.organizationId) throw new Error("Miembro sin organización");
  await assertCanManage(
    member.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  const [evt] = await db.select().from(events).where(eq(events.id, input.eventId)).limit(1);
  if (!evt || evt.organizationId !== member.organizationId)
    throw new Error("Evento no pertenece a la org");

  await db
    .insert(prMemberEvents)
    .values({
      memberId: input.memberId,
      eventId: input.eventId,
      commissionBps: input.commissionBps ?? null,
    })
    .onConflictDoUpdate({
      target: [prMemberEvents.memberId, prMemberEvents.eventId],
      set: { commissionBps: input.commissionBps ?? null },
    });
  revalidatePath("/org");
}

export async function unassignMemberFromEvent(memberId: string, eventId: string) {
  const session = await requireSession();
  const [member] = await db.select().from(prMembers).where(eq(prMembers.id, memberId)).limit(1);
  if (!member?.organizationId) throw new Error("Miembro sin organización");
  await assertCanManage(
    member.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  await db
    .delete(prMemberEvents)
    .where(and(eq(prMemberEvents.memberId, memberId), eq(prMemberEvents.eventId, eventId)));
  revalidatePath("/org");
}

// ── Vista del miembro ────────────────────────────────────────────────

/** Datos del PrMember del usuario actual (si tiene). */
export async function getMyPrMember() {
  const session = await requireSession({ redirectTo: "/pr" });
  const [member] = await db
    .select()
    .from(prMembers)
    .where(eq(prMembers.userId, session.user.id))
    .limit(1);
  return member ?? null;
}

/** Stats agregadas de ventas de un miembro. */
export async function getPrMemberStats(memberId: string) {
  const [agg] = await db
    .select({
      sales: sql<number>`count(*)::int`,
      qty: sql<number>`coalesce(sum(${prSales.quantity}), 0)::int`,
      gross: sql<number>`coalesce(sum(${prSales.totalAmountCents}), 0)::int`,
      commission: sql<number>`coalesce(sum(${prSales.commissionAmountCents}), 0)::int`,
    })
    .from(prSales)
    .where(eq(prSales.memberId, memberId));

  return agg ?? { sales: 0, qty: 0, gross: 0, commission: 0 };
}

/** Eventos donde el miembro está asignado (o todos los de su org si joinAllEvents). */
export async function listMyPrEvents() {
  const session = await requireSession({ redirectTo: "/pr" });
  const [member] = await db
    .select()
    .from(prMembers)
    .where(eq(prMembers.userId, session.user.id))
    .limit(1);
  if (!member) return [];

  // Asignados explícitamente
  const assigned = await db
    .select({
      id: events.id,
      slug: events.slug,
      name: events.name,
      startDate: events.startDate,
      ticketsSold: events.ticketsSold,
      capacity: events.capacity,
      status: events.status,
      commissionBps: prMemberEvents.commissionBps,
    })
    .from(prMemberEvents)
    .innerJoin(events, eq(events.id, prMemberEvents.eventId))
    .where(eq(prMemberEvents.memberId, member.id));

  return { member, events: assigned };
}

/** Lookup público por código de afiliado — sin requerir sesión. */
export async function lookupPrMemberByCode(code: string) {
  const [m] = await db
    .select({
      id: prMembers.id,
      name: prMembers.name,
      organizationId: prMembers.organizationId,
    })
    .from(prMembers)
    .where(eq(prMembers.code, code.toUpperCase()))
    .limit(1);
  return m ?? null;
}

// Re-export user (silenciador para evitar tree-shake removal en algunos
// bundlers cuando se usa en tipo)
void user;
