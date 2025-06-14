import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [new URL('https://cesar-aws-s3.s3.us-east-2.amazonaws.com/**')],
  },
};

export default nextConfig;
