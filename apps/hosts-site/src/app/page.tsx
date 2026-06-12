import Link from "next/link";
import Image from "next/image";
import {
  MoneySendIcon,
  UserMultipleIcon,
  ChartIncreaseIcon,
  UserRemoveIcon,
  MoneyRemoveIcon,
  ChartDecreaseIcon,
  Globe01Icon,
  CalendarCheck01Icon,
  CreditCardIcon,
  WhatsappIcon,
  Settings01Icon,
  TickDoubleIcon,
  Rocket01Icon,
} from "@/components/icons";
import { WatermarkDivider } from "@/components/watermark-divider";
import { DangerCallout } from "@/components/danger-callout";
import { FadeUp, FadeIn, ScaleIn, StaggerGrid, StaggerItem } from "@/components/animate";

const WA_LINK =
  "https://wa.me/27000000000?text=Hi%20CVT%20Hosts%2C%20I%27d%20like%20to%20know%20more%20about%20your%20packages.";

const HERO_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=420&h=300&fit=crop&auto=format",
    alt: "Luxury guest house exterior",
    pos: "top-[8%] left-[2%]",
    rotate: "-rotate-2",
    w: 220, h: 160,
    delay: 0.6,
  },
  {
    src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=420&h=300&fit=crop&auto=format",
    alt: "Modern SA property with pool",
    pos: "top-[12%] right-[2%]",
    rotate: "rotate-2",
    w: 220, h: 160,
    delay: 0.75,
  },
  {
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=420&h=320&fit=crop&auto=format",
    alt: "Cape-style guest house garden",
    pos: "bottom-[10%] left-[2%]",
    rotate: "rotate-1",
    w: 200, h: 155,
    delay: 0.9,
  },
  {
    src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=420&h=320&fit=crop&auto=format",
    alt: "Elegant guest house bedroom",
    pos: "bottom-[14%] right-[2%]",
    rotate: "-rotate-1",
    w: 200, h: 155,
    delay: 1.05,
  },
];

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

function SectionHeadline({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={`text-4xl md:text-5xl leading-tight mb-6 ${className}`}
      style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}
    >
      {children}
    </h2>
  );
}

function PrimaryBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block rounded-lg px-8 py-3.5 text-sm transition-opacity hover:opacity-90"
      style={{
        fontFamily: "var(--font-barlow)",
        fontWeight: 700,
        letterSpacing: "0.05em",
        background: "var(--accent)",
        color: "var(--text-inverse)",
      }}
    >
      {children}
    </Link>
  );
}

function SecondaryBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-block rounded-lg px-8 py-3.5 text-sm transition-opacity hover:opacity-80"
      style={{
        fontFamily: "var(--font-barlow)",
        fontWeight: 700,
        letterSpacing: "0.05em",
        border: "1px solid var(--accent)",
        color: "var(--accent)",
        background: "transparent",
      }}
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section
        className="relative flex items-center justify-center min-h-[100svh] overflow-hidden pt-6"
        style={{ background: "var(--bg-primary)" }}
      >
        {HERO_IMAGES.map((img) => (
          <FadeIn
            key={img.alt}
            delay={img.delay}
            duration={0.7}
            className={`absolute ${img.pos} ${img.rotate} hidden xl:block pointer-events-none`}
            style={{ zIndex: 1 }}
          >
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                border: "2px solid var(--border)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
              }}
            >
              <Image
                src={img.src}
                alt={img.alt}
                width={img.w}
                height={img.h}
                className="object-cover"
                style={{ display: "block" }}
                unoptimized
              />
            </div>
          </FadeIn>
        ))}

        <div className="relative z-10 mx-auto max-w-[1100px] px-6 py-24 md:py-32 text-center">
          <FadeUp delay={0.05}>
            <div
              className="inline-block text-xs tracking-[0.1em] uppercase px-3 py-1.5 rounded-full mb-8"
              style={{ background: "var(--bg-subtle)", color: "var(--accent)", fontFamily: "var(--font-barlow)" }}
            >
              Launch Offer — First 5 Properties Only — 50% off setup fee
            </div>
            <Eyebrow>For South African Guest Houses</Eyebrow>
          </FadeUp>

          <FadeUp delay={0.15}>
            <h1
              className="text-5xl md:text-7xl leading-[1.05] mb-6 mx-auto max-w-3xl"
              style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "var(--text-primary)" }}
            >
              You&rsquo;re losing R6,000
              <br />every month.
              <br />
              <span style={{ color: "var(--accent)" }}>Not to bad business.</span>
              <br />To Booking.com.
            </h1>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p
              className="text-base md:text-lg leading-relaxed max-w-[560px] mx-auto mb-10"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
            >
              Every booking through their platform costs you 15–20%. That is your
              profit, handed to a platform that owns your guest and charges you
              again every return visit. CVT Hosts gives you a direct booking
              system built around your property.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <PrimaryBtn href="/how-it-works">See How It Works</PrimaryBtn>
              <SecondaryBtn href="/packages">View Packages</SecondaryBtn>
            </div>
            <p className="text-xs" style={{ fontFamily: "var(--font-inter)", color: "var(--text-secondary)" }}>
              No long-term contracts. Cancel any month.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── STAT BAR ─────────────────────────────────────────────────────── */}
      <section style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <StaggerGrid className="mx-auto max-w-[1100px] px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { Icon: MoneySendIcon, stat: "R72,000+", desc: "Lost to OTA commissions annually by the average SA guest house" },
            { Icon: UserMultipleIcon, stat: "100%", desc: "Of your direct booking guests — their details belong to you, not the platform" },
            { Icon: ChartIncreaseIcon, stat: "R899/month", desc: "Is all it costs to run a complete direct booking system with payments" },
          ].map(({ Icon, stat, desc }, i) => (
            <StaggerItem key={i}>
              <div
                className="flex flex-col items-start gap-3 py-4 md:py-0 md:px-10 first:pl-0 last:pr-0 border-b md:border-b-0 md:border-l last:border-0 first:border-l-0"
                style={{ borderColor: "var(--border)" }}
              >
                <Icon size={28} style={{ color: "var(--accent)" }} />
                <span
                  className="text-4xl"
                  style={{ fontFamily: "var(--font-barlow)", fontWeight: 900, color: "var(--text-primary)" }}
                >
                  {stat}
                </span>
                <span className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>
                  {desc}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* ── THE PROBLEM ──────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-6 py-24">
        <FadeUp>
          <Eyebrow>The Real Cost</Eyebrow>
          <SectionHeadline>
            Booking.com is not your partner.
            <br />It is your most expensive cost.
          </SectionHeadline>
          <p className="text-base leading-relaxed max-w-[640px] mb-10" style={{ color: "var(--text-secondary)" }}>
            You listed your property to get bookings. That worked. But every year
            you stay on the platform, the arrangement costs you more — not just in
            commission, but in guests you cannot contact, relationships you cannot
            build, and revenue that belongs to you but never arrives.
          </p>
          <div className="mb-10">
            <DangerCallout>
              A guest house doing R30,000 per month in bookings pays up to R6,000
              in commission every single month. That is R72,000 a year — for
              guests who will book through the same platform again next time and
              cost you again.
            </DangerCallout>
          </div>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              Icon: UserRemoveIcon,
              title: "You do not own the guest",
              body: "Their contact details belong to Booking.com. When they return, they go back to the platform. You pay commission on a guest you already earned.",
            },
            {
              Icon: MoneyRemoveIcon,
              title: "You pay on every booking, forever",
              body: "There is no ceiling. No point at which you have paid enough. The more successful your property becomes, the more you hand over.",
            },
            {
              Icon: ChartDecreaseIcon,
              title: "Your rates are not fully yours",
              body: "Visibility programmes require you to discount on top of commission. You pay to be seen and reduce your margin to be chosen.",
            },
          ].map(({ Icon, title, body }) => (
            <StaggerItem key={title}>
              <div
                className="rounded-xl p-7 border h-full"
                style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
              >
                <Icon size={32} className="mb-5" style={{ color: "var(--danger)" }} />
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
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <WatermarkDivider />

      {/* ── THE SOLUTION ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <FadeUp>
            <Eyebrow>What CVT Hosts Builds for You</Eyebrow>
            <SectionHeadline>
              Your property.
              <br />Your bookings.
              <br />Your revenue.
            </SectionHeadline>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
              A professional website, live availability calendar, upfront
              PayFast payments, a bookings database, and a shareable booking
              link. Guests book directly with you. Money goes straight to your
              account.
            </p>
            <div className="flex flex-wrap gap-4">
              <PrimaryBtn href="/how-it-works">See How It Works</PrimaryBtn>
            </div>
          </FadeUp>

          <ScaleIn delay={0.15}>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: "1px solid var(--border)", boxShadow: "0 8px 40px rgba(0,0,0,0.25)" }}
            >
              <Image
                src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=700&h=520&fit=crop&auto=format"
                alt="South African guest house with pool and garden"
                width={700}
                height={520}
                className="w-full object-cover"
                unoptimized
              />
            </div>
          </ScaleIn>
        </div>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          {[
            {
              Icon: Globe01Icon,
              title: "Your own website",
              body: "Professional, mobile-first, built for your property. Your rooms, your rates, your brand.",
            },
            {
              Icon: CalendarCheck01Icon,
              title: "Live booking calendar",
              body: "Guests select dates, confirm availability instantly, and pay upfront. Every booking lands in your database.",
            },
            {
              Icon: CreditCardIcon,
              title: "Direct payments via PayFast",
              body: "SA's most trusted payment platform. Card and EFT. Money goes straight to your account at the point of booking.",
            },
            {
              Icon: WhatsappIcon,
              title: "WhatsApp notifications",
              body: "Every booking triggers an instant WhatsApp to you — guest name, dates, room, and payment confirmation.",
            },
          ].map(({ Icon, title, body }) => (
            <StaggerItem key={title}>
              <div
                className="rounded-xl p-7 border h-full"
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
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      {/* ── HOW IT WORKS SUMMARY ─────────────────────────────────────────── */}
      <section style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-[1100px] px-6 py-24">
          <FadeUp>
            <Eyebrow>The Process</Eyebrow>
            <SectionHeadline>Live in one week.</SectionHeadline>
          </FadeUp>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {[
              { Icon: Settings01Icon, num: "01", title: "We build your system", body: "You send us your property details, photos, and room information. We build your website, booking engine, and database — branded to your property." },
              { Icon: TickDoubleIcon, num: "02", title: "You review and approve", body: "We send you a staging link. You check every page, every room, every rate. We adjust until it is exactly right. Nothing goes live without your sign-off." },
              { Icon: Rocket01Icon, num: "03", title: "Guests book direct", body: "Your site goes live. Guests find you, book directly, and pay upfront. You get a WhatsApp notification. That is the whole process." },
            ].map(({ Icon, num, title, body }) => (
              <StaggerItem key={num}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl leading-none" style={{ fontFamily: "var(--font-barlow)", fontWeight: 900, color: "var(--accent)" }}>{num}</span>
                    <Icon size={24} style={{ color: "var(--accent)" }} />
                  </div>
                  <h3 className="text-lg" style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, color: "var(--text-primary)" }}>{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>{body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>

          <FadeUp>
            <div className="flex flex-wrap gap-4">
              <PrimaryBtn href="/packages">See Our Packages</PrimaryBtn>
              <SecondaryBtn href="/contact">Talk to Us First</SecondaryBtn>
            </div>
          </FadeUp>
        </div>
      </section>

      <WatermarkDivider />

      {/* ── PACKAGES SUMMARY ─────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-6 py-24">
        <FadeUp>
          <Eyebrow>Pricing</Eyebrow>
          <SectionHeadline>Pick where you are.<br />We will get you where you want to be.</SectionHeadline>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { name: "Get Found", tier: "Starter", tagline: "Professional website and direct booking infrastructure.", price: "R7,000", monthly: "R499/month", gold: false },
            { name: "Take Direct Bookings", tier: "Growth", tagline: "A complete booking and payment system with reports.", price: "R15,000", monthly: "R899/month", gold: true },
            { name: "Own Your Market", tier: "Full Stack", tagline: "Everything — including a WhatsApp AI Agent that books, replies, and collects payment autonomously.", price: "R30,000", monthly: "R1,800/month", gold: false },
          ].map(({ name, tier, tagline, price, monthly, gold }) => (
            <StaggerItem key={tier}>
              <div className="rounded-xl border flex flex-col overflow-hidden h-full" style={{ background: "var(--bg-surface)", borderColor: gold ? "var(--accent)" : "var(--border)" }}>
                {gold && <div className="h-[3px] w-full" style={{ background: "var(--accent)" }} />}
                <div className="p-7 flex flex-col gap-4 flex-1">
                  <p className="text-xs tracking-[0.12em] uppercase" style={{ fontFamily: "var(--font-barlow)", color: "var(--text-secondary)" }}>{tier}</p>
                  <h3 className="text-2xl" style={{ fontFamily: "var(--font-barlow)", fontWeight: 800, color: "var(--text-primary)" }}>{name}</h3>
                  <p className="text-sm leading-snug" style={{ color: "var(--text-secondary)" }}>{tagline}</p>
                  <div className="mt-auto pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                    <p className="text-xl font-semibold" style={{ color: "var(--text-primary)", fontFamily: "var(--font-barlow)" }}>
                      {price} <span className="text-sm font-normal" style={{ color: "var(--text-secondary)" }}>once-off</span>
                    </p>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{monthly}</p>
                  </div>
                  <Link href="/packages" className="text-sm underline underline-offset-2 transition-opacity hover:opacity-70" style={{ color: "var(--accent)", fontFamily: "var(--font-barlow)" }}>
                    See what&rsquo;s included
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <FadeUp>
          <div className="rounded-xl p-6 text-center" style={{ background: "var(--bg-subtle)" }}>
            <p className="text-xs tracking-[0.12em] uppercase mb-1" style={{ fontFamily: "var(--font-barlow)", color: "var(--accent)" }}>Launch Offer — First 5 Properties Only</p>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>50% off every setup fee. Monthly retainer unchanged.</p>
            <PrimaryBtn href="/contact">Claim your spot</PrimaryBtn>
          </div>
        </FadeUp>
      </section>

      {/* ── TESTIMONIAL ──────────────────────────────────────────────────── */}
      <section style={{ background: "var(--bg-surface)", borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-[1100px] px-6 py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <FadeUp>
              <div className="rounded-xl p-8 md:p-12" style={{ background: "var(--bg-primary)", borderLeft: "3px solid var(--accent)" }}>
                <blockquote className="text-lg md:text-xl leading-relaxed mb-6" style={{ fontFamily: "var(--font-playfair)", color: "var(--text-primary)" }}>
                  &ldquo;We had no idea how much we were giving away. Booking.com was listed as our only
                  website. We had no contact details for a single guest. CVT Hosts changed that in a week.&rdquo;
                </blockquote>
                <cite className="text-sm not-italic" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}>
                  Guest house owner, Bloemfontein, South Africa
                </cite>
              </div>
            </FadeUp>
            <ScaleIn delay={0.1}>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <Image
                  src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=640&h=440&fit=crop&auto=format"
                  alt="Beautiful South African guest house property"
                  width={640}
                  height={440}
                  className="w-full object-cover"
                  unoptimized
                />
              </div>
            </ScaleIn>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1100px] px-6 py-32 text-center">
        <FadeUp>
          <h2
            className="text-4xl md:text-5xl leading-tight mb-6 max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "var(--text-primary)" }}
          >
            Stop paying commission on guests you already earned.
          </h2>
          <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
            Your next booking could be commission-free. One conversation is all it takes.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer"
              className="inline-block rounded-lg px-8 py-3.5 text-sm transition-opacity hover:opacity-90"
              style={{ fontFamily: "var(--font-barlow)", fontWeight: 700, letterSpacing: "0.05em", background: "var(--accent)", color: "var(--text-inverse)" }}>
              WhatsApp Us Now
            </a>
            <SecondaryBtn href="/demo">See the Demo</SecondaryBtn>
          </div>
          <p className="text-xs" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}>
            No pressure. No sales script. Just a straight conversation about your property.
          </p>
        </FadeUp>
      </section>
    </>
  );
}
