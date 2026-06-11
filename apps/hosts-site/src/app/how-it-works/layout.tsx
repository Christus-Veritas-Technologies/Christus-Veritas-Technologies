import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From no website to live direct bookings in one week. Here is exactly what happens — onboarding, build, review, and go-live — when you sign up with CVT Hosts.",
  openGraph: {
    title: "How It Works | CVT Hosts",
    description:
      "From no website to live direct bookings in one week. See the four-phase process CVT Hosts follows for every South African guest house.",
    url: "https://hosts.christusveritas.tech/how-it-works",
  },
  alternates: { canonical: "https://hosts.christusveritas.tech/how-it-works" },
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
