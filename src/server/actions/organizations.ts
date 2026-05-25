"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { organizationMembers, organizations, user } from "@/db/schema";
import { requireSession } from "@/server/auth";
import { assertCanManage, assertOwnerOrAdmin, listMyMemberships } from "@/server/memberships";
import { uniqueSlug } from "@/server/slug";
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  type CreateOrganizationInput,
  type UpdateOrganizationInput,
} from "@/lib/validations/organization";

async function orgSlugExists(slug: string): Promise<boolean> {
  const rows = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(and(eq(organizations.slug, slug), isNull(organizations.deletedAt)))
    .limit(1);
  return rows.length > 0;
}

export async function createOrganization(input: CreateOrganizationInput) {
  const session = await requireSession({ redirectTo: "/org" });
  const data = createOrganizationSchema.parse(input);

  const slug = await uniqueSlug(data.slug ?? data.name, orgSlugExists);

  const [created] = await db
    .insert(organizations)
    .values({
      name: data.name,
      slug,
      description: data.description || null,
      sector: data.sector,
      location: data.location || null,
      capacity: data.capacity ?? null,
      openingHours: data.openingHours || null,
      logoUrl: data.logoUrl || null,
      coverUrl: data.coverUrl || null,
      userId: session.user.id,
    })
    .returning();

  // Membership de owner
  await db
    .insert(organizationMembers)
    .values({
      organizationId: created.id,
      userId: session.user.id,
      role: "owner",
      status: "active",
    })
    .onConflictDoNothing();

  // Promocionar a organizer si todavía es user (rol global)
  const currentRole = (session.user as { role?: string }).role;
  if (currentRole === "user") {
    await db
      .update(user)
      .set({ role: "organizer", updatedAt: new Date() })
      .where(eq(user.id, session.user.id));
  }

  revalidatePath("/org");
  return created;
}

export async function updateOrganization(id: string, input: UpdateOrganizationInput) {
  const session = await requireSession();
  const data = updateOrganizationSchema.parse(input);

  await assertOwnerOrAdmin(
    id,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  const [updated] = await db
    .update(organizations)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, id))
    .returning();

  revalidatePath("/org");
  revalidatePath(`/org/${updated.slug}`);
  return updated;
}

export async function listMyOrganizations() {
  const session = await requireSession({ redirectTo: "/org" });
  return listMyMemberships(
    session.user.id,
    (session.user as { role?: string }).role,
  );
}

export async function getOrganizationBySlug(slug: string) {
  const session = await requireSession();
  const [org] = await db
    .select()
    .from(organizations)
    .where(and(eq(organizations.slug, slug), isNull(organizations.deletedAt)))
    .limit(1);
  if (!org) return null;

  // Comprueba membership (managers); si no, ¿es admin global?
  try {
    await assertCanManage(
      org.id,
      session.user.id,
      (session.user as { role?: string }).role,
    );
    return org;
  } catch {
    return null;
  }
}
