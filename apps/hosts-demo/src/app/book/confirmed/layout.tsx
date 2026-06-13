import type { Metadata } from "next";
export const metadata: Metadata = { title: "Booking Confirmed" };
export default function ConfirmedLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
