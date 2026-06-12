"use client";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// PayFast sandbox merchant details (public test credentials)
const PAYFAST_SANDBOX_URL = "https://sandbox.payfast.co.za/eng/process";
const MERCHANT_ID = "10000100";
const MERCHANT_KEY = "46f0cd694581a";
const RETURN_URL_BASE = "/book/confirmed";
const CANCEL_URL = "/book";
const NOTIFY_URL = "/api/payfast/notify"; // IPN (not implemented in demo)

function md5(str: string): Promise<string> {
  // For demo purposes we skip real MD5 signature — PayFast sandbox accepts without
  return Promise.resolve("");
}

function PaymentContent() {
  const searchParams = useSearchParams();

  const ref = searchParams.get("ref") ?? "";
  const room = searchParams.get("room") ?? "Room";
  const amount = searchParams.get("amount") ?? "0";
  const firstName = searchParams.get("firstName") ?? "";
  const lastName = searchParams.get("lastName") ?? "";
  const email = searchParams.get("email") ?? "";

  const [copied, setCopied] = useState(false);
  const formattedAmount = Number(amount).toFixed(2);

  // PayFast form fields
  const payfastFields = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: `${typeof window !== "undefined" ? window.location.origin : ""}/book/confirmed?ref=${ref}&room=${encodeURIComponent(room)}&amount=${amount}`,
    cancel_url: `${typeof window !== "undefined" ? window.location.origin : ""}${CANCEL_URL}`,
    notify_url: `${typeof window !== "undefined" ? window.location.origin : ""}${NOTIFY_URL}`,
    name_first: firstName || "Guest",
    name_last: lastName || "Guest",
    email_address: email || "guest@example.com",
    m_payment_id: ref,
    amount: formattedAmount,
    item_name: `Thornfield Guest House – ${room}`,
    item_description: `Booking reference: ${ref}`,
  };

  function copyTestCard() {
    navigator.clipboard?.writeText("4000000000000002").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <Badge className="mb-3 bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/30">
              Secure Payment
            </Badge>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[var(--text-primary)]">
              Complete Your Booking
            </h1>
            <p className="text-[var(--text-secondary)] mt-2 text-sm">
              You'll be redirected to PayFast to complete payment securely.
            </p>
          </div>

          {/* Booking summary */}
          <Card className="mb-5 border-[var(--border)]">
            <CardContent className="p-5">
              <h2 className="font-[family-name:var(--font-barlow)] font-bold text-sm uppercase tracking-wide text-[var(--text-secondary)] mb-3">Booking Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Reference</span>
                  <span className="font-[family-name:var(--font-barlow)] font-bold text-[var(--accent)]">{ref || "TH-DEMO"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-secondary)]">Room</span>
                  <span className="font-medium text-[var(--text-primary)]">{room}</span>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-bold">
                <span>Total Amount</span>
                <span className="text-[var(--accent)] font-[family-name:var(--font-barlow)] text-xl">
                  R{Number(amount).toLocaleString("en-ZA")}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Test card note */}
          <Card className="mb-6 border-amber-200 bg-amber-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="shrink-0 mt-0.5"><path d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                <p className="font-semibold text-sm text-[var(--text-primary)] font-[family-name:var(--font-barlow)]">Demo — Use Test Card</p>
              </div>
              <div className="space-y-1.5 text-sm text-[var(--text-secondary)]">
                <div className="flex justify-between items-center bg-white rounded-md px-3 py-2 border border-amber-200">
                  <div>
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Card Number</p>
                    <p className="font-mono font-bold text-[var(--text-primary)] tracking-widest">4000 0000 0000 0002</p>
                  </div>
                  <button
                    onClick={copyTestCard}
                    className="text-xs text-[var(--accent)] hover:underline font-medium"
                  >
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 bg-white rounded-md px-3 py-2 border border-amber-200">
                    <p className="text-xs text-[var(--text-secondary)] font-medium">Expiry</p>
                    <p className="font-mono font-bold text-[var(--text-primary)]">Any future date</p>
                  </div>
                  <div className="flex-1 bg-white rounded-md px-3 py-2 border border-amber-200">
                    <p className="text-xs text-[var(--text-secondary)] font-medium">CVV</p>
                    <p className="font-mono font-bold text-[var(--text-primary)]">Any 3 digits</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* PayFast POST form */}
          <form action={PAYFAST_SANDBOX_URL} method="POST">
            {Object.entries(payfastFields).map(([name, value]) => (
              <input key={name} type="hidden" name={name} value={value} />
            ))}
            <Button type="submit" size="lg" className="w-full text-base mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
              Pay R{Number(amount).toLocaleString("en-ZA")} via PayFast
            </Button>
          </form>

          <div className="flex items-center justify-center gap-2 text-xs text-[var(--text-secondary)]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="11" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secured by PayFast · PCI DSS Level 1 Certified
          </div>

          <Separator className="my-5" />

          <p className="text-center text-sm text-[var(--text-secondary)]">
            Changed your mind?{" "}
            <Link href="/book" className="text-[var(--accent)] hover:underline font-medium">
              Go back to booking
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)]" />}>
      <PaymentContent />
    </Suspense>
  );
}
