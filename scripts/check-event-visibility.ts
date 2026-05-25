/**
 * Diagnóstico: por qué un evento no se lista en la home pública.
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "../src/lib/db";

async function main() {
  const rows = await db.execute(sql`
    SELECT id, slug, name, status, is_public,
           start_date, end_date,
           deleted_at IS NOT NULL as deleted,
           (status = 'active' AND is_public = true AND deleted_at IS NULL
            AND start_date >= now()) as listed_in_public
    FROM events
    ORDER BY start_date DESC
  `);
  console.table(rows.rows ?? rows);

  const ttypes = await db.execute(sql`
    SELECT t.id, e.name as event_name, t.name, t.kind, t.price_cents, t.max_quantity, t.sold_quantity
    FROM ticket_types t
    JOIN events e ON e.id = t.event_id
  `);
  console.log("\n── Ticket types ─────");
  console.table(ttypes.rows ?? ttypes);
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
