import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  date,
  boolean,
} from "drizzle-orm/pg-core";
import { events } from "./events";
import { genderEnum } from "./auth";

// Compradores sin cuenta (guest checkout)
export const guestUsers = pgTable("guest_users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  surname: text("surname").notNull(),
  email: text("email").notNull(),
  phone: varchar("phone", { length: 30 }),
  dni: varchar("dni", { length: 20 }),
  birthDate: date("birth_date"),
  gender: genderEnum("gender"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Listas de invitados (acceso sin compra)
export const guestLists = pgTable("guest_lists", {
  id: uuid("id").defaultRandom().primaryKey(),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),

  name: text("name").notNull(),
  email: text("email"),
  prepaid: boolean("prepaid").default(false).notNull(),
  qrCode: text("qr_code").notNull().unique(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
