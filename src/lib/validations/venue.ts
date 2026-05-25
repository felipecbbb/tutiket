import { z } from "zod";
import { slugSchema, uuidSchema, optionalUrl } from "./common";

export const createVenueSchema = z.object({
  organizationId: uuidSchema,
  name: z.string().min(2).max(120),
  slug: slugSchema.optional(),
  description: z.string().max(2000).optional().or(z.literal("")),
  location: z.string().min(2).max(200),
  capacity: z.coerce.number().int().positive(),
  imageUrl: optionalUrl,
  thumbnailUrl: optionalUrl,
  isPublic: z.boolean().default(true),
  isPrimary: z.boolean().default(false),
});
export type CreateVenueInput = z.infer<typeof createVenueSchema>;

export const updateVenueSchema = createVenueSchema.partial().omit({ organizationId: true });
export type UpdateVenueInput = z.infer<typeof updateVenueSchema>;
