import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
    default: "Client Portal | Christus Veritas Technologies",
    template: "%s | CVT Client Portal",
  },
  description: "Manage your projects, invoices, and support tickets in one place. Christus Veritas Technologies client portal.",
  metadataBase: new URL("https://client-area.christusveritas.tech"),
  keywords: ["client portal", "project management", "invoices", "support", "Christus Veritas Technologies"],
  authors: [{ name: "Christus Veritas Technologies" }],
  creator: "Christus Veritas Technologies",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://client-area.christusveritas.tech",
    siteName: "CVT Client Portal",
    title: "Client Portal | Christus Veritas Technologies",
    description: "Manage your projects, invoices, and support tickets in one place.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Portal | Christus Veritas Technologies",
    description: "Manage your projects, invoices, and support tickets in one place.",
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
