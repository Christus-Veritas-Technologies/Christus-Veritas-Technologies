import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      room: { select: { name: true } },
      guest: { select: { firstName: true, lastName: true, email: true, phone: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const headers = ["Reference", "Guest", "Email", "Phone", "Room", "Check-In", "Check-Out", "Nights", "Guests", "Amount (R)", "Status", "Created"];
  const rows = bookings.map((b) => [
    b.reference,
    `${b.guest.firstName} ${b.guest.lastName}`,
    b.guest.email,
    b.guest.phone ?? "",
    b.room.name,
    format(b.checkIn, "yyyy-MM-dd"),
    format(b.checkOut, "yyyy-MM-dd"),
    b.nights,
    b.guestCount,
    b.amount,
    b.status,
    format(b.createdAt, "yyyy-MM-dd"),
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="thornfield-bookings-${format(new Date(), "yyyy-MM-dd")}.csv"`,
    },
  });
}
