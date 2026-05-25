import { z } from "zod";
import { slugSchema, uuidSchema, optionalUrl } from "./common";

export const eventStatusValues = [
  "draft",
  "pending",
  "active",
  "inactive",
  "cancelled",
] as const;

export const createEventSchema = z
  .object({
    organizationId: uuidSchema,
    venueId: uuidSchema.optional(),
    name: z.string().min(2).max(120),
    slug: slugSchema.optional(),
    description: z.string().max(5000).optional().or(z.literal("")),
    location: z.string().min(2).max(200),
    category: z.string().min(2).max(60),
    bannerUrl: optionalUrl,
    thumbnailUrl: optionalUrl,
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    doorOpeningTime: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato HH:MM")
      .optional()
      .or(z.literal("")),
    capacity: z.coerce.number().int().positive(),
    minimumAge: z.coerce.number().int().min(0).max(99).optional(),
    dresscode: z.string().max(200).optional().or(z.literal("")),
    additionalInfo: z.string().max(2000).optional().or(z.literal("")),
    termsConditions: z.string().max(10000).optional().or(z.literal("")),
    isPublic: z.boolean().default(true),
  })
  .refine((d) => d.endDate > d.startDate, {
    message: "La fecha de fin debe ser posterior al inicio",
    path: ["endDate"],
  });
export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = z
  .object({
    venueId: uuidSchema.nullable().optional(),
    name: z.string().min(2).max(120).optional(),
    slug: slugSchema.optional(),
    description: z.string().max(5000).optional().or(z.literal("")),
    location: z.string().min(2).max(200).optional(),
    category: z.string().min(2).max(60).optional(),
    bannerUrl: optionalUrl,
    thumbnailUrl: optionalUrl,
    startDate: z.coerce.date().optional(),
    endDate: z.coerce.date().optional(),
    doorOpeningTime: z
      .string()
      .regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato HH:MM")
      .optional()
      .or(z.literal("")),
    capacity: z.coerce.number().int().positive().optional(),
    minimumAge: z.coerce.number().int().min(0).max(99).optional(),
    dresscode: z.string().max(200).optional().or(z.literal("")),
    additionalInfo: z.string().max(2000).optional().or(z.literal("")),
    termsConditions: z.string().max(10000).optional().or(z.literal("")),
    isPublic: z.boolean().optional(),
    status: z.enum(eventStatusValues).optional(),
  });
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
