import Link from "next/link";
import {
  CalendarCheck01Icon,
  CreditCardIcon,
  WhatsappIcon,
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

export default function DemoPage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32" style={{ background: "var(--bg-primary)" }}>
        <div className="mx-auto max-w-[1100px] px-6">
          <Eyebrow>Live Demo</Eyebrow>
          <h1
            className="text-4xl md:text-5xl leading-tight mb-6 max-w-2xl"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
          >
            See exactly what
            <br />your guests will experience.
          </h1>
          <p className="text-base max-w-[600px]" style={{ color: "var(--text-secondary)" }}>
            This is a fully working demo built for a fictional SA guest house — Thornfield Guest House,
            Bloemfontein. Every feature is live. Browse it the way your guests would.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1100px] px-6 pb-24">
        {/* ── DEVICE MOCKUP ────────────────────────────────────────────── */}
        <div
          className="rounded-sm border p-8 md:p-16 mb-12 flex flex-col md:flex-row items-center justify-center gap-12"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)", minHeight: "480px" }}
        >
          {/* Laptop frame */}
          <div className="hidden md:flex flex-col items-center gap-0">
            <div
              className="rounded-t-lg border-2 overflow-hidden"
              style={{ width: "420px", height: "280px", borderColor: "var(--border)", background: "var(--bg-subtle)" }}
            >
              {/* Placeholder for demo iframe */}
              <div className="w-full h-full flex flex-col items-center justify-center gap-3" style={{ background: "var(--bg-primary)" }}>
                <p
                  className="text-sm"
                  style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-secondary)" }}
                >
                  Thornfield Guest House
                </p>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  Demo site — coming soon
                </p>
                <a
                  href="#"
                  className="text-xs underline underline-offset-2"
                  style={{ color: "var(--accent)" }}
                >
                  Open in new tab
                </a>
              </div>
            </div>
            <div
              className="rounded-b-lg border-2 border-t-0 h-5 w-full"
              style={{ borderColor: "var(--border)", background: "var(--bg-subtle)" }}
            />
            <div
              className="rounded-full mt-1"
              style={{ width: "60px", height: "6px", background: "var(--bg-subtle)" }}
            />
          </div>

          {/* Phone frame */}
          <div className="flex flex-col items-center">
            <div
              className="rounded-[24px] border-4 overflow-hidden"
              style={{ width: "180px", height: "320px", borderColor: "var(--border)", background: "var(--bg-subtle)" }}
            >
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-4" style={{ background: "var(--bg-primary)" }}>
                <p
                  className="text-xs text-center"
                  style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-secondary)" }}
                >
                  Thornfield Guest House
                </p>
                <p className="text-[10px] text-center" style={{ color: "var(--text-secondary)" }}>
                  Mobile demo — coming soon
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── WHAT YOU ARE LOOKING AT ──────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            {
              Icon: CalendarCheck01Icon,
              title: "Live booking calendar",
              body: "Select dates and walk through the full booking flow end-to-end.",
            },
            {
              Icon: CreditCardIcon,
              title: "PayFast payment flow",
              body: "The payment screen runs in test mode. See exactly what your guests see when they pay.",
            },
            {
              Icon: WhatsappIcon,
              title: "WhatsApp booking",
              body: "The WhatsApp button opens a pre-filled message — the same experience on your live property site.",
            },
          ].map(({ Icon, title, body }) => (
            <div
              key={title}
              className="rounded-sm border p-7"
              style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
            >
              <Icon size={32} className="mb-5" style={{ color: "var(--accent)" }} />
              <h3
                className="text-base mb-3"
                style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
              >
                {title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <div
          className="rounded-sm border p-8 md:p-12 text-center"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
        >
          <h2
            className="text-3xl mb-4"
            style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
          >
            Want this built for your property?
          </h2>
          <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
            This demo took four days to build. Yours takes the same. Send us your details and we will have
            a staging version ready for your review within the week.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-90"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", background: "var(--accent)", color: "var(--text-inverse)" }}
            >
              Get Started
            </Link>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-[4px] px-8 py-3.5 text-sm transition-opacity hover:opacity-80"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", border: "1px solid var(--accent)", color: "var(--accent)", background: "transparent" }}
            >
              WhatsApp Us First
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
