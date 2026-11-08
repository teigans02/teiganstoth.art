import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    minimumCacheTTL: 60 * 60 * 4,
  },
  async redirects() {
    return [
      { source: "/projects/nst", destination: "/projects/no-small-talk", permanent: true },
      { source: "/projects/tfd", destination: "/projects/fat-duck", permanent: true },
    ];
  },
};

export default nextConfig;
