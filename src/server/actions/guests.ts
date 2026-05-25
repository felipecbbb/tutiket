"use server";

import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { events, guestLists } from "@/db/schema";
import { requireSession } from "@/server/auth";
import { assertCanManage } from "@/server/memberships";
import { signTicketQR } from "@/lib/qr";
import { addGuestsSchema, type AddGuestsInput } from "@/lib/validations/guest";

async function assertManagesEvent(eventId: string, userId: string, role?: string) {
  const [evt] = await db.select().from(events).where(eq(events.id, eventId)).limit(1);
  if (!evt) throw new Error("Evento no encontrado");
  await assertCanManage(evt.organizationId, userId, role);
  return evt;
}

export async function addGuests(input: AddGuestsInput) {
  const session = await requireSession();
  const data = addGuestsSchema.parse(input);
  await assertManagesEvent(
    data.eventId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  // Inserta uno a uno para poder firmar el QR con el id resultante
  const created: { id: string; name: string }[] = [];
  for (const row of data.rows) {
    // Generamos QR temporal con un UUID — luego de insertar, lo refirmaríamos.
    // Para no ir y volver, insertamos con QR placeholder y luego UPDATE.
    const [inserted] = await db
      .insert(guestLists)
      .values({
        eventId: data.eventId,
        name: row.name,
        email: row.email || null,
        prepaid: row.prepaid,
        qrCode: `pending-${crypto.randomUUID()}`,
      })
      .returning({ id: guestLists.id, name: guestLists.name });

    const signed = signTicketQR(inserted.id);
    await db
      .update(guestLists)
      .set({ qrCode: signed, updatedAt: new Date() })
      .where(eq(guestLists.id, inserted.id));

    created.push(inserted);
  }

  revalidatePath("/org");
  return { count: created.length };
}

export async function listEventGuests(eventId: string) {
  const session = await requireSession();
  await assertManagesEvent(
    eventId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  return db
    .select()
    .from(guestLists)
    .where(eq(guestLists.eventId, eventId))
    .orderBy(desc(guestLists.createdAt));
}

export async function removeGuest(id: string) {
  const session = await requireSession();
  const [guest] = await db.select().from(guestLists).where(eq(guestLists.id, id)).limit(1);
  if (!guest) throw new Error("Invitado no encontrado");
  await assertManagesEvent(
    guest.eventId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  await db.delete(guestLists).where(eq(guestLists.id, id));
  revalidatePath("/org");
}
