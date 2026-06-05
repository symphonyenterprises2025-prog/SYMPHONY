import type { NextConfig } from 'next'

const ALLOWED_REMOTE_IMAGE_HOSTS = [
  'ozuoxykvcfeeylszacoj.supabase.co',
  'images.unsplash.com',
  'cdn.symphonyenterprise.co.in',
  'symphonyenterprise.co.in',
  'fnp.symphonyenterprise.co.in',
]

const nextConfig: NextConfig = {
  images: {
    remotePatterns: ALLOWED_REMOTE_IMAGE_HOSTS.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
    formats: ['image/webp'],
    // Cap the optimizer so a 2x-DPR request never asks for a 3840-px
    // resize of a 3.6 MB banner. Free tier has ~256 MB to play with.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    workerThreads: false,
    cpus: 1,
    optimizePackageImports: ['lucide-react'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default nextConfig
