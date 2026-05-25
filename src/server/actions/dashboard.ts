"use server";

import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { events, organizations, venues } from "@/db/schema";
import { requireSession } from "@/server/auth";
import { listMyMemberships } from "@/server/memberships";

/**
 * IDs de orgs donde el user puede gestionar (incluye admin global → todas).
 */
async function manageableOrgIds(): Promise<string[]> {
  const session = await requireSession();
  const role = (session.user as { role?: string }).role;
  const ms = await listMyMemberships(session.user.id, role);
  return ms.map((m) => m.id);
}

/** Todos los eventos del usuario actual a través de todas sus orgs. */
export async function listMyEvents() {
  const orgIds = await manageableOrgIds();
  if (orgIds.length === 0) return [];

  return db
    .select({
      id: events.id,
      slug: events.slug,
      name: events.name,
      status: events.status,
      startDate: events.startDate,
      capacity: events.capacity,
      ticketsSold: events.ticketsSold,
      orgId: events.organizationId,
      orgSlug: organizations.slug,
      orgName: organizations.name,
    })
    .from(events)
    .innerJoin(organizations, eq(organizations.id, events.organizationId))
    .where(and(inArray(events.organizationId, orgIds), isNull(events.deletedAt)))
    .orderBy(desc(events.startDate))
    .limit(100);
}

/** Todos los locales del usuario actual. */
export async function listMyVenues() {
  const orgIds = await manageableOrgIds();
  if (orgIds.length === 0) return [];

  return db
    .select({
      id: venues.id,
      slug: venues.slug,
      name: venues.name,
      location: venues.location,
      capacity: venues.capacity,
      status: venues.status,
      orgId: venues.organizationId,
      orgSlug: organizations.slug,
      orgName: organizations.name,
    })
    .from(venues)
    .innerJoin(organizations, eq(organizations.id, venues.organizationId))
    .where(and(inArray(venues.organizationId, orgIds), isNull(venues.deletedAt)))
    .orderBy(desc(venues.createdAt))
    .limit(100);
}
