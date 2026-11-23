import { NextResponse } from "next/server";

/** Receives claim-form answers. Wire this to email, a sheet, a CRM or WhatsApp. */
export async function POST(req: Request) {
  const data = await req.json();
  console.log("New $100 claim:", data);
  return NextResponse.json({ ok: true });
}
