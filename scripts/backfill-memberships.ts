/**
 * Backfill: por cada organización existente, inserta una fila en
 * `organization_members` con role=owner para el creador original.
 * Idempotente — si la fila ya existe, no inserta duplicado.
 *
 * Uso: npx tsx --env-file=.env.local scripts/backfill-memberships.ts
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../src/lib/db";

async function main() {
  const result = await db.execute(sql`
    INSERT INTO organization_members (organization_id, user_id, role, status)
    SELECT id, user_id, 'owner'::org_member_role, 'active'::org_member_status
    FROM organizations
    WHERE deleted_at IS NULL
    ON CONFLICT (organization_id, user_id) DO NOTHING
  `);
  const r = result as unknown as { rowCount?: number };
  console.log(`✓ Filas insertadas: ${r.rowCount ?? "?"}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✗", err);
    process.exit(1);
  });
