import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // Standalone output bundles only what's needed — optimal for Docker
  output: "standalone",
};

export default nextConfig;
