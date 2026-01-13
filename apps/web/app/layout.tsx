import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Christus Veritas Technologies | Software Development & Digital Solutions",
    template: "%s | Christus Veritas Technologies",
  },
  description: "Professional software development, web applications, and digital solutions. Transform your business with cutting-edge technology from Christus Veritas Technologies.",
  metadataBase: new URL("https://christusveritas.tech"),
  keywords: ["software development", "web development", "digital solutions", "technology", "consulting", "Christus Veritas Technologies"],
  authors: [{ name: "Christus Veritas Technologies" }],
  creator: "Christus Veritas Technologies",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://christusveritas.tech",
    siteName: "Christus Veritas Technologies",
    title: "Christus Veritas Technologies | Software Development & Digital Solutions",
    description: "Professional software development, web applications, and digital solutions.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Christus Veritas Technologies",
    description: "Professional software development, web applications, and digital solutions.",
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
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
