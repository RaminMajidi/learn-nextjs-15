import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3.amazonaws.com",
        port: "",
        pathname: "/my-bucket/**"
      }
    ]
  },
  // ===> Only using in next@canery
  // experimental: {
  //   ppr: 'incremental',
  // },
};

export default nextConfig;
