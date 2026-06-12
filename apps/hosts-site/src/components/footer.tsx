import Link from "next/link";
import { WhatsappIcon, Mail01Icon } from "@/components/icons";
import { CvtLogo } from "./cvt-logo";
import { FadeIn } from "@/components/animate";

const NAV_LINKS = [
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
      className="w-full"
      style={{ background: "var(--bg-primary)", paddingBottom: "2rem" }}
    >
      <FadeIn>
        <div className="mx-auto max-w-[1100px] px-4 md:px-6">
          <div
            className="rounded-2xl border"
            style={{
              background: "var(--bg-surface)",
              borderColor: "var(--border)",
            }}
          >
            {/* Main grid */}
            <div className="grid grid-cols-1 gap-10 p-8 md:p-10 md:grid-cols-3">

              {/* Left — logo */}
              <div className="flex items-start">
                <CvtLogo />
              </div>

              {/* Centre — nav links */}
              <div className="flex flex-col gap-1">
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-barlow)" }}
                >
                  Quick Links
                </p>
                <nav className="flex flex-col gap-2" aria-label="Footer navigation">
                  {NAV_LINKS.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-sm transition-opacity hover:opacity-60"
                      style={{ color: "var(--text-primary)", fontFamily: "var(--font-barlow)" }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Right — about + contact */}
              <div className="flex flex-col gap-4">
                <p
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "var(--text-secondary)", fontFamily: "var(--font-barlow)" }}
                >
                  About CVT Hosts
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  CVT Hosts gives South African guest houses a complete digital
                  presence — booking site, Google profile, WhatsApp automation,
                  and AI guest support — all managed for you.
                </p>

                <div className="flex flex-col gap-2 mt-1">
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: "var(--accent)", fontFamily: "var(--font-barlow)" }}
                  >
                    <WhatsappIcon size={18} />
                    Chat on WhatsApp
                  </a>
                  <a
                    href="mailto:hosts@christusveritas.tech"
                    className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
                    style={{ color: "var(--accent)", fontFamily: "var(--font-barlow)" }}
                  >
                    <Mail01Icon size={18} />
                    hosts@christusveritas.tech
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom bar */}
            <div
              className="border-t px-8 md:px-10 py-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
              style={{ borderColor: "var(--border)" }}
            >
              <span
                className="text-xs"
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
              >
                © 2026 Christus Veritas Technologies. All rights reserved.
              </span>
              <span
                className="text-xs"
                style={{ color: "var(--text-secondary)", fontFamily: "var(--font-inter)" }}
              >
                Payments via PayFast · POPIA compliant
              </span>
            </div>
          </div>
        </div>
      </FadeIn>
    </footer>
  );
}
