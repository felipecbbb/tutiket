"use server";

import { and, desc, eq, isNull, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  eventValidators,
  events,
  organizations,
  tickets,
  validations,
} from "@/db/schema";
import { requireSession } from "@/server/auth";
import { verifyTicketQR } from "@/lib/qr";

/**
 * Eventos en los que el usuario actual puede validar:
 *  - admin: todos los eventos activos
 *  - organizer: eventos de orgs que le pertenecen
 *  - validator/otros: eventos donde aparece en event_validators
 */
export async function listValidatorEvents() {
  const session = await requireSession({ redirectTo: "/validar" });
  const role = (session.user as { role?: string }).role;

  if (role === "admin") {
    return db
      .select({
        id: events.id,
        slug: events.slug,
        name: events.name,
        startDate: events.startDate,
        location: events.location,
        capacity: events.capacity,
        ticketsSold: events.ticketsSold,
        status: events.status,
      })
      .from(events)
      .where(and(isNull(events.deletedAt), or(eq(events.status, "active"), eq(events.status, "draft"))))
      .orderBy(desc(events.startDate))
      .limit(50);
  }

  // Eventos donde está asignado como validador (N..N)
  const assignedRows = await db
    .select({
      id: events.id,
      slug: events.slug,
      name: events.name,
      startDate: events.startDate,
      location: events.location,
      capacity: events.capacity,
      ticketsSold: events.ticketsSold,
      status: events.status,
    })
    .from(eventValidators)
    .innerJoin(events, eq(events.id, eventValidators.eventId))
    .where(and(eq(eventValidators.userId, session.user.id), isNull(events.deletedAt)));

  // Eventos de sus organizaciones (si es organizer)
  let ownRows: typeof assignedRows = [];
  if (role === "organizer" || role === "admin") {
    ownRows = await db
      .select({
        id: events.id,
        slug: events.slug,
        name: events.name,
        startDate: events.startDate,
        location: events.location,
        capacity: events.capacity,
        ticketsSold: events.ticketsSold,
        status: events.status,
      })
      .from(events)
      .innerJoin(organizations, eq(organizations.id, events.organizationId))
      .where(
        and(
          eq(organizations.userId, session.user.id),
          isNull(events.deletedAt),
          isNull(organizations.deletedAt),
        ),
      );
  }

  // Dedup
  const map = new Map<string, (typeof assignedRows)[number]>();
  [...assignedRows, ...ownRows].forEach((r) => map.set(r.id, r));
  return [...map.values()].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );
}

async function canValidateEvent(eventId: string, userId: string, role?: string) {
  if (role === "admin") return true;

  // ¿Es organizer de la org de ese evento?
  const ownership = await db
    .select({ id: events.id })
    .from(events)
    .innerJoin(organizations, eq(organizations.id, events.organizationId))
    .where(and(eq(events.id, eventId), eq(organizations.userId, userId)))
    .limit(1);
  if (ownership.length > 0) return true;

  // ¿Está en event_validators?
  const assigned = await db
    .select({ eventId: eventValidators.eventId })
    .from(eventValidators)
    .where(and(eq(eventValidators.eventId, eventId), eq(eventValidators.userId, userId)))
    .limit(1);
  return assigned.length > 0;
}

export type ValidationResult =
  | { ok: true; ticket: { id: string; attendee: string | null; kind: string } }
  | { ok: false; reason: "invalid" | "wrong_event" | "duplicate" | "cancelled" };

export async function validateQR(
  qr: string,
  eventId: string,
): Promise<ValidationResult> {
  const session = await requireSession();
  const role = (session.user as { role?: string }).role;
  if (!(await canValidateEvent(eventId, session.user.id, role))) {
    return { ok: false, reason: "invalid" };
  }

  const ticketId = verifyTicketQR(qr);
  if (!ticketId) {
    await recordValidation(undefined, eventId, session.user.id, "invalid");
    return { ok: false, reason: "invalid" };
  }

  const [ticket] = await db.select().from(tickets).where(eq(tickets.id, ticketId)).limit(1);
  if (!ticket) {
    await recordValidation(undefined, eventId, session.user.id, "invalid");
    return { ok: false, reason: "invalid" };
  }
  if (ticket.eventId !== eventId) {
    await recordValidation(ticket.id, eventId, session.user.id, "wrong_event");
    return { ok: false, reason: "wrong_event" };
  }
  if (ticket.status === "cancelled" || ticket.status === "refunded") {
    await recordValidation(ticket.id, eventId, session.user.id, "cancelled");
    return { ok: false, reason: "cancelled" };
  }
  if (ticket.status === "used") {
    await recordValidation(ticket.id, eventId, session.user.id, "duplicate");
    return { ok: false, reason: "duplicate" };
  }

  // Marca como usado + crea validación (en transacción lógica)
  await db.update(tickets).set({ status: "used", updatedAt: new Date() }).where(eq(tickets.id, ticket.id));
  await recordValidation(ticket.id, eventId, session.user.id, "ok");

  const attendee = ticket.attendeeName
    ? `${ticket.attendeeName}${ticket.attendeeSurname ? " " + ticket.attendeeSurname : ""}`
    : null;
  return { ok: true, ticket: { id: ticket.id, attendee, kind: ticket.kind } };
}

async function recordValidation(
  ticketId: string | undefined,
  eventId: string,
  validatedBy: string,
  result: "ok" | "duplicate" | "invalid" | "wrong_event" | "cancelled",
) {
  if (!ticketId) return; // sin ticket no podemos crear FK
  await db.insert(validations).values({
    ticketId,
    eventId,
    validatedBy,
    result,
  });
}

export async function listEventValidations(eventId: string) {
  const session = await requireSession();
  const role = (session.user as { role?: string }).role;
  if (!(await canValidateEvent(eventId, session.user.id, role))) {
    throw new Error("Sin permisos");
  }
  return db
    .select({
      id: validations.id,
      ticketId: validations.ticketId,
      validatedAt: validations.validatedAt,
      result: validations.result,
    })
    .from(validations)
    .where(eq(validations.eventId, eventId))
    .orderBy(desc(validations.validatedAt))
    .limit(50);
}

export async function eventValidationStats(eventId: string) {
  const session = await requireSession();
  const role = (session.user as { role?: string }).role;
  if (!(await canValidateEvent(eventId, session.user.id, role))) {
    throw new Error("Sin permisos");
  }
  const rows = await db
    .select({
      result: validations.result,
      n: sql<number>`count(*)::int`,
    })
    .from(validations)
    .where(eq(validations.eventId, eventId))
    .groupBy(validations.result);
  return rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.result] = r.n;
    return acc;
  }, {});
}
