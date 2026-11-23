# Christus-Veritas-Technologies

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines Next.js, Self, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **Next.js** - Full-stack React framework
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Prisma** - TypeScript-first ORM
- **PostgreSQL** - Database engine
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

## Database Setup

This project uses PostgreSQL with Prisma 7. The schema lives in `packages/db/prisma/schema/schema.prisma` and migrations in `packages/db/prisma/migrations`.

Tables:

- `claims`: applications for the $100 offer, saved by `POST /api/claim`
- `contact_requests`: enquiries from the services-page drawer, saved by `POST /api/contact`

1. Copy `apps/web/.env.example` to `apps/web/.env` and set `DATABASE_URL`, e.g.
   `postgresql://postgres:<password>@localhost:5432/cvt?schema=public`
2. Create the database and apply all migrations:

```bash
pnpm run db:migrate
```

After changing the schema, run `pnpm run db:migrate` again; it creates a new migration in `packages/db/prisma/migrations`. Commit those files.

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## Deployment (Docker Compose / Coolify)

`docker-compose.yml` at the repository root runs everything: PostgreSQL 18 (`db`) and the Next.js site (`web`). The web image is built from a Dockerfile inlined in the compose file. On every start, it applies pending Prisma migrations (`prisma migrate deploy`) and then runs `next start` on port 3000.

- Required variable: `POSTGRES_PASSWORD`. Use letters and numbers only, because it is embedded in the database URL.
- Optional variables: `POSTGRES_USER` (default `postgres`) and `POSTGRES_DB` (default `cvt`).
- Database data persists in the `cvt-postgres` volume.

Locally: `POSTGRES_PASSWORD=change-me docker compose up -d --build`. Add `ports: ["3000:3000"]` under `web` to reach it at http://localhost:3000.

On Coolify: create a resource from the public Git repository, choose the **Docker Compose** build pack, set the base directory to `/` and the Docker Compose location to `/docker-compose.yml`. Set `POSTGRES_PASSWORD` in Environment Variables, give the `web` service a domain ending in `:3000` (for example `https://example.com:3000`), and deploy.

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@Christus-Veritas-Technologies/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Project Structure

```
Christus-Veritas-Technologies/
├── apps/
│   └── web/         # Fullstack application (Next.js)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   └── db/          # Database schema & queries
```

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run db:push`: Push schema changes to database (prototyping only; prefer migrations)
- `pnpm run db:generate`: Generate database client/types
- `pnpm run db:migrate`: Create and apply database migrations (development)
- `pnpm run db:studio`: Open database studio UI
