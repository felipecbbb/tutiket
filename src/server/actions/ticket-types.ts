"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { events, ticketTypes } from "@/db/schema";
import { requireSession } from "@/server/auth";
import { assertCanManage } from "@/server/memberships";
import {
  createTicketTypeSchema,
  updateTicketTypeSchema,
  type CreateTicketTypeInput,
  type UpdateTicketTypeInput,
} from "@/lib/validations/ticket-type";

async function loadEventManaged(eventId: string, userId: string, role?: string) {
  const [evt] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!evt) throw new Error("Evento no encontrado");
  await assertCanManage(evt.organizationId, userId, role);
  return evt;
}

export async function createTicketType(input: CreateTicketTypeInput) {
  const session = await requireSession();
  const data = createTicketTypeSchema.parse(input);
  const evt = await loadEventManaged(
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

  await loadEventManaged(
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

export async function deleteTicketType(id: string) {
  const session = await requireSession();
  const [tt] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, id)).limit(1);
  if (!tt) throw new Error("Tipo de entrada no encontrado");
  if (tt.soldQuantity > 0)
    throw new Error("No se puede borrar: ya hay entradas vendidas");
  const evt = await loadEventManaged(
    tt.eventId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  await db.delete(ticketTypes).where(eq(ticketTypes.id, id));
  revalidatePath("/org");
  revalidatePath(`/eventos/${evt.slug}`);
}
