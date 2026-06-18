import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Location & Directions",
  description: "Find Thornfield Guest House in Nyanga, Zimbabwe's Eastern Highlands. Directions from Harare and Mutare, nearby attractions, and GPS coordinates.",
};
export default function LocationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
