import type { PrismaClient } from "@/generated/prisma";

// Lazy singleton with PrismaPg adapter for Prisma 7.
//
// Prisma 7 defaults to the "client" engine type (WASM-based), which requires
// either `adapter` or `accelerateUrl` in the PrismaClient constructor.
// Without one of these it throws PrismaClientConstructorValidationError.
//
// Solution: use @prisma/adapter-pg to provide a pg.Pool-backed adapter.
//
// Dynamic require() keeps all Prisma/pg code out of module-load time so that
// next build can load route modules (to read `export const dynamic`) without
// a real DATABASE_URL or the adapter packages being resolved at build time.

const g = globalThis as unknown as { __prisma?: PrismaClient };

function getClient(): PrismaClient {
  if (!g.__prisma) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient: PC } = require("@/generated/prisma") as {
      PrismaClient: new (opts?: unknown) => PrismaClient;
    };
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { Pool } = require("pg") as { Pool: new (opts: { connectionString: string }) => unknown };
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPg } = require("@prisma/adapter-pg") as {
      PrismaPg: new (pool: unknown) => unknown;
    };

    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    const adapter = new PrismaPg(pool);
    g.__prisma = new PC({ adapter, log: ["error"] });
  }
  return g.__prisma;
}

// Proxy preserves the `prisma.booking.findMany()` call shape for all callers.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    const c = getClient();
    const v = (c as Record<string | symbol, unknown>)[prop];
    return typeof v === "function" ? (v as () => unknown).bind(c) : v;
  },
});
