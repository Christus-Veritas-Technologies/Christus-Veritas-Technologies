import Link from "next/link";
import { WhatsappIcon, Mail01Icon, MapsLocationIcon } from "hugeicons-react";
import { CvtLogo } from "./cvt-logo";

const FOOTER_LINKS = [
  { label: "Home", href: "/" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Packages", href: "/packages" },
  { label: "Compare", href: "/compare" },
  { label: "Demo", href: "/demo" },
  { label: "Contact", href: "/contact" },
];

const WA_LINK =
  "https://wa.me/27000000000?text=Hi%20CVT%20Hosts%2C%20I%27d%20like%20to%20know%20more%20about%20your%20packages.";

export function Footer() {
  return (
    <footer
      className="w-full border-t"
      style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
    >
      {/* Main footer grid */}
      <div className="mx-auto max-w-[1100px] px-6 py-16 grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Left — brand */}
        <div className="flex flex-col gap-4">
          <CvtLogo />
          <p className="text-sm leading-relaxed max-w-[240px]" style={{ color: "var(--text-secondary)" }}>
            CVT Hosts is a service by Christus Veritas Technologies.
            Built for South African guest houses.
          </p>
        </div>

        {/* Centre — nav */}
        <nav className="flex flex-col gap-3 md:items-center" aria-label="Footer navigation">
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm transition-colors hover:opacity-80"
              style={{ fontFamily: "var(--font-barlow)", color: "var(--text-secondary)" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — contact */}
        <div className="flex flex-col gap-4 md:items-end">
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            <WhatsappIcon size={20} style={{ color: "var(--accent)" }} />
            WhatsApp Us
          </a>
          <a
            href="mailto:hosts@christusveritas.tech"
            className="flex items-center gap-2 text-sm transition-colors hover:opacity-80"
            style={{ color: "var(--text-secondary)" }}
          >
            <Mail01Icon size={20} style={{ color: "var(--accent)" }} />
            Email Us
          </a>
          <span
            className="flex items-center gap-2 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            <MapsLocationIcon size={20} style={{ color: "var(--accent)" }} />
            Serving SA properties
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="mx-auto max-w-[1100px] px-6 py-5 flex flex-col gap-1 md:flex-row md:justify-between text-xs"
          style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
        >
          <span>© 2026 Christus Veritas Technologies. All rights reserved.</span>
          <span>Payments processed via PayFast. POPIA compliant.</span>
        </div>
      </div>
    </footer>
  );
}
