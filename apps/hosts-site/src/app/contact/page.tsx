import Image from "next/image";
import {
  WhatsappIcon,
  Mail01Icon,
  Clock01Icon,
  CheckmarkCircle02Icon,
} from "@/components/icons";

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

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckmarkCircle02Icon size={20} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
      <span className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
        {children}
      </span>
    </li>
  );
}

export default function ContactPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-[1100px] px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <FadeUp>
            <Eyebrow>Get in Touch</Eyebrow>
            <h1
              className="text-4xl md:text-5xl leading-tight mb-6"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
            >
              No forms. No ticket queues.
              <br />Just a conversation.
            </h1>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>
              WhatsApp us directly. Tell us about your property — rooms, location, what you currently use for
              bookings. We will tell you which package fits and answer any question you have.
            </p>
          </FadeUp>
          <ScaleIn delay={0.15} className="hidden md:block">
          <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)", boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}>
            <Image
              src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=700&h=500&fit=crop&auto=format"
              alt="Welcoming guest house room ready for guests"
              width={700}
              height={500}
              className="w-full object-cover"
              unoptimized
            />
          </div>
          </ScaleIn>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 pb-24">
        {/* ── CONTACT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {/* WhatsApp */}
          <div
            className="rounded-sm border p-8 md:p-10 flex flex-col gap-5"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
          >
            <WhatsappIcon size={40} style={{ color: "var(--accent)" }} />
            <div>
              <h2
                className="text-2xl mb-2"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
              >
                WhatsApp Us
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                The fastest way to reach us. We respond within a few hours during business hours.
              </p>
            </div>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-center rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-90"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 700,
                letterSpacing: "0.05em",
                background: "var(--accent)",
                color: "var(--text-inverse)",
              }}
            >
              Open WhatsApp
            </a>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>+27 [SA number — to be confirmed]</p>
          </div>

          {/* Email */}
          <div
            className="rounded-sm border p-8 md:p-10 flex flex-col gap-5"
            style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
          >
            <Mail01Icon size={40} style={{ color: "var(--accent)" }} />
            <div>
              <h2
                className="text-2xl mb-2"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
              >
                Email Us
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                Prefer to write it out? Email works too.
              </p>
            </div>
            <a
              href="mailto:hosts@christusveritas.tech"
              className="inline-block text-center rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-80"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 700,
                letterSpacing: "0.05em",
                border: "1px solid var(--accent)",
                color: "var(--accent)",
                background: "transparent",
              }}
            >
              Send an Email
            </a>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>hosts@christusveritas.tech</p>
          </div>
        </div>

        {/* ── WHAT TO INCLUDE ──────────────────────────────────────────── */}
        <div
          className="rounded-sm border p-8 md:p-10 mb-12"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
        >
          <h2
            className="text-2xl mb-6"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
          >
            To get the most useful response, tell us:
          </h2>
          <ul className="flex flex-col gap-4 mb-6">
            <CheckItem>Your property name and location</CheckItem>
            <CheckItem>How many rooms or units you have</CheckItem>
            <CheckItem>What you currently use for bookings</CheckItem>
            <CheckItem>Roughly how many bookings you take per month</CheckItem>
            <CheckItem>What you want to achieve</CheckItem>
          </ul>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            You do not need all of this ready. If you have a single question, send it.
          </p>
        </div>

        {/* ── RESPONSE TIME ─────────────────────────────────────────────── */}
        <div className="flex items-start gap-4">
          <Clock01Icon size={20} className="shrink-0 mt-0.5" style={{ color: "var(--text-secondary)" }} />
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            WhatsApp messages answered within 4 hours, Monday to Friday, 8am–6pm SAST. Email within 24
            hours. Weekend messages answered first thing Monday.
          </p>
        </div>
      </section>
    </>
  );
}
