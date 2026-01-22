import { config } from "dotenv";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { migrate } from "drizzle-orm/vercel-postgres/migrator";

// Load environment variables from .env.local
config({ path: ".env.local" });

async function runMigration() {
  console.log("Running migrations...");

  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL environment variable is not set");
  }

  const db = drizzle();

  await migrate(db, { migrationsFolder: "./drizzle" });

  console.log("Migrations completed!");
  process.exit(0);
}

runMigration().catch((err) => {
  console.error("Migration failed!");
  console.error(err);
  process.exit(1);
});
