import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
  boolean,
  jsonb,
  time,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { organizations } from "./organizations";
import { venues } from "./venues";

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "pending",
  "active",
  "inactive",
  "cancelled",
]);

export const eventStyleEnum = pgEnum("event_style", [
  "modern",     // sleek, glassmorphism, gradientes
  "minimal",    // limpio, tipografía grande
  "bold",       // colores fuertes, bordes marcados
  "festival",   // overlay rave, marquee
  "sport",      // estilo deportivo
  "elegant",    // boda/gala
]);

export const ticketTypeKindEnum = pgEnum("ticket_type_kind", [
  "general",
  "vip",
  "guestlist",
  "early_bird",
]);

export const events = pgTable("events", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  category: text("category").notNull(),

  bannerUrl: text("banner_url"),
  thumbnailUrl: text("thumbnail_url"),

  // Personalización visual del evento (control del organizador)
  themeColor: text("theme_color"),            // hex primario (ej #ff5a1f)
  accentColor: text("accent_color"),          // hex acento
  eventStyle: eventStyleEnum("event_style").default("modern").notNull(),
  customTagline: text("custom_tagline"),      // frase debajo del título

  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  doorOpeningTime: time("door_opening_time"),

  capacity: integer("capacity").notNull(),
  ticketsSold: integer("tickets_sold").default(0).notNull(),

  minimumAge: integer("minimum_age"),
  dresscode: text("dresscode"),
  additionalInfo: text("additional_info"),
  termsConditions: text("terms_conditions"),

  status: eventStatusEnum("status").default("draft").notNull(),
  isPublic: boolean("is_public").default(true).notNull(),

  // Recurrencia
  isRecurring: boolean("is_recurring").default(false).notNull(),
  recurrenceDays: jsonb("recurrence_days").$type<string[]>(),
  recurrenceUntil: timestamp("recurrence_until"),
  parentEventId: uuid("parent_event_id"),

  // Métricas
  impressions: integer("impressions").default(0).notNull(),
  impressionsHistory: jsonb("impressions_history").$type<Record<string, number>>(),

  // Relaciones
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  venueId: uuid("venue_id").references(() => venues.id, { onDelete: "set null" }),
  promoterId: text("promoter_id").references(() => user.id, { onDelete: "set null" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const ticketTypes = pgTable("ticket_types", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  description: text("description"),
  kind: ticketTypeKindEnum("kind").notNull(),

  // Precio en céntimos (evita errores de redondeo)
  priceCents: integer("price_cents").notNull(),

  // Límites
  maxQuantity: integer("max_quantity").notNull(),
  soldQuantity: integer("sold_quantity").default(0).notNull(),
  userLimit: integer("user_limit").notNull(), // máx por usuario

  isNominative: boolean("is_nominative").default(false).notNull(),

  saleStartDate: timestamp("sale_start_date"),
  saleEndDate: timestamp("sale_end_date"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Validadores asignados a un evento (N..N)
export const eventValidators = pgTable("event_validators", {
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
