"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";

function ConfirmedContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref") ?? "TH-XXXXXX";
  const room = searchParams.get("room") ?? "Room";
  const amount = searchParams.get("amount") ?? "0";

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Navbar />
      <div className="pt-28 pb-20 px-6 flex items-start justify-center">
        <div className="max-w-lg w-full">
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          >
            <div className="w-20 h-20 rounded-full bg-[var(--success)]/10 border-4 border-[var(--success)] flex items-center justify-center">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
          </motion.div>

          <motion.div className="text-center mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[var(--text-primary)] mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-[var(--text-secondary)]">
              Thank you - your stay at Thornfield has been reserved. A confirmation email is on its way.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <Card className="border-[var(--border)] mb-6">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-[family-name:var(--font-barlow)] font-bold text-base text-[var(--text-primary)]">Booking Reference</h2>
                  <span className="font-[family-name:var(--font-barlow)] font-black text-xl text-[var(--accent)] tracking-widest">{ref}</span>
                </div>
                <Separator className="mb-4" />
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Room</span>
                    <span className="font-medium text-[var(--text-primary)]">{room}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Total paid</span>
                    <span className="font-bold text-[var(--accent)] font-[family-name:var(--font-barlow)]">${Number(amount).toLocaleString("en-US")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-secondary)]">Payment status</span>
                    <span className="font-medium text-[var(--success)] flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                      Paid
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
            <Card className="bg-[var(--bg-subtle)] border-[var(--border)] mb-8">
              <CardContent className="p-5">
                <h3 className="font-[family-name:var(--font-barlow)] font-semibold text-sm text-[var(--text-primary)] mb-3">What happens next?</h3>
                <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
                  {[
                    "You will receive a confirmation email with your booking details.",
                    "We will reach out if we need anything before your arrival.",
                    "Check-in is from 14:00. Let us know if you will be arriving late.",
                    "We look forward to welcoming you to Nyanga!",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[var(--accent)] font-bold mt-0.5">{i + 1}.</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div className="flex flex-col sm:flex-row gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
            <Button asChild className="flex-1"><Link href="/">Back to Home</Link></Button>
            <Button asChild variant="outline" className="flex-1"><Link href="/rooms">Browse Rooms</Link></Button>
          </motion.div>

          <motion.p
            className="text-center text-xs text-[var(--text-secondary)]/50 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            Demo environment · no real payment was processed
          </motion.p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function ConfirmedPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-primary)]" />}>
      <ConfirmedContent />
    </Suspense>
  );
}
