import type { Metadata } from "next";

const BASE_URL = "https://hosts.christusveritastech.co.zw";
const PAGE_URL = `${BASE_URL}/packages`;
const OG_IMAGE = `${BASE_URL}/og-packages.png`;

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description:
    "Three packages for Zimbabwe guest houses: Starter at $5/month, Growth at $10/month, and Full Stack at $25/month. All include a professional direct booking website, live calendar, and PayFast integration. No OTA commission, ever.",
  keywords: [
    "CVT Hosts pricing",
    "guest house website price Zimbabwe",
    "$5 booking website",
    "$10 guest house system",
    "affordable accommodation website Zimbabwe",
    "direct booking platform pricing",
    "guest house subscription Zimbabwe",
    "no commission booking plan",
    "PayFast guest house plans",
    "bed and breakfast website pricing",
  ],
  openGraph: {
    title: "Packages & Pricing — From $5/month | CVT Hosts",
    description:
      "Starter, Growth, or Full Stack. All plans include a professional booking site, live availability calendar, and PayFast integration. Zero OTA commission, fixed monthly fee.",
    url: PAGE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "CVT Hosts Packages — Starter $5, Growth $10, Full Stack $25",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Packages from $5/month | CVT Hosts",
    description:
      "Three plans for Zimbabwe guest houses. Direct booking website + PayFast + zero commission from $5/month.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: PAGE_URL },
};

const packagesSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}/#webpage`,
  url: PAGE_URL,
  name: "Packages & Pricing | CVT Hosts",
  description:
    "Pricing plans for the CVT Hosts direct booking system for Zimbabwe guest houses.",
  isPartOf: { "@id": `${BASE_URL}/#website` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Packages & Pricing", item: PAGE_URL },
    ],
  },
};

const offersSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "CVT Hosts Pricing Plans",
  description: "Direct booking system plans for Zimbabwe guest houses",
  numberOfItems: 3,
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      item: {
        "@type": "Offer",
        name: "Starter",
        description:
          "Professional direct booking website with live availability calendar, PayFast integration, and basic booking management.",
        price: "5",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "5",
          priceCurrency: "USD",
          unitText: "MONTH",
        },
        seller: { "@id": `${BASE_URL}/#organization` },
      },
    },
    {
      "@type": "ListItem",
      position: 2,
      item: {
        "@type": "Offer",
        name: "Growth",
        description:
          "Professional website, live booking calendar, online payments via EcoCash and OneMoney, bookings database, guest contact database, calendar sync, expense tracking, financial reports, and ongoing support.",
        price: "10",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "10",
          priceCurrency: "USD",
          unitText: "MONTH",
        },
        seller: { "@id": `${BASE_URL}/#organization` },
      },
    },
    {
      "@type": "ListItem",
      position: 3,
      item: {
        "@type": "Offer",
        name: "Full Stack",
        description:
          "Everything in Run Your Business plus WhatsApp AI Agent for 24/7 autonomous booking handling, Facebook and Instagram management, monthly SEO blog post, priority support, and quarterly strategy calls.",
        price: "25",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "25",
          priceCurrency: "USD",
          unitText: "MONTH",
        },
        seller: { "@id": `${BASE_URL}/#organization` },
      },
    },
  ],
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packagesSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersSchema) }}
      />
      {children}
    </>
  );
}
