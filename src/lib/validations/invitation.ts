import { z } from "zod";
import { uuidSchema } from "./common";

export const invitationRoleValues = [
  "validator",
  "pr_member",
  "pr_manager",
  "organizer",
] as const;

export const createInvitationSchema = z.object({
  email: z.string().email("Email no válido"),
  role: z.enum(invitationRoleValues),
  organizationId: uuidSchema.optional(),
  message: z.string().max(500).optional().or(z.literal("")),
});
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;
