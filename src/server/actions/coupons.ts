"use server";

import { and, desc, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { coupons, organizations } from "@/db/schema";
import { requireSession } from "@/server/auth";
import {
  createCouponSchema,
  updateCouponSchema,
  type CreateCouponInput,
  type UpdateCouponInput,
} from "@/lib/validations/coupon";

async function assertOwnsOrg(orgId: string, userId: string, role?: string) {
  if (role === "admin") return;
  const [org] = await db
    .select({ userId: organizations.userId })
    .from(organizations)
    .where(and(eq(organizations.id, orgId), isNull(organizations.deletedAt)))
    .limit(1);
  if (!org) throw new Error("Organización no encontrada");
  if (org.userId !== userId) throw new Error("Sin permisos");
}

export async function createCoupon(input: CreateCouponInput) {
  const session = await requireSession();
  const data = createCouponSchema.parse(input);
  await assertOwnsOrg(
    data.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  const [created] = await db
    .insert(coupons)
    .values({
      code: data.code.toUpperCase().trim(),
      discountType: data.discountType,
      discountValue: data.discountValue,
      maxUses: data.maxUses,
      startDate: data.startDate,
      endDate: data.endDate,
      organizationId: data.organizationId,
      eventId: data.eventId ?? null,
    })
    .returning();

  revalidatePath("/org");
  return created;
}

export async function updateCoupon(id: string, input: UpdateCouponInput) {
  const session = await requireSession();
  const data = updateCouponSchema.parse(input);

  const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
  if (!coupon) throw new Error("Cupón no encontrado");
  if (coupon.organizationId) {
    await assertOwnsOrg(
      coupon.organizationId,
      session.user.id,
      (session.user as { role?: string }).role,
    );
  } else if ((session.user as { role?: string }).role !== "admin") {
    throw new Error("Sin permisos");
  }

  const [updated] = await db
    .update(coupons)
    .set({
      ...data,
      ...(data.code && { code: data.code.toUpperCase().trim() }),
      updatedAt: new Date(),
    })
    .where(eq(coupons.id, id))
    .returning();

  revalidatePath("/org");
  return updated;
}

export async function deleteCoupon(id: string) {
  const session = await requireSession();
  const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id)).limit(1);
  if (!coupon) throw new Error("Cupón no encontrado");
  if (coupon.organizationId) {
    await assertOwnsOrg(
      coupon.organizationId,
      session.user.id,
      (session.user as { role?: string }).role,
    );
  }
  await db.delete(coupons).where(eq(coupons.id, id));
  revalidatePath("/org");
}

export async function listCouponsByOrg(organizationId: string) {
  const session = await requireSession();
  await assertOwnsOrg(
    organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  return db
    .select()
    .from(coupons)
    .where(eq(coupons.organizationId, organizationId))
    .orderBy(desc(coupons.createdAt));
}

/**
 * Aplica un cupón al precio dado. Para el flujo de checkout (Fase 2).
 * Devuelve descuento en céntimos y el cupón resuelto.
 */
export async function previewCoupon(
  code: string,
  eventId: string,
  priceCents: number,
): Promise<{ ok: true; discountCents: number; coupon: typeof coupons.$inferSelect } | { ok: false; reason: string }> {
  const normalized = code.toUpperCase().trim();
  const [coupon] = await db.select().from(coupons).where(eq(coupons.code, normalized)).limit(1);
  if (!coupon) return { ok: false, reason: "Cupón no encontrado" };
  if (coupon.status !== "active") return { ok: false, reason: "Cupón inactivo" };
  const now = new Date();
  if (coupon.startDate > now) return { ok: false, reason: "Aún no es válido" };
  if (coupon.endDate < now) return { ok: false, reason: "Cupón expirado" };
  if (coupon.uses >= coupon.maxUses) return { ok: false, reason: "Cupón agotado" };
  if (coupon.eventId && coupon.eventId !== eventId)
    return { ok: false, reason: "Cupón no aplicable a este evento" };

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = Math.floor((priceCents * coupon.discountValue) / 100);
  } else {
    discount = Math.min(priceCents, coupon.discountValue);
  }
  return { ok: true, discountCents: discount, coupon };
}
