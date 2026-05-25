import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  varchar,
  date,
  integer,
} from "drizzle-orm/pg-core";

// ──────────────────────────────────────────────────────────────
// Enums de dominio
// ──────────────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", [
  "user",
  "organizer",
  "validator",
  "pr_member",
  "admin",
]);

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

// ──────────────────────────────────────────────────────────────
// Better-Auth tables (extendidas con campos de dominio)
// ──────────────────────────────────────────────────────────────
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").$defaultFn(() => false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()).notNull(),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()).notNull(),

  // Campos de dominio (heredados de users)
  surname: text("surname"),
  dni: varchar("dni", { length: 20 }).unique(),
  birthDate: date("birth_date"),
  gender: genderEnum("gender"),
  phone: varchar("phone", { length: 20 }).unique(),
  postalCode: varchar("postal_code", { length: 10 }),
  role: userRoleEnum("role").default("user").notNull(),

  // Loyalty (Twinpoints) — en segundo plano
  loyaltyPoints: integer("loyalty_points").default(0).notNull(),

  // Stats agregadas
  totalEventsCreated: integer("total_events_created").default(0).notNull(),
  totalTicketsSold: integer("total_tickets_sold").default(0).notNull(),
  totalRevenueCents: integer("total_revenue_cents").default(0).notNull(),

  deletedAt: timestamp("deleted_at"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(() => new Date()),
  updatedAt: timestamp("updated_at").$defaultFn(() => new Date()),
});
