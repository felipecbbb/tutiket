"use server";

import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  organizationMembers,
  user,
  type OrgMemberRole,
} from "@/db/schema";
import { requireSession } from "@/server/auth";
import { assertCanManage, assertOwnerOrAdmin } from "@/server/memberships";

export async function listOrgMembers(organizationId: string) {
  const session = await requireSession();
  await assertCanManage(
    organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  return db
    .select({
      userId: organizationMembers.userId,
      role: organizationMembers.role,
      status: organizationMembers.status,
      createdAt: organizationMembers.createdAt,
      name: user.name,
      email: user.email,
    })
    .from(organizationMembers)
    .innerJoin(user, eq(user.id, organizationMembers.userId))
    .where(eq(organizationMembers.organizationId, organizationId))
    .orderBy(desc(organizationMembers.createdAt));
}

export async function updateMemberRole(
  organizationId: string,
  userId: string,
  role: OrgMemberRole,
) {
  const session = await requireSession();
  await assertOwnerOrAdmin(
    organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  if (role === "owner") throw new Error("No puedes asignar otro owner desde aquí");

  // No degradar al único owner
  const [current] = await db
    .select({ role: organizationMembers.role })
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId),
      ),
    )
    .limit(1);
  if (!current) throw new Error("Miembro no encontrado");
  if (current.role === "owner") throw new Error("No se puede degradar al owner");

  await db
    .update(organizationMembers)
    .set({ role, updatedAt: new Date() })
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId),
      ),
    );
  revalidatePath("/org");
}

export async function removeMember(organizationId: string, userId: string) {
  const session = await requireSession();
  await assertOwnerOrAdmin(
    organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  const [current] = await db
    .select({ role: organizationMembers.role })
    .from(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId),
      ),
    )
    .limit(1);
  if (!current) throw new Error("Miembro no encontrado");
  if (current.role === "owner") throw new Error("No se puede quitar al owner");

  await db
    .delete(organizationMembers)
    .where(
      and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId),
      ),
    );
  revalidatePath("/org");
}
