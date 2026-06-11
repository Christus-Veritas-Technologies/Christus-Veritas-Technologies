import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CVT Hosts vs Booking.com",
  description:
    "A factual, side-by-side comparison of CVT Hosts and Booking.com — cost per booking, guest ownership, payment control, and what you keep if you leave.",
  openGraph: {
    title: "CVT Hosts vs Booking.com | CVT Hosts",
    description:
      "One takes a cut of everything. The other builds something you own. See the factual comparison.",
    url: "https://hosts.christusveritas.tech/compare",
  },
  alternates: { canonical: "https://hosts.christusveritas.tech/compare" },
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
