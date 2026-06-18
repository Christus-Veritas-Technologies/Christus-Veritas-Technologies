import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { WA_LINK } from "@/lib/config";

const BASE_URL = "https://hosts.christusveritastech.co.zw";

export const metadata: Metadata = {
  title: "CVT Hosts — Get Your Zimbabwe Guest House Found Online",
  description:
    "Most Zimbabwe guest houses are invisible on Google and lose every guest record the moment a phone breaks or a notebook goes missing. CVT Hosts builds you a professional website, a live booking calendar with EcoCash, OneMoney, and card payments, and a permanent guest database — live in one week, from $75.",
  keywords: [
    "guest house website Zimbabwe",
    "Zimbabwe guest house Google listing",
    "direct booking system Zimbabwe",
    "EcoCash accommodation booking",
    "guest house booking calendar Zimbabwe",
    "$75 guest house website",
    "guest database for guest house",
    "Zimbabwe hospitality tech",
    "WhatsApp AI booking agent",
  ],
  openGraph: {
    title: "CVT Hosts — Get Found. Get Booked. Get Permanent Records.",
    description:
      "Most Zimbabwe guest houses are invisible on Google and keep no permanent record of their guests. CVT Hosts gets you online with a professional website, a live booking calendar, EcoCash/OneMoney/card payments, and a guest database that is yours forever.",
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CVT Hosts — Direct Booking for Zimbabwe Guest Houses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CVT Hosts — Get Found. Get Booked. Get Permanent Records.",
    description:
      "Invisible on Google? No record of your guests? Get online in one week, from $75.",
    images: [`${BASE_URL}/og-image.png`],
  },
  alternates: { canonical: BASE_URL },
};

import {
  MoneySendIcon,
  UserMultipleIcon,
  Clock01Icon,
  Search01Icon,
  DocumentCodeIcon,
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
    alt: "Modern Zimbabwe property with pool",
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
            <Eyebrow>For Zimbabwean Guest Houses</Eyebrow>
          </FadeUp>

          <FadeUp delay={0.15}>
            <h1
              className="text-5xl md:text-7xl leading-[1.05] mb-6 mx-auto max-w-3xl"
              style={{ fontFamily: "var(--font-playfair)", fontWeight: 400, color: "var(--text-primary)" }}
            >
              In 2004, the world
              <br />went online.
              <br />Hotels got found.
              <br />Restaurants got booked.
              <br />
              <span style={{ color: "var(--accent)" }}>Your guest house did not.</span>
            </h1>
          </FadeUp>

          <FadeUp delay={0.25}>
            <p
              className="text-base md:text-lg leading-relaxed max-w-[560px] mx-auto mb-10"
              style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
            >
              The dotcom era did not pass Zimbabwe by — it passed your guest
              house by. Every night, a traveller opens Google, searches for a
              place to stay in your city, and books the first property with a
              website. If yours is not there, they will never find you. CVT
              Hosts gets your guest house online — with a professional
              website, direct bookings, upfront payments, and a permanent
              record of every guest you have ever hosted.
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
            { Icon: Clock01Icon, stat: "20+ years", desc: "Since the internet changed how the world finds and books accommodation — most Zimbabwe guest houses still are not on it" },
            { Icon: UserMultipleIcon, stat: "100%", desc: "Of your guests — their contact details belong to you, stored in your own permanent database" },
            { Icon: MoneySendIcon, stat: "$75", desc: "Is all it takes to get your guest house online with a professional website that works" },
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
          <Eyebrow>The Real Problem</Eyebrow>
          <SectionHeadline>
            Your guest house exists.
            <br />It just does not exist
            <br />where guests are looking.
          </SectionHeadline>
          <p className="text-base leading-relaxed max-w-[640px] mb-10" style={{ color: "var(--text-secondary)" }}>
            The world moved online over twenty years ago. Businesses that got
            there early built audiences, filled calendars, and grew.
            Businesses that did not became invisible to anyone who did not
            already know they existed. Most Zimbabwe guest houses never made
            the move. They still run on word of mouth, WhatsApp messages, and
            a booking register that lives in a drawer. When a guest checks
            out, they take nothing with them. No record survives the
            notebook it was written in.
          </p>
          <div className="mb-10">
            <DangerCallout>
              A guest who cannot find your property on Google does not call
              to ask. They book the property that showed up in the search.
              Not because it is better. Because it was there.
            </DangerCallout>
          </div>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              Icon: Search01Icon,
              title: "You are invisible online",
              body: "No website means no Google listing. No Google listing means no discovery. The traveller searching for a guest house in your city tonight will not find you — because there is nothing to find.",
            },
            {
              Icon: DocumentCodeIcon,
              title: "Your records live in a notebook",
              body: "Every guest who has ever stayed with you. Every booking, every payment, every contact. Written in a register or saved in a WhatsApp chat. One lost phone, one flood — and it is gone. Permanently.",
            },
            {
              Icon: Clock01Icon,
              title: "Bookings fall through every week",
              body: "A guest messages on WhatsApp. You reply hours later. They have already booked somewhere else. There is no system catching the ones that slip through.",
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
              Your website.
              <br />Your bookings.
              <br />Your records.
              <br />All in one place.
            </SectionHeadline>
            <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-secondary)" }}>
              CVT Hosts gives your guest house everything it needs to run
              properly in the digital age — built and managed for you. A
              professional website your guests can find on Google. A live
              booking calendar that takes payments upfront via EcoCash,
              OneMoney, and card. A permanent guest database that grows with
              every stay. Expense tracking and financial reports you can
              export as PDF. Everything your guest house needs, in one
              place, online, safe, and yours. It took the world twenty years
              to get here. It takes your property one week.
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
                alt="Zimbabwe guest house with pool and garden"
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
              body: "Professional, mobile-first, built for your property. Found on Google by the guests who are already searching.",
            },
            {
              Icon: CalendarCheck01Icon,
              title: "Live booking calendar",
              body: "Guests select dates, check availability, and pay upfront. Every booking lands in your permanent database in real time.",
            },
            {
              Icon: CreditCardIcon,
              title: "Direct payments",
              body: "EcoCash, OneMoney, and card — collected at the point of booking. No chasing proof of payment. No manual confirmations.",
            },
            {
              Icon: WhatsappIcon,
              title: "WhatsApp notifications",
              body: "Every confirmed booking sends an instant WhatsApp to you — guest name, dates, room, and payment confirmation.",
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
            <SectionHeadline>Twenty years late.<br />One week to catch up.</SectionHeadline>
          </FadeUp>

          <StaggerGrid className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
            {[
              { Icon: Settings01Icon, num: "01", title: "We learn your property", body: "You send us your property details, photos, and room information. A WhatsApp conversation handles most of it." },
              { Icon: TickDoubleIcon, num: "02", title: "You review and approve", body: "We send you a staging link. Check every page, every room, every rate. Nothing goes live without your sign-off." },
              { Icon: Rocket01Icon, num: "03", title: "Guests find you and book direct", body: "Your site goes live. Guests discover you on Google, book directly, and pay upfront. You get a WhatsApp notification. That is the whole process." },
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
            { name: "Get Found", tier: "Starter", tagline: "Your guest house on the internet — found on Google, reachable on WhatsApp, visible to the world.", price: "$75", monthly: "$5/month", gold: false },
            { name: "Run Your Business", tier: "Growth", tagline: "Your website, your bookings, your payments, your guest records, and your finances — all in one place.", price: "$200", monthly: "$10/month", gold: true },
            { name: "Own Your Market", tier: "Full Stack", tagline: "Everything — including a WhatsApp AI Agent that answers guests, confirms bookings, and collects payment around the clock.", price: "$500", monthly: "$25/month", gold: false },
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
                  &ldquo;We had no idea what we were missing. Guests could not
                  find us online, and the ones who did book — we had no way
                  to reach them again. CVT Hosts changed that in a week.&rdquo;
                </blockquote>
                <cite className="text-sm not-italic" style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}>
                  Guest house owner, Mutare, Zimbabwe
                </cite>
              </div>
            </FadeUp>
            <ScaleIn delay={0.1}>
              <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                <Image
                  src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=640&h=440&fit=crop&auto=format"
                  alt="Beautiful Zimbabwe guest house property"
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
            The internet has been
            <br />waiting twenty years
            <br />for your guest house.
          </h2>
          <p className="text-base mb-10 max-w-lg mx-auto" style={{ color: "var(--text-secondary)" }}>
            It takes one conversation and one week to get there. That is all.
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
