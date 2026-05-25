import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { organizations } from "./organizations";
import { events } from "./events";

export const notificationTypeEnum = pgEnum("notification_type", [
  "pr_join_request",
  "organization_verified",
  "event_upcoming",
  "event_finished",
  "ticket_milestone",
  "vip_ticket_milestone",
  "verifier_invitation",
  "verifier_accepted",
  "payment_completed",
  "payment_failed",
  "ticket_refunded",
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organizationId: uuid("organization_id").references(() => organizations.id, {
    onDelete: "cascade",
  }),
  eventId: uuid("event_id").references(() => events.id, { onDelete: "cascade" }),

  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").default(false).notNull(),
  data: jsonb("data").$type<Record<string, unknown>>(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
