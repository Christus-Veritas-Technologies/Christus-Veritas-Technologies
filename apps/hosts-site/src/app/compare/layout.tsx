import type { Metadata } from "next";

const BASE_URL = "https://hosts.christusveritastech.co.zw";
const PAGE_URL = `${BASE_URL}/compare`;
const OG_IMAGE = `${BASE_URL}/og-compare.png`;

export const metadata: Metadata = {
  title: "CVT Hosts vs Booking.com — Factual Comparison",
  description:
    "Side-by-side comparison of CVT Hosts and Booking.com across 10 categories: cost per booking, guest ownership, payment control, data access, and more. One takes 15–20% of every booking. The other charges a fixed monthly fee and you keep everything.",
  keywords: [
    "CVT Hosts vs Booking.com",
    "Booking.com alternative Zimbabwe",
    "direct booking vs OTA comparison",
    "stop paying Booking.com",
    "guest house OTA commission comparison",
    "avoid OTA fees Zimbabwe",
    "direct booking benefits guest house",
    "Booking.com commission rate",
    "own your guest bookings",
    "guest house website alternative",
  ],
  openGraph: {
    title: "CVT Hosts vs Booking.com — The Factual Side-by-Side | CVT Hosts",
    description:
      "One takes a cut of every booking, forever. The other builds something you own. A factual, no-spin comparison across cost, guest ownership, data control, and payment flow.",
    url: PAGE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "CVT Hosts vs Booking.com Comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CVT Hosts vs Booking.com — The Numbers Don't Lie | CVT Hosts",
    description:
      "Booking.com takes 15–20% of every booking. CVT Hosts charges a fixed monthly fee. See the full comparison.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: PAGE_URL },
};

const compareSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}/#webpage`,
  url: PAGE_URL,
  name: "CVT Hosts vs Booking.com Comparison | CVT Hosts",
  description:
    "Factual side-by-side comparison of CVT Hosts direct booking system and Booking.com for Zimbabwe guest houses.",
  isPartOf: { "@id": `${BASE_URL}/#website` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Compare", item: PAGE_URL },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How much does Booking.com charge per booking?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Booking.com charges between 15–25% commission on every booking, depending on your property's visibility programme. This applies to every booking, indefinitely — there is no cap.",
      },
    },
    {
      "@type": "Question",
      name: "What is the difference between CVT Hosts and Booking.com?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "CVT Hosts builds you a direct booking website you own, charges a fixed monthly fee with zero per-booking commission, and stores all guest data in your database. Booking.com takes 15–25% of every booking, owns the guest relationship, and holds guest contact data on their platform.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need to leave Booking.com to use CVT Hosts?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. You can run both simultaneously and gradually shift more bookings to direct. Most property owners see their direct booking share increase month-on-month once their website is live and they share their booking link.",
      },
    },
  ],
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(compareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
