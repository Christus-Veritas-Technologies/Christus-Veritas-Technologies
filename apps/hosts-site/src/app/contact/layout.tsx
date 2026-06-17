import type { Metadata } from "next";

const BASE_URL = "https://hosts.christusveritastech.co.zw";
const PAGE_URL = `${BASE_URL}/contact`;
const OG_IMAGE = `${BASE_URL}/og-contact.png`;

export const metadata: Metadata = {
  title: "Contact CVT Hosts",
  description:
    "No forms. No support tickets. WhatsApp or email CVT Hosts directly and get a straight answer about your guest house property. We respond within one business day.",
  keywords: [
    "contact CVT Hosts",
    "WhatsApp CVT Hosts",
    "guest house website enquiry Zimbabwe",
    "direct booking system enquiry",
    "CVT Hosts support",
    "hello@christusveritastech.co.zw",
    "book a demo CVT Hosts",
    "guest house website quote",
  ],
  openGraph: {
    title: "Contact CVT Hosts — WhatsApp or Email",
    description:
      "No forms. No ticket queues. WhatsApp or email us directly. Tell us about your property and we will tell you which plan fits in one conversation.",
    url: PAGE_URL,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Contact CVT Hosts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact CVT Hosts — No Forms, Just WhatsApp",
    description:
      "Tell us about your guest house. We will tell you which plan fits. One conversation.",
    images: [OG_IMAGE],
  },
  alternates: { canonical: PAGE_URL },
};

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${PAGE_URL}/#webpage`,
  url: PAGE_URL,
  name: "Contact CVT Hosts",
  description:
    "Contact Christus Veritas Technologies to enquire about the CVT Hosts direct booking system for your Zimbabwe guest house.",
  isPartOf: { "@id": `${BASE_URL}/#website` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Contact", item: PAGE_URL },
    ],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${BASE_URL}/#localbusiness`,
  name: "Christus Veritas Technologies",
  alternateName: "CVT Hosts",
  url: BASE_URL,
  email: "hello@christusveritastech.co.zw",
  description:
    "CVT Hosts builds professional direct booking systems for Zimbabwean guest houses.",
  areaServed: [
    { "@type": "Country", name: "Zimbabwe" },
  ],
  priceRange: "$5–$25/month",
  knowsAbout: [
    "Direct Booking Systems",
    "Guest House Websites",
    "EcoCash and OneMoney Integration",
    "Hospitality Technology",
    "Zimbabwe Accommodation",
  ],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {children}
    </>
  );
}
