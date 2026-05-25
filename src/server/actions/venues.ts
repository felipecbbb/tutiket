"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { organizations, venues } from "@/db/schema";
import { requireSession } from "@/server/auth";
import { uniqueSlug } from "@/server/slug";

async function venueSlugExists(slug: string): Promise<boolean> {
  const rows = await db
    .select({ id: venues.id })
    .from(venues)
    .where(and(eq(venues.slug, slug), isNull(venues.deletedAt)))
    .limit(1);
  return rows.length > 0;
}
import {
  createVenueSchema,
  updateVenueSchema,
  type CreateVenueInput,
  type UpdateVenueInput,
} from "@/lib/validations/venue";

async function assertOwnsOrg(orgId: string, userId: string, role?: string) {
  const [org] = await db
    .select()
    .from(organizations)
    .where(and(eq(organizations.id, orgId), isNull(organizations.deletedAt)))
    .limit(1);
  if (!org) throw new Error("Organización no encontrada");
  if (org.userId !== userId && role !== "admin") throw new Error("Sin permisos");
  return org;
}

export async function createVenue(input: CreateVenueInput) {
  const session = await requireSession();
  const data = createVenueSchema.parse(input);
  await assertOwnsOrg(
    data.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  const slug = await uniqueSlug(data.slug ?? data.name, venueSlugExists);
  const [created] = await db
    .insert(venues)
    .values({
      name: data.name,
      slug,
      description: data.description || null,
      location: data.location,
      capacity: data.capacity,
      imageUrl: data.imageUrl || null,
      thumbnailUrl: data.thumbnailUrl || null,
      isPublic: data.isPublic,
      isPrimary: data.isPrimary,
      organizationId: data.organizationId,
    })
    .returning();

  revalidatePath(`/org`);
  return created;
}

export async function updateVenue(id: string, input: UpdateVenueInput) {
  const session = await requireSession();
  const data = updateVenueSchema.parse(input);

  const [venue] = await db
    .select()
    .from(venues)
    .where(and(eq(venues.id, id), isNull(venues.deletedAt)))
    .limit(1);
  if (!venue) throw new Error("Local no encontrado");
  await assertOwnsOrg(
    venue.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  const [updated] = await db
    .update(venues)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(venues.id, id))
    .returning();
  revalidatePath(`/org`);
  return updated;
}

export async function listVenuesByOrg(organizationId: string) {
  const session = await requireSession();
  await assertOwnsOrg(
    organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  return db
    .select()
    .from(venues)
    .where(and(eq(venues.organizationId, organizationId), isNull(venues.deletedAt)));
}
