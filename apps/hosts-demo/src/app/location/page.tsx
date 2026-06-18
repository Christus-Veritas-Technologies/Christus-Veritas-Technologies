"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FadeUp, HeroReveal, StaggerContainer, StaggerItem, ScaleIn } from "@/components/Animate";
import { motion } from "framer-motion";

const ATTRACTIONS = [
  { name: "Nyanga", distance: "2.5km", icon: "🏔️", desc: "World-class hiking, mountain biking, and trout fishing in one of the Highlands' most scenic valleys." },
  { name: "Mtarazi Falls", distance: "25km", icon: "🎭", desc: "Zimbabwe's tallest waterfall, plunging into the Honde Valley — a must-see for any visitor to the Highlands." },
  { name: "Mount Nyangani", distance: "18km", icon: "⛰️", desc: "Zimbabwe's highest peak, with trails ranging from gentle walks to technical scrambles." },
  { name: "Nyanga National Park", distance: "40km", icon: "🦁", desc: "Wildlife reserve with eland, leopard, and a full birding checklist nearby." },
  { name: "Nyanga Town", distance: "30km", icon: "🛍️", desc: "Nearest town for supplies, ATMs, and the local crafts market." },
  { name: "Nyangombe River", distance: "4km", icon: "🌊", desc: "Swimming holes, kingfisher spotting, and beautiful riparian walks along the Nyangombe River." },
];

const DIRECTIONS = [
  {
    from: "Harare (approx. 4h 00min)",
    steps: [
      "Take the A15 east towards Nyanga",
      "Continue through Rusape and on towards Juliasdale",
      "Follow signs through Nyanga town (approx. 30km)",
      "Turn onto the road towards Nyanga National Park",
      "Thornfield is 2.5km on the right — look for the wooden signage",
    ],
  },
  {
    from: "Mutare (approx. 1h 30min)",
    steps: [
      "Take the A14 north towards Nyanga",
      "Continue via Juliasdale",
      "Follow signs towards Nyanga town on the main road",
      "Continue 30km through Nyanga town",
      "Thornfield is 2.5km past the national park junction",
    ],
  },
];

export default function LocationPage() {
  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end pb-16 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&q=85" alt="Eastern Highlands from above" fill priority className="object-cover scale-105" sizes="100vw" />
        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
          <HeroReveal delay={0.1}>
            <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 font-[family-name:var(--font-barlow)]">Location</p>
          </HeroReveal>
          <HeroReveal delay={0.25}>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-medium text-white leading-tight mb-4">
              Find Us in the Highlands
            </h1>
          </HeroReveal>
          <HeroReveal delay={0.4}>
            <p className="text-white/70 text-lg max-w-lg">Nyanga, Eastern Highlands — 4 hours from Harare, 1.5 hours from Mutare.</p>
          </HeroReveal>
        </div>
      </section>

      {/* ── MAP + ADDRESS ── */}
      <section className="py-20 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          <ScaleIn>
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-xl border border-[var(--border)]">
              <Image src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=900&q=80" alt="Map area" fill className="object-cover opacity-70" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-[var(--bg-subtle)]/30" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                  className="bg-[var(--accent)] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl mb-3"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                </motion.div>
                <div className="bg-[var(--bg-surface)]/95 backdrop-blur-sm rounded-2xl px-5 py-3 shadow-xl text-center">
                  <p className="font-[family-name:var(--font-barlow)] font-bold text-[var(--text-primary)] text-sm">Thornfield Guest House</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">Nyanga, Zimbabwe</p>
                </div>
              </div>
            </div>
          </ScaleIn>

          <FadeUp>
            <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-4 font-[family-name:var(--font-barlow)]">Address</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-medium text-[var(--text-primary)] mb-6 leading-tight">
              Nyanga,<br /><span className="italic">Eastern Highlands</span>
            </h2>

            <div className="space-y-4 text-sm text-[var(--text-secondary)]">
              {[
                { icon: "📍", label: "Address", value: "12 Thornfield Road, Nyanga, Manicaland" },
                { icon: "📞", label: "Phone", value: "+263 29 812 3456" },
                { icon: "✉️", label: "Email", value: "hello@thornfieldguesthouse.co.zw" },
                { icon: "🕐", label: "Check-in", value: "From 14:00 | Check-out by 11:00" },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <span className="text-base mt-0.5 shrink-0">{icon}</span>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)] font-[family-name:var(--font-barlow)] text-xs uppercase tracking-wide mb-0.5">{label}</p>
                    <p>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Button asChild><Link href="/book">Book Your Stay</Link></Button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── ATTRACTIONS ── */}
      <section className="py-20 px-6 bg-[var(--bg-subtle)]">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 font-[family-name:var(--font-barlow)]">Nearby</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium text-[var(--text-primary)] leading-tight">What's Around You</h2>
            <div className="w-12 h-0.5 bg-[var(--accent)] mx-auto mt-5" />
          </FadeUp>
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ATTRACTIONS.map((a) => (
              <StaggerItem key={a.name}>
                <Card className="hover:shadow-md transition-shadow group">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center text-xl shrink-0 group-hover:bg-[var(--accent)]/20 transition-colors">{a.icon}</div>
                      <div>
                        <div className="flex items-baseline gap-2 mb-1">
                          <h3 className="font-[family-name:var(--font-barlow)] font-bold text-[var(--text-primary)]">{a.name}</h3>
                          <span className="text-xs text-[var(--accent)] font-semibold">{a.distance}</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{a.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── DIRECTIONS ── */}
      <section className="py-20 px-6 bg-[var(--bg-surface)]">
        <div className="max-w-4xl mx-auto">
          <FadeUp className="text-center mb-14">
            <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 font-[family-name:var(--font-barlow)]">Getting Here</p>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-medium text-[var(--text-primary)]">Directions</h2>
            <div className="w-12 h-0.5 bg-[var(--accent)] mx-auto mt-5" />
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DIRECTIONS.map((dir) => (
              <FadeUp key={dir.from}>
                <Card>
                  <CardContent className="p-7">
                    <h3 className="font-[family-name:var(--font-barlow)] font-bold text-[var(--text-primary)] mb-5 flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[var(--accent)] text-white text-xs flex items-center justify-center">🚗</span>
                      From {dir.from}
                    </h3>
                    <ol className="space-y-3">
                      {dir.steps.map((step, i) => (
                        <li key={i} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                          <span className="w-5 h-5 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </CardContent>
                </Card>
              </FadeUp>
            ))}
          </div>

          <FadeUp delay={0.2} className="mt-8">
            <Card className="bg-[var(--accent)]/5 border-[var(--accent)]/20">
              <CardContent className="p-6 flex gap-4 items-start">
                <span className="text-2xl">📌</span>
                <div>
                  <p className="font-[family-name:var(--font-barlow)] font-bold text-[var(--text-primary)] mb-1">Need help finding us?</p>
                  <p className="text-sm text-[var(--text-secondary)]">Call us on <strong>+263 29 812 3456</strong> or WhatsApp — we're happy to guide you in. Free on-site parking available for all guests.</p>
                </div>
              </CardContent>
            </Card>
          </FadeUp>
        </div>
      </section>

      <Footer />
    </>
  );
}
