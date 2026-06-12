import type { Metadata } from "next";

const BASE_URL = "https://hosts.christusveritastech.co.zw";
const PAGE_URL = `${BASE_URL}/packages`;
const OG_IMAGE = `${BASE_URL}/og-packages.png`;

export const metadata: Metadata = {
  title: "Packages & Pricing",
  description:
    "Three packages for South African guest houses: Starter at R499/month, Growth at R899/month, and Full Stack at R1,800/month. All include a professional direct booking website, live calendar, and PayFast integration. No OTA commission, ever.",
  keywords: [
    "CVT Hosts pricing",
    "guest house website price South Africa",
    "R499 booking website",
    "R899 guest house system",
    "affordable accommodation website SA",
    "direct booking platform pricing",
    "guest house subscription South Africa",
    "no commission booking plan",
    "PayFast guest house plans",
    "bed and breakfast website pricing",
  ],
  openGraph: {
    title: "Packages & Pricing — From R499/month | CVT Hosts",
    description:
      "Starter, Growth, or Full Stack. All plans include a professional booking site, live availability calendar, and PayFast integration. Zero OTA commission, fixed monthly fee.",
    url: PAGE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "CVT Hosts Packages — Starter R499, Growth R899, Full Stack R1,800",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Packages from R499/month | CVT Hosts",
    description:
      "Three plans for SA guest houses. Direct booking website + PayFast + zero commission from R499/month.",
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
    "Pricing plans for the CVT Hosts direct booking system for South African guest houses.",
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
  description: "Direct booking system plans for South African guest houses",
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
        price: "499",
        priceCurrency: "ZAR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "499",
          priceCurrency: "ZAR",
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
          "Everything in Starter plus WhatsApp booking bot, booking reports, PDF/CSV exports, and guest database.",
        price: "899",
        priceCurrency: "ZAR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "899",
          priceCurrency: "ZAR",
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
          "Complete managed service including custom domain, social media management, Google Ads, and dedicated account support.",
        price: "1800",
        priceCurrency: "ZAR",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: "1800",
          priceCurrency: "ZAR",
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
