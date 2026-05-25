import { z } from "zod";
import { uuidSchema } from "./common";

export const ticketKindValues = ["general", "vip", "guestlist", "early_bird"] as const;

export const createTicketTypeSchema = z
  .object({
    eventId: uuidSchema,
    name: z.string().min(2).max(80),
    description: z.string().max(500).optional().or(z.literal("")),
    kind: z.enum(ticketKindValues),
    // Precio en céntimos
    priceCents: z.coerce.number().int().min(0),
    maxQuantity: z.coerce.number().int().positive(),
    userLimit: z.coerce.number().int().positive().default(10),
    isNominative: z.boolean().default(false),
    saleStartDate: z.coerce.date().optional(),
    saleEndDate: z.coerce.date().optional(),
  })
  .refine(
    (d) =>
      !d.saleStartDate || !d.saleEndDate || d.saleEndDate > d.saleStartDate,
    {
      message: "La fecha de fin de venta debe ser posterior al inicio",
      path: ["saleEndDate"],
    },
  );
export type CreateTicketTypeInput = z.infer<typeof createTicketTypeSchema>;

export const updateTicketTypeSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  description: z.string().max(500).optional().or(z.literal("")),
  kind: z.enum(ticketKindValues).optional(),
  priceCents: z.coerce.number().int().min(0).optional(),
  maxQuantity: z.coerce.number().int().positive().optional(),
  userLimit: z.coerce.number().int().positive().optional(),
  isNominative: z.boolean().optional(),
  saleStartDate: z.coerce.date().optional(),
  saleEndDate: z.coerce.date().optional(),
});
export type UpdateTicketTypeInput = z.infer<typeof updateTicketTypeSchema>;
