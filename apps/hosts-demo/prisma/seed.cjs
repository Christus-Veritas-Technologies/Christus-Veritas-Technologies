// CommonJS seed — runs with plain `node` in the Docker runner container.
// TypeScript is not available at runtime, so this mirrors seed.ts without types.
'use strict';

// Resolve from /app/ so Node finds packages in the standalone's node_modules.
const { createRequire } = require('module');
const appRequire = createRequire('/app/');
const { Pool } = appRequire('pg');
const { PrismaPg } = appRequire('@prisma/adapter-pg');
const { PrismaClient, BookingStatus } = require('../src/generated/prisma');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Idempotency guard — skip entirely if rooms already exist.
  const existingRooms = await prisma.room.count();
  if (existingRooms > 0) {
    console.log(`✓ Already seeded (${existingRooms} rooms found) — skipping.`);
    return;
  }

  // ── Rooms ──────────────────────────────────────────────────────────────────
  const rooms = await Promise.all([
    prisma.room.create({
      data: {
        name: 'Garden Suite',
        slug: 'garden-suite',
        category: 'GARDEN SUITE',
        description:
          'A serene ground-floor room opening onto the private garden. Queen bed, en-suite shower, small writing desk, and a view of the rose beds. Quiet, private, and warm.',
        bedType: '1 Queen',
        capacity: 2,
        ratePerNight: 950,
        amenities: ['Full Breakfast', 'Free Wi-Fi', 'Private Bathroom', 'Secure Parking', 'Garden Access', 'Air Conditioning'],
        photos: [
          'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
          'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=80',
        ],
      },
    }),
    prisma.room.create({
      data: {
        name: 'Mountain View Room',
        slug: 'mountain-view-room',
        category: 'MOUNTAIN VIEW',
        description:
          'First floor with unobstructed views across the valley. King bed, en-suite bathroom with rainfall shower, and a reading chair by the window.',
        bedType: '1 King',
        capacity: 2,
        ratePerNight: 1200,
        amenities: ['Full Breakfast', 'Free Wi-Fi', 'Private Bathroom', 'Secure Parking', 'Mountain View', 'Air Conditioning'],
        photos: [
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80',
          'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&q=80',
        ],
      },
    }),
    prisma.room.create({
      data: {
        name: 'Family Room',
        slug: 'family-room',
        category: 'FAMILY ROOM',
        description:
          'Our largest standard room, configured for families. One king bed plus two single beds. En-suite bathroom with separate shower and bath. Ample wardrobe and storage.',
        bedType: '1 King + 2 Single',
        capacity: 4,
        ratePerNight: 1800,
        amenities: ['Full Breakfast', 'Free Wi-Fi', 'Private Bathroom', 'Secure Parking', 'Extra Beds', 'Air Conditioning'],
        photos: [
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80',
        ],
      },
    }),
    prisma.room.create({
      data: {
        name: 'Executive Suite',
        slug: 'executive-suite',
        category: 'EXECUTIVE SUITE',
        description:
          'Our flagship room. King bed with premium linen, a separate lounge area, en-suite with freestanding bath and shower, and a private balcony.',
        bedType: '1 King, en-suite lounge',
        capacity: 2,
        ratePerNight: 2200,
        amenities: ['Full Breakfast', 'Free Wi-Fi', 'Private Bathroom', 'Secure Parking', 'Private Balcony', 'Lounge Area', 'Premium Linen', 'Air Conditioning'],
        photos: [
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80',
        ],
      },
    }),
  ]);
  console.log(`✓ Created ${rooms.length} rooms`);

  // ── Guests ─────────────────────────────────────────────────────────────────
  const guestData = [
    { firstName: 'Thembi',  lastName: 'Dlamini',   email: 'thembi.dlamini@email.com',   phone: '0821234567' },
    { firstName: 'Pieter',  lastName: 'van Wyk',   email: 'pieter.vanwyk@email.com',    phone: '0831234567' },
    { firstName: 'Naledi',  lastName: 'Mokoena',   email: 'naledi.mokoena@email.com',   phone: '0791234567' },
    { firstName: 'James',   lastName: 'Ferreira',  email: 'james.ferreira@email.com',   phone: '0841234567' },
    { firstName: 'Amahle',  lastName: 'Zulu',      email: 'amahle.zulu@email.com',      phone: '0761234567' },
    { firstName: 'Ruan',    lastName: 'Botha',     email: 'ruan.botha@email.com',       phone: '0711234567' },
    { firstName: 'Fatima',  lastName: 'Essop',     email: 'fatima.essop@email.com',     phone: '0821345678' },
    { firstName: 'Sipho',   lastName: 'Ndlovu',    email: 'sipho.ndlovu@email.com',     phone: '0831456789' },
    { firstName: 'Karen',   lastName: 'Steyn',     email: 'karen.steyn@email.com',      phone: '0791567890' },
    { firstName: 'Lungelo', lastName: 'Khoza',     email: 'lungelo.khoza@email.com',    phone: '0726789012' },
    { firstName: 'Yusuf',   lastName: 'Patel',     email: 'yusuf.patel@email.com',      phone: '0737890123' },
    { firstName: 'Zanele',  lastName: 'Mahlangu',  email: 'zanele.mahlangu@email.com',  phone: '0748901234' },
  ];
  const guests = await Promise.all(guestData.map((g) => prisma.guest.create({ data: g })));
  console.log(`✓ Created ${guests.length} guests`);

  // ── Bookings ───────────────────────────────────────────────────────────────
  const roomMap = Object.fromEntries(rooms.map((r) => [r.slug, r]));
  const bookingsData = [
    { guestIdx: 0,  roomSlug: 'garden-suite',      checkIn: '2026-05-14', checkOut: '2026-05-17', nights: 3, amount: 2850,  status: BookingStatus.confirmed },
    { guestIdx: 1,  roomSlug: 'mountain-view-room', checkIn: '2026-05-20', checkOut: '2026-05-22', nights: 2, amount: 2400,  status: BookingStatus.confirmed },
    { guestIdx: 2,  roomSlug: 'family-room',        checkIn: '2026-05-28', checkOut: '2026-06-01', nights: 4, amount: 7200,  status: BookingStatus.confirmed },
    { guestIdx: 3,  roomSlug: 'executive-suite',    checkIn: '2026-06-03', checkOut: '2026-06-05', nights: 2, amount: 4400,  status: BookingStatus.confirmed },
    { guestIdx: 4,  roomSlug: 'garden-suite',       checkIn: '2026-06-10', checkOut: '2026-06-12', nights: 2, amount: 1900,  status: BookingStatus.confirmed },
    { guestIdx: 5,  roomSlug: 'mountain-view-room', checkIn: '2026-06-15', checkOut: '2026-06-18', nights: 3, amount: 3600,  status: BookingStatus.confirmed },
    { guestIdx: 6,  roomSlug: 'executive-suite',    checkIn: '2026-06-20', checkOut: '2026-06-23', nights: 3, amount: 6600,  status: BookingStatus.confirmed },
    { guestIdx: 7,  roomSlug: 'family-room',        checkIn: '2026-06-25', checkOut: '2026-06-28', nights: 3, amount: 5400,  status: BookingStatus.confirmed },
    { guestIdx: 8,  roomSlug: 'garden-suite',       checkIn: '2026-07-01', checkOut: '2026-07-04', nights: 3, amount: 2850,  status: BookingStatus.confirmed },
    { guestIdx: 9,  roomSlug: 'mountain-view-room', checkIn: '2026-07-08', checkOut: '2026-07-10', nights: 2, amount: 2400,  status: BookingStatus.confirmed },
    { guestIdx: 10, roomSlug: 'executive-suite',    checkIn: '2026-07-14', checkOut: '2026-07-17', nights: 3, amount: 6600,  status: BookingStatus.pending   },
    { guestIdx: 11, roomSlug: 'family-room',        checkIn: '2026-07-20', checkOut: '2026-07-24', nights: 4, amount: 7200,  status: BookingStatus.confirmed },
  ];

  let refCounter = 1001;
  const bookings = await Promise.all(
    bookingsData.map(({ guestIdx, roomSlug, checkIn, checkOut, nights, amount, status }) =>
      prisma.booking.create({
        data: {
          reference: `TH-${refCounter++}`,
          roomId: roomMap[roomSlug].id,
          guestId: guests[guestIdx].id,
          checkIn:  new Date(checkIn),
          checkOut: new Date(checkOut),
          nights,
          guestCount: roomSlug === 'family-room' ? 4 : 2,
          amount,
          status,
        },
      })
    )
  );
  console.log(`✓ Created ${bookings.length} bookings`);
  console.log('✓ Seed complete.');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
