import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, format } from "date-fns";

export async function GET() {
  const now = new Date();
  const thirtyDaysAgo = subDays(now, 30);

  const [totalBookings, confirmedBookings, totalGuests, revenueResult, recentBookings, bookingsByDay] =
    await Promise.all([
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "confirmed" } }),
      prisma.guest.count(),
      prisma.booking.aggregate({
        _sum: { amount: true },
        where: { status: "confirmed" },
      }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          room: { select: { name: true } },
          guest: { select: { firstName: true, lastName: true } },
        },
      }),
      prisma.booking.findMany({
        where: { createdAt: { gte: thirtyDaysAgo }, status: "confirmed" },
        select: { createdAt: true, amount: true },
      }),
    ]);

  // Build daily revenue chart data
  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = format(subDays(now, i), "MMM d");
    dayMap.set(d, 0);
  }
  for (const b of bookingsByDay) {
    const d = format(b.createdAt, "MMM d");
    if (dayMap.has(d)) dayMap.set(d, (dayMap.get(d) ?? 0) + b.amount);
  }
  const revenueChart = Array.from(dayMap.entries()).map(([date, revenue]) => ({ date, revenue }));

  // Occupancy rate: confirmed bookings / total capacity (rough)
  const occupancyRate = totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0;

  return NextResponse.json({
    totalBookings,
    confirmedBookings,
    totalGuests,
    totalRevenue: revenueResult._sum.amount ?? 0,
    occupancyRate,
    recentBookings,
    revenueChart,
  });
}
