import type { Metadata, Viewport } from "next";
import { Barlow, Inter, Playfair_Display } from "next/font/google";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Providers } from "@/components/providers";
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

const BASE_URL = "https://hosts.christusveritastech.co.zw";
const SITE_NAME = "CVT Hosts";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "CVT Hosts — Direct Booking System for Zimbabwe Guest Houses",
    template: "%s | CVT Hosts",
  },
  description:
    "The dotcom era passed Zimbabwe guest houses by. CVT Hosts gives yours a professional website, live booking calendar, permanent guest database, and EcoCash, OneMoney, and card payments — found on Google, live in one week, from $5/month.",
  keywords: [
    "guest house booking system Zimbabwe",
    "direct booking website Zimbabwe",
    "get found on Google Zimbabwe guest house",
    "EcoCash guest house integration",
    "Zimbabwe accommodation website builder",
    "guest house website Zimbabwe",
    "direct booking platform",
    "accommodation management system",
    "B&B booking system",
    "permanent guest database Zimbabwe",
    "CVT Hosts",
    "Christus Veritas Technologies",
    "hospitality tech Zimbabwe",
    "guest house marketing",
    "direct bookings Zimbabwe",
  ],
  authors: [{ name: "Christus Veritas Technologies", url: BASE_URL }],
  creator: "Christus Veritas Technologies",
  publisher: "Christus Veritas Technologies",
  category: "Technology",
  classification: "Business/Technology",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_ZW",
    url: BASE_URL,
    siteName: SITE_NAME,
    title: "CVT Hosts — Direct Booking System for Zimbabwe Guest Houses",
    description:
      "Hotels got found online twenty years ago. Your guest house did not. CVT Hosts gives your property a website, a live booking calendar, and a permanent guest database — built and managed for you from $5/month.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "CVT Hosts — Direct Booking for Zimbabwe Guest Houses",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@cvthosts",
    creator: "@cvthosts",
    title: "CVT Hosts — Direct Booking System for Zimbabwe Guest Houses",
    description:
      "Twenty years late. One week to catch up. Get found on Google with a full direct booking system from $5/month.",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        alt: "CVT Hosts — Direct Booking for Zimbabwe Guest Houses",
      },
    ],
  },
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-ZW": BASE_URL,
    },
  },
  appleWebApp: {
    title: "CVT Hosts",
    statusBarStyle: "default",
    capable: true,
  },
  other: {
    "geo.region": "ZW",
    "geo.placename": "Zimbabwe",
    "geo.position": "-19.0;29.8",
    ICBM: "-19.0, 29.8",
    "msapplication-TileColor": "#C9A84C",
    "theme-color": "#C9A84C",
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0F0E0C" },
    { media: "(prefers-color-scheme: light)", color: "#FAF8F4" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "Christus Veritas Technologies",
  alternateName: "CVT Hosts",
  url: BASE_URL,
  logo: {
    "@type": "ImageObject",
    url: `${BASE_URL}/logo.png`,
    width: 200,
    height: 60,
  },
  description:
    "CVT Hosts gives Zimbabwean guest houses the online presence and booking systems the dotcom era left behind — found on Google, booked directly, and recorded permanently.",
  areaServed: [
    { "@type": "Country", name: "Zimbabwe" },
  ],
  serviceType: "Direct Booking System",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Support",
    availableLanguage: ["English"],
    contactOption: "TollFree",
  },
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${BASE_URL}/#website`,
  url: BASE_URL,
  name: "CVT Hosts",
  description:
    "Direct booking systems for Zimbabwean guest houses.",
  publisher: { "@id": `${BASE_URL}/#organization` },
  inLanguage: "en-ZW",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${BASE_URL}/?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-ZW"
      suppressHydrationWarning
      className={`${inter.variable} ${barlow.variable} ${playfair.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
      >
        <Providers>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
