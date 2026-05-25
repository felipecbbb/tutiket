"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { user } from "@/db/schema";
import { requireSession } from "@/server/auth";

const profileSchema = z.object({
  name: z.string().min(2).max(80),
  surname: z.string().max(80).optional().or(z.literal("")),
  phone: z.string().max(30).optional().or(z.literal("")),
  dni: z.string().max(20).optional().or(z.literal("")),
  postalCode: z.string().max(10).optional().or(z.literal("")),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export async function updateMyProfile(input: ProfileInput) {
  const session = await requireSession();
  const data = profileSchema.parse(input);

  await db
    .update(user)
    .set({
      name: data.name,
      surname: data.surname || null,
      phone: data.phone || null,
      dni: data.dni || null,
      postalCode: data.postalCode || null,
      updatedAt: new Date(),
    })
    .where(eq(user.id, session.user.id));

  revalidatePath("/mi");
  revalidatePath("/ajustes");
}
