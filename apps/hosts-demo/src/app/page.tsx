"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { addDays, format, differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import { FadeUp, StaggerContainer, StaggerItem, HeroReveal, ScaleIn, BlurReveal } from "@/components/Animate";

const ROOMS = [
  { id: "garden-suite", name: "Garden Suite", category: "Suite", rate: 65, capacity: 2, bedType: "Queen Bed", description: "Serene garden views, private patio, en-suite soaking tub and fireplace.", amenities: ["Private patio", "Soaking tub", "Fireplace", "Wi-Fi"], photo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80" },
  { id: "mountain-view", name: "Mountain View Room", category: "Deluxe", rate: 85, capacity: 2, bedType: "King Bed", description: "Uninterrupted highland panorama from a king bed and private balcony.", amenities: ["Private balcony", "Mountain views", "Rain shower", "Mini-bar"], photo: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80" },
  { id: "family-room", name: "Family Room", category: "Family", rate: 120, capacity: 4, bedType: "2x Queen Beds", description: "Two queen beds, kitchenette, and pool access -- home for the whole family.", amenities: ["Kitchenette", "Pool access", "Kids toys", "Garden view"], photo: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80" },
];

const TESTIMONIALS = [
  { name: "Sarah & Mark T.", location: "Harare", rating: 5, text: "We have stayed at many guest houses, but Thornfield is something special. The mountain views were stunning, and the hosts made us feel completely at home." },
  { name: "David K.", location: "Bulawayo", rating: 5, text: "Booking directly was so easy -- no Booking.com surcharges, just great rates and personal service. The garden suite was exactly as described: absolute tranquility." },
];

const FAQS = [
  { q: "What time is check-in and check-out?", a: "Check-in from 14:00, check-out by 11:00. Early/late arrangements subject to availability." },
  { q: "Is breakfast included?", a: "A full cooked breakfast is included. Dietary requirements accommodated with prior notice." },
  { q: "Do you accept pets?", a: "Well-behaved dogs welcome in the Garden Suite and Family Room. Please notify us at booking." },
  { q: "Is there parking on site?", a: "Free secure parking for all guests on the property." },
  { q: "What is your cancellation policy?", a: "Full refund 7+ days before arrival. 50% retained within 7 days. No-shows charged in full." },
  { q: "Do you have Wi-Fi?", a: "Complimentary high-speed Wi-Fi available throughout the property." },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="var(--accent)" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
      ))}
    </div>
  );
}

function AnimatedStat({ target, suffix = "", prefix = "" }: { target: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1200;
    const stepMs = 16;
    const increment = target / (duration / stepMs);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, stepMs);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{prefix}{inView ? count : 0}{suffix}</span>;
}

export default function HomePage() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState("2");
  const [disabledDates, setDisabledDates] = useState<Date[]>([]);

  useEffect(() => {
    fetch("/api/availability")
      .then((r) => r.json())
      .then((data: { checkIn: string; checkOut: string }[]) => {
        const dates: Date[] = [];
        for (const b of data) {
          dates.push(...eachDayOfInterval({ start: new Date(b.checkIn), end: addDays(new Date(b.checkOut), -1) }));
        }
        setDisabledDates(dates);
      })
      .catch(() => {});
  }, []);

  const nights = dateRange?.from && dateRange?.to ? differenceInCalendarDays(dateRange.to, dateRange.from) : 0;
  const dateLabel = dateRange?.from && dateRange?.to
    ? `${format(dateRange.from, "d MMM")} - ${format(dateRange.to, "d MMM yyyy")}`
    : dateRange?.from ? `${format(dateRange.from, "d MMM")} - select checkout`
    : "Select your dates";
  const bookUrl = dateRange?.from && dateRange?.to
    ? `/book?from=${format(dateRange.from, "yyyy-MM-dd")}&to=${format(dateRange.to, "yyyy-MM-dd")}&guests=${guests}`
    : `/book?guests=${guests}`;

  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative h-[95vh] min-h-[640px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1800&q=85"
          alt="Eastern Highlands mountain landscape"
          fill priority
          className="object-cover"
          sizes="100vw"
        />
        <motion.div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.62) 100%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4 }}
        />

        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto w-full">
          <HeroReveal delay={0.05}>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-7">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="text-xs font-bold tracking-[0.18em] uppercase font-[family-name:var(--font-barlow)] text-white/90">
                Nyanga, Zimbabwe
              </span>
            </div>
          </HeroReveal>

          <HeroReveal delay={0.2}>
            <h1
              className="font-[family-name:var(--font-playfair)] font-medium text-white leading-[1.08] mb-6 drop-shadow-2xl"
              style={{ fontSize: "clamp(3rem, 7.5vw, 5.5rem)" }}
            >
              Your Mountain<br />
              <span className="italic text-[var(--accent)]">Escape</span> Awaits
            </h1>
          </HeroReveal>

          <HeroReveal delay={0.35}>
            <p
              className="text-white/75 font-light leading-relaxed mb-10 mx-auto"
              style={{ fontSize: "clamp(1rem, 2vw, 1.15rem)", maxWidth: "520px" }}
            >
              Intimate guest house in the heart of Zimbabwe&rsquo;s Eastern Highlands. Book direct, skip the commission, experience true Zimbabwean hospitality.
            </p>
          </HeroReveal>

          <HeroReveal delay={0.5}>
            <div className="bg-[var(--bg-surface)]/96 backdrop-blur-lg rounded-2xl shadow-2xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 max-w-2xl mx-auto border border-white/10">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--bg-primary)] text-sm text-left min-w-0 hover:border-[var(--accent)]/50 transition-colors">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="shrink-0"><rect width="18" height="18" x="3" y="4" rx="2"/><line x1="3" x2="21" y1="10" y2="10"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="16" x2="16" y1="2" y2="6"/></svg>
                    <span className={dateRange?.from ? "text-[var(--text-primary)] font-medium text-sm" : "text-[var(--text-secondary)] text-sm"}>{dateLabel}</span>
                    {nights > 0 && <span className="ml-auto text-xs text-[var(--accent)] font-bold shrink-0 bg-[var(--accent)]/10 px-1.5 py-0.5 rounded-full">{nights}n</span>}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="range" selected={dateRange} onSelect={setDateRange} disabled={[{ before: new Date() }, ...disabledDates.map((d) => new Date(d))]} numberOfMonths={2} />
                </PopoverContent>
              </Popover>
              <div className="sm:w-36 shrink-0">
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6].map((n) => (<SelectItem key={n} value={String(n)}>{n} {n===1?"guest":"guests"}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <Button asChild size="lg" className="rounded-xl px-6 shrink-0 h-11 font-[family-name:var(--font-barlow)] font-bold">
                <Link href={bookUrl}>Check Availability</Link>
              </Button>
            </div>
          </HeroReveal>

          <HeroReveal delay={0.65}>
            <div className="flex items-center justify-center gap-6 mt-7 text-xs text-white/50">
              {["No booking fees", "Instant confirmation", "Best rate guaranteed"].map((item, i) => (
                <React.Fragment key={item}>
                  {i > 0 && <div className="w-px h-3 bg-white/20" />}
                  <span className="flex items-center gap-1.5">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {item}
                  </span>
                </React.Fragment>
              ))}
            </div>
          </HeroReveal>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" opacity="0.5"><path d="m6 9 6 6 6-6"/></svg>
          </motion.div>
        </motion.div>
      </section>

      {/* STAT BAR */}
      <motion.section
        className="bg-[var(--text-primary)] text-white py-8"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 4, suffix: "", prefix: "", label: "Unique Rooms" },
            { value: 100, suffix: "%", prefix: "", label: "Instant Confirmation" },
            { value: 0, suffix: "%", prefix: "", label: "Commission Fees" },
            { value: 9, suffix: "/5", prefix: "4.", label: "Guest Rating" },
          ].map(({ value, suffix, prefix, label }) => (
            <div key={label} className="text-center">
              <p className="font-[family-name:var(--font-barlow)] font-black text-3xl text-[var(--accent)] tabular-nums">
                <AnimatedStat target={value} suffix={suffix} prefix={prefix} />
              </p>
              <p className="text-xs text-white/45 mt-1.5 font-[family-name:var(--font-barlow)] tracking-wide">{label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ROOMS */}
      <section className="py-28 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Our Rooms" title="A Room for Every Occasion" subtitle="Each room is thoughtfully designed with premium linen, en-suite bathrooms, and its own character." />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {ROOMS.map((room) => (
              <StaggerItem key={room.id}>
                <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 h-full border-[var(--border)]">
                  <div className="relative h-56 overflow-hidden">
                    <Image src={room.photo} alt={room.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                    <div className="absolute top-3 left-3">
                      <Badge className="bg-[var(--bg-surface)]/95 text-[var(--text-primary)] border-0 shadow-sm text-xs font-[family-name:var(--font-barlow)] font-semibold">{room.category}</Badge>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <CardContent className="p-6 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-[family-name:var(--font-barlow)] font-bold text-[var(--text-primary)] text-base">{room.name}</h3>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{room.bedType} &middot; {room.capacity} guests</p>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <p className="font-[family-name:var(--font-barlow)] font-black text-xl text-[var(--accent)]">${room.rate.toLocaleString("en-US")}</p>
                        <p className="text-xs text-[var(--text-secondary)]">/ night</p>
                      </div>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4 flex-1">{room.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {room.amenities.map((a) => (
                        <span key={a} className="text-xs bg-[var(--bg-subtle)] text-[var(--text-secondary)] px-2.5 py-0.5 rounded-full">{a}</span>
                      ))}
                    </div>
                    <Button asChild size="sm" className="w-full font-[family-name:var(--font-barlow)] font-semibold">
                      <Link href={`/book?room=${room.id}`}>Book This Room</Link>
                    </Button>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
          <FadeUp delay={0.15} className="text-center mt-12">
            <Button asChild variant="outline" size="lg" className="font-[family-name:var(--font-barlow)] font-semibold">
              <Link href="/rooms">View All Rooms &amp; Suites</Link>
            </Button>
          </FadeUp>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-28 px-6 bg-[var(--bg-subtle)]">
        <div className="max-w-5xl mx-auto">
          <SectionHeader eyebrow="Simple Process" title="Book in 3 Easy Steps" subtitle="No account required. Direct booking takes under 3 minutes." />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { n: "01", title: "Choose Your Room", desc: "Browse our handpicked rooms and use the calendar to check real-time availability." },
              { n: "02", title: "Enter Your Details", desc: "Fill in guest information and any special requests. Takes under 2 minutes." },
              { n: "03", title: "Secure Payment", desc: "Pay via EcoCash, OneMoney, or card. Receive instant confirmation to your inbox." },
            ].map(({ n, title, desc }) => (
              <StaggerItem key={n}>
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    className="w-16 h-16 rounded-2xl bg-[var(--accent)] text-white font-[family-name:var(--font-barlow)] font-black text-lg flex items-center justify-center mb-5 shadow-lg"
                    whileHover={{ scale: 1.08, rotate: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {n}
                  </motion.div>
                  <h3 className="font-[family-name:var(--font-barlow)] font-bold text-[var(--text-primary)] mb-2">{title}</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ABOUT */}
      <section className="py-28 px-6 bg-[var(--bg-surface)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <BlurReveal>
            <div className="relative">
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85" alt="Eastern Highlands mountains" fill className="object-cover" sizes="50vw" />
              </div>
              <motion.div
                className="absolute -bottom-6 -right-6 bg-[var(--accent)] text-white rounded-2xl p-6 shadow-2xl text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                <p className="font-[family-name:var(--font-barlow)] font-black text-4xl leading-none">15+</p>
                <p className="text-xs font-medium mt-1 opacity-85 font-[family-name:var(--font-barlow)]">Years of<br />Hospitality</p>
              </motion.div>
            </div>
          </BlurReveal>

          <FadeUp>
            <p className="text-[0.68rem] font-[family-name:var(--font-barlow)] font-bold uppercase tracking-[0.22em] text-[var(--accent)] mb-4">Our Story</p>
            <h2
              className="font-[family-name:var(--font-playfair)] font-medium text-[var(--text-primary)] leading-[1.12] mb-6"
              style={{ fontSize: "clamp(1.85rem, 4vw, 2.9rem)" }}
            >
              Where the Mountains<br /><span className="italic">Feel Like Home</span>
            </h2>
            <p className="text-[var(--text-secondary)] mb-4 leading-relaxed text-[0.95rem]">Thornfield Guest House was born from a love of Zimbabwe&rsquo;s Eastern Highlands and a belief that the best stays are the most personal ones. Nestled in the foothills of Nyanga, we offer a calm, unhurried retreat from city life.</p>
            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed text-[0.95rem]">We do not list on major booking platforms -- because we believe in direct relationships with our guests. Every room is thoughtfully furnished; every breakfast homemade.</p>
            <div className="flex gap-3">
              <Button asChild className="font-[family-name:var(--font-barlow)] font-semibold"><Link href="/book">Book Your Stay</Link></Button>
              <Button asChild variant="outline" className="font-[family-name:var(--font-barlow)] font-semibold"><Link href="/rooms">Explore Rooms</Link></Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28 px-6 bg-[var(--bg-subtle)]">
        <div className="max-w-4xl mx-auto">
          <SectionHeader eyebrow="Guest Reviews" title="Loved by Our Guests" />
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <StaggerItem key={t.name}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow bg-[var(--bg-surface)] overflow-hidden">
                  <div className="h-1 bg-[var(--accent)]" />
                  <CardContent className="p-7">
                    <StarRating count={t.rating} />
                    <p className="text-[var(--text-secondary)] mt-4 mb-6 leading-[1.8] italic text-[0.93rem]">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--accent)]/15 flex items-center justify-center text-[var(--accent)] font-bold font-[family-name:var(--font-barlow)] text-sm shrink-0">
                        {t.name[0]}
                      </div>
                      <div>
                        <p className="font-[family-name:var(--font-barlow)] font-bold text-sm text-[var(--text-primary)]">{t.name}</p>
                        <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t.location}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* LOCATION TEASER */}
      <section className="py-28 px-6 bg-[var(--bg-surface)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <FadeUp>
            <p className="text-[0.68rem] font-[family-name:var(--font-barlow)] font-bold uppercase tracking-[0.22em] text-[var(--accent)] mb-4">Location</p>
            <h2
              className="font-[family-name:var(--font-playfair)] font-medium text-[var(--text-primary)] leading-[1.12] mb-6"
              style={{ fontSize: "clamp(1.85rem, 4vw, 2.9rem)" }}
            >
              Heart of the<br /><span className="italic">Highlands</span>
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed text-[0.95rem]">Nyanga, Eastern Highlands, 4h from Harare and 6h from Bulawayo. Perfect for hiking, birding, or simply unwinding.</p>
            <ul className="space-y-3 mb-8">
              {["2.5km from Nyanga National Park gate", "Walking distance to hiking trails", "15min to nearest town (Nyanga)", "Free secure on-site parking"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
                  <div className="w-5 h-5 rounded-full bg-[var(--accent)]/12 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Button asChild variant="outline" className="font-[family-name:var(--font-barlow)] font-semibold"><Link href="/location">Get Directions</Link></Button>
          </FadeUp>
          <ScaleIn>
            <div className="relative h-80 rounded-3xl overflow-hidden shadow-xl border border-[var(--border)]">
              <Image src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80" alt="Map area" fill className="object-cover opacity-60" sizes="50vw" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}>
                  <div className="bg-[var(--accent)] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl mb-3">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                </motion.div>
                <div className="bg-[var(--bg-surface)]/95 backdrop-blur-sm rounded-2xl px-5 py-2.5 shadow-xl text-center">
                  <p className="font-[family-name:var(--font-barlow)] font-bold text-[var(--text-primary)] text-sm">Thornfield Guest House</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Nyanga, Zimbabwe</p>
                </div>
              </div>
            </div>
          </ScaleIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-28 px-6 bg-[var(--bg-subtle)]">
        <div className="max-w-3xl mx-auto">
          <SectionHeader eyebrow="Common Questions" title="Frequently Asked Questions" />
          <FadeUp>
            <Accordion type="single" collapsible className="bg-[var(--bg-surface)] rounded-2xl border border-[var(--border)] px-6 shadow-sm divide-y divide-[var(--border)]">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-none">
                  <AccordionTrigger className="text-left font-[family-name:var(--font-barlow)] font-semibold text-[0.93rem] py-4 hover:no-underline hover:text-[var(--accent)] transition-colors">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-[var(--text-secondary)] leading-relaxed text-[0.9rem] pb-4">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </FadeUp>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80" alt="Guest house at dusk" fill className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-black/72" />
        <FadeUp className="relative z-10 max-w-2xl mx-auto text-center text-white">
          <p className="text-[0.68rem] font-[family-name:var(--font-barlow)] font-bold uppercase tracking-[0.22em] text-[var(--accent)] mb-5">Ready When You Are</p>
          <h2
            className="font-[family-name:var(--font-playfair)] font-medium text-white leading-[1.1] mb-5"
            style={{ fontSize: "clamp(2.2rem, 6vw, 4rem)" }}
          >
            Escape to the<br /><span className="italic text-[var(--accent)]">Highlands</span>
          </h2>
          <p className="text-white/60 mb-10 font-light leading-relaxed" style={{ fontSize: "clamp(0.95rem, 1.5vw, 1.1rem)" }}>
            No booking fees, no middlemen. Just warm rooms, mountain air, and home-cooked breakfasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="font-[family-name:var(--font-barlow)] font-bold text-base px-8">
              <Link href="/book">Book Your Room</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white hover:text-[var(--text-primary)] font-[family-name:var(--font-barlow)] font-bold text-base px-8">
              <Link href="/rooms">Browse Rooms</Link>
            </Button>
          </div>
        </FadeUp>
      </section>

      <Footer />
    </>
  );
}
