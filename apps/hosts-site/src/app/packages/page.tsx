"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BrowserIcon,
  SmartPhone01Icon,
  GoogleIcon,
  CalendarCheck01Icon,
  CreditCardIcon,
  DatabaseIcon,
  LinkSquare01Icon,
  WhatsappIcon,
  Search01Icon,
  HeadsetIcon,
  Link01Icon,
  UserListIcon,
  FileDownloadIcon,
  AnalyticsUpIcon,
  AiBrain01Icon,
  Megaphone01Icon,
  DocumentCodeIcon,
  ChartBarIcon,
  Calendar01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Message01Icon,
  UserCheck01Icon,
} from "hugeicons-react";

const WA_LINK =
  "https://wa.me/27000000000?text=Hi%20CVT%20Hosts%2C%20I%27d%20like%20to%20know%20more%20about%20your%20packages.";

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

function Check() {
  return <CheckmarkCircle02Icon size={20} style={{ color: "var(--accent)" }} />;
}
function Dash() {
  return <span style={{ color: "var(--text-secondary)" }}>—</span>;
}

function FeatureItem({ Icon, label }: { Icon: React.ElementType; label: string }) {
  return (
    <li className="flex items-start gap-3">
      <Icon size={20} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
      <span className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>{label}</span>
    </li>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "var(--border)" }}>
      <button
        className="flex w-full items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <span
          className="text-base"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
        >
          {q}
        </span>
        {open
          ? <ArrowUp01Icon size={20} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
          : <ArrowDown01Icon size={20} style={{ color: "var(--text-secondary)", flexShrink: 0 }} />
        }
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          {a}
        </p>
      )}
    </div>
  );
}

const TABLE_ROWS = [
  { feature: "Professional website", starter: true, growth: true, full: true },
  { feature: "Mobile-first design", starter: true, growth: true, full: true },
  { feature: "Google Business Profile setup", starter: true, growth: true, full: true },
  { feature: "Live booking calendar", starter: true, growth: true, full: true },
  { feature: "PayFast payment integration", starter: true, growth: true, full: true },
  { feature: "Bookings database", starter: true, growth: true, full: true },
  { feature: "Shareable booking link", starter: true, growth: true, full: true },
  { feature: "WhatsApp booking notification", starter: true, growth: true, full: true },
  { feature: "Basic SEO setup", starter: true, growth: true, full: true },
  { feature: "Booking.com calendar sync", starter: false, growth: true, full: true },
  { feature: "Guest contact database", starter: false, growth: true, full: true },
  { feature: "Automated guest confirmation (WhatsApp)", starter: false, growth: true, full: true },
  { feature: "PDF and CSV report exports", starter: false, growth: true, full: true },
  { feature: "Revenue and occupancy reporting", starter: false, growth: true, full: true },
  { feature: "WhatsApp AI Agent (full autonomous booking)", starter: false, growth: false, full: true },
  { feature: "Ad campaign management", starter: false, growth: false, full: true },
  { feature: "Monthly SEO blog post", starter: false, growth: false, full: true },
  { feature: "Monthly performance report", starter: false, growth: false, full: true },
  { feature: "Quarterly strategy call", starter: false, growth: false, full: true },
];

const SUPPORT_ROW = {
  feature: "Support",
  starterLabel: "1 month",
  growthLabel: "Ongoing",
  fullLabel: "Priority, ongoing",
};

const FAQS = [
  {
    q: "Do I need to leave Booking.com to use this?",
    a: "No. Your Booking.com listing stays active. The Growth and Full Stack packages sync your calendars automatically so there are no double bookings.",
  },
  {
    q: "What payment methods can my guests use?",
    a: "PayFast supports Visa, Mastercard, and EFT. Guests pay at the point of booking — no account needed, no friction.",
  },
  {
    q: "Who sets up PayFast?",
    a: "We do. We handle the full integration. If you do not have a PayFast account, we walk you through creating one.",
  },
  {
    q: "How does the shareable booking link work?",
    a: "It is a direct link to your booking calendar. You can paste it into your Instagram bio, your WhatsApp status, a Facebook post, a Google Business description — anywhere. A guest who clicks it goes straight to your availability and can book in under two minutes.",
  },
  {
    q: "How does the WhatsApp AI Agent get trained on my property?",
    a: "During setup we load your rooms, rates, availability rules, cancellation policy, and any FAQs into the Agent. It draws on your live bookings database so its availability information is always accurate.",
  },
  {
    q: "Can I see everything the Agent has booked?",
    a: "Yes. Every booking the Agent makes is written to your bookings database in real time. You can view, search, filter, and export the full booking history at any time.",
  },
  {
    q: "What if the Agent cannot handle a guest's question?",
    a: "The Agent recognises when a conversation is outside its scope and flags it to you with a notification. It does not guess or give wrong information — it hands off cleanly.",
  },
  {
    q: "Is there a long-term contract?",
    a: "No. Month to month. One month's notice to cancel.",
  },
];

export default function PackagesPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-[1100px] px-6">
          <Eyebrow>Pricing</Eyebrow>
          <h1
            className="text-4xl md:text-5xl leading-tight mb-6 max-w-xl"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
          >
            Three packages.
            <br />One clear upgrade path.
          </h1>
          <p className="text-base max-w-[600px]" style={{ color: "var(--text-secondary)" }}>
            Every package includes a professional website, a bookings database, and a shareable booking
            link. What you choose determines how much of your business you automate.
          </p>
        </div>
      </section>

      {/* ── LAUNCH OFFER BANNER ──────────────────────────────────────────── */}
      <div style={{ background: "var(--bg-subtle)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-[1100px] px-6 py-5 flex items-center gap-4">
          <Clock01Icon size={20} style={{ color: "var(--accent)", flexShrink: 0 }} />
          <div>
            <span
              className="text-xs tracking-[0.1em] uppercase mr-3"
              style={{ fontFamily: "var(--font-barlow)", color: "var(--accent)" }}
            >
              Launch Offer — First 5 Properties
            </span>
            <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
              The first 5 SA guest houses to sign up receive 50% off the once-off setup fee. Monthly retainer unchanged.
            </span>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1100px] px-6 py-16">
        {/* ── PACKAGE CARDS ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">

          {/* Starter */}
          <div className="rounded-sm border flex flex-col overflow-hidden" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <div className="p-7 flex flex-col gap-5 flex-1">
              <Eyebrow>Starter</Eyebrow>
              <div>
                <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, color: "var(--text-primary)" }}>
                  Get Found
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Your property online, taking direct bookings from day one.
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-barlow)" }}>Once-off</p>
                <p className="text-4xl" style={{ fontFamily: "var(--font-barlow)", fontWeight: 900, color: "var(--text-primary)" }}>
                  <span className="line-through text-2xl mr-2" style={{ color: "var(--text-secondary)" }}>R7,000</span>
                  R3,500
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>R499 per month</p>
                <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>Launch price</p>
              </div>
              <ul className="flex flex-col gap-3 flex-1">
                <FeatureItem Icon={BrowserIcon} label="Professional 5-page website" />
                <FeatureItem Icon={SmartPhone01Icon} label="Mobile-first design" />
                <FeatureItem Icon={GoogleIcon} label="Google Business Profile setup" />
                <FeatureItem Icon={CalendarCheck01Icon} label="Live booking calendar" />
                <FeatureItem Icon={CreditCardIcon} label="PayFast integration" />
                <FeatureItem Icon={DatabaseIcon} label="Bookings database" />
                <FeatureItem Icon={LinkSquare01Icon} label="Shareable booking link" />
                <FeatureItem Icon={WhatsappIcon} label="WhatsApp booking notification" />
                <FeatureItem Icon={Search01Icon} label="Basic SEO setup" />
                <FeatureItem Icon={HeadsetIcon} label="1 month support included" />
              </ul>
              <p className="text-xs pt-4 border-t" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                Best for: Properties that want a professional presence and a working direct booking system from day one.
              </p>
              <Link
                href="/contact"
                className="block text-center rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-80 mt-2"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", border: "1px solid var(--accent)", color: "var(--accent)" }}
              >
                Get Started — Starter
              </Link>
            </div>
          </div>

          {/* Growth */}
          <div className="rounded-sm flex flex-col overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--accent)" }}>
            <div className="h-[3px] w-full" style={{ background: "var(--accent)" }} />
            <div className="p-7 flex flex-col gap-5 flex-1">
              <Eyebrow>Growth</Eyebrow>
              <div>
                <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, color: "var(--text-primary)" }}>
                  Take Direct Bookings
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  A complete booking system with reporting so you always know where your business stands.
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-barlow)" }}>Once-off</p>
                <p className="text-4xl" style={{ fontFamily: "var(--font-barlow)", fontWeight: 900, color: "var(--text-primary)" }}>
                  <span className="line-through text-2xl mr-2" style={{ color: "var(--text-secondary)" }}>R15,000</span>
                  R7,500
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>R899 per month</p>
                <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>Launch price</p>
              </div>
              <ul className="flex flex-col gap-3 flex-1">
                <FeatureItem Icon={BrowserIcon} label="Everything in Starter" />
                <FeatureItem Icon={Link01Icon} label="Booking.com calendar sync" />
                <FeatureItem Icon={UserListIcon} label="Guest contact database" />
                <FeatureItem Icon={WhatsappIcon} label="Automated booking confirmation via WhatsApp" />
                <FeatureItem Icon={FileDownloadIcon} label="PDF and CSV report exports" />
                <FeatureItem Icon={AnalyticsUpIcon} label="Revenue summaries, occupancy data, guest history" />
                <FeatureItem Icon={HeadsetIcon} label="Ongoing monthly support" />
              </ul>
              {/* The math callout */}
              <div className="rounded-sm p-4" style={{ background: "var(--bg-subtle)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  A property doing R30,000/month via Booking.com loses up to R6,000 in commission.
                  The Growth package costs R899/month. It recovers its own cost before the second
                  direct booking of the month.
                </p>
              </div>
              <p className="text-xs pt-4 border-t" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                Best for: Properties actively losing commission to OTAs who want full control and clear revenue visibility.
              </p>
              <Link
                href="/contact"
                className="block text-center rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-90 mt-2"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", background: "var(--accent)", color: "var(--text-inverse)" }}
              >
                Get Started — Growth
              </Link>
            </div>
          </div>

          {/* Full Stack */}
          <div className="rounded-sm border flex flex-col overflow-hidden" style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <div className="p-7 flex flex-col gap-5 flex-1">
              <Eyebrow>Full Stack</Eyebrow>
              <div>
                <h2 className="text-2xl mb-1" style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, color: "var(--text-primary)" }}>
                  Own Your Market
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Everything in Growth — plus a WhatsApp AI Agent that handles bookings, payments, and
                  guest queries entirely on its own.
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-barlow)" }}>Once-off</p>
                <p className="text-4xl" style={{ fontFamily: "var(--font-barlow)", fontWeight: 900, color: "var(--text-primary)" }}>
                  <span className="line-through text-2xl mr-2" style={{ color: "var(--text-secondary)" }}>R30,000</span>
                  R15,000
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>R1,800 per month</p>
                <p className="text-xs mt-1" style={{ color: "var(--accent)" }}>Launch price</p>
              </div>
              <ul className="flex flex-col gap-3">
                <FeatureItem Icon={BrowserIcon} label="Everything in Growth" />
                <FeatureItem Icon={AiBrain01Icon} label="WhatsApp AI Agent — full breakdown below" />
                <FeatureItem Icon={Megaphone01Icon} label="One managed Facebook and Instagram ad campaign per month" />
                <FeatureItem Icon={DocumentCodeIcon} label="One SEO blog post per month" />
                <FeatureItem Icon={ChartBarIcon} label="Monthly performance report" />
                <FeatureItem Icon={Calendar01Icon} label="Quarterly strategy call" />
                <FeatureItem Icon={HeadsetIcon} label="Priority support" />
              </ul>

              {/* WhatsApp AI Agent sub-block */}
              <div
                className="rounded-sm p-5 border"
                style={{ background: "var(--bg-primary)", borderColor: "var(--accent)" }}
              >
                <h3
                  className="text-base mb-3"
                  style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
                >
                  Your property, staffed around the clock — on WhatsApp.
                </h3>
                <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                  The WhatsApp AI Agent is a fully autonomous booking assistant that lives on your
                  WhatsApp Business number. It handles the entire guest journey — from the first enquiry
                  to the confirmed booking to the payment — without you lifting a finger.
                </p>
                <ul className="flex flex-col gap-3">
                  {[
                    { Icon: Message01Icon, title: "Guest enquiries", body: "Replies instantly with accurate information drawn from your live database." },
                    { Icon: CalendarCheck01Icon, title: "Booking confirmation", body: "Checks availability, confirms the booking, and updates your database in real time." },
                    { Icon: CreditCardIcon, title: "Payment collection", body: "Sends a PayFast link inside WhatsApp. Once paid, booking is confirmed automatically." },
                    { Icon: DatabaseIcon, title: "Database sync", body: "Every booking writes to your database instantly. No double bookings, no manual entries." },
                    { Icon: Clock01Icon, title: "24/7 availability", body: "Bookings made at 2am are confirmed at 2am." },
                    { Icon: UserCheck01Icon, title: "Escalation to you", body: "For anything outside its scope, it flags the conversation and notifies you to take over." },
                  ].map(({ Icon, title, body }) => (
                    <li key={title} className="flex items-start gap-3">
                      <Icon size={16} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                      <div>
                        <span className="text-xs font-bold block" style={{ color: "var(--text-primary)", fontFamily: "var(--font-barlow)" }}>
                          {title}
                        </span>
                        <span className="text-xs leading-snug" style={{ color: "var(--text-secondary)" }}>{body}</span>
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="text-xs leading-relaxed mt-4 pt-4 border-t" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                  Most guest houses lose bookings to slow response times. The Agent closes those bookings
                  before a guest considers another property.
                </p>
              </div>

              <p className="text-xs pt-4 border-t" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                Best for: Properties that want to fully automate guest acquisition and own their market.
              </p>
              <Link
                href="/contact"
                className="block text-center rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-80 mt-2"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", border: "1px solid var(--accent)", color: "var(--accent)" }}
              >
                Get Started — Full Stack
              </Link>
            </div>
          </div>
        </div>

        {/* ── COMPARISON TABLE ──────────────────────────────────────────── */}
        <h2
          className="text-3xl mb-8"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
        >
          Everything, side by side.
        </h2>

        {/* Desktop table */}
        <div className="hidden md:block mb-20 overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th className="py-4 text-left w-1/2 pr-8" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-barlow)", fontWeight: 400 }}>Feature</th>
                {["Starter", "Growth", "Full Stack"].map((h) => (
                  <th key={h} className="py-4 text-center" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map(({ feature, starter, growth, full }, i) => (
                <tr
                  key={feature}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: i % 2 === 0 ? "transparent" : "var(--bg-subtle)",
                  }}
                >
                  <td className="py-3 pr-8" style={{ color: "var(--text-secondary)" }}>{feature}</td>
                  <td className="py-3 text-center">{starter ? <span className="flex justify-center"><Check /></span> : <Dash />}</td>
                  <td className="py-3 text-center">{growth ? <span className="flex justify-center"><Check /></span> : <Dash />}</td>
                  <td className="py-3 text-center">{full ? <span className="flex justify-center"><Check /></span> : <Dash />}</td>
                </tr>
              ))}
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <td className="py-3 pr-8" style={{ color: "var(--text-secondary)" }}>{SUPPORT_ROW.feature}</td>
                <td className="py-3 text-center text-xs" style={{ color: "var(--text-secondary)" }}>{SUPPORT_ROW.starterLabel}</td>
                <td className="py-3 text-center text-xs" style={{ color: "var(--text-secondary)" }}>{SUPPORT_ROW.growthLabel}</td>
                <td className="py-3 text-center text-xs" style={{ color: "var(--text-secondary)" }}>{SUPPORT_ROW.fullLabel}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile accordion table */}
        <div className="md:hidden mb-20">
          {TABLE_ROWS.map(({ feature, starter, growth, full }) => (
            <div
              key={feature}
              className="py-4 border-b grid grid-cols-4 items-center gap-2 text-xs"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="col-span-1 leading-snug" style={{ color: "var(--text-secondary)" }}>{feature}</span>
              <span className="flex justify-center">{starter ? <Check /> : <Dash />}</span>
              <span className="flex justify-center">{growth ? <Check /> : <Dash />}</span>
              <span className="flex justify-center">{full ? <Check /> : <Dash />}</span>
            </div>
          ))}
        </div>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <h2
          className="text-3xl mb-8"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
        >
          Questions before you decide.
        </h2>
        <div className="mb-20 border-t" style={{ borderColor: "var(--border)" }}>
          {FAQS.map((faq) => (
            <FaqItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center py-16 border-t" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-90"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", background: "var(--accent)", color: "var(--text-inverse)" }}
            >
              WhatsApp Us
            </a>
            <Link
              href="/compare"
              className="inline-block rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-80"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", border: "1px solid var(--accent)", color: "var(--accent)", background: "transparent" }}
            >
              See the Comparison
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
