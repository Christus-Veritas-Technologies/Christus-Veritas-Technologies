import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-[var(--text-primary)] text-white/70">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="font-[family-name:var(--font-barlow)] font-black text-lg text-white tracking-tight">Thornfield</p>
          <p className="font-[family-name:var(--font-playfair)] italic text-[var(--accent)] text-sm mb-4">Guest House</p>
          <p className="text-sm leading-relaxed">
            Warm hospitality in the heart of the Drakensberg. Direct bookings, no commission.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <p className="text-white font-semibold font-[family-name:var(--font-barlow)] mb-4 text-sm uppercase tracking-wider">Explore</p>
          <ul className="space-y-2 text-sm">
            {[["Home", "/"], ["Rooms", "/rooms"], ["Gallery", "/gallery"], ["Location", "/location"]].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-white font-semibold font-[family-name:var(--font-barlow)] mb-4 text-sm uppercase tracking-wider">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>+27 36 000 0000</li>
            <li>info@thornfieldguesthouse.co.za</li>
            <li>Drakensberg, KwaZulu-Natal</li>
            <li>South Africa</li>
          </ul>
        </div>

        {/* Book */}
        <div>
          <p className="text-white font-semibold font-[family-name:var(--font-barlow)] mb-4 text-sm uppercase tracking-wider">Book Direct</p>
          <p className="text-sm mb-4">Skip the middleman. Book directly and pay us — zero commission, best rates guaranteed.</p>
          <Link
            href="/book"
            className="inline-block bg-[var(--accent)] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[var(--accent-muted)] transition-colors font-[family-name:var(--font-barlow)]"
          >
            Book Now →
          </Link>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
        <p>© {new Date().getFullYear()} Thornfield Guest House. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="/dashboard" className="hover:text-white transition-colors">Host Dashboard</Link>
          <Link href="/book" className="hover:text-white transition-colors">Book a Room</Link>
        </div>
      </div>
    </footer>
  );
}
