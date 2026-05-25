"use server";

import { and, desc, eq, ilike, isNull, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  events,
  organizations,
  tickets,
  user,
  venues,
} from "@/db/schema";
import { requireRole } from "@/server/auth";
import type { UserRole } from "@/server/auth";

const USER_ROLES = [
  "user",
  "validator",
  "pr_member",
  "pr_manager",
  "organizer",
  "admin",
] as const;

async function ensureAdmin() {
  return requireRole(["admin"]);
}

// ── Plataforma ─────────────────────────────────────────────────────────
export async function adminPlatformStats() {
  await ensureAdmin();
  const [userCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(user)
    .where(isNull(user.deletedAt));
  const [orgCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(organizations)
    .where(isNull(organizations.deletedAt));
  const [eventCount] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(events)
    .where(isNull(events.deletedAt));
  const [ticketAgg] = await db
    .select({
      sold: sql<number>`count(*)::int`,
      revenue: sql<number>`coalesce(sum(${tickets.priceCents}), 0)::int`,
    })
    .from(tickets)
    .where(eq(tickets.status, "sold"));

  return {
    users: userCount?.n ?? 0,
    organizations: orgCount?.n ?? 0,
    events: eventCount?.n ?? 0,
    ticketsSold: ticketAgg?.sold ?? 0,
    revenueCents: ticketAgg?.revenue ?? 0,
  };
}

// ── Usuarios ───────────────────────────────────────────────────────────
export async function adminListUsers(query?: string) {
  await ensureAdmin();
  const q = query?.trim();
  const where = q
    ? and(
        isNull(user.deletedAt),
        or(ilike(user.email, `%${q}%`), ilike(user.name, `%${q}%`)),
      )
    : isNull(user.deletedAt);

  return db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      emailVerified: user.emailVerified,
    })
    .from(user)
    .where(where)
    .orderBy(desc(user.createdAt))
    .limit(100);
}

export async function adminUpdateUserRole(userId: string, role: UserRole) {
  await ensureAdmin();
  if (!USER_ROLES.includes(role as (typeof USER_ROLES)[number])) {
    throw new Error("Rol no válido");
  }
  await db
    .update(user)
    .set({ role, updatedAt: new Date() })
    .where(eq(user.id, userId));
  revalidatePath("/admin/usuarios");
}

export async function adminDeleteUser(userId: string) {
  const session = await ensureAdmin();
  if (session.user.id === userId) throw new Error("No puedes borrarte a ti mismo");
  await db
    .update(user)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(user.id, userId));
  revalidatePath("/admin/usuarios");
}

// ── Eventos ────────────────────────────────────────────────────────────
export async function adminListEvents(query?: string) {
  await ensureAdmin();
  const q = query?.trim();
  const where = q
    ? and(isNull(events.deletedAt), ilike(events.name, `%${q}%`))
    : isNull(events.deletedAt);

  return db
    .select({
      id: events.id,
      slug: events.slug,
      name: events.name,
      status: events.status,
      startDate: events.startDate,
      capacity: events.capacity,
      ticketsSold: events.ticketsSold,
      organizationId: events.organizationId,
    })
    .from(events)
    .where(where)
    .orderBy(desc(events.createdAt))
    .limit(100);
}

export async function adminUpdateEventStatus(
  id: string,
  status: "draft" | "pending" | "active" | "inactive" | "cancelled",
) {
  await ensureAdmin();
  await db
    .update(events)
    .set({ status, updatedAt: new Date() })
    .where(eq(events.id, id));
  revalidatePath("/admin/eventos");
  revalidatePath("/");
}

export async function adminDeleteEvent(id: string) {
  await ensureAdmin();
  await db
    .update(events)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(events.id, id));
  revalidatePath("/admin/eventos");
  revalidatePath("/");
}

// ── Venues ─────────────────────────────────────────────────────────────
export async function adminListVenues() {
  await ensureAdmin();
  return db
    .select({
      id: venues.id,
      slug: venues.slug,
      name: venues.name,
      location: venues.location,
      capacity: venues.capacity,
      organizationId: venues.organizationId,
      status: venues.status,
    })
    .from(venues)
    .where(isNull(venues.deletedAt))
    .orderBy(desc(venues.createdAt))
    .limit(100);
}

export async function adminDeleteVenue(id: string) {
  await ensureAdmin();
  await db
    .update(venues)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(venues.id, id));
  revalidatePath("/admin/venues");
}

// ── Organizaciones ─────────────────────────────────────────────────────
export async function adminListOrganizations() {
  await ensureAdmin();
  return db
    .select()
    .from(organizations)
    .where(isNull(organizations.deletedAt))
    .orderBy(desc(organizations.createdAt))
    .limit(100);
}

export async function adminUpdateOrgStatus(
  id: string,
  status: "pending" | "verified" | "rejected",
) {
  await ensureAdmin();
  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, id))
    .limit(1);
  if (!org) throw new Error("Organización no encontrada");

  await db
    .update(organizations)
    .set({ status, updatedAt: new Date() })
    .where(eq(organizations.id, id));

  // Notificar al owner del cambio
  if (org.userId && org.status !== status) {
    const { createNotification } = await import("@/server/actions/notifications");
    await createNotification({
      userId: org.userId,
      type: "organization_verified",
      title:
        status === "verified"
          ? "¡Organización aprobada!"
          : status === "rejected"
            ? "Organización rechazada"
            : "Organización marcada como pendiente",
      message:
        status === "verified"
          ? `"${org.name}" ya está aprobada. Tus eventos activos aparecerán en la web pública.`
          : status === "rejected"
            ? `"${org.name}" ha sido rechazada. Contacta con soporte si crees que es un error.`
            : `"${org.name}" vuelve a estado pendiente.`,
      organizationId: org.id,
    });
  }

  revalidatePath("/admin/organizaciones");
  revalidatePath("/org");
  revalidatePath(`/org/${org.slug}`);
  revalidatePath("/");
}

export async function adminDeleteOrg(id: string) {
  await ensureAdmin();
  await db
    .update(organizations)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(organizations.id, id));
  revalidatePath("/admin/organizaciones");
}
