"use client";
import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FadeUp, HeroReveal, StaggerContainer, StaggerItem } from "@/components/Animate";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORIES = ["All", "Rooms", "Garden", "Dining", "Views", "Amenities"] as const;
type Category = (typeof CATEGORIES)[number];

const IMAGES: { src: string; alt: string; category: Exclude<Category, "All">; wide?: boolean }[] = [
  { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80", alt: "Garden Suite bedroom", category: "Rooms", wide: true },
  { src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&q=80", alt: "Mountain View Room", category: "Rooms" },
  { src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80", alt: "Family Room", category: "Rooms" },
  { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80", alt: "Honeymoon Suite", category: "Rooms", wide: true },
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80", alt: "Drakensberg mountains", category: "Views", wide: true },
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80", alt: "Mountain panorama", category: "Views" },
  { src: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80", alt: "Valley view", category: "Views" },
  { src: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80", alt: "Garden blooms", category: "Garden" },
  { src: "https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=800&q=80", alt: "Garden path", category: "Garden", wide: true },
  { src: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&q=80", alt: "Garden seating", category: "Garden" },
  { src: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800&q=80", alt: "Breakfast spread", category: "Dining", wide: true },
  { src: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80", alt: "Dining room", category: "Dining" },
  { src: "https://images.unsplash.com/photo-1530648672449-81f6c723e2f1?w=800&q=80", alt: "Morning coffee", category: "Dining" },
  { src: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80", alt: "Pool deck", category: "Amenities", wide: true },
  { src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80", alt: "Spa bathroom", category: "Amenities" },
  { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&q=80", alt: "Fireplace lounge", category: "Amenities" },
];

export default function GalleryPage() {
  const [active, setActive] = useState<Category>("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === "All" ? IMAGES : IMAGES.filter((img) => img.category === active);

  function prev() {
    if (lightbox === null) return;
    setLightbox((lightbox - 1 + filtered.length) % filtered.length);
  }
  function next() {
    if (lightbox === null) return;
    setLightbox((lightbox + 1) % filtered.length);
  }

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[55vh] min-h-[380px] flex items-end pb-16 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=85" alt="Gallery hero" fill priority className="object-cover scale-105" sizes="100vw" />
        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
          <HeroReveal delay={0.1}>
            <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 font-[family-name:var(--font-barlow)]">Gallery</p>
          </HeroReveal>
          <HeroReveal delay={0.25}>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-medium text-white leading-tight mb-4">
              See Thornfield
            </h1>
          </HeroReveal>
          <HeroReveal delay={0.4}>
            <p className="text-white/70 text-lg max-w-md">Rooms, gardens, views, and the moments that make a stay unforgettable.</p>
          </HeroReveal>
        </div>
      </section>

      {/* ── FILTER TABS ── */}
      <section className="sticky top-16 z-30 bg-[var(--bg-surface)]/95 backdrop-blur-sm border-b border-[var(--border)] py-4 px-6">
        <div className="max-w-6xl mx-auto flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium font-[family-name:var(--font-barlow)] transition-all duration-200 ${
                active === cat
                  ? "bg-[var(--accent)] text-white shadow-sm"
                  : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── MASONRY GRID ── */}
      <section className="py-12 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            layout
            className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <motion.div
                  key={img.src}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className={`relative overflow-hidden rounded-2xl cursor-pointer group break-inside-avoid ${img.wide ? "aspect-[4/3]" : "aspect-square"}`}
                  onClick={() => setLightbox(i)}
                >
                  <Image src={img.src} alt={img.alt} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3 shadow">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m21 21-4.35-4.35"/><circle cx="11" cy="11" r="8"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-black/70 text-white text-xs px-2.5 py-1 rounded-full font-[family-name:var(--font-barlow)]">{img.category}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              className="relative w-full max-w-4xl mx-4 aspect-[4/3]"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={filtered[lightbox].src} alt={filtered[lightbox].alt} fill className="object-contain" sizes="100vw" />
            </motion.div>

            {/* Nav */}
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full p-3 transition-colors">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
            </button>

            {/* Close */}
            <button onClick={() => setLightbox(null)} className="absolute top-5 right-5 bg-white/10 hover:bg-white/25 text-white rounded-full p-2 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>

            {/* Counter */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/60 text-white/80 text-sm px-4 py-1.5 rounded-full font-[family-name:var(--font-barlow)]">
              {lightbox + 1} / {filtered.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}
