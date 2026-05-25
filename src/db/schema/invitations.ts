import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { organizations } from "./organizations";

export const invitationRoleEnum = pgEnum("invitation_role", [
  "validator",
  "pr_member",
  "pr_manager",
  "organizer",
]);

export const invitationStatusEnum = pgEnum("invitation_status", [
  "pending",
  "accepted",
  "revoked",
  "expired",
]);

/**
 * Invitaciones a colaborar en una organización con un rol concreto.
 * El destinatario abre /invitacion/[token]; si no tiene cuenta, primero
 * se registra (manteniendo el token); al aceptar se le asigna el rol.
 */
export const invitations = pgTable(
  "invitations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    role: invitationRoleEnum("role").notNull(),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "cascade",
    }),
    token: text("token").notNull().unique(),
    invitedBy: text("invited_by")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    acceptedAt: timestamp("accepted_at"),
    acceptedBy: text("accepted_by").references(() => user.id, {
      onDelete: "set null",
    }),
    status: invitationStatusEnum("status").default("pending").notNull(),
    message: text("message"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    emailIdx: index("invitations_email_idx").on(t.email),
    orgIdx: index("invitations_org_idx").on(t.organizationId),
  }),
);
