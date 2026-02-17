import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.POSTGRES_URL_NON_POOLING ??
  process.env.POSTGRES_URL ??
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "Missing database connection string. Set POSTGRES_URL_NON_POOLING or POSTGRES_URL or DATABASE_URL in .env.local."
  );
}

// Disable prepared statements for some hosted Postgres providers
const client = postgres(connectionString, { prepare: false });

export const db = drizzle(client, { schema });
