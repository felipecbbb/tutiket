/**
 * Crea (o promociona) un usuario admin en la BD.
 *
 * Uso:
 *   npm run admin:create -- "Felipe" "felipegestion03@gmail.com" "<password>"
 *
 * Si el email ya existe, NO recrea — solo promociona a role=admin.
 */
import "dotenv/config";
import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";
import { user } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const [, , nameArg, emailArg, passwordArg] = process.argv;
  if (!nameArg || !emailArg || !passwordArg) {
    console.error("Uso: npm run admin:create -- <name> <email> <password>");
    process.exit(1);
  }

  console.log(`→ Buscando si existe ${emailArg}…`);
  const existing = await db.select().from(user).where(eq(user.email, emailArg)).limit(1);

  if (existing.length > 0) {
    console.log(`✓ Usuario ya existe — promocionando a admin`);
    await db
      .update(user)
      .set({ role: "admin", updatedAt: new Date() })
      .where(eq(user.email, emailArg));
    console.log(`✓ ${emailArg} ahora es admin`);
    return;
  }

  console.log(`→ Creando cuenta…`);
  const result = await auth.api.signUpEmail({
    body: {
      name: nameArg,
      email: emailArg,
      password: passwordArg,
    },
  });
  if (!result?.user?.id) {
    throw new Error("signUpEmail no devolvió user.id");
  }
  console.log(`✓ Cuenta creada (id=${result.user.id})`);

  await db
    .update(user)
    .set({ role: "admin", emailVerified: true, updatedAt: new Date() })
    .where(eq(user.id, result.user.id));
  console.log(`✓ Promocionado a admin`);

  console.log("\n──────────────────────────────────────────────");
  console.log(`  Email:    ${emailArg}`);
  console.log(`  Password: ${passwordArg}`);
  console.log(`  Role:     admin`);
  console.log("──────────────────────────────────────────────\n");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✗ Error:", err);
    process.exit(1);
  });
