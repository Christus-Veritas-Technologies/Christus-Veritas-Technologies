import type { Metadata } from "next";
import { JetBrains_Mono, Montserrat, Sora } from "next/font/google";

import "../index.css";
import Providers from "@/components/providers";
import { Footer } from "@/components/site/Footer";
import { Nav } from "@/components/site/Nav";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["500"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "800"],
});

export const metadata: Metadata = {
  title: "Christus Veritas Technologies · Premium apps at African prices",
  description:
    "Apps, websites and POS systems that make your business look as big as it is. Built in Mutare, priced for Africa.",
  metadataBase: new URL("https://christusveritastech.co.zw"),
  openGraph: { images: ["/brand/cvt-mark-1024.png"] },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${mono.variable} ${montserrat.variable}`}
    >
      <body className="antialiased">
        <Providers>
          <Nav />
          {/* clip (not hidden) trims decorative overflow without creating a scroll container. */}
          <main style={{ overflowX: "clip" }}>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
