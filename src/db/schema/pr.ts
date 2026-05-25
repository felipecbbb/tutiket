import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  integer,
  boolean,
  varchar,
  unique,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { organizations } from "./organizations";
import { events } from "./events";
import { ticketTypes } from "./events";

export const prRoleEnum = pgEnum("pr_role", ["rrpp", "rrpp_manager", "admin"]);
export const prMemberStatusEnum = pgEnum("pr_member_status", [
  "pending",
  "approved",
  "rejected",
]);
export const prInvitationStatusEnum = pgEnum("pr_invitation_status", [
  "pending",
  "accepted",
  "expired",
]);

// Equipos de RR.PP. dentro de una organización
export const prTeams = pgTable("pr_teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  allowCommissionModification: boolean("allow_commission_modification")
    .default(false)
    .notNull(),
  assignToAllEvents: boolean("assign_to_all_events").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Miembros del equipo PR (RR.PP.)
export const prMembers = pgTable("pr_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: varchar("phone", { length: 30 }),
  role: prRoleEnum("role").default("rrpp").notNull(),

  // Comisión en basis points (1% = 100 bps, evita decimales)
  commissionBps: integer("commission_bps").default(0).notNull(),
  joinAllEvents: boolean("join_all_events").default(false).notNull(),
  status: prMemberStatusEnum("status").default("pending").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Equipos asignados a eventos (N..N con comisión override)
export const prEventTeams = pgTable(
  "pr_event_teams",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => prTeams.id, { onDelete: "cascade" }),
    commissionBps: integer("commission_bps"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique("pr_event_teams_event_team_unique").on(t.eventId, t.teamId)],
);

// Miembros asignados a eventos (N..N con comisión override)
export const prMemberEvents = pgTable(
  "pr_member_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    memberId: uuid("member_id")
      .notNull()
      .references(() => prMembers.id, { onDelete: "cascade" }),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    commissionBps: integer("commission_bps"),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique("pr_member_events_member_event_unique").on(t.memberId, t.eventId)],
);

// Miembros dentro de equipos
export const prMemberTeams = pgTable(
  "pr_member_teams",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    memberId: uuid("member_id")
      .notNull()
      .references(() => prMembers.id, { onDelete: "cascade" }),
    teamId: uuid("team_id")
      .notNull()
      .references(() => prTeams.id, { onDelete: "cascade" }),

    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (t) => [unique("pr_member_teams_member_team_unique").on(t.memberId, t.teamId)],
);

// Invitaciones a unirse al equipo PR
export const prInvitations = pgTable("pr_invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email"),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  teamId: uuid("team_id").references(() => prTeams.id, { onDelete: "set null" }),
  inviteToken: text("invite_token").notNull().unique(),
  status: prInvitationStatusEnum("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  role: prRoleEnum("role").default("rrpp").notNull(),
  invitedBy: text("invited_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  isPublicLink: boolean("is_public_link").default(false).notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Registro de ventas atribuidas a un PR
export const prSales = pgTable("pr_sales", {
  id: uuid("id").defaultRandom().primaryKey(),
  memberId: uuid("member_id").references(() => prMembers.id, {
    onDelete: "set null",
  }),
  eventId: uuid("event_id")
    .notNull()
    .references(() => events.id, { onDelete: "cascade" }),
  ticketTypeId: uuid("ticket_type_id").references(() => ticketTypes.id, {
    onDelete: "set null",
  }),
  quantity: integer("quantity").notNull(),
  totalAmountCents: integer("total_amount_cents").notNull(),
  commissionAmountCents: integer("commission_amount_cents").notNull(),
  soldAt: timestamp("sold_at").defaultNow().notNull(),
});
