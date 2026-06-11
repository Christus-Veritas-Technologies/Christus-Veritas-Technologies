import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description:
    "Three packages for South African guest houses — Starter (R499/month), Growth (R899/month), and Full Stack (R1,800/month). All include a professional website, booking calendar, and PayFast integration.",
  openGraph: {
    title: "Packages & Pricing | CVT Hosts",
    description:
      "Choose the package that fits your property. Starter, Growth, or Full Stack — all built around direct bookings and zero commission.",
    url: "https://hosts.christusveritas.tech/packages",
  },
  alternates: { canonical: "https://hosts.christusveritas.tech/packages" },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
