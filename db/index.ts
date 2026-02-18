import "server-only";
import * as schema from "./schema";

// If a direct URL exists (local dev, or non-Vercel runtime), use postgres-js:
const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL;

if (connectionString) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const postgres = require("postgres").default ?? require("postgres");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { drizzle } = require("drizzle-orm/postgres-js");

  const client = postgres(connectionString, { prepare: false });
  export const db = drizzle(client, { schema });
} else {
  // Otherwise (Vercel Postgres runtime), use vercel-postgres:
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { drizzle } = require("drizzle-orm/vercel-postgres");
  export const db = drizzle({ schema });
}
