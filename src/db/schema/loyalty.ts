import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { organizations } from "./organizations";

export const rewardStatusEnum = pgEnum("reward_status", ["active", "inactive"]);

export const loyaltyTxTypeEnum = pgEnum("loyalty_tx_type", ["earn", "redeem", "adjust"]);

export const rewards = pgTable("rewards", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  costPoints: integer("cost_points").notNull(),
  stock: integer("stock"), // null = ilimitado
  redeemed: integer("redeemed").default(0).notNull(),
  status: rewardStatusEnum("status").default("active").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const loyaltyTransactions = pgTable(
  "loyalty_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: loyaltyTxTypeEnum("type").notNull(),
    points: integer("points").notNull(), // siempre positivo; type indica dirección
    reason: text("reason").notNull(),
    rewardId: uuid("reward_id").references(() => rewards.id, { onDelete: "set null" }),
    refTable: text("ref_table"), // p.ej. "tickets", "events"
    refId: text("ref_id"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index("loyalty_tx_user_idx").on(t.userId),
  }),
);
