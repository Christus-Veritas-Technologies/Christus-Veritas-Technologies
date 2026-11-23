import prisma from "@Christus-Veritas-Technologies/db";
import { NextResponse } from "next/server";

import { contactSchema, fieldErrors } from "@/lib/validation";

/** Stores a quick enquiry from the services-page contact drawer. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 400 });
  }

  try {
    const request = await prisma.contactRequest.create({ data: parsed.data, select: { id: true } });
    return NextResponse.json({ ok: true, id: request.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to save contact request", error);
    return NextResponse.json({ ok: false, errors: { form: "We couldn't send your message. Please try again." } }, { status: 500 });
  }
}
