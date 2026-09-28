import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.21st.dev",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/crewsplit.html',
        destination: '/index.html',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
