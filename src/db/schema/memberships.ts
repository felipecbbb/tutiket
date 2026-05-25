import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { organizations } from "./organizations";

/**
 * Rol del miembro DENTRO de una organización (independiente del user.role
 * global). Permite que un mismo usuario pertenezca a varias orgs con
 * roles distintos en cada una.
 *
 * - owner: dueño original, no se puede degradar; uno por org
 * - admin: permisos completos excepto borrar la org
 * - organizer: crear/editar eventos, venues, ticket types, cupones
 * - pr_manager: gestionar equipos PR y miembros
 * - pr_member: ver sus propias ventas, link de afiliado
 * - validator: solo escanear QR en eventos de esta org
 */
export const orgMemberRoleEnum = pgEnum("org_member_role", [
  "owner",
  "admin",
  "organizer",
  "pr_manager",
  "pr_member",
  "validator",
]);

export const orgMemberStatusEnum = pgEnum("org_member_status", [
  "active",
  "inactive",
]);

export const organizationMembers = pgTable(
  "organization_members",
  {
    organizationId: uuid("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: orgMemberRoleEnum("role").notNull(),
    status: orgMemberStatusEnum("status").default("active").notNull(),

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.organizationId, t.userId] }),
    userIdx: index("organization_members_user_idx").on(t.userId),
  }),
);

export type OrgMemberRole = (typeof orgMemberRoleEnum.enumValues)[number];

/** Roles con permisos de "gestión" (ven dashboard de la org). */
export const MANAGER_ROLES: OrgMemberRole[] = [
  "owner",
  "admin",
  "organizer",
  "pr_manager",
];
