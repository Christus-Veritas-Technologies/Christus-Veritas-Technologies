import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Location & Directions",
  description: "Find Thornfield Guest House in the Central Drakensberg, KwaZulu-Natal. Directions from Johannesburg and Durban, nearby attractions, and GPS coordinates.",
};
export default function LocationLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
