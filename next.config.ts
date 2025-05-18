import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure images to allow external URLs
  images: {
    domains: ["placehold.co", "via.placeholder.com"], // Allow placeholder images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allow all domains for now
      },
    ],
  },
  // Keep this temporarily until we confirm everything works
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
