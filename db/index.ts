import "server-only";

import * as schema from "./schema";

// Always import both; we choose at runtime.
import { drizzle as drizzleVercel } from "drizzle-orm/vercel-postgres";
import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL;

// If we have a URL (local dev or any environment with a direct URL), use postgres-js.
// Otherwise, fall back to Vercel Postgres driver.
export const db = connectionString
  ? drizzlePg(postgres(connectionString, { prepare: false }), { schema })
  : drizzleVercel({ schema });
