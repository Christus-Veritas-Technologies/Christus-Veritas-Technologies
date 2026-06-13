import type { Metadata } from "next";
export const metadata: Metadata = { title: "Guests — Dashboard" };
export default function GuestsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
