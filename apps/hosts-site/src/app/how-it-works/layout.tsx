import type { Metadata } from "next";

const BASE_URL = "https://hosts.christusveritastech.co.zw";
const PAGE_URL = `${BASE_URL}/how-it-works`;
const OG_IMAGE = `${BASE_URL}/og-how-it-works.png`;

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From invisible to fully booked in 7 days. Four phases: onboarding, build, review, and go-live. CVT Hosts builds your website, booking calendar, payments, and permanent guest database — and manages every step.",
  keywords: [
    "guest house website setup Zimbabwe",
    "get found on Google Zimbabwe guest house",
    "guest house onboarding",
    "website launch 7 days",
    "CVT Hosts process",
    "guest database setup Zimbabwe",
    "EcoCash integration setup",
    "guest house website launch",
  ],
  openGraph: {
    title: "How It Works — From Invisible to Fully Booked in 7 Days | CVT Hosts",
    description:
      "Four phases: onboarding, build, review, and go-live. CVT Hosts takes your guest house from invisible online to found on Google with a live booking site in one week.",
    url: PAGE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "CVT Hosts — How It Works",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "From Invisible to Fully Booked in 7 Days | CVT Hosts",
    description:
      "CVT Hosts takes you from invisible online to a live direct booking site in one week. Four steps. No technical knowledge needed.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: PAGE_URL },
};

const howItWorksSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${PAGE_URL}/#webpage`,
  url: PAGE_URL,
  name: "How It Works | CVT Hosts",
  description:
    "The four-phase process CVT Hosts follows to take a Zimbabwe guest house from invisible online to a live, Google-discoverable direct booking website in 7 days.",
  isPartOf: { "@id": `${BASE_URL}/#website` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "How It Works",
        item: PAGE_URL,
      },
    ],
  },
};

const howItWorksStepsSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How CVT Hosts Sets Up Your Direct Booking Website",
  description:
    "The four-phase process to get your Zimbabwe guest house from no website to live direct bookings.",
  totalTime: "P7D",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Onboarding Call",
      text: "A 30-minute call to capture your property details, room inventory, rates, and preferences. No technical knowledge needed.",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Build",
      text: "CVT Hosts builds your branded website with live availability calendar, room listings, and EcoCash, OneMoney, and card payment integration.",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Review",
      text: "You review the site and request any changes before going live. Unlimited revisions at this stage.",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Go Live",
      text: "Your site is launched on your domain, submitted to Google, and you start getting found by guests searching online — with every booking landing in your permanent database.",
    },
  ],
};

export default function HowItWorksLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howItWorksSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howItWorksStepsSchema) }}
      />
      {children}
    </>
  );
}
