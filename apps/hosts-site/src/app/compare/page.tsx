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
    label: "Cost per booking",
    booking: "15–25% of every booking, forever",
    cvt: "Zero per booking. Fixed monthly fee.",
  },
  {
    label: "Who owns the guest relationship",
    booking: "Booking.com",
    cvt: "You",
  },
  {
    label: "Guest contact details",
    booking: "Held by the platform",
    cvt: "Stored in your database, fully accessible",
  },
  {
    label: "Repeat guest books again",
    booking: "Back to Booking.com. You pay commission again.",
    cvt: "They come to your website or WhatsApp. You pay nothing.",
  },
  {
    label: "Your own branded website",
    booking: "No",
    cvt: "Yes",
  },
  {
    label: "Shareable booking link",
    booking: "No",
    cvt: "Yes — works anywhere",
  },
  {
    label: "Payment to you",
    booking: "Held and released on platform schedule",
    cvt: "Directly into your account at point of booking",
  },
  {
    label: "Booking reports and exports",
    booking: "Basic, platform-controlled",
    cvt: "PDF and CSV export, full data ownership (Growth and above)",
  },
  {
    label: "Autonomous booking on WhatsApp",
    booking: "No",
    cvt: "Yes — Full Stack AI Agent",
  },
  {
    label: "Pricing control",
    booking: "Constrained by platform programmes",
    cvt: "Full control",
  },
  {
    label: "What you keep if you leave",
    booking: "Nothing — listings, reviews, and all guest data stay on their platform",
    cvt: "Everything — your website, your domain, your database, your guest list",
  },
];

const COST_SCENARIOS = [
  {
    label: "At $1,500/month in bookings",
    commission: { monthly: "$225", annual: "$2,700" },
    cvt: { label: "Growth", monthly: "$10", annual: "$120" },
    saving: "$2,580",
  },
  {
    label: "At $3,000/month in bookings",
    commission: { monthly: "$450", annual: "$5,400" },
    cvt: { label: "Growth", monthly: "$10", annual: "$120" },
    saving: "$5,280",
  },
  {
    label: "At $6,000/month in bookings",
    commission: { monthly: "$900", annual: "$10,800" },
    cvt: { label: "Full Stack", monthly: "$25", annual: "$300" },
    saving: "$10,500",
  },
];

export default function ComparePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-[1100px] px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <Eyebrow>CVT Hosts vs Booking.com</Eyebrow>
            <h1
              className="text-4xl md:text-5xl leading-tight mb-6"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
            >
              One takes a cut of everything.
              <br />The other builds something you own.
            </h1>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              This is a factual comparison of what each gives your property — and what each costs you over time.
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
                <th className="py-4 px-6 text-left" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-secondary)" }}>Booking.com</th>
                <th className="py-4 px-6 text-left" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--accent)" }}>CVT Hosts</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map(({ label, booking, cvt }, i) => (
                <tr
                  key={label}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    background: i % 2 === 0 ? "var(--bg-surface)" : "var(--bg-subtle)",
                  }}
                >
                  <td className="py-4 px-6 font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-barlow)" }}>{label}</td>
                  <td className="py-4 px-6 leading-snug" style={{ color: "var(--text-secondary)" }}>{booking}</td>
                  <td className="py-4 px-6 leading-snug" style={{ color: "var(--text-primary)" }}>{cvt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile stacked */}
          <div className="md:hidden">
            {COMPARE_ROWS.map(({ label, booking, cvt }, i) => (
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
                    <p className="text-xs uppercase tracking-wide mb-1" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-barlow)" }}>Booking.com</p>
                    <p className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>{booking}</p>
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
            Every year a property stays on Booking.com without a direct booking system, it hands over more
            revenue and builds nothing it owns. The commission compounds. The guest list stays on their
            servers. The brand equity builds their platform, not yours.
          </DangerCallout>
        </div>

        {/* ── REAL COST SECTION ────────────────────────────────────────── */}
        <h2
          className="text-3xl mb-8"
          style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
        >
          What commission has cost you.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          {COST_SCENARIOS.map(({ label, commission, cvt, saving }) => (
            <div
              key={label}
              className="rounded-sm border p-7"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
            >
              <p
                className="text-xs tracking-[0.1em] uppercase mb-4"
                style={{ fontFamily: "var(--font-barlow)", color: "var(--text-secondary)" }}
              >
                {label}
              </p>
              <div className="flex flex-col gap-3 mb-5">
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>Booking.com commission @ 15%</p>
                  <p className="text-lg" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--danger)" }}>
                    {commission.monthly}/month · {commission.annual}/year
                  </p>
                </div>
                <div>
                  <p className="text-xs mb-0.5" style={{ color: "var(--text-secondary)" }}>CVT Hosts {cvt.label}</p>
                  <p className="text-lg" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}>
                    {cvt.monthly}/month · {cvt.annual}/year
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs mb-1" style={{ color: "var(--text-secondary)" }}>Annual difference</p>
                <p
                  className="text-3xl"
                  style={{ fontFamily: "var(--font-barlow)", fontWeight: 900, color: "var(--accent)" }}
                >
                  {saving}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs mb-20" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}>
          Based on Booking.com&rsquo;s base commission of 15%. Properties on Preferred Partner or Genius programmes pay 18–25%.
        </p>

        {/* ── WHAT YOU BUILD ───────────────────────────────────────────── */}
        <div
          className="rounded-sm p-8 md:p-12 mb-20"
          style={{ background: "var(--bg-surface)", borderLeft: "3px solid var(--accent)" }}
        >
          <h2
            className="text-3xl mb-6"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
          >
            Every direct booking builds something.
            <br />Every OTA booking builds theirs.
          </h2>
          <p className="text-base leading-relaxed max-w-[680px]" style={{ color: "var(--text-secondary)" }}>
            A guest who books through CVT Hosts is a guest in your database. Their details are yours. When
            they come back, they come directly to you — through your website, your booking link, or your
            WhatsApp AI Agent. You pay nothing on that second booking. Or the third. That is what direct
            booking infrastructure builds over time: a guest list that compounds in your favour, not theirs.
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
