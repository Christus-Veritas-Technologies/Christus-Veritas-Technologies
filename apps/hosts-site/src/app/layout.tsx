import type { Metadata, Viewport } from "next";
import { Barlow, Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

const BASE_URL = "https://hosts.christusveritas.tech";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "CVT Hosts — Direct Booking System for South African Guest Houses",
    template: "%s | CVT Hosts",
  },
  description:
    "Stop paying 15–20% commission to Booking.com. CVT Hosts builds your guest house a professional website, live booking calendar, and PayFast payment integration — from R499/month.",
  keywords: [
    "guest house booking system South Africa",
    "direct booking website",
    "avoid Booking.com commission",
    "PayFast guest house",
    "SA accommodation website",
    "CVT Hosts",
  ],
  authors: [{ name: "Christus Veritas Technologies" }],
  creator: "Christus Veritas Technologies",
  publisher: "Christus Veritas Technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: BASE_URL,
    siteName: "CVT Hosts",
    title: "CVT Hosts — Direct Booking System for South African Guest Houses",
    description:
      "Stop paying commission on every booking. CVT Hosts gives your property a complete direct booking and payment system — built and managed for you.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CVT Hosts — Direct Booking for SA Guest Houses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CVT Hosts — Direct Booking System for SA Guest Houses",
    description:
      "Stop paying Booking.com commission. Get a full direct booking system from R499/month.",
    images: [`${BASE_URL}/og-image.png`],
  },
  alternates: {
    canonical: BASE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0F0E0C" },
    { media: "(prefers-color-scheme: light)", color: "#FAF8F4" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-ZA"
      suppressHydrationWarning
      className={`${inter.variable} ${barlow.variable} ${playfair.variable}`}
    >
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
