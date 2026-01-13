# @cvt/db

Database package for Christus Veritas Technologies ERP using Prisma ORM.

## Setup

1. Create a `.env` file with your database URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/cvt_erp"
```

2. Generate Prisma client:

```bash
pnpm db:generate
```

3. Run migrations:

```bash
pnpm db:migrate
```

4. Seed the database:

```bash
pnpm db:seed
```

## Usage

```typescript
import { prisma } from "@cvt/db";

// Query example
const organizations = await prisma.organization.findMany();
```

## Scripts

- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database (development)
- `pnpm db:migrate` - Run migrations
- `pnpm db:migrate:deploy` - Deploy migrations (production)
- `pnpm db:seed` - Seed the database
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:reset` - Reset database and run migrations
