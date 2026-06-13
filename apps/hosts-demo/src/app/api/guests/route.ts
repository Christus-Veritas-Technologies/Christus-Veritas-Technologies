import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "50");

  const [guests, total] = await Promise.all([
    prisma.guest.findMany({
      include: {
        bookings: {
          select: { id: true, reference: true, status: true, checkIn: true, amount: true },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.guest.count(),
  ]);

  return NextResponse.json({ guests, total, page, limit });
}
