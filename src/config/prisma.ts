import * as dotenv from "dotenv";
// Only load .env file in development (Railway provides env vars directly)
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import { PrismaClient } from "@prisma/client";
import { URL } from "url";

// Validate DATABASE_URL at startup to provide a clearer error message
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error(
    "FATAL: Missing DATABASE_URL environment variable. Prisma requires a valid Postgres connection string starting with 'postgresql://' or 'postgres://'."
  );
  console.error("Set DATABASE_URL in your environment or in Railway/hosting provider secrets.");
  // Exit early to avoid runtime 500s caused by Prisma initialization errors
  process.exit(1);
}

try {
  // Basic format validation
  const parsed = new URL(databaseUrl);
  if (!(parsed.protocol === "postgresql:" || parsed.protocol === "postgres:")) {
    console.error(
      `FATAL: DATABASE_URL protocol must be 'postgresql' or 'postgres'. Got: ${parsed.protocol}`
    );
    process.exit(1);
  }
} catch (err) {
  console.error("FATAL: DATABASE_URL is not a valid URL:", err instanceof Error ? err.message : String(err));
  process.exit(1);
}

// Create a simple Prisma client instance
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
