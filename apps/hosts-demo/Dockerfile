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

# Install Prisma CLI so the entrypoint can push the schema and seed at startup.
# This runs BEFORE USER nextjs so npm can write to /usr/local.
RUN npm install -g prisma@7.8.0

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy standalone bundle — Next.js preserves monorepo path structure inside standalone
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/.next/standalone ./

# Copy static assets and public folder (not included in standalone)
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/.next/static ./apps/hosts-demo/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/public ./apps/hosts-demo/public

# Copy generated Prisma client so the runtime can reach it
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/src/generated ./apps/hosts-demo/src/generated

# Copy schema and CJS seed so the entrypoint can push + seed at startup
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/prisma/schema.prisma ./apps/hosts-demo/prisma/schema.prisma
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/prisma/seed.cjs ./apps/hosts-demo/prisma/seed.cjs

# Startup entrypoint:
#   1. Push schema (idempotent — safe on every deploy)
#   2. Seed data   (idempotent — skips if rooms already exist)
#   3. Start the Next.js server
RUN printf '#!/bin/sh\nset -e\necho "==> Pushing schema..."\nprisma db push --schema=/app/apps/hosts-demo/prisma/schema.prisma --skip-generate --accept-data-loss\necho "==> Schema ready. Seeding..."\nnode /app/apps/hosts-demo/prisma/seed.cjs\necho "==> Starting server..."\nexec node apps/hosts-demo/server.js\n' > /entrypoint.sh \
  && chmod +x /entrypoint.sh

USER nextjs

EXPOSE 7779

CMD ["/entrypoint.sh"]
