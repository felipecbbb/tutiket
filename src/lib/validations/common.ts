import { z } from "zod";

export const slugSchema = z
  .string()
  .min(3, "Demasiado corto")
  .max(60, "Demasiado largo")
  .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones");

export const uuidSchema = z.string().uuid();

export const optionalUrl = z.string().url().optional().or(z.literal(""));
