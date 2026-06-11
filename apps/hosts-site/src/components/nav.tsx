"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu01Icon, Cancel01Icon } from "hugeicons-react";
import { CvtLogo } from "./cvt-logo";

const NAV_LINKS = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Packages", href: "/packages" },
  { label: "Compare", href: "/compare" },
  { label: "See Demo", href: "/demo" },
];

const WA_LINK =
  "https://wa.me/27000000000?text=Hi%20CVT%20Hosts%2C%20I%27d%20like%20to%20know%20more%20about%20your%20packages.";

export function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="sticky top-0 z-50 w-full border-b"
      style={{
        background: "var(--bg-primary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
        {/* Logo */}
        <CvtLogo />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors"
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 400,
                color: pathname === link.href ? "var(--text-primary)" : "var(--text-secondary)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-[4px] px-8 py-3.5 text-sm transition-colors"
            style={{
              fontFamily: "var(--font-barlow)",
              fontWeight: 700,
              letterSpacing: "0.05em",
              background: "var(--accent)",
              color: "var(--text-inverse)",
            }}
          >
            Get Started
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-sm"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          style={{ color: "var(--text-primary)" }}
        >
          {open ? <Cancel01Icon size={24} /> : <Menu01Icon size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
        >
          <nav className="flex flex-col px-6 py-4 gap-4" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="py-2 text-sm"
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: "var(--font-barlow)",
                  fontWeight: 400,
                  color: pathname === link.href ? "var(--text-primary)" : "var(--text-secondary)",
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="mt-2 rounded-[4px] px-8 py-3.5 text-sm text-center"
              onClick={() => setOpen(false)}
              style={{
                fontFamily: "var(--font-barlow)",
                fontWeight: 700,
                letterSpacing: "0.05em",
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
