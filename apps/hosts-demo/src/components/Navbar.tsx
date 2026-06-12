"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Rooms" },
  { href: "/gallery", label: "Gallery" },
  { href: "/location", label: "Location" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--bg-surface)]/95 backdrop-blur-md shadow-sm border-b border-[var(--border)]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2">
          <span
            className={cn(
              "font-[family-name:var(--font-barlow)] font-black text-xl tracking-tight transition-colors",
              scrolled ? "text-[var(--text-primary)]" : "text-white"
            )}
          >
            Thornfield
          </span>
          <span
            className={cn(
              "font-[family-name:var(--font-playfair)] text-sm italic transition-colors",
              scrolled ? "text-[var(--accent)]" : "text-[var(--accent)]"
            )}
          >
            Guest House
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium font-[family-name:var(--font-barlow)] transition-colors",
                pathname === link.href
                  ? "text-[var(--accent)]"
                  : scrolled
                  ? "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  : "text-white/80 hover:text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Button asChild size="sm" variant={scrolled ? "default" : "outline"} className={cn(!scrolled && "border-white text-white hover:bg-white hover:text-[var(--text-primary)]")}>
            <Link href="/book">Book Now</Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className={cn(scrolled ? "text-[var(--text-secondary)]" : "text-white/80 hover:text-white hover:bg-white/10")}>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className={cn("md:hidden p-2 rounded-md", scrolled ? "text-[var(--text-primary)]" : "text-white")}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--bg-surface)] border-t border-[var(--border)] px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "text-sm font-medium py-1 font-[family-name:var(--font-barlow)]",
                pathname === link.href ? "text-[var(--accent)]" : "text-[var(--text-primary)]"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Button asChild size="sm" className="flex-1">
              <Link href="/book" onClick={() => setMobileOpen(false)}>Book Now</Link>
            </Button>
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>Dashboard</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
