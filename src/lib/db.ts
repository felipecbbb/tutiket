import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "@/db/schema";
import { env } from "@/lib/env";

// Habilita WebSockets en Node.js (Vercel functions). En Edge usar HTTP driver.
if (typeof WebSocket === "undefined") {
  neonConfig.webSocketConstructor = ws;
}

// Pool con keepalive — reduce cold-start de queries y permite paralelizar.
const globalForDb = globalThis as unknown as { __pool?: Pool };

const pool =
  globalForDb.__pool ??
  new Pool({
    connectionString: env.DATABASE_URL,
    max: 5,
    idleTimeoutMillis: 30_000,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__pool = pool;
}

export const db = drizzle({ client: pool, schema });

export type DB = typeof db;
