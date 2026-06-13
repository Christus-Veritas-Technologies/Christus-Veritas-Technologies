import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Book Your Stay",
  description: "Reserve your room at Thornfield Guest House. Direct booking — no booking fees, no commission. Instant confirmation.",
};
export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
