import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",  // Apply to all routes
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-inline';"  // Modify this based on your security needs
          },
        ],
      },
    ];
  },
};

export default nextConfig;
