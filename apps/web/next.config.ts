import type { NextConfig } from 'next'

const ALLOWED_REMOTE_IMAGE_HOSTS = [
  'ozuoxykvcfeeylszacoj.supabase.co',
  'images.unsplash.com',
  'cdn.symphonyenterprise.co.in',
  'symphonyenterprise.co.in',
  'fnp.symphonyenterprise.co.in',
]

const nextConfig: NextConfig = {
  // Don't advertise the framework in the response header.
  poweredByHeader: false,
  images: {
    // Source images are pre-baked to WebP at 1920px max (see
    // public/images/home/banner*.webp, about/hero.webp, etc.). The
    // next/image optimizer is disabled because on the Render free
    // tier (512 MB) it OOM-kills the instance when several
    // images are requested in parallel (hero rotator prefetches
    // all 10, then RSC prefetches kick in). Disabling the
    // optimizer means next/image renders a plain <img> with the
    // source file as-is -- fine for already-optimized sources.
    unoptimized: true,
    remotePatterns: ALLOWED_REMOTE_IMAGE_HOSTS.map((hostname) => ({
      protocol: 'https',
      hostname,
    })),
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
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
