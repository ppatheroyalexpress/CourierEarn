import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  // Disable font optimization to prevent loading issues
  optimizeFonts: false,
  // Ensure proper asset handling
  assetPrefix: undefined,
  // Handle transpile packages
  transpilePackages: ['@courierearn/shared', '@courierearn/ui'],
};

export default nextConfig;
