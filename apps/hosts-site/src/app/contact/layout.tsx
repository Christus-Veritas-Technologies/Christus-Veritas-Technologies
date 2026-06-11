import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "No forms. No ticket queues. WhatsApp or email CVT Hosts directly and get a straight conversation about your guest house property.",
  openGraph: {
    title: "Contact | CVT Hosts",
    description:
      "WhatsApp us directly. Tell us about your property and we will tell you which package fits.",
    url: "https://hosts.christusveritas.tech/contact",
  },
  alternates: { canonical: "https://hosts.christusveritas.tech/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
