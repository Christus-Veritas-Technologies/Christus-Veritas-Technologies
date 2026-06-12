import type { Metadata } from "next";
import { Barlow, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-barlow",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Thornfield Guest House", template: "%s | Thornfield Guest House" },
  description:
    "Experience warm hospitality in the heart of the Drakensberg. Thornfield Guest House — direct bookings, no commission.",
  keywords: ["guest house", "Drakensberg", "accommodation", "bed and breakfast", "South Africa"],
  openGraph: {
    siteName: "Thornfield Guest House",
    type: "website",
    locale: "en_ZA",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${barlow.variable} ${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
