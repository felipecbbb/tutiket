import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  MANAGER_ROLES,
  organizationMembers,
  organizations,
  type OrgMemberRole,
} from "@/db/schema";

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
  if (row.status !== "active")
    throw new Error("Tu acceso a esta organización está suspendido");
  if (!allowedRoles.includes(row.role))
    throw new Error("Tu rol en esta organización no permite esta acción");

  return { role: row.role };
}

export function assertCanManage(
  orgId: string,
  userId: string,
  globalRole?: string,
) {
  return assertOrgMember(orgId, userId, MANAGER_ROLES, globalRole);
}

export function assertOwnerOrAdmin(
  orgId: string,
  userId: string,
  globalRole?: string,
) {
  return assertOrgMember(orgId, userId, ["owner", "admin"], globalRole);
}

/**
 * Lista las organizaciones donde el usuario tiene membership activa.
 * Si es admin global, devuelve TODAS las orgs activas (con role 'owner'
 * simulado para los flujos de gestión).
 */
export async function listMyMemberships(userId: string, globalRole?: string) {
  if (globalRole === "admin") {
    const rows = await db
      .select({
        id: organizations.id,
        slug: organizations.slug,
        name: organizations.name,
        sector: organizations.sector,
        location: organizations.location,
        status: organizations.status,
      })
      .from(organizations)
      .where(isNull(organizations.deletedAt));
    return rows.map((r) => ({ ...r, memberRole: "owner" as OrgMemberRole }));
  }

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
        isNull(organizations.deletedAt),
      ),
    );
}
