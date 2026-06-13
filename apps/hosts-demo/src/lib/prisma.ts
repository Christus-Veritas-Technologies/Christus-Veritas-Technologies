import type { PrismaClient } from "@/generated/prisma";

// Lazy singleton — PrismaClient is NOT instantiated at module load time.
// Using `import type` means zero runtime Prisma code runs when this module is
// imported. `new PrismaClient()` only runs on the first property access
// (e.g. `prisma.booking.findMany(...)`), which never happens during `next build`
// because all API routes are marked `export const dynamic = "force-dynamic"`.
//
// This pattern prevents two common Docker build failures:
//   1. Missing DATABASE_URL causes PrismaClientInitializationError at instantiation
//   2. @prisma/client-runtime-utils not found (required by the generated client)

const g = globalThis as unknown as { __prisma?: PrismaClient };

function getClient(): PrismaClient {
  if (!g.__prisma) {
    // Dynamic require so PrismaClient (and its deps) are resolved at call-time,
    // not at module-import time. In dev, cache on globalThis to survive HMR.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient: PC } = require("@/generated/prisma") as {
      PrismaClient: new (opts?: { log?: string[] }) => PrismaClient;
    };
    g.__prisma = new PC({ log: ["error"] });
  }
  return g.__prisma;
}

// Proxy so all existing callers (`prisma.booking.findMany()` etc.) work unchanged.
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    const c = getClient();
    const v = (c as Record<string | symbol, unknown>)[prop];
    return typeof v === "function" ? (v as () => unknown).bind(c) : v;
  },
});
