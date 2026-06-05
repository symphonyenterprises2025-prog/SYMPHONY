import type { NextConfig } from 'next'

const ALLOWED_REMOTE_IMAGE_HOSTS = [
  'ozuoxykvcfeeylszacoj.supabase.co',
  'images.unsplash.com',
  'cdn.symphonyenterprise.co.in',
  'symphonyenterprise.co.in',
  'fnp.symphonyenterprise.co.in',
]

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: ALLOWED_REMOTE_IMAGE_HOSTS.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
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
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
