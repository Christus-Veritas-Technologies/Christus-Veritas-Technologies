import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const bookingSchema = z.object({
  roomId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  nights: z.number(),
  guestCount: z.number().min(1).max(10),
  amount: z.number(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  specialRequests: z.string().optional(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");

  const where = status ? { status: status as "pending" | "confirmed" | "cancelled" } : {};

  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: { room: { select: { name: true } }, guest: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.booking.count({ where }),
  ]);

  return NextResponse.json({ bookings, total, page, limit });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = bookingSchema.parse(body);

  const reference = `TH-${Date.now().toString(36).toUpperCase()}`;

  // Upsert guest
  const guest = await prisma.guest.upsert({
    where: { email: data.email },
    update: { firstName: data.firstName, lastName: data.lastName, phone: data.phone },
    create: { firstName: data.firstName, lastName: data.lastName, email: data.email, phone: data.phone },
  });

  const booking = await prisma.booking.create({
    data: {
      reference,
      roomId: data.roomId,
      guestId: guest.id,
      checkIn: new Date(data.checkIn),
      checkOut: new Date(data.checkOut),
      nights: data.nights,
      guestCount: data.guestCount,
      amount: data.amount,
      status: "pending",
      specialRequests: data.specialRequests,
    },
    include: { room: { select: { name: true } }, guest: true },
  });

  return NextResponse.json(booking, { status: 201 });
}
