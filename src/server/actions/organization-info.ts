"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { organizationInfo } from "@/db/schema";
import { requireSession } from "@/server/auth";
import { assertOwnerOrAdmin } from "@/server/memberships";
import { orgInfoSchema, type OrgInfoInput } from "@/lib/validations/organization-info";

export async function getOrgInfo(organizationId: string) {
  const session = await requireSession();
  await assertOwnerOrAdmin(
    organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );
  const [info] = await db
    .select()
    .from(organizationInfo)
    .where(eq(organizationInfo.organizationId, organizationId))
    .limit(1);
  return info ?? null;
}

export async function upsertOrgInfo(input: OrgInfoInput) {
  const session = await requireSession();
  const data = orgInfoSchema.parse(input);
  await assertOwnerOrAdmin(
    data.organizationId,
    session.user.id,
    (session.user as { role?: string }).role,
  );

  const values = {
    organizationId: data.organizationId,
    legalName: data.legalName || null,
    commercialName: data.commercialName || null,
    cifNif: data.cifNif || null,
    address: data.address || null,
    postalCode: data.postalCode || null,
    city: data.city || null,
    country: data.country,
    iban: data.iban || null,
    bicSwift: data.bicSwift || null,
    phone: data.phone || null,
    financialEmail: data.financialEmail || null,
    customerServiceEmail: data.customerServiceEmail || null,
    privacyPolicyUrl: data.privacyPolicyUrl || null,
  };

  await db
    .insert(organizationInfo)
    .values(values)
    .onConflictDoUpdate({
      target: organizationInfo.organizationId,
      set: { ...values, updatedAt: new Date() },
    });

  revalidatePath("/org");
}
