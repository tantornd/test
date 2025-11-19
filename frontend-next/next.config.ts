import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Rewrites are optional since we're using absolute URLs in API calls
  // async rewrites() {
  //   const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
  //   return [
  //     {
  //       source: '/api/v1/:path*',
  //       destination: `${apiUrl}/:path*`,
  //     },
  //   ];
  // },
};

export default nextConfig;

