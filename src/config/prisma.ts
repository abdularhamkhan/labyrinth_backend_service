import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "../../prisma/generated/prisma";

// Create a simple Prisma client instance
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});
