/**
 * Diagnóstico: lista estado real de la BD para entender bugs reportados.
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../src/lib/db";

async function main() {
  console.log("\n── Usuarios ────────────────────────");
  const users = await db.execute(sql`
    SELECT id, email, name, role, deleted_at IS NOT NULL as deleted, created_at
    FROM "user"
    ORDER BY created_at DESC
  `);
  console.table(users.rows ?? users);

  console.log("\n── Organizaciones ──────────────────");
  const orgs = await db.execute(sql`
    SELECT id, slug, name, user_id as owner_id, status, deleted_at IS NOT NULL as deleted
    FROM organizations
    ORDER BY created_at DESC
  `);
  console.table(orgs.rows ?? orgs);

  console.log("\n── Memberships ─────────────────────");
  const ms = await db.execute(sql`
    SELECT om.organization_id, o.name as org_name, om.user_id, u.email, om.role, om.status
    FROM organization_members om
    JOIN organizations o ON o.id = om.organization_id
    JOIN "user" u ON u.id = om.user_id
    ORDER BY om.created_at DESC
  `);
  console.table(ms.rows ?? ms);

  console.log("\n── Eventos ─────────────────────────");
  const evs = await db.execute(sql`
    SELECT id, slug, name, status, organization_id, is_public, deleted_at IS NOT NULL as deleted
    FROM events
    ORDER BY created_at DESC
  `);
  console.table(evs.rows ?? evs);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
