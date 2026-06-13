"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FadeUp, HeroReveal, StaggerContainer, StaggerItem, ScaleIn } from "@/components/Animate";
import { motion } from "framer-motion";

const ROOMS = [
  {
    id: "garden-suite",
    name: "Garden Suite",
    category: "Suite",
    rate: 950,
    capacity: 2,
    size: "28m²",
    bedType: "Queen Bed",
    description: "A serene retreat that opens directly onto our manicured garden. This suite blends indoor comfort with outdoor living — your private patio becomes a natural extension of the room.",
    longDesc: "Wake to birdsong and garden fragrance. The Garden Suite features a plush queen bed with premium linen, an en-suite shower and soaking tub, and direct patio access with garden furniture for morning coffee or sunset wine. The wood-burning fireplace makes it perfect for winter getaways.",
    amenities: ["Private patio", "En-suite bathroom", "Soaking tub", "Fireplace", "Garden access", "Wi-Fi", "Aircon", "Tea & coffee station"],
    photos: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=80",
      "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=80",
    ],
  },
  {
    id: "mountain-view",
    name: "Mountain View Room",
    category: "Deluxe",
    rate: 1200,
    capacity: 2,
    size: "34m²",
    bedType: "King Bed",
    description: "Floor-to-ceiling windows frame an uninterrupted Drakensberg panorama. The finest room in the house for views — especially at sunrise.",
    longDesc: "The Mountain View Room sits at the highest point of the property, offering breathtaking vistas of the Berg escarpment. A king-sized bed, walk-in rain shower, and generous private balcony make this the choice for anniversaries, honeymoons, or anyone who deserves to be spoiled.",
    amenities: ["Private balcony", "Mountain views", "King bed", "Rain shower", "Mini-bar", "Wi-Fi", "Aircon", "Plunge pool access"],
    photos: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&q=80",
    ],
  },
  {
    id: "family-room",
    name: "Family Room",
    category: "Family",
    rate: 1800,
    capacity: 4,
    size: "52m²",
    bedType: "2× Queen Beds",
    description: "Our largest room, designed for families. Two queen beds, a kitchenette, and direct access to the pool and garden make this the home-away-from-home for family stays.",
    longDesc: "Give the family room to breathe. Two separate sleeping zones, a fully equipped kitchenette for snacks and meals, and its own entrance mean privacy and flexibility. Kids will love the garden and pool access; parents will love the king-sized comfort and spa bathroom.",
    amenities: ["2× Queen beds", "Kitchenette", "Pool access", "Garden view", "Spa bathroom", "Kids toys available", "Wi-Fi", "Aircon"],
    photos: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=80",
    ],
  },
  {
    id: "honeymoon-suite",
    name: "Honeymoon Suite",
    category: "Luxury",
    rate: 2200,
    capacity: 2,
    size: "60m²",
    bedType: "Super King Bed",
    description: "The pinnacle of Thornfield luxury. Private plunge pool, four-poster bed, and a butler breakfast service make this the ultimate romantic retreat.",
    longDesc: "Designed entirely around romance and indulgence. A four-poster super-king bed dressed in Egyptian cotton, a private heated plunge pool on your terrace, a deep-soak double bathtub, and in-room butler breakfast service. Complimentary bottle of local MCC on arrival.",
    amenities: ["Private plunge pool", "Four-poster bed", "Double bath", "Butler breakfast", "Champagne on arrival", "Wi-Fi", "Aircon", "Fireplace"],
    photos: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=900&q=80",
      "https://images.unsplash.com/photo-1455587734955-081b22074882?w=900&q=80",
    ],
  },
];

function AmenityIcon() {
  return (
    <div className="w-4 h-4 rounded-full bg-[var(--accent)]/15 flex items-center justify-center shrink-0">
      <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
    </div>
  );
}

export default function RoomsPage() {
  const [activePhotos, setActivePhotos] = useState<Record<string, number>>({});

  function setPhoto(roomId: string, idx: number) {
    setActivePhotos((prev) => ({ ...prev, [roomId]: idx }));
  }

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative h-[55vh] min-h-[400px] flex items-end pb-16 overflow-hidden">
        <Image src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600&q=85" alt="Rooms hero" fill priority className="object-cover scale-105" sizes="100vw" />
        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
        <div className="relative z-10 max-w-5xl mx-auto px-6 w-full">
          <HeroReveal delay={0.1}>
            <p className="text-xs font-bold text-[var(--accent)] uppercase tracking-[0.2em] mb-3 font-[family-name:var(--font-barlow)]">Our Rooms</p>
          </HeroReveal>
          <HeroReveal delay={0.25}>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-medium text-white leading-tight mb-4">
              Rooms &amp; Suites
            </h1>
          </HeroReveal>
          <HeroReveal delay={0.4}>
            <p className="text-white/70 text-lg max-w-lg">Every room is thoughtfully furnished and designed for rest, romance, or family memories.</p>
          </HeroReveal>
        </div>
      </section>

      {/* ── ROOMS ── */}
      <section className="py-20 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto space-y-20">
          {ROOMS.map((room, i) => {
            const photoIdx = activePhotos[room.id] ?? 0;
            return (
              <FadeUp key={room.id} delay={0.05}>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-lg border border-[var(--border)] ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  {/* Image panel */}
                  <ScaleIn delay={0.1}>
                    <div className="relative h-80 md:h-full min-h-[320px] bg-[var(--bg-subtle)]">
                      <Image src={room.photos[photoIdx]} alt={`${room.name} photo ${photoIdx + 1}`} fill className="object-cover transition-all duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
                      {/* Thumbnail strip */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {room.photos.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setPhoto(room.id, idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-200 ${idx === photoIdx ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"}`}
                          />
                        ))}
                      </div>
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-[var(--bg-surface)]/95 text-[var(--text-primary)] border border-[var(--border)] shadow-sm">{room.category}</Badge>
                      </div>
                    </div>
                  </ScaleIn>

                  {/* Content panel */}
                  <div className="p-8 md:p-10 bg-[var(--bg-surface)] flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-5">
                        <div>
                          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[var(--text-primary)] mb-1">{room.name}</h2>
                          <div className="flex gap-4 text-sm text-[var(--text-secondary)]">
                            <span className="flex items-center gap-1.5">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                              Up to {room.capacity} guests
                            </span>
                            <span>{room.bedType}</span>
                            <span>{room.size}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0 ml-4">
                          <p className="font-[family-name:var(--font-barlow)] font-black text-3xl text-[var(--accent)]">R{room.rate.toLocaleString("en-ZA")}</p>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5">per night</p>
                        </div>
                      </div>

                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">{room.longDesc}</p>

                      <Separator className="mb-6" />

                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3 font-[family-name:var(--font-barlow)]">Room Amenities</p>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          {room.amenities.map((amenity) => (
                            <div key={amenity} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                              <AmenityIcon />
                              {amenity}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-8">
                      <Button asChild className="flex-1">
                        <Link href={`/book?room=${room.id}`}>Book This Room</Link>
                      </Button>
                      <Button asChild variant="outline">
                        <Link href="/gallery">View Photos</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </FadeUp>
            );
          })}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-16 px-6 bg-[var(--bg-subtle)]">
        <FadeUp className="max-w-2xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-medium text-[var(--text-primary)] mb-3">Not sure which room?</h2>
          <p className="text-[var(--text-secondary)] mb-7">Our booking page lets you compare and select the perfect room for your stay.</p>
          <Button asChild size="lg"><Link href="/book">Start Your Booking</Link></Button>
        </FadeUp>
      </section>

      <Footer />
    </>
  );
}
