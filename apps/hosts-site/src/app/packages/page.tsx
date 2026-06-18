"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { FadeUp, StaggerGrid, StaggerItem, ScaleIn } from "@/components/animate";
import { WA_LINK } from "@/lib/config";
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
  Rocket01Icon,
} from "@/components/icons";

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
  { feature: "EcoCash, OneMoney, and card payment integration", starter: true, growth: true, full: true },
  { feature: "Bookings database", starter: true, growth: true, full: true },
  { feature: "Shareable booking link", starter: true, growth: true, full: true },
  { feature: "WhatsApp booking notification", starter: true, growth: true, full: true },
  { feature: "Basic SEO setup", starter: true, growth: true, full: true },
  { feature: "Calendar sync with other booking platforms", starter: false, growth: true, full: true },
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
    q: "I do not have a website at all. Can you still help?",
    a: "Yes — that is exactly who Package 1 is for. Most of our guest houses start with nothing online. We build everything from scratch: no existing website, domain, or technical setup required on your side.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes, at any time. Every package is self-contained and gives you real value on its own, but every package also carries forward — your website, your domain, and all your data move with you when you upgrade. Nothing is rebuilt from scratch.",
  },
  {
    q: "What payment methods can my guests use?",
    a: "EcoCash, OneMoney, and card. Guests pay at the point of booking — no account needed, no friction.",
  },
  {
    q: "Who sets up the payment integration?",
    a: "We do. We handle the full integration with EcoCash, OneMoney, and card processing so payments land straight in your account.",
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
          <FadeUp>
          <Eyebrow>Pricing</Eyebrow>
          <h1
            className="text-4xl md:text-5xl leading-tight mb-6 max-w-xl"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
          >
            Three packages.
            <br />One clear upgrade path.
          </h1>
          <p className="text-base max-w-[600px]" style={{ color: "var(--text-secondary)" }}>
            Every package is self-contained — real value on its own. Start where your budget allows.
            Upgrade when you are ready. Your website and all your data carry over.
          </p>
          </FadeUp>
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
              The first 5 Zimbabwe guest houses to sign up receive 50% off the once-off setup fee. Monthly retainer unchanged.
            </span>
          </div>
        </div>
      </div>

      <section className="mx-auto max-w-[1100px] px-6 py-16">
        {/* ── PACKAGE CARDS ─────────────────────────────────────────────── */}
        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">

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
                  $75
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>$5 per month</p>
              </div>
              <ul className="flex flex-col gap-3 flex-1">
                <FeatureItem Icon={BrowserIcon} label="Professional 5-page website (Home, Rooms, Gallery, About, Contact)" />
                <FeatureItem Icon={SmartPhone01Icon} label="Mobile-first design" />
                <FeatureItem Icon={GoogleIcon} label="Google Business Profile setup and optimisation" />
                <FeatureItem Icon={CalendarCheck01Icon} label="WhatsApp enquiry button — routes directly to your number" />
                <FeatureItem Icon={CreditCardIcon} label="Google Maps listing and directions" />
                <FeatureItem Icon={DatabaseIcon} label="Basic SEO setup" />
                <FeatureItem Icon={LinkSquare01Icon} label="1 month support included" />
                <FeatureItem Icon={WhatsappIcon} label="Upgrade to Package 2 or 3 anytime — your website carries over" />
              </ul>
              <p className="text-xs pt-4 border-t" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                Best for: Properties that want a professional presence and a working direct booking system from day one.
              </p>
              <Link
                href="/contact"
                className="block text-center rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-80 mt-2"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", border: "1px solid var(--accent)", color: "var(--accent)" }}
              >
                Get Started — Get Found
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
                  Run Your Business
                </h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Full booking calendar, payments, guest database, financial tracking, and reporting — everything to run your property like a real business.
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-barlow)" }}>Once-off</p>
                <p className="text-4xl" style={{ fontFamily: "var(--font-barlow)", fontWeight: 900, color: "var(--text-primary)" }}>
                  $200
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>$10 per month</p>
              </div>
              <ul className="flex flex-col gap-3 flex-1">
                <FeatureItem Icon={BrowserIcon} label="Professional website (included)" />
                <FeatureItem Icon={CalendarCheck01Icon} label="Live booking calendar with real-time room availability" />
                <FeatureItem Icon={CreditCardIcon} label="Online payment via EcoCash, OneMoney, and bank transfer" />
                <FeatureItem Icon={DatabaseIcon} label="Bookings database — every reservation stored, searchable, yours" />
                <FeatureItem Icon={UserListIcon} label="Guest contact database — their details belong to you, permanently" />
                <FeatureItem Icon={LinkSquare01Icon} label="Shareable booking link — works on WhatsApp, Facebook, anywhere" />
                <FeatureItem Icon={WhatsappIcon} label="Automated booking confirmation sent to guest on payment" />
                <FeatureItem Icon={Link01Icon} label="Calendar sync across all your booking channels" />
                <FeatureItem Icon={FileDownloadIcon} label="Expense tracking — log and categorise property costs" />
                <FeatureItem Icon={AnalyticsUpIcon} label="Profit and loss dashboard — know exactly where you stand" />
                <FeatureItem Icon={DocumentCodeIcon} label="Financial document generation — monthly statements and occupancy summaries, exportable as PDF" />
                <FeatureItem Icon={HeadsetIcon} label="Ongoing monthly support" />
                <FeatureItem Icon={Rocket01Icon} label="Upgrade to Package 3 anytime — everything carries over" />
              </ul>
              {/* The callout */}
              <div className="rounded-sm p-4" style={{ background: "var(--bg-subtle)" }}>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                  For twenty years, most Zimbabwe guest houses have kept bookings in a register,
                  payments in a WhatsApp thread, and finances in their heads. This replaces all of that.
                </p>
              </div>
              <p className="text-xs pt-4 border-t" style={{ color: "var(--text-secondary)", borderColor: "var(--border)" }}>
                Best for: Properties ready to replace the booking register, the WhatsApp payment thread, and the end-of-month guesswork with one connected system.
              </p>
              <Link
                href="/contact"
                className="block text-center rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-90 mt-2"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", background: "var(--accent)", color: "var(--text-inverse)" }}
              >
                Get Started — Run Your Business
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
                  Everything in Package 2 — plus a WhatsApp AI Agent that handles enquiries, confirms bookings, and collects payment autonomously, 24/7.
                </p>
              </div>
              <div>
                <p className="text-sm mb-1" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-barlow)" }}>Once-off</p>
                <p className="text-4xl" style={{ fontFamily: "var(--font-barlow)", fontWeight: 900, color: "var(--text-primary)" }}>
                  $500
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>$25 per month</p>
              </div>
              <ul className="flex flex-col gap-3">
                <FeatureItem Icon={BrowserIcon} label="Professional website (included)" />
                <FeatureItem Icon={DatabaseIcon} label="Everything in Package 2 — full booking and financial operating system" />
                <FeatureItem Icon={AiBrain01Icon} label="WhatsApp AI Agent — handles enquiries, checks availability, confirms bookings, and collects payment autonomously, 24/7" />
                <FeatureItem Icon={ChartBarIcon} label="Full revenue, occupancy, and financial reports — exportable PDF and CSV" />
                <FeatureItem Icon={Megaphone01Icon} label="Facebook and Instagram page setup with branded visuals" />
                <FeatureItem Icon={DocumentCodeIcon} label="One managed social media post per week" />
                <FeatureItem Icon={Search01Icon} label="Monthly SEO blog post targeting Zimbabwe travel and accommodation searches" />
                <FeatureItem Icon={HeadsetIcon} label="Priority support" />
                <FeatureItem Icon={Calendar01Icon} label="Quarterly strategy call" />
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
                    { Icon: CreditCardIcon, title: "Payment collection", body: "Sends an EcoCash, OneMoney, or card payment link inside WhatsApp. Once paid, booking is confirmed automatically." },
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
                Get Started — Own Your Market
              </Link>
            </div>
          </div>
        </StaggerGrid>

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
