import { z } from "zod";
import { slugSchema, optionalUrl } from "./common";

export const orgSectorValues = [
  "restaurante",
  "discoteca",
  "pub",
  "beach_club",
  "festival",
  "promotora",
  "lounge",
] as const;

export const createOrganizationSchema = z.object({
  name: z.string().min(2, "Demasiado corto").max(80, "Demasiado largo"),
  slug: slugSchema.optional(), // se genera si no viene
  description: z.string().max(2000).optional().or(z.literal("")),
  sector: z.enum(orgSectorValues),
  location: z.string().max(200).optional().or(z.literal("")),
  capacity: z.coerce.number().int().positive().optional(),
  openingHours: z.string().max(200).optional().or(z.literal("")),
  logoUrl: optionalUrl,
  coverUrl: optionalUrl,
});
export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema.partial();
export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
