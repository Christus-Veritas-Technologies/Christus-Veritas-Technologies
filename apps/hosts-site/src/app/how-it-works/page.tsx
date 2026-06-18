import Link from "next/link";
import Image from "next/image";
import { WA_LINK } from "@/lib/config";
import {
  CheckmarkCircle02Icon,
  BrowserIcon,
  CalendarCheck01Icon,
  DatabaseIcon,
  LinkSquare01Icon,
  CreditCardIcon,
  Notification02Icon,
  GoogleIcon,
  Link01Icon,
  HeadsetIcon,
  AnalyticsUpIcon,
  RefreshIcon,
  UserListIcon,
  ChartBarIcon,
} from "@/components/icons";
import { FadeUp, ScaleIn, StaggerGrid, StaggerItem } from "@/components/animate";

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs tracking-[0.12em] uppercase mb-4"
      style={{ fontFamily: "var(--font-barlow)", color: "var(--text-secondary)" }}>
      {children}
    </p>
  );
}

function PhaseLabel({ num, label }: { num: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 mb-3">
      <span className="text-2xl" style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, color: "var(--accent)" }}>
        Phase {num}
      </span>
      <span className="text-xs tracking-[0.1em] uppercase" style={{ fontFamily: "var(--font-barlow)", color: "var(--text-secondary)" }}>
        {label}
      </span>
    </div>
  );
}

function TimelineLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm mt-6" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-secondary)" }}>
      {children}
    </p>
  );
}

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckmarkCircle02Icon size={20} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
      <span className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>{children}</span>
    </li>
  );
}

function BuildItem({ Icon, label }: { Icon: React.ElementType; label: string }) {
  return (
    <li className="flex items-center gap-3">
      <Icon size={20} style={{ color: "var(--accent)" }} />
      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}</span>
    </li>
  );
}

export default function HowItWorksPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-[1100px] px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <Eyebrow>How It Works</Eyebrow>
            <h1 className="text-4xl md:text-5xl leading-tight mb-6"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}>
              From invisible to fully booked.
              <br />In one week.
            </h1>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              Here is exactly what happens from the moment you contact us to the moment guests start finding you on Google and booking direct.
            </p>
          </FadeUp>
          <ScaleIn delay={0.15} className="hidden md:block">
            <div className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border)", boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}>
              <Image
                src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&h=500&fit=crop&auto=format"
                alt="Elegant Zimbabwe guest house property"
                width={700} height={500}
                className="w-full object-cover"
                unoptimized
              />
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* ── PHASES ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-6 py-8">

        {/* Phase 1 */}
        <FadeUp>
          <div className="rounded-sm border p-8 md:p-12 mb-6"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <PhaseLabel num="1" label="Onboarding" />
            <h2 className="text-3xl mb-4"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}>
              We learn your property.
            </h2>
            <p className="text-base leading-relaxed max-w-[600px] mb-8" style={{ color: "var(--text-secondary)" }}>
              You tell us about your rooms, your rates, and your property. A WhatsApp conversation handles
              most of it. We tell you exactly what we need — you will not be guessing or filling out lengthy forms.
            </p>
            <p className="text-xs tracking-[0.1em] uppercase mb-4"
              style={{ fontFamily: "var(--font-barlow)", color: "var(--text-secondary)" }}>
              What we collect
            </p>
            <ul className="flex flex-col gap-3">
              <CheckItem>Property name, location, and contact details</CheckItem>
              <CheckItem>Room types with descriptions and rates</CheckItem>
              <CheckItem>Your best photos</CheckItem>
              <CheckItem>Check-in and check-out times</CheckItem>
              <CheckItem>Cancellation policy</CheckItem>
              <CheckItem>EcoCash and OneMoney account details (or we help you create one)</CheckItem>
            </ul>
            <TimelineLabel>Day 1–2</TimelineLabel>
          </div>
        </FadeUp>

        {/* Phase 2 */}
        <FadeUp>
          <div className="rounded-sm border p-8 md:p-12 mb-6"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <PhaseLabel num="2" label="Build" />
            <h2 className="text-3xl mb-4"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}>
              We build your system.
            </h2>
            <p className="text-base leading-relaxed max-w-[600px] mb-8" style={{ color: "var(--text-secondary)" }}>
              We handle the entire build. You are not involved in this phase — there are no decisions to make
              mid-build. We follow the brief and deliver a complete system.
            </p>
            <p className="text-xs tracking-[0.1em] uppercase mb-4"
              style={{ fontFamily: "var(--font-barlow)", color: "var(--text-secondary)" }}>
              What we build
            </p>
            <ul className="flex flex-col gap-3">
              <BuildItem Icon={BrowserIcon} label="Your website (Home, Rooms, Gallery, About, Contact, Booking)" />
              <BuildItem Icon={CalendarCheck01Icon} label="Live availability calendar with your rooms and rates" />
              <BuildItem Icon={DatabaseIcon} label="Bookings database — every reservation stored and searchable" />
              <BuildItem Icon={LinkSquare01Icon} label="Shareable booking link — works on any site, any platform, any social profile" />
              <BuildItem Icon={CreditCardIcon} label="EcoCash, OneMoney, and card payment integration" />
              <BuildItem Icon={Notification02Icon} label="WhatsApp notification for every booking received" />
              <BuildItem Icon={GoogleIcon} label="Google Business Profile setup" />
              <BuildItem Icon={UserListIcon} label="Permanent guest contact database — every guest, kept forever" />
              <BuildItem Icon={ChartBarIcon} label="Expense tracking and financial reports (Run Your Business and above)" />
              <BuildItem Icon={Link01Icon} label="Calendar sync with other booking platforms (Run Your Business and above)" />
            </ul>
            <TimelineLabel>Day 2–4</TimelineLabel>
          </div>
        </FadeUp>

        {/* Phase 3 */}
        <FadeUp>
          <div className="rounded-sm border p-8 md:p-12 mb-6"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <PhaseLabel num="3" label="Review" />
            <h2 className="text-3xl mb-4"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}>
              You check everything.
            </h2>
            <p className="text-base leading-relaxed max-w-[600px]" style={{ color: "var(--text-secondary)" }}>
              We send you a staging link. Open it on your phone — the same way your guests will. Check every
              page, every room description, every rate. Tell us what to change. We change it. Nothing goes
              live without your explicit approval.
            </p>
            <TimelineLabel>Day 4–6</TimelineLabel>
          </div>
        </FadeUp>

        {/* Phase 4 */}
        <FadeUp>
          <div className="rounded-sm border p-8 md:p-12 mb-16"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
            <PhaseLabel num="4" label="Live" />
            <h2 className="text-3xl mb-4"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}>
              Your system goes live.
            </h2>
            <p className="text-base leading-relaxed max-w-[600px]" style={{ color: "var(--text-secondary)" }}>
              We connect your domain, submit your property to Google, and run a full end-to-end test — a
              real booking, a real payment, a real WhatsApp notification — so you see exactly what your
              guests experience before anyone else does. From here, every guest who searches for a place
              to stay in your city can find you.
            </p>
            <TimelineLabel>Day 6–7</TimelineLabel>
          </div>
        </FadeUp>

        {/* ── AFTER GO-LIVE ─────────────────────────────────────────────── */}
        <FadeUp>
          <h2 className="text-3xl mb-8"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}>
            What happens every month.
          </h2>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              Icon: HeadsetIcon,
              title: "Support",
              body: "Every package includes monthly support. WhatsApp us when something needs updating. We handle it.",
            },
            {
              Icon: AnalyticsUpIcon,
              title: "Reports (Growth and Full Stack)",
              body: "Export your bookings data as PDF or CSV at any time — revenue summaries, occupancy, guest history. Your data, in your hands, in the format you need.",
            },
            {
              Icon: RefreshIcon,
              title: "Calendar sync",
              body: "If you list on other platforms, your calendars stay in sync automatically — no double bookings, no manual updates.",
            },
          ].map(({ Icon, title, body }) => (
            <StaggerItem key={title}>
              <div className="rounded-sm border p-7 h-full"
                style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}>
                <Icon size={32} className="mb-5" style={{ color: "var(--accent)" }} />
                <h3 className="text-base mb-3"
                  style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{body}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <FadeUp>
          <div className="text-center py-16 border-t" style={{ borderColor: "var(--border)" }}>
            <h2 className="text-3xl mb-8"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}>
              Ready to get started?
            </h2>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/packages"
                className="inline-block rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-90"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", background: "var(--accent)", color: "var(--text-inverse)" }}>
                View Packages
              </Link>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
                className="inline-block rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-80"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", border: "1px solid var(--accent)", color: "var(--accent)", background: "transparent" }}>
                WhatsApp Us First
              </a>
            </div>
          </div>
        </FadeUp>

      </section>
    </>
  );
}
