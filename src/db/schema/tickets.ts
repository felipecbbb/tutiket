import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { events, ticketTypes } from "./events";

export const ticketStatusEnum = pgEnum("ticket_status", [
  "sold",
  "used",
  "refunded",
  "cancelled",
]);

export const ticketKindEnum = pgEnum("ticket_kind", [
  "general",
  "vip",
  "guestlist",
  "invitation",
]);

export const couponStatusEnum = pgEnum("coupon_status", ["active", "inactive"]);
export const couponDiscountTypeEnum = pgEnum("coupon_discount_type", [
  "percentage",
  "fixed",
]);

// Tickets vendidos
export const tickets = pgTable("tickets", {
  id: uuid("id").defaultRandom().primaryKey(),

  // QR firmado con HMAC — el código real se genera con HMAC(ticket.id, SECRET)
  qrCode: text("qr_code").notNull().unique(),
  orderRef: text("order_ref").notNull().unique(),

  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  ticketTypeId: uuid("ticket_type_id")
    .notNull()
    .references(() => ticketTypes.id, { onDelete: "restrict" }),

  // Quién compró el ticket — puede ser usuario o guest
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  guestUserId: uuid("guest_user_id"), // FK definido en guests.ts evitando ciclo

  kind: ticketKindEnum("kind").notNull(),
  priceCents: integer("price_cents").notNull(),
  status: ticketStatusEnum("status").default("sold").notNull(),
  nominative: boolean("nominative").default(false).notNull(),

  // Datos del asistente (si nominative=true)
  attendeeName: text("attendee_name"),
  attendeeSurname: text("attendee_surname"),
  attendeeDni: text("attendee_dni"),

  paymentId: uuid("payment_id"), // FK definido en payments.ts evitando ciclo

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Cada vez que se escanea un QR en la puerta
export const validations = pgTable("validations", {
  id: uuid("id").defaultRandom().primaryKey(),
  ticketId: uuid("ticket_id")
    .notNull()
    .references(() => tickets.id, { onDelete: "cascade" }),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  validatedBy: text("validated_by").references(() => user.id, {
    onDelete: "set null",
  }),
  validatedAt: timestamp("validated_at").defaultNow().notNull(),
  // Por si se quiere registrar invalidaciones (intentos fallidos)
  result: text("result").default("ok").notNull(), // ok | duplicate | invalid | wrong_event
});

export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(),
  discountType: couponDiscountTypeEnum("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(), // si percentage: 0-100. Si fixed: céntimos
  maxUses: integer("max_uses").notNull(),
  uses: integer("uses").default(0).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  status: couponStatusEnum("status").default("active").notNull(),

  // Scope opcional
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
