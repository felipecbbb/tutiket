"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { organizations, user } from "@/db/schema";
import { requireSession } from "@/server/auth";
import { uniqueSlug } from "@/server/slug";

async function orgSlugExists(slug: string): Promise<boolean> {
  const rows = await db
    .select({ id: organizations.id })
    .from(organizations)
    .where(and(eq(organizations.slug, slug), isNull(organizations.deletedAt)))
    .limit(1);
  return rows.length > 0;
}
import {
  createOrganizationSchema,
  updateOrganizationSchema,
  type CreateOrganizationInput,
  type UpdateOrganizationInput,
} from "@/lib/validations/organization";

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

  // Promocionar a organizer si todavía es user
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

  const [org] = await db
    .select()
    .from(organizations)
    .where(and(eq(organizations.id, id), isNull(organizations.deletedAt)))
    .limit(1);

  if (!org) throw new Error("Organización no encontrada");
  const role = (session.user as { role?: string }).role;
  if (org.userId !== session.user.id && role !== "admin") {
    throw new Error("Sin permisos");
  }

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
  return db
    .select()
    .from(organizations)
    .where(
      and(eq(organizations.userId, session.user.id), isNull(organizations.deletedAt)),
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
  const role = (session.user as { role?: string }).role;
  if (org.userId !== session.user.id && role !== "admin") return null;
  return org;
}
