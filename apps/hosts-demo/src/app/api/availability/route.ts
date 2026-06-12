import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId");

  const where = roomId
    ? { roomId, status: { not: "cancelled" as const } }
    : { status: { not: "cancelled" as const } };

  const bookings = await prisma.booking.findMany({
    where,
    select: { checkIn: true, checkOut: true, roomId: true },
  });

  return NextResponse.json(bookings);
}
