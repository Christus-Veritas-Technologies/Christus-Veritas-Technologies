import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const DIRECTIONS = [
  {
    from: "From Johannesburg",
    time: "± 3h 30min",
    steps: [
      "Take the N3 south towards Durban",
      "Take the Harrismith/Bergville exit (R74)",
      "Follow R74 through Bergville towards Champagne Valley",
      "Turn left at the Thornfield Guest House sign (2.5km past the Spioenkop turn-off)",
    ],
  },
  {
    from: "From Durban",
    time: "± 2h 00min",
    steps: [
      "Take the N3 north towards Johannesburg",
      "Take the Estcourt/Bergville exit onto R103",
      "Follow signs to Bergville, then pick up R74 to Champagne Valley",
      "Turn right at the Thornfield Guest House sign",
    ],
  },
];

const NEARBY = [
  { name: "Champagne Castle", distance: "8km", desc: "Iconic Berg peak — day hikes from the guest house" },
  { name: "Cathedral Peak", distance: "22km", desc: "World-class hiking and climbing routes" },
  { name: "Drakensberg Boys Choir", distance: "12km", desc: "Renowned choral school with public performances" },
  { name: "Spioenkop Dam", distance: "35km", desc: "Water sports, birding, and Anglo-Boer War memorial" },
  { name: "Winterton Town", distance: "30km", desc: "Supermarkets, fuel, and local craft markets" },
  { name: "Berg Hikes (on doorstep)", distance: "0km", desc: "Multiple trail entrances within walking distance" },
];

export default function LocationPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative h-56 flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=1400&q=80"
          alt="Drakensberg location"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10 w-full">
          <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-1 font-[family-name:var(--font-barlow)]">Find Us</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-white font-medium">Location & Directions</h1>
        </div>
      </section>

      {/* Address bar */}
      <section className="bg-[var(--text-primary)] text-white py-6 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div>
              <p className="font-semibold text-sm font-[family-name:var(--font-barlow)]">Thornfield Guest House</p>
              <p className="text-white/70 text-sm">Champagne Valley Road, Central Drakensberg, KwaZulu-Natal, 3363</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10">
              <a href="tel:+27360000000">+27 36 000 0000</a>
            </Button>
            <Button asChild size="sm">
              <Link href="/book">Book Now</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14">

          {/* Map placeholder */}
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[var(--text-primary)] mb-4">
              Where We Are
            </h2>
            <div className="relative h-80 rounded-2xl overflow-hidden border border-[var(--border)] shadow-md bg-[var(--bg-subtle)]">
              <Image
                src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=900&q=80"
                alt="Drakensberg landscape"
                fill
                className="object-cover opacity-50"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Map pin overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="bg-[var(--accent)] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-xl">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div className="bg-[var(--bg-surface)]/95 rounded-xl px-4 py-2 text-center shadow-lg">
                  <p className="font-[family-name:var(--font-barlow)] font-bold text-sm text-[var(--text-primary)]">Thornfield Guest House</p>
                  <p className="text-xs text-[var(--text-secondary)]">Central Drakensberg · S28°58ʹ · E29°24ʹ</p>
                </div>
                <a
                  href="https://maps.google.com/?q=Drakensberg+Guest+House+KwaZulu-Natal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[var(--accent)] text-white px-3 py-1.5 rounded-full hover:bg-[var(--accent-muted)] transition-colors font-medium"
                >
                  Open in Google Maps →
                </a>
              </div>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-2 text-center">GPS Coordinates: S 28°58ʹ12.4ʺ  E 29°24ʹ08.7ʺ</p>
          </div>

          {/* Nearby */}
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[var(--text-primary)] mb-4">
              What's Nearby
            </h2>
            <div className="space-y-3">
              {NEARBY.map((item) => (
                <div key={item.name} className="flex items-start gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--accent)]/40 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm text-[var(--text-primary)] font-[family-name:var(--font-barlow)]">{item.name}</p>
                      <span className="text-xs bg-[var(--bg-subtle)] text-[var(--text-secondary)] px-2 py-0.5 rounded-full shrink-0 ml-2">{item.distance}</span>
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Directions */}
      <section className="py-14 px-6 bg-[var(--bg-subtle)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-2 font-[family-name:var(--font-barlow)]">Getting Here</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[var(--text-primary)]">Directions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DIRECTIONS.map((dir) => (
              <Card key={dir.from} className="overflow-hidden">
                <div className="bg-[var(--text-primary)] text-white px-5 py-3 flex justify-between items-center">
                  <p className="font-[family-name:var(--font-barlow)] font-bold">{dir.from}</p>
                  <span className="text-[var(--accent)] text-sm font-semibold">{dir.time}</span>
                </div>
                <CardContent className="p-5">
                  <ol className="space-y-3">
                    {dir.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-[var(--text-secondary)]">
                        <span className="w-5 h-5 rounded-full bg-[var(--accent)] text-white text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </div>
          <Card className="mt-6 border-[var(--accent)]/30 bg-[var(--accent)]/5">
            <CardContent className="p-5 flex items-start gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <p className="text-sm text-[var(--text-secondary)]">
                <strong className="text-[var(--text-primary)]">Need help finding us?</strong> WhatsApp or call us on <strong>+27 36 000 0000</strong> and we'll guide you in. Last 5km is a gravel road — suitable for standard vehicles.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact strip */}
      <section className="py-12 px-6 bg-[var(--bg-surface)] border-t border-[var(--border)]">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>, label: "Phone", value: "+27 36 000 0000", href: "tel:+27360000000" },
            { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>, label: "Email", value: "info@thornfieldguesthouse.co.za", href: "mailto:info@thornfieldguesthouse.co.za" },
            { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>, label: "Address", value: "Champagne Valley Road, KZN, 3363", href: "#" },
          ].map(({ icon, label, value, href }) => (
            <a key={label} href={href} className="flex flex-col items-center gap-2 group">
              <div className="w-12 h-12 rounded-full bg-[var(--bg-subtle)] flex items-center justify-center group-hover:bg-[var(--accent)]/10 transition-colors">
                {icon}
              </div>
              <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide font-semibold font-[family-name:var(--font-barlow)]">{label}</p>
              <p className="text-sm text-[var(--text-primary)] font-medium">{value}</p>
            </a>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
