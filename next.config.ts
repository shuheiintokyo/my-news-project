import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure images to allow external URLs
  images: {
    domains: [
      "placehold.co",
      "via.placeholder.com",
      "media.wired.com",
      "s.yimg.com",
      "techcrunch.com",
      "cdn.vox-cdn.com",
      "i.kinja-img.com",
      "i.guim.co.uk",
      "ichef.bbci.co.uk",
      "image.cnbcfm.com",
      "cdn.mos.cms.futurecdn.net",
    ],
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
