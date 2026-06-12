# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# openssl required by Prisma client generation
RUN apt-get update -y && apt-get install -y openssl && corepack enable

# Copy workspace manifests first for better layer caching
COPY package.json pnpm-workspace.yaml ./
COPY apps/hosts-site/package.json ./apps/hosts-site/package.json
COPY packages/config/package.json ./packages/config/package.json
COPY packages/db/package.json ./packages/db/package.json
COPY packages/env/package.json ./packages/env/package.json
COPY packages/ui/package.json ./packages/ui/package.json

# --ignore-scripts skips postinstall (prisma generate) during deps-only layer.
# Schema files aren't copied yet at this point, so the script would fail.
RUN pnpm install --no-frozen-lockfile --ignore-scripts

# Copy full source — now schema files exist
COPY . .

# Generate Prisma client with the explicit schema directory path
RUN cd packages/db && npx prisma generate --schema prisma/schema

# Build only the hosts-site app
RUN pnpm --filter hosts-site build

# ── Stage 2: Runner ───────────────────────────────────────────────────────────
# Standalone output is self-contained — no pnpm or node_modules needed
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

# Next.js standalone entrypoint — respects PORT and HOSTNAME env vars
CMD ["node", "apps/hosts-site/server.js"]
