import type { Metadata } from "next";

const BASE_URL = "https://hosts.christusveritastech.co.zw";
const PAGE_URL = `${BASE_URL}/compare`;
const OG_IMAGE = `${BASE_URL}/og-compare.png`;

export const metadata: Metadata = {
  title: "The Old Way vs CVT Hosts — A Real Comparison",
  description:
    "Side-by-side comparison of running a Zimbabwe guest house the old way — word of mouth, WhatsApp, a paper register — versus running it with CVT Hosts: a website guests can find, a live booking calendar, upfront payments, and a permanent guest database.",
  keywords: [
    "Zimbabwe guest house old way vs online",
    "guest house booking register vs online system",
    "guest house WhatsApp bookings problems",
    "permanent guest database Zimbabwe",
    "direct booking system Zimbabwe guest house",
    "Zimbabwe guest house digital transformation",
    "guest house record keeping Zimbabwe",
    "own your guest data",
  ],
  openGraph: {
    title: "The Old Way vs CVT Hosts | CVT Hosts",
    description:
      "Word of mouth, WhatsApp, and a paper register. Or a website, a live booking calendar, and a permanent guest database. A real, no-spin comparison.",
    url: PAGE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "The Old Way vs CVT Hosts Comparison",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Old Way vs CVT Hosts | CVT Hosts",
    description:
      "See exactly what changes when a Zimbabwe guest house moves from word of mouth and a notebook to a real online system.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: PAGE_URL },
};

const compareSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}/#webpage`,
  url: PAGE_URL,
  name: "The Old Way vs CVT Hosts | CVT Hosts",
  description:
    "A factual comparison between running a Zimbabwe guest house on word of mouth, WhatsApp, and a paper register versus running it with CVT Hosts.",
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
      name: "What is 'the old way' CVT Hosts compares against?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Most Zimbabwe guest houses still run on word of mouth, WhatsApp messages, and a paper booking register — with no website and no permanent record of their guests. That is the comparison, not a specific competitor.",
      },
    },
    {
      "@type": "Question",
      name: "What happens to my guest records if my phone is lost or stolen?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "With a paper register or WhatsApp-only setup, that history is gone permanently. With CVT Hosts, every guest, booking, and payment is stored in your own database and backed up — nothing depends on a single device.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an existing website or online presence to switch?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Most properties we work with start from nothing online. CVT Hosts builds the website, booking calendar, and guest database from scratch.",
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
