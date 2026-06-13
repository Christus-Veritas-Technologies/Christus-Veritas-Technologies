# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# openssl required by Prisma client generation
RUN apt-get update -y && apt-get install -y openssl && corepack enable

# Copy workspace manifests first (same pattern as hosts-site — no .npmrc, no lockfile).
# pnpm uses default settings, so auto-install-peers=true applies and
# @prisma/client-runtime-utils is auto-installed as a peer dep of @prisma/client.
COPY package.json pnpm-workspace.yaml ./
COPY apps/hosts-demo/package.json ./apps/hosts-demo/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/env/package.json ./packages/env/package.json
COPY packages/ui/package.json ./packages/ui/package.json

RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copy full source
COPY . .

# Prisma 7 validates datasource.url at PrismaClient() instantiation time.
# Next.js loads route modules at build to read their exports (e.g. `dynamic`).
# Without DATABASE_URL the module throws before force-dynamic is read, failing the build.
# This dummy URL lets PrismaClient instantiate; the real URL comes from Coolify at runtime.
ENV DATABASE_URL="postgresql://build:build@localhost:5432/build"

# Generate Prisma client then build only the hosts-demo app
RUN pnpm --filter hosts-demo build

# ── Stage 2: Runner ───────────────────────────────────────────────────────────
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=7779
ENV HOSTNAME="0.0.0.0"

# openssl required at runtime by Prisma
RUN apt-get update -y && apt-get install -y openssl \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy standalone bundle — Next.js preserves monorepo path structure inside standalone
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/.next/standalone ./

# Copy static assets and public folder (not included in standalone)
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/.next/static ./apps/hosts-demo/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/public ./apps/hosts-demo/public

# Copy generated Prisma client so the runtime can reach it
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/src/generated ./apps/hosts-demo/src/generated

# Copy migration and seed scripts — both are plain CJS that run with bare node.
# pg is a runtime dep so it IS present in the standalone node_modules.
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/prisma/migrate.cjs ./apps/hosts-demo/prisma/migrate.cjs
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/prisma/seed.cjs ./apps/hosts-demo/prisma/seed.cjs

# Startup entrypoint:
#   1. Run migrate.cjs  — creates all tables/indexes/FKs (idempotent, uses pg directly)
#   2. Run seed.cjs     — inserts demo data if rooms table is empty
#   3. Start the server
RUN printf '#!/bin/sh\n# No set -e: server must start even if migration/seed fails\necho "==> Running schema migration..."\nif node /app/apps/hosts-demo/prisma/migrate.cjs 2>&1; then\n  echo "==> Migration done. Seeding..."\n  node /app/apps/hosts-demo/prisma/seed.cjs 2>&1 || echo "WARNING: seed failed"\nelse\n  echo "WARNING: migration failed -- server will start anyway"\nfi\necho "==> Starting server..."\ncd /app\nexec node apps/hosts-demo/server.js\n' > /entrypoint.sh \
  && chmod +x /entrypoint.sh

USER nextjs

EXPOSE 7779

CMD ["/entrypoint.sh"]
