import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { events, ticketTypes } from "./events";

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "completed",
  "failed",
  "refunded",
]);

export const paymentGatewayEnum = pgEnum("payment_gateway", [
  "stripe",
  "redsys",
  "paypal",
  "bizum",
]);

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),

  // Referencia única (vinculada a la transacción del gateway)
  reference: text("reference").notNull().unique(),

  // Quién pagó
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  guestUserId: uuid("guest_user_id"), // FK en guests.ts

  // Para qué
  eventId: uuid("event_id").references(() => events.id, { onDelete: "set null" }),
  ticketTypeId: uuid("ticket_type_id").references(() => ticketTypes.id, {
    onDelete: "set null",
  }),
  quantity: integer("quantity").default(1).notNull(),

  // Importe en céntimos
  amountCents: integer("amount_cents").notNull(),
  currency: text("currency").default("EUR").notNull(),

  // Estado
  status: paymentStatusEnum("status").default("pending").notNull(),
  errorMessage: text("error_message"),

  // Gateway
  gateway: paymentGatewayEnum("gateway").notNull(),
  gatewayData: jsonb("gateway_data").$type<Record<string, unknown>>(),

  // Datos de asistentes (para tickets nominativos comprados juntos)
  attendeesData: jsonb("attendees_data").$type<
    Array<{ name: string; surname: string; dni: string; email?: string }>
  >(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});
