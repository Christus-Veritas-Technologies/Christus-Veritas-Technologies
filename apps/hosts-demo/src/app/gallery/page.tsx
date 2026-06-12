"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CATEGORIES = ["All", "Rooms", "Garden", "Dining", "Views", "Amenities"];

const PHOTOS = [
  { src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85", alt: "Garden Suite interior", category: "Rooms", span: "col-span-2 row-span-2" },
  { src: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=700&q=85", alt: "Mountain View Room", category: "Rooms", span: "" },
  { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=85", alt: "Drakensberg panorama", category: "Views", span: "" },
  { src: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=700&q=85", alt: "Family Room", category: "Rooms", span: "" },
  { src: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=700&q=85", alt: "Executive Suite", category: "Rooms", span: "" },
  { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85", alt: "Mountain views at dawn", category: "Views", span: "col-span-2" },
  { src: "https://images.unsplash.com/photo-1585543805890-6051f7829f98?w=700&q=85", alt: "Garden path", category: "Garden", span: "" },
  { src: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=700&q=85", alt: "Cosy bedroom details", category: "Rooms", span: "" },
  { src: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&q=85", alt: "Breakfast table", category: "Dining", span: "" },
  { src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=700&q=85", alt: "Home-cooked breakfast", category: "Dining", span: "" },
  { src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=700&q=85", alt: "Fireplace lounge", category: "Amenities", span: "" },
  { src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=700&q=85", alt: "En-suite bathroom", category: "Amenities", span: "" },
  { src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=700&q=85", alt: "Bed detail", category: "Rooms", span: "" },
  { src: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=900&q=85", alt: "Berg sunset", category: "Views", span: "col-span-2" },
  { src: "https://images.unsplash.com/photo-1585088826927-9e0f2c4b5e2f?w=700&q=85", alt: "Garden seating", category: "Garden", span: "" },
  { src: "https://images.unsplash.com/photo-1490750967868-88df5691cc97?w=700&q=85", alt: "Morning garden", category: "Garden", span: "" },
];

export default function GalleryPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = active === "All" ? PHOTOS : PHOTOS.filter((p) => p.category === active);

  function prev() {
    setLightbox((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }
  function next() {
    setLightbox((i) => (i === null ? null : (i + 1) % filtered.length));
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative h-56 flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=80"
          alt="Gallery hero"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10 w-full">
          <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-1 font-[family-name:var(--font-barlow)]">Photo Gallery</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-white font-medium">Life at Thornfield</h1>
        </div>
      </section>

      {/* Filter tabs */}
      <section className="sticky top-16 z-40 bg-[var(--bg-surface)]/95 backdrop-blur-md border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium font-[family-name:var(--font-barlow)] whitespace-nowrap transition-colors ${
                active === cat
                  ? "bg-[var(--accent)] text-white"
                  : "bg-[var(--bg-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Masonry grid */}
      <section className="py-12 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] gap-3">
          {filtered.map((photo, i) => (
            <div
              key={photo.src}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${photo.span}`}
              onClick={() => setLightbox(i)}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-end p-3">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
                  {photo.alt}
                </span>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Badge className="bg-[var(--bg-surface)]/90 text-[var(--text-primary)] border-0 text-xs">{photo.category}</Badge>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-6 bg-[var(--bg-subtle)] text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[var(--text-primary)] mb-3">
          Like What You See?
        </h2>
        <p className="text-[var(--text-secondary)] mb-6">Book directly and experience it for yourself.</p>
        <Button asChild size="lg">
          <Link href="/book">Reserve Your Room</Link>
        </Button>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full aspect-[4/3]" onClick={(e) => e.stopPropagation()}>
            <Image
              src={filtered[lightbox].src.replace("w=700", "w=1200").replace("w=900", "w=1400")}
              alt={filtered[lightbox].alt}
              fill
              className="object-contain rounded-lg"
              sizes="90vw"
            />
          </div>
          <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </button>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 rounded-full bg-black/40">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {filtered[lightbox].alt} · {lightbox + 1} / {filtered.length}
          </p>
        </div>
      )}

      <Footer />
    </>
  );
}
