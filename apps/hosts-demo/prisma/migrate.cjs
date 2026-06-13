// migrate.cjs — runs with plain `node` in the Docker runner container.
// Creates all tables, indexes, and foreign keys from scratch (idempotent).
// Uses pg directly — no Prisma CLI needed, which avoids config-resolution
// issues in the standalone runner where devDependencies are not present.
'use strict';

const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('==> Creating enum types...');
    // DO block makes this idempotent — no error if enum already exists
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'cancelled');
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    console.log('==> Creating tables...');
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Room" (
        "id"           TEXT        NOT NULL,
        "name"         TEXT        NOT NULL,
        "slug"         TEXT        NOT NULL,
        "category"     TEXT        NOT NULL,
        "description"  TEXT        NOT NULL,
        "bedType"      TEXT        NOT NULL,
        "capacity"     INTEGER     NOT NULL,
        "ratePerNight" INTEGER     NOT NULL,
        "amenities"    TEXT[],
        "photos"       TEXT[],
        "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Room_slug_key" ON "Room"("slug");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "Guest" (
        "id"        TEXT         NOT NULL,
        "firstName" TEXT         NOT NULL,
        "lastName"  TEXT         NOT NULL,
        "email"     TEXT         NOT NULL,
        "phone"     TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Guest_email_key" ON "Guest"("email");
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS "Booking" (
        "id"              TEXT           NOT NULL,
        "reference"       TEXT           NOT NULL,
        "roomId"          TEXT           NOT NULL,
        "guestId"         TEXT           NOT NULL,
        "checkIn"         TIMESTAMP(3)   NOT NULL,
        "checkOut"        TIMESTAMP(3)   NOT NULL,
        "nights"          INTEGER        NOT NULL,
        "guestCount"      INTEGER        NOT NULL DEFAULT 2,
        "amount"          INTEGER        NOT NULL,
        "status"          "BookingStatus" NOT NULL DEFAULT 'pending',
        "specialRequests" TEXT,
        "createdAt"       TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt"       TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
      );
    `);

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "Booking_reference_key" ON "Booking"("reference");
    `);

    console.log('==> Adding foreign keys...');
    // DO blocks make each FK idempotent — no error if constraint already exists
    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "Booking"
          ADD CONSTRAINT "Booking_roomId_fkey"
          FOREIGN KEY ("roomId") REFERENCES "Room"("id")
          ON DELETE RESTRICT ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    await client.query(`
      DO $$ BEGIN
        ALTER TABLE "Booking"
          ADD CONSTRAINT "Booking_guestId_fkey"
          FOREIGN KEY ("guestId") REFERENCES "Guest"("id")
          ON DELETE RESTRICT ON UPDATE CASCADE;
      EXCEPTION WHEN duplicate_object THEN NULL;
      END $$;
    `);

    console.log('✓ Schema ready.');
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch((e) => { console.error(e); process.exit(1); });
