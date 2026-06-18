# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# openssl required by Prisma (installed in workspace but not needed by hosts-site build)
RUN apt-get update -y && apt-get install -y openssl && corepack enable

# Copy workspace manifests first for better layer caching.
# pnpm-lock.yaml and .npmrc are included so pnpm resolves from the committed
# lockfile instead of re-resolving every dependency against the registry from
# scratch (the latter is what was timing out builds — see ERR_PNPM_BROKEN_METADATA_JSON).
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml .npmrc ./
COPY apps/hosts-site/package.json ./apps/hosts-site/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/env/package.json ./packages/env/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# --no-frozen-lockfile still lets pnpm adjust the lockfile if package.json drifted,
# but starting from a real lockfile avoids a full from-scratch resolution.
# --ignore-scripts skips all postinstall scripts (including packages/db prisma generate).
# hosts-site has no dependency on packages/db, so no client generation needed.
RUN pnpm config set fetch-retries 5 \
  && pnpm config set fetch-retry-mintimeout 20000 \
  && pnpm config set fetch-retry-maxtimeout 120000 \
  && pnpm install --no-frozen-lockfile --ignore-scripts

# Copy full source
COPY . .

# Build only the hosts-site app
RUN pnpm --filter hosts-site build

# ── Stage 2: Runner ───────────────────────────────────────────────────────────
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=7777
ENV HOSTNAME="0.0.0.0"

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy standalone bundle (contains its own node_modules subset)
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-site/.next/standalone ./

# Copy static assets and public folder
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-site/.next/static ./apps/hosts-site/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/hosts-site/public ./apps/hosts-site/public

USER nextjs

EXPOSE 7777

CMD ["node", "apps/hosts-site/server.js"]
