import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Photo Gallery",
  description: "Explore Thornfield Guest House through our photo gallery — rooms, mountain views, gardens, dining, and more.",
};
export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
