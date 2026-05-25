"use server";

import { and, desc, eq, gte, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { events, organizations, venues } from "@/db/schema";
import { requireSession } from "@/server/auth";
import { assertCanManage } from "@/server/memberships";
import { uniqueSlug } from "@/server/slug";
import {
  createEventSchema,
  updateEventSchema,
  type CreateEventInput,
  type UpdateEventInput,
} from "@/lib/validations/event";

async function eventSlugExists(slug: string): Promise<boolean> {
  const rows = await db
    .select({ id: events.id })
    .from(events)
    .where(and(eq(events.slug, slug), isNull(events.deletedAt)))
    .limit(1);
  return rows.length > 0;
}

export async function createEvent(input: CreateEventInput) {
  const session = await requireSession();
  const data = createEventSchema.parse(input);
  const role = (session.user as { role?: string }).role;
  await assertCanManage(data.organizationId, session.user.id, role);

  if (data.venueId) {
    const [v] = await db
      .select()
      .from(venues)
      .where(and(eq(venues.id, data.venueId), isNull(venues.deletedAt)))
      .limit(1);
    if (!v || v.organizationId !== data.organizationId) {
      throw new Error("Local no pertenece a la organización");
    }
  }

  const slug = await uniqueSlug(data.slug ?? data.name, eventSlugExists);
  const [created] = await db
    .insert(events)
    .values({
      name: data.name,
      slug,
      description: data.description || null,
      location: data.location,
      category: data.category,
      bannerUrl: data.bannerUrl || null,
      thumbnailUrl: data.thumbnailUrl || null,
      startDate: data.startDate,
      endDate: data.endDate,
      doorOpeningTime: data.doorOpeningTime || null,
      capacity: data.capacity,
      minimumAge: data.minimumAge ?? null,
      dresscode: data.dresscode || null,
      additionalInfo: data.additionalInfo || null,
      termsConditions: data.termsConditions || null,
      isPublic: data.isPublic,
      organizationId: data.organizationId,
      venueId: data.venueId ?? null,
      status: "draft",
    })
    .returning();

  revalidatePath("/org");
  return created;
}

export async function updateEvent(id: string, input: UpdateEventInput) {
  const session = await requireSession();
  const data = updateEventSchema.parse(input);

  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, id), isNull(events.deletedAt)))
    .limit(1);
  if (!event) throw new Error("Evento no encontrado");
  const role = (session.user as { role?: string }).role;
  await assertCanManage(event.organizationId, session.user.id, role);

  const [updated] = await db
    .update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(events.id, id))
    .returning();

  revalidatePath("/");
  revalidatePath(`/eventos/${updated.slug}`);
  revalidatePath("/org");
  return updated;
}

export async function publishEvent(id: string) {
  return updateEvent(id, { status: "active" });
}

export async function cancelEvent(id: string) {
  return updateEvent(id, { status: "cancelled" });
}

export async function listEventsByOrg(organizationId: string) {
  const session = await requireSession();
  await assertCanManage(
    organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  return db
    .select()
    .from(events)
    .where(and(eq(events.organizationId, organizationId), isNull(events.deletedAt)))
    .orderBy(desc(events.startDate));
}

export async function getOrgStats(organizationId: string) {
  const session = await requireSession();
  await assertCanManage(
    organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  const [agg] = await db
    .select({
      totalEvents: sql<number>`count(*)::int`,
      activeEvents: sql<number>`count(*) filter (where status = 'active')::int`,
      capacity: sql<number>`coalesce(sum(capacity), 0)::int`,
      sold: sql<number>`coalesce(sum(tickets_sold), 0)::int`,
    })
    .from(events)
    .where(and(eq(events.organizationId, organizationId), isNull(events.deletedAt)));

  const top = await db
    .select({
      id: events.id,
      slug: events.slug,
      name: events.name,
      ticketsSold: events.ticketsSold,
      capacity: events.capacity,
      status: events.status,
      startDate: events.startDate,
    })
    .from(events)
    .where(and(eq(events.organizationId, organizationId), isNull(events.deletedAt)))
    .orderBy(desc(events.ticketsSold))
    .limit(5);

  const now = new Date();
  const upcoming = await db
    .select({
      id: events.id,
      slug: events.slug,
      name: events.name,
      ticketsSold: events.ticketsSold,
      capacity: events.capacity,
      status: events.status,
      startDate: events.startDate,
    })
    .from(events)
    .where(
      and(
        eq(events.organizationId, organizationId),
        isNull(events.deletedAt),
        gte(events.startDate, now),
      ),
    )
    .orderBy(events.startDate)
    .limit(5);

  return { agg: agg ?? { totalEvents: 0, activeEvents: 0, capacity: 0, sold: 0 }, top, upcoming };
}

/** Listado público de eventos activos próximos. NO requiere sesión. */
export async function listPublicUpcomingEvents(limit = 24) {
  const now = new Date();
  try {
    return await db
      .select({
        id: events.id,
        slug: events.slug,
        name: events.name,
        location: events.location,
        category: events.category,
        bannerUrl: events.bannerUrl,
        thumbnailUrl: events.thumbnailUrl,
        startDate: events.startDate,
        endDate: events.endDate,
        capacity: events.capacity,
        ticketsSold: events.ticketsSold,
      })
      .from(events)
      .where(
        and(
          eq(events.status, "active"),
          eq(events.isPublic, true),
          isNull(events.deletedAt),
          gte(events.startDate, now),
        ),
      )
      .orderBy(events.startDate)
      .limit(limit);
  } catch (err) {
    console.warn("[events] listPublicUpcomingEvents falló:", err);
    return [];
  }
}

export async function getPublicEventBySlug(slug: string) {
  const [evt] = await db
    .select()
    .from(events)
    .where(
      and(
        eq(events.slug, slug),
        eq(events.isPublic, true),
        isNull(events.deletedAt),
      ),
    )
    .limit(1);
  // void to keep symmetric with other helpers
  void organizations;
  return evt ?? null;
}
