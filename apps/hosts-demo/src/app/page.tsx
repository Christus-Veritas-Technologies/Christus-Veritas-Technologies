"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { addDays, format, differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ROOMS = [
  {
    id: "garden-suite",
    name: "Garden Suite",
    category: "Suite",
    rate: 950,
    capacity: 2,
    bedType: "Queen Bed",
    description: "Wake up to lush garden views. This serene suite features a private patio, en-suite bathroom, and garden access.",
    amenities: ["Private patio", "En-suite bathroom", "Garden views", "Fireplace", "Wi-Fi"],
    photo: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
  },
  {
    id: "mountain-view",
    name: "Mountain View Room",
    category: "Deluxe",
    rate: 1200,
    capacity: 2,
    bedType: "King Bed",
    description: "Breathtaking Drakensberg vistas from your private balcony. Spacious, light-filled room with premium finishes.",
    amenities: ["Private balcony", "Mountain views", "Luxury linen", "Mini-bar", "Wi-Fi"],
    photo: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80",
  },
  {
    id: "family-room",
    name: "Family Room",
    category: "Family",
    rate: 1800,
    capacity: 4,
    bedType: "2× Queen Beds",
    description: "Spacious family room with two queen beds, a kitchenette, and easy access to the pool and garden play area.",
    amenities: ["Kitchenette", "Pool access", "Garden view", "Kids toys", "Wi-Fi"],
    photo: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&q=80",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah & Mark T.",
    location: "Johannesburg",
    text: "We've stayed at many guest houses, but Thornfield is something special. The mountain views from our room were stunning, and the hosts made us feel completely at home. We'll definitely be back!",
    rating: 5,
  },
  {
    name: "David K.",
    location: "Cape Town",
    text: "Booking directly through the website was so easy. No Booking.com surcharges, just great rates and personal service. The garden suite was exactly as described — absolute tranquility.",
    rating: 5,
  },
];

const FAQS = [
  { q: "What time is check-in and check-out?", a: "Check-in is from 14:00 and check-out is at 11:00. Early check-in and late check-out can be arranged subject to availability — just let us know in advance." },
  { q: "Is breakfast included?", a: "A full cooked breakfast is included for all guests. We accommodate dietary requirements with prior notice." },
  { q: "Do you accept pets?", a: "We welcome well-behaved dogs in our Garden Suite and Family Room. Please notify us at the time of booking so we can prepare accordingly." },
  { q: "Is there parking on site?", a: "Yes, we offer free secure parking for all guests on the property." },
  { q: "What is your cancellation policy?", a: "Cancellations made 7+ days before arrival receive a full refund. Within 7 days, we retain 50% of the deposit. No-shows are charged in full." },
  { q: "Do you have Wi-Fi?", a: "Yes, complimentary high-speed Wi-Fi is available throughout the property." },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="1">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      ))}
    </div>
  );
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
          const range = eachDayOfInterval({ start: new Date(b.checkIn), end: addDays(new Date(b.checkOut), -1) });
          dates.push(...range);
        }
        setDisabledDates(dates);
      })
      .catch(() => {});
  }, []);

  const nights =
    dateRange?.from && dateRange?.to
      ? differenceInCalendarDays(dateRange.to, dateRange.from)
      : 0;

  const dateLabel =
    dateRange?.from && dateRange?.to
      ? `${format(dateRange.from, "d MMM")} – ${format(dateRange.to, "d MMM yyyy")}`
      : dateRange?.from
      ? `${format(dateRange.from, "d MMM yyyy")} – select checkout`
      : "Select dates";

  const bookUrl = dateRange?.from && dateRange?.to
    ? `/book?from=${format(dateRange.from, "yyyy-MM-dd")}&to=${format(dateRange.to, "yyyy-MM-dd")}&guests=${guests}`
    : `/book?guests=${guests}`;

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[90vh] min-h-[560px] flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85"
          alt="Drakensberg landscape"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />

        <div className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto">
          <Badge variant="secondary" className="mb-4 bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30">
            Drakensberg, KwaZulu-Natal
          </Badge>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-medium leading-tight mb-4">
            Your Mountain<br />Escape Awaits
          </h1>
          <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
            Intimate guest house in the heart of the Drakensberg. Book direct, skip the commission, and experience true South African hospitality.
          </p>

          {/* Booking Widget */}
          <div className="bg-[var(--bg-surface)]/95 backdrop-blur-sm rounded-xl shadow-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl mx-auto">
            {/* Date picker */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex-1 flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg-primary)] text-sm text-left min-w-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="shrink-0"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                  <span className={dateRange?.from ? "text-[var(--text-primary)] font-medium" : "text-[var(--text-secondary)]"}>
                    {dateLabel}
                  </span>
                  {nights > 0 && <span className="ml-auto text-xs text-[var(--accent)] font-semibold shrink-0">{nights}n</span>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  disabled={[{ before: new Date() }, ...disabledDates.map((d) => new Date(d))]}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            {/* Guests */}
            <div className="sm:w-36">
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? "guest" : "guests"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button asChild size="lg" className="sm:px-6">
              <Link href={bookUrl}>Check Availability</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── STAT BAR ── */}
      <section className="bg-[var(--text-primary)] text-white py-6">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            ["4", "Unique Rooms"],
            ["100%", "Instant Confirmation"],
            ["0%", "Commission Fees"],
            ["⭐ 4.9", "Guest Rating"],
          ].map(([stat, label]) => (
            <div key={label} className="text-center">
              <p className="font-[family-name:var(--font-barlow)] font-black text-2xl text-[var(--accent)]">{stat}</p>
              <p className="text-sm text-white/60 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ROOMS ── */}
      <section className="py-20 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-2 font-[family-name:var(--font-barlow)]">Our Rooms</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-medium text-[var(--text-primary)]">
              A Room for Every Occasion
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ROOMS.map((room) => (
              <Card key={room.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={room.photo}
                    alt={room.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)]">
                      {room.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-[family-name:var(--font-barlow)] font-bold text-lg text-[var(--text-primary)]">{room.name}</h3>
                    <div className="text-right">
                      <p className="font-[family-name:var(--font-barlow)] font-black text-xl text-[var(--accent)]">
                        R{room.rate.toLocaleString("en-ZA")}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">per night</p>
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)] mb-3 line-clamp-2">{room.description}</p>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)] mb-4">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      {room.capacity} guests
                    </span>
                    <span>{room.bedType}</span>
                  </div>
                  <Button asChild className="w-full" size="sm">
                    <Link href={`/book?room=${room.id}`}>Book This Room</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link href="/rooms">View All Rooms</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-6 bg-[var(--bg-subtle)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-2 font-[family-name:var(--font-barlow)]">Simple Process</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-medium text-[var(--text-primary)]">
              Book in 3 Easy Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Choose Your Room",
                desc: "Browse our handpicked rooms and select the one that suits your stay. Use the calendar to check availability instantly.",
              },
              {
                step: "02",
                title: "Enter Your Details",
                desc: "Fill in your guest information, preferred dates, and any special requests. Takes under 2 minutes.",
              },
              {
                step: "03",
                title: "Secure Payment",
                desc: "Pay securely via PayFast — card or EFT. Receive instant confirmation straight to your inbox.",
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[var(--accent)] text-white font-[family-name:var(--font-barlow)] font-black text-xl flex items-center justify-center mb-4 shadow-md">
                  {step}
                </div>
                <h3 className="font-[family-name:var(--font-barlow)] font-bold text-lg text-[var(--text-primary)] mb-2">{title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-20 px-6 bg-[var(--bg-surface)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div className="relative">
            <div className="relative h-[440px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85"
                alt="Drakensberg mountains"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 bg-[var(--accent)] text-white rounded-xl p-4 shadow-lg text-center">
              <p className="font-[family-name:var(--font-barlow)] font-black text-2xl">15+</p>
              <p className="text-xs font-medium">Years of<br />Hospitality</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-3 font-[family-name:var(--font-barlow)]">Our Story</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-medium text-[var(--text-primary)] mb-5">
              Where the Mountains<br />Feel Like Home
            </h2>
            <p className="text-[var(--text-secondary)] mb-4 leading-relaxed">
              Thornfield Guest House was born from a love of the Drakensberg and a belief that the best stays are the most personal ones. Nestled in the foothills of the Berg, we offer a calm, unhurried retreat from city life.
            </p>
            <p className="text-[var(--text-secondary)] mb-8 leading-relaxed">
              Every room is thoughtfully furnished, every breakfast homemade. We don't list on major booking platforms — not because we're exclusive, but because we believe in direct relationships with our guests.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/book">Book Your Stay</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/rooms">Explore Rooms</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-6 bg-[var(--bg-subtle)]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-2 font-[family-name:var(--font-barlow)]">Guest Reviews</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-medium text-[var(--text-primary)]">
              Loved by Our Guests
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="border-l-4 border-l-[var(--accent)] border-[var(--border)]">
                <CardContent className="p-6">
                  <StarRating count={t.rating} />
                  <p className="text-[var(--text-secondary)] mt-3 mb-4 leading-relaxed italic">"{t.text}"</p>
                  <Separator className="mb-3" />
                  <div>
                    <p className="font-semibold text-sm text-[var(--text-primary)] font-[family-name:var(--font-barlow)]">{t.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{t.location}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATION ── */}
      <section className="py-20 px-6 bg-[var(--bg-surface)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-3 font-[family-name:var(--font-barlow)]">Location</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-medium text-[var(--text-primary)] mb-5">
              Heart of the Drakensberg
            </h2>
            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              We're situated in the Central Drakensberg, easily accessible from Johannesburg (3h 30min) and Durban (2h). Perfect for hiking, birding, photography, or simply unwinding.
            </p>
            <ul className="space-y-3 text-sm text-[var(--text-secondary)]">
              {[
                "2.5km from Champagne Valley Road",
                "Walking distance to hiking trails",
                "30min to nearest town (Winterton)",
                "Free secure on-site parking",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[var(--accent)]/20 flex items-center justify-center shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative h-80 rounded-2xl overflow-hidden shadow-xl bg-[var(--bg-subtle)] flex items-center justify-center">
            <Image
              src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80"
              alt="Map view"
              fill
              className="object-cover opacity-60"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="relative z-10 text-center">
              <div className="bg-[var(--accent)] text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2 shadow-lg">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <p className="font-[family-name:var(--font-barlow)] font-bold text-[var(--text-primary)] bg-[var(--bg-surface)]/90 px-3 py-1 rounded-full text-sm">
                Thornfield Guest House
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-6 bg-[var(--bg-subtle)]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-2 font-[family-name:var(--font-barlow)]">Common Questions</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-medium text-[var(--text-primary)]">
              Frequently Asked Questions
            </h2>
          </div>
          <Accordion type="single" collapsible className="bg-[var(--bg-surface)] rounded-xl border border-[var(--border)] px-6">
            {FAQS.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`} className={i === FAQS.length - 1 ? "border-b-0" : ""}>
                <AccordionTrigger className="text-left font-[family-name:var(--font-barlow)] font-semibold">{faq.q}</AccordionTrigger>
                <AccordionContent>{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=80"
          alt="Guest house exterior"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/65" />
        <div className="relative z-10 max-w-2xl mx-auto text-center text-white">
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium mb-4">
            Ready to Escape to the Berg?
          </h2>
          <p className="text-white/75 text-lg mb-8">
            Book directly with us — no booking fees, no middlemen. Just warm rooms, mountain air, and home-cooked breakfasts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-base">
              <Link href="/book">Book Your Room</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[var(--text-primary)] text-base"
            >
              <Link href="/rooms">Browse Rooms</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
