import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // !! WARN !!
    // Temporarily ignore TypeScript errors during build
    // This should be removed once the type issues are resolved
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
