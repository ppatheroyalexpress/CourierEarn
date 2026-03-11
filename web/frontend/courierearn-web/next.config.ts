import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    resolveAlias: {
      '@tailwindcss/oxide': '@tailwindcss/oxide-linux-x64-gnu'
    }
  }
};

export default nextConfig;
