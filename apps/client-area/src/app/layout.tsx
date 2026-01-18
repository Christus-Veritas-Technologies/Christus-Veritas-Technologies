import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CVT Client Portal | Manage Your Services & Billing",
    template: "%s | CVT Client Portal",
  },
  description: "Access your CVT technology services, view invoices, track project progress, and manage billing in one secure portal. Christus Veritas Technologies client dashboard.",
  metadataBase: new URL("https://client-area.christusveritas.tech"),
  keywords: ["CVT client portal", "technology services", "billing management", "invoices", "project tracking", "Christus Veritas Technologies"],
  authors: [{ name: "Christus Veritas Technologies" }],
  creator: "Christus Veritas Technologies",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://client-area.christusveritas.tech",
    siteName: "CVT Client Portal",
    title: "CVT Client Portal | Manage Your Technology Services & Billing",
    description: "Secure access to your CVT services, billing management, and project tracking dashboard.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CVT Client Portal | Technology Services & Billing",
    description: "Access your CVT services, invoices, and project dashboard in one place.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
