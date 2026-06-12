import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function GET() {
  const bookings = await prisma.booking.findMany({
    include: {
      room: { select: { name: true } },
      guest: { select: { firstName: true, lastName: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Dynamic import to avoid SSR issues
  const { default: jsPDF } = await import("jspdf");
  const autoTable = (await import("jspdf-autotable")).default;

  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  // Header
  doc.setFillColor(201, 168, 76);
  doc.rect(0, 0, 297, 18, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text("Thornfield Guest House — Bookings Report", 14, 12);
  doc.setFontSize(9);
  doc.text(`Generated: ${format(new Date(), "dd MMM yyyy")}`, 230, 12);

  autoTable(doc, {
    startY: 24,
    head: [["Reference", "Guest", "Room", "Check-In", "Check-Out", "Nights", "Amount", "Status"]],
    body: bookings.map((b) => [
      b.reference,
      `${b.guest.firstName} ${b.guest.lastName}`,
      b.room.name,
      format(b.checkIn, "dd MMM yyyy"),
      format(b.checkOut, "dd MMM yyyy"),
      b.nights,
      `R${b.amount.toLocaleString("en-ZA")}`,
      b.status.toUpperCase(),
    ]),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [26, 24, 22], textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [244, 241, 236] },
    columnStyles: { 7: { fontStyle: "bold" } },
  });

  const pdfBytes = doc.output("arraybuffer");

  return new NextResponse(pdfBytes, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="thornfield-bookings-${format(new Date(), "yyyy-MM-dd")}.pdf"`,
    },
  });
}
