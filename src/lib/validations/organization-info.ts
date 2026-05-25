import { z } from "zod";
import { uuidSchema, optionalUrl } from "./common";

export const orgInfoSchema = z.object({
  organizationId: uuidSchema,
  legalName: z.string().max(200).optional().or(z.literal("")),
  commercialName: z.string().max(200).optional().or(z.literal("")),
  cifNif: z.string().max(50).optional().or(z.literal("")),
  address: z.string().max(300).optional().or(z.literal("")),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  city: z.string().max(100).optional().or(z.literal("")),
  country: z.string().max(60).default("ES"),
  iban: z.string().max(50).optional().or(z.literal("")),
  bicSwift: z.string().max(20).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  financialEmail: z.string().email("Email no válido").optional().or(z.literal("")),
  customerServiceEmail: z.string().email("Email no válido").optional().or(z.literal("")),
  privacyPolicyUrl: optionalUrl,
});
export type OrgInfoInput = z.infer<typeof orgInfoSchema>;
