import type { Metadata } from "next";

const BASE_URL = "https://hosts.christusveritastech.co.zw";
const PAGE_URL = `${BASE_URL}/demo`;
const DEMO_URL = "https://hosts-demo.christusveritastech.co.zw";
const OG_IMAGE = `${BASE_URL}/og-demo.png`;

export const metadata: Metadata = {
  title: "Live Demo — Thornfield Guest House",
  description:
    "See exactly what your guests and you will experience with CVT Hosts. A fully live demo featuring Thornfield Guest House, Bloemfontein — real booking calendar, PayFast payment flow, and a working owner dashboard. Try it yourself.",
  keywords: [
    "CVT Hosts demo",
    "guest house booking system demo",
    "live booking demo South Africa",
    "PayFast booking demo",
    "guest house website demo",
    "Thornfield Guest House demo",
    "direct booking system preview",
    "see CVT Hosts in action",
    "accommodation website demo",
    "owner dashboard demo",
  ],
  openGraph: {
    title: "Live Demo — See Your Future Booking Site | CVT Hosts",
    description:
      "A fully working demo of the CVT Hosts system — real calendar blocking, PayFast sandbox payment, and a live owner dashboard. See exactly what you and your guests will experience.",
    url: PAGE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "CVT Hosts Live Demo — Thornfield Guest House",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Demo — See Your Future Booking Site | CVT Hosts",
    description:
      "Real booking calendar. PayFast sandbox. Live owner dashboard. See CVT Hosts in action before you commit.",
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const demoSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}/#webpage`,
  url: PAGE_URL,
  name: "Live Demo | CVT Hosts",
  description:
    "A fully working demonstration of the CVT Hosts direct booking system, built for Thornfield Guest House — a fictional South African guest house in Bloemfontein.",
  isPartOf: { "@id": `${BASE_URL}/#website` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Live Demo", item: PAGE_URL },
    ],
  },
  significantLink: DEMO_URL,
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CVT Hosts Direct Booking System",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: DEMO_URL,
  description:
    "A complete direct booking system for South African guest houses including live availability calendar, PayFast payment integration, and owner dashboard.",
  offers: {
    "@type": "Offer",
    price: "499",
    priceCurrency: "ZAR",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "499",
      priceCurrency: "ZAR",
      unitText: "MONTH",
    },
  },
  featureList: [
    "Live availability calendar",
    "PayFast payment integration",
    "Owner dashboard with booking management",
    "Guest database",
    "PDF and CSV export",
    "WhatsApp booking integration",
    "Mobile-first responsive design",
  ],
};

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(demoSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      {children}
    </>
  );
}
