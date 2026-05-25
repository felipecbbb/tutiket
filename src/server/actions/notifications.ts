"use server";

import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { notifications } from "@/db/schema";
import { requireSession } from "@/server/auth";

export type NotificationType =
  | "pr_join_request"
  | "organization_verified"
  | "event_upcoming"
  | "event_finished"
  | "ticket_milestone"
  | "vip_ticket_milestone"
  | "verifier_invitation"
  | "verifier_accepted"
  | "payment_completed"
  | "payment_failed"
  | "ticket_refunded";

/**
 * Crea una notificación. Llamada desde otras server actions (no del cliente
 * directamente). Lanzar fuego-y-olvido para no bloquear el flujo principal.
 */
export async function createNotification(input: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  organizationId?: string;
  eventId?: string;
  data?: Record<string, unknown>;
}) {
  await db.insert(notifications).values({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message,
    organizationId: input.organizationId ?? null,
    eventId: input.eventId ?? null,
    data: input.data ?? null,
  });
}

export async function listMyNotifications(limit = 30) {
  const session = await requireSession();
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, session.user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function countMyUnreadNotifications(): Promise<number> {
  const session = await requireSession();
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(notifications)
    .where(
      and(eq(notifications.userId, session.user.id), eq(notifications.read, false)),
    );
  return row?.n ?? 0;
}

export async function markNotificationRead(id: string) {
  const session = await requireSession();
  await db
    .update(notifications)
    .set({ read: true, updatedAt: new Date() })
    .where(
      and(eq(notifications.id, id), eq(notifications.userId, session.user.id)),
    );
  revalidatePath("/mi");
}

export async function markAllNotificationsRead() {
  const session = await requireSession();
  await db
    .update(notifications)
    .set({ read: true, updatedAt: new Date() })
    .where(
      and(
        eq(notifications.userId, session.user.id),
        eq(notifications.read, false),
      ),
    );
  revalidatePath("/mi");
}
