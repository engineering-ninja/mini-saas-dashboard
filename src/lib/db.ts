import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { env } from "./env";
import { pgPoolConfig } from "./pg-ssl";

const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg(pgPoolConfig(env.DATABASE_URL)),
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Cache on globalThis so Next.js hot-reloads reuse one connection pool.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
