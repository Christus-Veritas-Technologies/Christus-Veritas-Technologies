# ── Stage 1: Builder ──────────────────────────────────────────────────────────
FROM node:22-slim AS builder

WORKDIR /app

# openssl is required by Prisma client generation
RUN apt-get update -y && apt-get install -y openssl && corepack enable

# Copy manifests first for better layer caching
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Install all dependencies (including devDeps needed for build)
RUN pnpm install --no-frozen-lockfile

# Copy full source
COPY . .

# Generate Prisma client then build the Next.js app
RUN pnpm run build

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

# Copy the standalone server bundle (self-contained node_modules subset)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Copy static assets and public folder (not included in standalone)
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Copy generated Prisma client so the runtime can reach it
COPY --from=builder --chown=nextjs:nodejs /app/src/generated ./src/generated

USER nextjs

EXPOSE 7779

CMD ["node", "server.js"]
