import React from "react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer className="bg-[var(--text-primary)] text-white/60">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-10 grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Brand */}
        <div className="md:col-span-4">
          <div className="mb-5">
            <p className="font-[family-name:var(--font-barlow)] font-black text-xl text-white tracking-tight leading-none">Thornfield</p>
            <p className="font-[family-name:var(--font-playfair)] italic text-[var(--accent)] text-base">Guest House</p>
          </div>
          <p className="text-sm leading-relaxed mb-6">
            Warm hospitality in the heart of the Drakensberg. Direct bookings, no commission, best rates guaranteed.
          </p>
          <div className="flex gap-4 text-xs text-white/40">
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              Est. 2009
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
              Champagne Valley, KZN
            </span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2">
          <p className="text-white font-bold font-[family-name:var(--font-barlow)] mb-5 text-xs uppercase tracking-[0.15em]">Explore</p>
          <ul className="space-y-2.5 text-sm">
            {[["Home", "/"], ["Rooms", "/rooms"], ["Gallery", "/gallery"], ["Location", "/location"]].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors duration-150">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Book */}
        <div className="md:col-span-2">
          <p className="text-white font-bold font-[family-name:var(--font-barlow)] mb-5 text-xs uppercase tracking-[0.15em]">Book</p>
          <ul className="space-y-2.5 text-sm">
            {[["Book a Room", "/book"], ["Garden Suite", "/book?room=garden-suite"], ["Mountain View", "/book?room=mountain-view"], ["Family Room", "/book?room=family-room"]].map(([label, href]) => (
              <li key={href}>
                <Link href={href} className="hover:text-white transition-colors duration-150">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact + CTA */}
        <div className="md:col-span-4">
          <p className="text-white font-bold font-[family-name:var(--font-barlow)] mb-5 text-xs uppercase tracking-[0.15em]">Contact</p>
          <ul className="space-y-2 text-sm mb-6">
            <li className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[var(--accent)]"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.9 13.5 19.79 19.79 0 0 1 1.94 4.9 2 2 0 0 1 3.9 2.72h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              +27 36 468 1234
            </li>
            <li className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[var(--accent)]"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              hello@thornfieldguesthouse.co.za
            </li>
            <li className="flex items-center gap-2">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-[var(--accent)]"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              Champagne Valley, 3318
            </li>
          </ul>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 bg-[var(--accent)] text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-[var(--accent-muted)] transition-colors font-[family-name:var(--font-barlow)]"
          >
            Book Direct — Best Rate
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
          </Link>
        </div>
      </div>

      <Separator className="bg-white/10" />

      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/30">
        <p>© {new Date().getFullYear()} Thornfield Guest House. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/dashboard" className="hover:text-white/60 transition-colors">Host Dashboard</Link>
          <span className="text-white/15">·</span>
          <Link href="/book" className="hover:text-white/60 transition-colors">Book a Room</Link>
        </div>
      </div>
    </footer>
  );
}
