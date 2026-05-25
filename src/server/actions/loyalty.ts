"use server";

import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { loyaltyTransactions, rewards, user } from "@/db/schema";
import { requireSession } from "@/server/auth";
import { assertCanManage } from "@/server/memberships";

// ── Premios (CRUD admin) ─────────────────────────────────────────────
export async function createReward(input: {
  organizationId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  costPoints: number;
  stock?: number | null;
}) {
  const session = await requireSession();
  await assertCanManage(
    input.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  if (input.costPoints < 1) throw new Error("El coste debe ser positivo");

  const [created] = await db
    .insert(rewards)
    .values({
      organizationId: input.organizationId,
      name: input.name,
      description: input.description ?? null,
      imageUrl: input.imageUrl ?? null,
      costPoints: input.costPoints,
      stock: input.stock ?? null,
    })
    .returning();

  revalidatePath("/org");
  return created;
}

export async function listOrgRewards(organizationId: string) {
  const session = await requireSession();
  await assertCanManage(
    organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  return db
    .select()
    .from(rewards)
    .where(eq(rewards.organizationId, organizationId))
    .orderBy(desc(rewards.createdAt));
}

export async function toggleReward(id: string) {
  const session = await requireSession();
  const [reward] = await db.select().from(rewards).where(eq(rewards.id, id)).limit(1);
  if (!reward) throw new Error("Premio no encontrado");
  await assertCanManage(
    reward.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  const next = reward.status === "active" ? "inactive" : "active";
  await db
    .update(rewards)
    .set({ status: next, updatedAt: new Date() })
    .where(eq(rewards.id, id));
  revalidatePath("/org");
}

export async function deleteReward(id: string) {
  const session = await requireSession();
  const [reward] = await db.select().from(rewards).where(eq(rewards.id, id)).limit(1);
  if (!reward) throw new Error("Premio no encontrado");
  await assertCanManage(
    reward.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  await db.delete(rewards).where(eq(rewards.id, id));
  revalidatePath("/org");
}

// ── Puntos del usuario ───────────────────────────────────────────────
export async function getMyPoints() {
  const session = await requireSession();
  const [u] = await db
    .select({ points: user.loyaltyPoints })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);
  return u?.points ?? 0;
}

export async function listMyLoyaltyTransactions(limit = 50) {
  const session = await requireSession();
  return db
    .select()
    .from(loyaltyTransactions)
    .where(eq(loyaltyTransactions.userId, session.user.id))
    .orderBy(desc(loyaltyTransactions.createdAt))
    .limit(limit);
}

/** Lista premios disponibles (active) en TODAS las orgs, ordenados por coste. */
export async function listAvailableRewards() {
  return db
    .select()
    .from(rewards)
    .where(eq(rewards.status, "active"))
    .orderBy(rewards.costPoints)
    .limit(100);
}

/** Suma puntos al usuario y registra transacción. Llamada interna desde
 *  flujos como compra de ticket completada. */
export async function earnPoints(input: {
  userId: string;
  points: number;
  reason: string;
  refTable?: string;
  refId?: string;
}) {
  if (input.points <= 0) return;
  await db.transaction(async (tx) => {
    await tx
      .update(user)
      .set({
        loyaltyPoints: sql`${user.loyaltyPoints} + ${input.points}`,
        updatedAt: new Date(),
      })
      .where(eq(user.id, input.userId));
    await tx.insert(loyaltyTransactions).values({
      userId: input.userId,
      type: "earn",
      points: input.points,
      reason: input.reason,
      refTable: input.refTable ?? null,
      refId: input.refId ?? null,
    });
  });
}

/** El usuario canjea un premio: comprueba stock y puntos, descuenta y registra. */
export async function redeemReward(rewardId: string) {
  const session = await requireSession();

  const [reward] = await db.select().from(rewards).where(eq(rewards.id, rewardId)).limit(1);
  if (!reward) throw new Error("Premio no encontrado");
  if (reward.status !== "active") throw new Error("Premio no disponible");
  if (reward.stock !== null && reward.redeemed >= reward.stock)
    throw new Error("Premio agotado");

  const [u] = await db
    .select({ points: user.loyaltyPoints })
    .from(user)
    .where(eq(user.id, session.user.id))
    .limit(1);
  if (!u) throw new Error("Usuario no encontrado");
  if (u.points < reward.costPoints) throw new Error("Puntos insuficientes");

  await db.transaction(async (tx) => {
    await tx
      .update(user)
      .set({
        loyaltyPoints: sql`${user.loyaltyPoints} - ${reward.costPoints}`,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));
    await tx
      .update(rewards)
      .set({ redeemed: sql`${rewards.redeemed} + 1`, updatedAt: new Date() })
      .where(eq(rewards.id, reward.id));
    await tx.insert(loyaltyTransactions).values({
      userId: session.user.id,
      type: "redeem",
      points: reward.costPoints,
      reason: `Canje: ${reward.name}`,
      rewardId: reward.id,
    });
  });

  revalidatePath("/mi/puntos");
  return reward;
}

/** Admin/owner ajusta puntos manualmente (positivo o negativo). */
export async function adjustPoints(input: {
  userId: string;
  delta: number;
  reason: string;
}) {
  const session = await requireSession();
  if ((session.user as { role?: string }).role !== "admin")
    throw new Error("Sin permisos");
  if (input.delta === 0) return;

  await db.transaction(async (tx) => {
    await tx
      .update(user)
      .set({
        loyaltyPoints: sql`greatest(${user.loyaltyPoints} + ${input.delta}, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(user.id, input.userId));
    await tx.insert(loyaltyTransactions).values({
      userId: input.userId,
      type: "adjust",
      points: Math.abs(input.delta),
      reason: `${input.delta > 0 ? "+" : "-"}${Math.abs(input.delta)} · ${input.reason}`,
    });
  });
}

// Silencia unused warning
void and;
