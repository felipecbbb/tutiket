import { z } from "zod";
import { uuidSchema } from "./common";

export const couponDiscountTypeValues = ["percentage", "fixed"] as const;

export const createCouponSchema = z
  .object({
    organizationId: uuidSchema,
    code: z
      .string()
      .min(3, "Mínimo 3 caracteres")
      .max(40, "Máximo 40 caracteres")
      .regex(/^[A-Z0-9_-]+$/, "Solo mayúsculas, números y guiones"),
    discountType: z.enum(couponDiscountTypeValues),
    discountValue: z.coerce.number().int().min(1),
    maxUses: z.coerce.number().int().min(1),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    eventId: uuidSchema.optional().or(z.literal("").transform(() => undefined)),
  })
  .refine((d) => d.endDate > d.startDate, {
    message: "La fecha de fin debe ser posterior al inicio",
    path: ["endDate"],
  })
  .refine(
    (d) => d.discountType !== "percentage" || d.discountValue <= 100,
    { message: "Porcentaje máximo 100", path: ["discountValue"] },
  );
export type CreateCouponInput = z.infer<typeof createCouponSchema>;

export const updateCouponSchema = z.object({
  code: z.string().min(3).max(40).regex(/^[A-Z0-9_-]+$/).optional(),
  discountType: z.enum(couponDiscountTypeValues).optional(),
  discountValue: z.coerce.number().int().min(1).optional(),
  maxUses: z.coerce.number().int().min(1).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  status: z.enum(["active", "inactive"]).optional(),
  eventId: uuidSchema.nullable().optional(),
});
export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;
