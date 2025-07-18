import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimize image formats
    formats: ['image/avif', 'image/webp'],
    // Set image quality
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days
  },
  
  // Enable React strict mode for better development experience
  reactStrictMode: true,
  
  // Enable SWC minification for faster builds
  swcMinify: true,
  
  // Enable experimental features
  experimental: {
    serverActions: true,
    // Enable optimizeFonts for better font loading performance
    optimizeFonts: true,
    // Enable server components
    serverComponents: true,
  },
  
  // Configure headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=31536000',
          },
        ],
      },
    ];
  },
  
  // Configure redirects for SEO
  async redirects() {
    return [
      {
        source: '/blog',
        destination: '/blog/page/1',
        permanent: true,
      },
      {
        source: '/research',
        destination: '/research/page/1',
        permanent: true,
      },
    ];
  },
  
  // Configure rewrites for clean URLs
  async rewrites() {
    return {
      beforeFiles: [
        // Rewrite for blog pagination
        {
          source: '/blog/page/:page',
          destination: '/blog?page=:page',
        },
        // Rewrite for research pagination
        {
          source: '/research/page/:page',
          destination: '/research?page=:page',
        },
      ],
    };
  },
  
  // Enable TypeScript for type checking
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Enable ESLint for code quality
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Enable gzip compression
  compress: true,
  
  // Configure build output
  output: 'standalone',
  
  // Configure powered by header
  poweredByHeader: false,
};

export default nextConfig;
