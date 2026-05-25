import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  MANAGER_ROLES,
  organizationMembers,
  organizations,
  type OrgMemberRole,
} from "@/db/schema";

/**
 * Comprueba que el usuario es miembro activo de la organización con uno
 * de los roles permitidos. Lanza Error si no.
 *
 * - admin global (user.role === "admin") salta los checks.
 */
export async function assertOrgMember(
  orgId: string,
  userId: string,
  allowedRoles: OrgMemberRole[],
  globalRole?: string,
): Promise<{ role: OrgMemberRole }> {
  if (globalRole === "admin") return { role: "owner" };

  const [row] = await db
    .select({ role: organizationMembers.role, status: organizationMembers.status })
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organizationId, orgId),
        eq(organizationMembers.userId, userId),
      ),
    )
    .limit(1);

  if (!row) throw new Error("No eres miembro de esta organización");
  if (row.status !== "active") throw new Error("Tu acceso a esta organización está suspendido");
  if (!allowedRoles.includes(row.role))
    throw new Error("Tu rol en esta organización no permite esta acción");

  return { role: row.role };
}

/** Atajo para acciones de gestión (owner/admin/organizer/pr_manager). */
export function assertCanManage(
  orgId: string,
  userId: string,
  globalRole?: string,
) {
  return assertOrgMember(orgId, userId, MANAGER_ROLES, globalRole);
}

/** Atajo para acciones de owner/admin solo. */
export function assertOwnerOrAdmin(
  orgId: string,
  userId: string,
  globalRole?: string,
) {
  return assertOrgMember(orgId, userId, ["owner", "admin"], globalRole);
}

/**
 * Lista las organizaciones donde el usuario tiene membership activa,
 * con su rol en cada una.
 */
export async function listMyMemberships(userId: string) {
  return db
    .select({
      id: organizations.id,
      slug: organizations.slug,
      name: organizations.name,
      sector: organizations.sector,
      location: organizations.location,
      status: organizations.status,
      memberRole: organizationMembers.role,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizations.id, organizationMembers.organizationId))
    .where(
      and(
        eq(organizationMembers.userId, userId),
        eq(organizationMembers.status, "active"),
      ),
    );
}
