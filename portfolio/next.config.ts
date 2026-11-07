import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    minimumCacheTTL: 60 * 60 * 4,
  },
};

export default nextConfig;
