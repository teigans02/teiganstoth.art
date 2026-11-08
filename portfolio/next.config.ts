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
      // image URLs that were already indexed by Google Images
      { source: "/images/teigan-stothart.jpeg", destination: "/images/teigan-stothart.jpg", permanent: true },
      { source: "/images/tfd/:path*", destination: "/images/fat-duck/:path*", permanent: true },
      { source: "/images/nst/:path*", destination: "/images/no-small-talk/:path*", permanent: true },
      { source: "/images/hearst/hero1.jpg", destination: "/images/hearst/hero.jpg", permanent: true },
      { source: "/images/hearst/hearst-logo-grid.svg", destination: "/images/hearst/logo-grid.svg", permanent: true },
    ];
  },
};

export default nextConfig;
