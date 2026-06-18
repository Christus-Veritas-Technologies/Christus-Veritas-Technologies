import Image from "next/image";
import Link from "next/link";
import { FadeUp, ScaleIn, StaggerGrid, StaggerItem } from "@/components/animate";
import { DangerCallout } from "@/components/danger-callout";
import { WA_LINK } from "@/lib/config";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-xs tracking-[0.12em] uppercase mb-4"
      style={{ fontFamily: "var(--font-barlow)", color: "var(--text-secondary)" }}
    >
      {children}
    </p>
  );
}

const COMPARE_ROWS = [
  {
    label: "How guests find you",
    old: "Word of mouth and luck. If they do not already know you exist, they never will.",
    cvt: "Found on Google by anyone searching for a place to stay in your city.",
  },
  {
    label: "Booking process",
    old: "A WhatsApp back-and-forth, hoping they reply before booking somewhere else.",
    cvt: "Guest picks dates on your live calendar and books in under two minutes.",
  },
  {
    label: "Payment collection",
    old: "Chasing proof-of-payment screenshots and hoping the EcoCash actually went through.",
    cvt: "Collected upfront via EcoCash, OneMoney, or card at the point of booking.",
  },
  {
    label: "Guest contact details",
    old: "Scattered across phones, notebooks, and old WhatsApp chats.",
    cvt: "Stored in one permanent database, searchable, yours forever.",
  },
  {
    label: "What happens if records are lost",
    old: "A stolen phone or a lost notebook — years of history gone, with no way to recover it.",
    cvt: "Nothing is lost. Every guest, every booking, every payment is backed up and permanent.",
  },
  {
    label: "Repeat guest returning",
    old: "You hope they saved your number. Most did not.",
    cvt: "Already in your database — message them directly, anytime.",
  },
  {
    label: "Expense and revenue tracking",
    old: "Guesswork. The numbers exist only in your head, if at all.",
    cvt: "Logged automatically, with profit-and-loss reports exportable as PDF (Run Your Business and above).",
  },
  {
    label: "After-hours bookings",
    old: "A guest messages at 11pm. You are asleep. By morning, they have booked elsewhere.",
    cvt: "Your calendar takes the booking at 11pm — no one has to be awake.",
  },
  {
    label: "What you own after five years",
    old: "Nothing. No website, no database, no record beyond what is still in a drawer.",
    cvt: "A website, a domain, a guest database, and five years of booking history — all yours.",
  },
];

const COST_CARDS = [
  {
    label: "Every month invisible",
    body: "Another month of guests who searched for a place to stay in your city and booked the property that showed up — not yours.",
  },
  {
    label: "Every lost phone or notebook",
    body: "Every guest you have ever hosted, gone. No record, no way to reach them again.",
  },
  {
    label: "Every late WhatsApp reply",
    body: "A booking that goes to whoever answered first — not whoever runs the better property.",
  },
];

export default function ComparePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-[1100px] px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <Eyebrow>The Old Way vs CVT Hosts</Eyebrow>
            <h1
              className="text-4xl md:text-5xl leading-tight mb-6"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
            >
              Word of mouth and a notebook.
              <br />Or a system that works while you sleep.
            </h1>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              This is not a comparison with Booking.com. It is a comparison
              between how most Zimbabwe guest houses run today — and how a
              guest house runs with CVT Hosts.
            </p>
          </FadeUp>
          <ScaleIn delay={0.15} className="hidden md:block">
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}>
            <Image
              src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=700&h=500&fit=crop&auto=format"
              alt="Zimbabwe property with beautiful garden"
              width={700}
              height={500}
              className="w-full object-cover"
              unoptimized
            />
          </div>
          </ScaleIn>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 py-12 pb-24">
        {/* ── COMPARISON TABLE ─────────────────────────────────────────── */}
        <div
          className="rounded-sm overflow-hidden border mb-16"
          style={{ borderColor: "var(--border)" }}
        >
          {/* Desktop */}
          <table className="hidden md:table w-full text-sm">
            <thead>
              <tr style={{ background: "var(--bg-subtle)", borderBottom: "1px solid var(--border)" }}>
                <th className="py-4 px-6 text-left w-1/3" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-barlow)", fontWeight: 400 }}></th>
                <th className="py-4 px-6 text-left" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-secondary)" }}>The Old Way</th>
                <th className="py-4 px-6 text-left" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--accent)" }}>CVT Hosts</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map(({ label, old, cvt }, i) => (
                <tr
                  key={label}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-subtle)",
                  }}
                >
                  <td className="py-4 px-6 font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-barlow)" }}>{label}</td>
                  <td className="py-4 px-6 leading-snug" style={{ color: "var(--text-secondary)" }}>{old}</td>
                  <td className="py-4 px-6 leading-snug" style={{ color: "var(--text-primary)" }}>{cvt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile stacked */}
          <div className="md:hidden">
            {COMPARE_ROWS.map(({ label, old, cvt }, i) => (
              <div
                key={label}
                className="p-5 border-b"
                style={{ borderColor: "var(--border)", background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-subtle)" }}
              >
                <p className="text-xs font-bold mb-3 uppercase tracking-wide" style={{ color: "var(--text-primary)", fontFamily: "var(--font-barlow)" }}>
                  {label}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-barlow)" }}>The Old Way</p>
                    <p className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>{old}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--accent)", fontFamily: "var(--font-barlow)" }}>CVT Hosts</p>
                    <p className="text-sm leading-snug" style={{ color: "var(--text-primary)" }}>{cvt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── DANGER CALLOUT ───────────────────────────────────────────── */}
        <div className="mb-16">
          <DangerCallout>
            The dotcom era started over twenty years ago. Every year without
            a website is another year of guests who could not find you,
            bookings that fell through, and records that exist only as long
            as the notebook does.
          </DangerCallout>
        </div>

        {/* ── WHAT THE OLD WAY COSTS ───────────────────────────────────── */}
        <h2
          className="text-3xl mb-8"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
        >
          What the old way actually costs.
        </h2>
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {COST_CARDS.map(({ label, body }) => (
            <StaggerItem key={label}>
              <div
                className="rounded-sm border p-7 h-full"
                style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
              >
                <p
                  className="text-xs tracking-[0.1em] uppercase mb-4"
                  style={{ fontFamily: "var(--font-barlow)", color: "var(--accent)" }}
                >
                  {label}
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  {body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* ── WHAT YOU BUILD ───────────────────────────────────────────── */}
        <div
          className="rounded-sm p-8 md:p-12 mb-20"
          style={{ background: "var(--bg-surface)", borderLeft: "3px solid var(--accent)" }}
        >
          <h2
            className="text-3xl mb-6"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
          >
            Every guest you host today
            <br />is still yours in five years.
          </h2>
          <p className="text-base leading-relaxed max-w-[680px]" style={{ color: "var(--text-secondary)" }}>
            A guest who books through CVT Hosts is a guest in your database,
            permanently. Their details are yours — when they come back, you
            already know who they are. Compare that to a booking register or
            a WhatsApp thread: searchable for as long as the phone survives,
            gone the day it does not. That is what a permanent system builds
            over time — a guest list that compounds in your favour, not one
            that disappears.
          </p>
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <div className="text-center py-8">
          <h2
            className="text-3xl mb-8"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
          >
            Your property should be working for you.
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/packages"
              className="inline-block rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-90"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", background: "var(--accent)", color: "var(--text-inverse)" }}
            >
              See Our Packages
            </Link>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-80"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", border: "1px solid var(--accent)", color: "var(--accent)", background: "transparent" }}
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
