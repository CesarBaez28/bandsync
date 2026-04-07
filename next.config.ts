import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://cesar-aws-s3.s3.us-east-2.amazonaws.com/**')],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb',
    },
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        // Treat the loaded file as JS (so importing returns a component)
        as: '*.js',
      },
    },
  },
};

export default nextConfig;
