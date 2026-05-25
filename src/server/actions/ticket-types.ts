"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { events, organizations, ticketTypes } from "@/db/schema";
import { requireSession } from "@/server/auth";
import {
  createTicketTypeSchema,
  updateTicketTypeSchema,
  type CreateTicketTypeInput,
  type UpdateTicketTypeInput,
} from "@/lib/validations/ticket-type";

async function loadEventOwned(eventId: string, userId: string, role?: string) {
  const [evt] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, eventId), isNull(events.deletedAt)))
    .limit(1);
  if (!evt) throw new Error("Evento no encontrado");

  const [org] = await db
    .select()
    .from(organizations)
    .where(eq(organizations.id, evt.organizationId))
    .limit(1);
  if (!org) throw new Error("Organización no encontrada");
  if (org.userId !== userId && role !== "admin") throw new Error("Sin permisos");
  return evt;
}

export async function createTicketType(input: CreateTicketTypeInput) {
  const session = await requireSession();
  const data = createTicketTypeSchema.parse(input);
  const evt = await loadEventOwned(
    data.eventId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  const [created] = await db
    .insert(ticketTypes)
    .values({
      eventId: data.eventId,
      name: data.name,
      description: data.description || null,
      kind: data.kind,
      priceCents: data.priceCents,
      maxQuantity: data.maxQuantity,
      userLimit: data.userLimit,
      isNominative: data.isNominative,
      saleStartDate: data.saleStartDate ?? null,
      saleEndDate: data.saleEndDate ?? null,
    })
    .returning();

  revalidatePath(`/eventos/${evt.slug}`);
  revalidatePath("/org");
  return created;
}

export async function updateTicketType(id: string, input: UpdateTicketTypeInput) {
  const session = await requireSession();
  const data = updateTicketTypeSchema.parse(input);

  const [tt] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, id)).limit(1);
  if (!tt) throw new Error("Tipo de entrada no encontrado");

  await loadEventOwned(
    tt.eventId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  const [updated] = await db
    .update(ticketTypes)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(ticketTypes.id, id))
    .returning();
  revalidatePath("/org");
  return updated;
}

export async function listTicketTypesByEvent(eventId: string) {
  return db.select().from(ticketTypes).where(eq(ticketTypes.eventId, eventId));
}
