import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React 19 features for performance
  reactStrictMode: true,
  
  // Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/demkeuigf/**", // Restrict to your Cloudinary account
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "www.google.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
    // Reduce image quality slightly for faster load times
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000, // Cache images for 1 year
  },
  
  // Compression
  compress: true,
  
  // Turbopack is enabled by default in Next.js 16
  turbopack: {},
  
  // Production optimizations
  poweredByHeader: false,
  generateEtags: true,
  
  // Security Headers
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.tailwindcss.com https://www.googletagmanager.com https://apis.google.com https://www.gstatic.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; font-src 'self' data:; connect-src 'self' https: https://securetoken.googleapis.com https://*.firebaseio.com https://*.googleapis.com; frame-src 'self' https://accounts.google.com https://*.firebaseapp.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self';",
          },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
