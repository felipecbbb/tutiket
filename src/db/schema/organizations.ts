import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  varchar,
  integer,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const orgSectorEnum = pgEnum("org_sector", [
  "restaurante",
  "discoteca",
  "pub",
  "beach_club",
  "festival",
  "promotora",
  "lounge",
]);

export const orgStatusEnum = pgEnum("org_status", ["pending", "verified", "rejected"]);

export const orgVerifierStatusEnum = pgEnum("org_verifier_status", [
  "pending",
  "active",
  "inactive",
]);

export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  sector: orgSectorEnum("sector").notNull(),
  logoUrl: text("logo_url"),
  coverUrl: text("cover_url"),
  location: text("location"),
  capacity: integer("capacity"),
  openingHours: text("opening_hours"),

  // Owner
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  status: orgStatusEnum("status").default("pending").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

// Datos fiscales/legales (separados para privacidad)
export const organizationInfo = pgTable("organization_info", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .unique()
    .references(() => organizations.id, { onDelete: "cascade" }),

  legalName: text("legal_name"),
  commercialName: text("commercial_name"),
  cifNif: varchar("cif_nif", { length: 50 }),
  address: text("address"),
  postalCode: varchar("postal_code", { length: 20 }),
  city: text("city"),
  country: text("country").default("ES"),

  iban: varchar("iban", { length: 50 }),
  bicSwift: varchar("bic_swift", { length: 20 }),

  phone: varchar("phone", { length: 30 }),
  financialEmail: text("financial_email"),
  customerServiceEmail: text("customer_service_email"),
  privacyPolicyUrl: text("privacy_policy_url"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Verificadores de la organización (personas que pueden validar entradas en la puerta)
export const organizationVerifiers = pgTable("organization_verifiers", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  invitedBy: text("invited_by")
    .notNull()
    .references(() => user.id),
  status: orgVerifierStatusEnum("status").default("pending").notNull(),
  invitationToken: text("invitation_token"),
  invitationSentAt: timestamp("invitation_sent_at"),
  invitationAcceptedAt: timestamp("invitation_accepted_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
