import prisma from "@Christus-Veritas-Technologies/db";
import { NextResponse } from "next/server";

import { claimSchema, fieldErrors } from "@/lib/validation";

/** Stores a $100-offer application from the claim form. */
export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = claimSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 400 });
  }

  const d = parsed.data;
  try {
    const claim = await prisma.claim.create({
      data: {
        name: d.name,
        phone: d.phone,
        email: d.email,
        owner: d.owner,
        business: d.business,
        description: d.what,
        yearsRunning: d.years,
        staffCount: d.staff,
        idea: d.idea,
        goal: d.goal,
        hasBrand: d.brand,
        depositReady: d.deposit,
        startWhen: d.start,
        paymentMethod: d.pay,
      },
      select: { id: true },
    });
    return NextResponse.json({ ok: true, id: claim.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to save claim", error);
    return NextResponse.json({ ok: false, errors: { form: "We couldn't save your application. Please try again." } }, { status: 500 });
  }
}
