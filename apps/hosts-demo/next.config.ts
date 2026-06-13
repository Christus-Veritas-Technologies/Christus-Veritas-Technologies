import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  // Prisma's generated client requires @prisma/client-runtime-utils at runtime.
  // Marking these as server-external prevents webpack from bundling them and
  // lets Node.js resolve them directly from node_modules at runtime.
  serverExternalPackages: ["@prisma/client", "@prisma/client-runtime-utils"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
  },
};

export default nextConfig;
