import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from any domain for persona photos
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.backblazeb2.com" },
      { protocol: "http",  hostname: "localhost" },
    ],
  },
  // API proxy to FastAPI backend
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8503";
    return [
      {
        source:      "/api/hezcast/:path*",
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
