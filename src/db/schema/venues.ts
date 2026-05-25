import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const venueStatusEnum = pgEnum("venue_status", ["active", "inactive"]);

export const venues = pgTable("venues", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  thumbnailUrl: text("thumbnail_url"),
  capacity: integer("capacity").notNull(),
  isPublic: boolean("is_public").default(true).notNull(),
  isPrimary: boolean("is_primary").default(false).notNull(),
  status: venueStatusEnum("status").default("active").notNull(),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});
