import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

/**
 * Single shared PrismaClient instance.
 *
 * Prisma 7 connects through a driver adapter; we use the native `pg` adapter
 * pointed at DATABASE_URL. In development we cache the client on `globalThis`
 * so Next.js hot-reloads don't open a new connection pool on every change.
 */
const createPrismaClient = () =>
  new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
