import { env } from "@Christus-Veritas-Technologies/env/server";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../prisma/generated/client";

export * from "../prisma/generated/client";

export function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

// Reuse one client across hot reloads in development so connections don't pile up.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
