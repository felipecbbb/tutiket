/**
 * Backfill: cualquier user que sea owner de una organización activa
 * debe tener al menos role='organizer'. Repara casos creados antes de
 * que Better-Auth incluyera el role en la sesión.
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../src/lib/db";

async function main() {
  const result = await db.execute(sql`
    UPDATE "user"
    SET role = 'organizer'::user_role,
        updated_at = now()
    WHERE role = 'user'
      AND deleted_at IS NULL
      AND id IN (
        SELECT DISTINCT user_id
        FROM organizations
        WHERE deleted_at IS NULL
      )
  `);
  const r = result as unknown as { rowCount?: number };
  console.log(`✓ Promocionados a organizer: ${r.rowCount ?? "?"}`);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
