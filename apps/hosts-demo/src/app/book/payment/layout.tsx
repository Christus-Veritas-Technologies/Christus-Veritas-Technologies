import type { Metadata } from "next";
export const metadata: Metadata = { title: "Secure Payment" };
export default function PaymentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
