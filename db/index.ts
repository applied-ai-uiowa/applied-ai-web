import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client = postgres("PASTE_THE_SAME_URL_STUDIO_IS_USING", { prepare: false });

export const db = drizzle(client, { schema });
