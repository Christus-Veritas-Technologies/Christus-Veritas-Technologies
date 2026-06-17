import type { Metadata } from "next";

const BASE_URL = "https://hosts.christusveritastech.co.zw";
const PAGE_URL = `${BASE_URL}/how-it-works`;
const OG_IMAGE = `${BASE_URL}/og-how-it-works.png`;

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "From no website to live direct bookings in 7 days. Four phases: onboarding call, professional build, owner review, and go-live. CVT Hosts manages every step for Zimbabwe guest house owners.",
  keywords: [
    "guest house website setup Zimbabwe",
    "how to get direct bookings",
    "stop paying Booking.com",
    "guest house onboarding",
    "website launch 7 days",
    "CVT Hosts process",
    "accommodation direct booking setup",
    "PayFast integration setup",
    "guest house website launch",
  ],
  openGraph: {
    title: "How It Works — From No Website to Live Bookings in 7 Days | CVT Hosts",
    description:
      "Four phases: onboarding call, professional build, review, and go-live. CVT Hosts takes your guest house from zero to a live direct booking site in one week.",
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
    title: "From No Website to Live Bookings in 7 Days | CVT Hosts",
    description:
      "CVT Hosts takes you from zero to a live direct booking site in one week. Four steps. No technical knowledge needed.",
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
    "The four-phase process CVT Hosts follows to take a Zimbabwe guest house from no online presence to a live direct booking website in 7 days.",
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
      text: "CVT Hosts builds your branded website with live availability calendar, room listings, and PayFast payment integration.",
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
      text: "Your site is launched on your domain and you start receiving direct bookings with zero commission.",
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
