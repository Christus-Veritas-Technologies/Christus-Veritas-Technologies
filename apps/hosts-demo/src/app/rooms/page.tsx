"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ROOMS = [
  {
    id: "garden-suite",
    slug: "garden-suite",
    name: "Garden Suite",
    category: "Suite",
    rate: 950,
    capacity: 2,
    bedType: "Queen Bed",
    sqm: 32,
    description:
      "The Garden Suite is a tranquil retreat with direct access to our manicured cottage garden. Wake up to birdsong, step onto your private patio with a cup of coffee, and let the Berg work its magic. The suite features a king-sized bed, an en-suite bathroom with a deep soaking tub, and warm natural materials throughout.",
    longDesc:
      "Ideal for couples seeking a romantic escape, the Garden Suite offers a peaceful sanctuary away from the main house. The private patio has outdoor seating and is surrounded by indigenous plantings. Inside, you'll find a fireplace for chilly mountain evenings, quality linen, and thoughtful details like fresh flowers and locally sourced toiletries.",
    amenities: ["Private patio", "En-suite bathroom", "Soaking tub", "Fireplace", "Garden views", "Wi-Fi", "Tea & coffee station", "Fresh flowers"],
    photos: [
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=900&q=85",
      "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=85",
    ],
  },
  {
    id: "mountain-view",
    slug: "mountain-view",
    name: "Mountain View Room",
    category: "Deluxe",
    rate: 1200,
    capacity: 2,
    bedType: "King Bed",
    sqm: 38,
    description:
      "The Mountain View Room is our most popular choice — and for good reason. Floor-to-ceiling glass doors open onto a private balcony with uninterrupted views of the Drakensberg range. It's the kind of view that stops you mid-sentence.",
    longDesc:
      "Furnished with premium linen, a king-sized bed, and subtle mountain-inspired décor, this room balances luxury with a sense of place. The en-suite bathroom features a rainfall shower. Arrive on a clear morning and you may see Champagne Castle dusted with snow.",
    amenities: ["Private balcony", "Mountain views", "King bed", "Rainfall shower", "Mini-bar", "Wi-Fi", "Luxury linen", "Binoculars provided"],
    photos: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=900&q=85",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=85",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=900&q=85",
    ],
  },
  {
    id: "family-room",
    slug: "family-room",
    name: "Family Room",
    category: "Family",
    rate: 1800,
    capacity: 4,
    bedType: "2× Queen Beds",
    sqm: 54,
    description:
      "Our Family Room is built for families who don't want to compromise on comfort. Two queen beds, a kitchenette stocked with basics, and direct garden access make this the ideal base for a family Drakensberg adventure.",
    longDesc:
      "The kids will love the garden, the pool access, and the small toy basket we keep stocked with books and games. Parents will appreciate the separate seating area, the extra storage, and the full en-suite bathroom with both bath and shower. Cots and high chairs can be arranged on request.",
    amenities: ["2× Queen beds", "Kitchenette", "Pool access", "Garden access", "En-suite bath & shower", "Wi-Fi", "Kids toys & books", "Cot on request"],
    photos: [
      "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=900&q=85",
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=900&q=85",
      "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=900&q=85",
    ],
  },
  {
    id: "executive-suite",
    slug: "executive-suite",
    name: "Executive Suite",
    category: "Suite",
    rate: 2200,
    capacity: 2,
    bedType: "King Bed",
    sqm: 65,
    description:
      "The Executive Suite is our finest room — a spacious, light-drenched sanctuary with a private lounge, a dressing room, and spectacular wraparound mountain and garden views. If you're celebrating something special, this is the room.",
    longDesc:
      "A bottle of Méthode Cap Classique awaits on arrival. The suite has a private entrance, a plunge pool accessible from the bedroom, and a spa bathroom with a double vanity, freestanding bath, and heated towel rails. Full butler service is available on request.",
    amenities: ["Private lounge", "Plunge pool", "Spa bathroom", "Freestanding bath", "Dressing room", "Butler service", "Welcome MCC", "Private entrance"],
    photos: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=900&q=85",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=900&q=85",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=900&q=85",
    ],
  },
];

function RoomCard({ room }: { room: typeof ROOMS[0] }) {
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-surface)] shadow-sm hover:shadow-md transition-shadow">
      {/* Images — 40% */}
      <div className="lg:col-span-2 relative">
        <div className="relative h-72 lg:h-full min-h-[280px]">
          <Image
            src={room.photos[activePhoto]}
            alt={room.name}
            fill
            className="object-cover transition-opacity duration-300"
            sizes="(max-width: 1024px) 100vw, 40vw"
          />
          {/* Photo thumbnails */}
          <div className="absolute bottom-3 left-3 flex gap-1.5">
            {room.photos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActivePhoto(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === activePhoto ? "bg-white scale-125" : "bg-white/50"}`}
              />
            ))}
          </div>
          <div className="absolute top-3 left-3">
            <Badge className="bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--border)]">{room.category}</Badge>
          </div>
        </div>
      </div>

      {/* Content — 60% */}
      <div className="lg:col-span-3 p-7 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-[var(--text-primary)]">{room.name}</h2>
            <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)] mt-1">
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Up to {room.capacity} guests
              </span>
              <span>{room.bedType}</span>
              <span>{room.sqm}m²</span>
            </div>
          </div>
          <div className="text-right shrink-0 ml-4">
            <p className="font-[family-name:var(--font-barlow)] font-black text-2xl text-[var(--accent)]">
              R{room.rate.toLocaleString("en-ZA")}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">per night</p>
          </div>
        </div>

        <p className="text-sm text-[var(--text-secondary)] mb-3 leading-relaxed">{room.description}</p>
        <p className="text-sm text-[var(--text-secondary)] mb-5 leading-relaxed">{room.longDesc}</p>

        <Separator className="mb-4" />

        {/* Amenities */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-2 font-[family-name:var(--font-barlow)]">Included</p>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((a) => (
              <span key={a} className="text-xs bg-[var(--bg-subtle)] text-[var(--text-secondary)] px-2.5 py-1 rounded-full border border-[var(--border)]">
                {a}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-auto">
          <Button asChild className="flex-1">
            <Link href={`/book?room=${room.slug}`}>Book This Room</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/book">Check Dates</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function RoomsPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="relative h-64 flex items-end overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1400&q=80"
          alt="Thornfield rooms"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-10 w-full">
          <p className="text-sm font-semibold text-[var(--accent)] uppercase tracking-widest mb-1 font-[family-name:var(--font-barlow)]">Our Accommodation</p>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl text-white font-medium">Rooms & Suites</h1>
        </div>
      </section>

      {/* Rooms list */}
      <section className="py-16 px-6 bg-[var(--bg-primary)]">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          {ROOMS.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>

      {/* CTA bar */}
      <section className="bg-[var(--accent)] py-12 px-6 text-white text-center">
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-medium mb-3">Not Sure Which Room?</h2>
        <p className="text-white/80 mb-6 max-w-md mx-auto text-sm">
          Use our booking form to see availability across all rooms for your preferred dates.
        </p>
        <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-[var(--accent)]">
          <Link href="/book">Check All Availability</Link>
        </Button>
      </section>

      <Footer />
    </>
  );
}
