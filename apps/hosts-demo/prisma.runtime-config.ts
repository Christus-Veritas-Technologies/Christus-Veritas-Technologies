// Runtime-only Prisma config — used inside the Docker runner container.
// No dotenv import: DATABASE_URL is injected directly by Coolify at runtime.
// This file is copied as prisma.config.ts into the runner during the Docker build.
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
