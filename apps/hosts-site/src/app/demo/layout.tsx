import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Demo",
  description:
    "See exactly what your guests will experience. A fully working demo of the CVT Hosts direct booking system, built for a fictional SA guest house — Thornfield Guest House, Bloemfontein.",
  openGraph: {
    title: "Live Demo | CVT Hosts",
    description:
      "Browse a fully working demo of the CVT Hosts direct booking system. Live calendar, PayFast payment flow, WhatsApp booking — all live.",
    url: "https://hosts.christusveritas.tech/demo",
  },
  alternates: { canonical: "https://hosts.christusveritas.tech/demo" },
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
