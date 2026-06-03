import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Reduce memory usage during build
  swcMinify: true,
  // Optimize for production
  compress: true,
  // Disable source maps in production to reduce memory
  productionBrowserSourceMaps: false,
  // Limit concurrent operations during build
  experimental: {
    // Reduce memory usage
    workerThreads: false,
    cpus: 1,
  },
}

export default nextConfig
