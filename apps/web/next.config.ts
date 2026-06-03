import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Disable standalone output for free tier - it increases memory usage
  // output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Optimize image loading
    formats: ['image/webp'],
    minimumCacheTTL: 60,
  },
  // Optimize for production
  compress: true,
  // Disable source maps in production to reduce memory
  productionBrowserSourceMaps: false,
  // Reduce memory usage
  swcMinify: true,
  // Experimental optimizations for memory
  experimental: {
    // Disable worker threads to reduce memory
    workerThreads: false,
    // Limit CPU usage
    cpus: 1,
    // Optimize package imports
    optimizePackageImports: ['lucide-react'],
  },
}

export default nextConfig
