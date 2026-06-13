import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Rooms & Suites",
  description: "Browse Thornfield Guest House's four unique rooms — Garden Suite, Mountain View, Family Room, and Executive Suite. Book directly for the best rates.",
};
export default function RoomsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
