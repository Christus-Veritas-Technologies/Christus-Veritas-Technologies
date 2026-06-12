"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu01Icon, Cancel01Icon } from "@/components/icons";
import { CvtLogo } from "./cvt-logo";

const NAV_LINKS = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Packages", href: "/packages" },
  { label: "Compare", href: "/compare" },
  { label: "See Demo", href: "/demo" },
  { label: "Contact", href: "/contact" },
];

const WA_LINK =
  "https://wa.me/27000000000?text=Hi%20CVT%20Hosts%2C%20I%27d%20like%20to%20know%20more%20about%20your%20packages.";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4 pb-0">
      {/* Floating card */}
      <div
        className="mx-auto flex h-[60px] max-w-[1100px] items-center justify-between rounded-xl border px-5"
        style={{
          background: "color-mix(in srgb, var(--bg-surface) 92%, transparent)",
          borderColor: "var(--border)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.18)",
        }}
      >
        {/* Logo */}
        <CvtLogo />

        {/* Desktop nav — centered */}
        <nav className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-opacity hover:opacity-60"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: pathname === link.href ? 600 : 400,
                color: pathname === link.href ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm transition-opacity hover:opacity-60"
            style={{ fontFamily: "var(--font-barlow)", color: "var(--text-secondary)" }}
          >
            WhatsApp
          </a>
          <Link
            href="/contact"
            className="rounded-lg px-4 py-2 text-sm font-semibold transition-opacity hover:opacity-90"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 700,
              background: "var(--accent)",
              color: "var(--text-inverse)",
            }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-sm"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          style={{ color: "var(--text-primary)" }}
        >
          {open ? <Cancel01Icon size={22} /> : <Menu01Icon size={22} />}
        </button>
      </div>

      {/* Mobile drawer — outside the card, flush below */}
      {open && (
        <div
          className="md:hidden mx-auto max-w-[1100px] rounded-b-xl border border-t-0 px-5 py-4"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
        >
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-1.5 text-sm"
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "var(--font-barlow)",
                  color: pathname === link.href ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 rounded-lg px-5 py-2.5 text-sm text-center font-bold"
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--font-barlow)",
                background: "var(--accent)",
                color: "var(--text-inverse)",
              }}
            >
              Get Started
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
