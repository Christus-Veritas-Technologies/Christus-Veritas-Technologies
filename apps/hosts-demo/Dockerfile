# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# openssl required by Prisma client generation
RUN apt-get update -y && apt-get install -y openssl && corepack enable

# Copy workspace manifests first for better layer caching.
# Must copy ALL package.json files so pnpm can resolve workspace:* references.
# .npmrc must be copied so pnpm respects public-hoist-pattern for @prisma/*
COPY package.json pnpm-workspace.yaml .npmrc ./
COPY apps/hosts-demo/package.json ./apps/hosts-demo/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/env/package.json ./packages/env/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# --ignore-scripts skips postinstall hooks (prisma generate runs in the build step below)
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copy full source
COPY . .

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

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy standalone bundle — Next.js preserves monorepo path structure inside standalone
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/.next/standalone ./

# Copy static assets and public folder (not included in standalone)
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/.next/static ./apps/hosts-demo/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/public ./apps/hosts-demo/public

# Copy generated Prisma client so the runtime can reach it
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-demo/src/generated ./apps/hosts-demo/src/generated

USER nextjs

EXPOSE 7779

# server.js lives at the monorepo-relative path inside the standalone bundle
CMD ["node", "apps/hosts-demo/server.js"]
