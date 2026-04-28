import { prisma } from '@/lib/db'
import { CACHE_TAGS } from '@/lib/revalidate'
import { unstable_cache } from 'next/cache'

export async function getBlogPosts() {
  return unstable_cache(
    async () => {
      return prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
      })
    },
    ['blog-posts'],
    {
      tags: [CACHE_TAGS.blog],
      revalidate: 3600,
    }
  )()
}

export async function getBlogPostBySlug(slug: string) {
  return unstable_cache(
    async () => {
      return prisma.blogPost.findUnique({
        where: { slug, isPublished: true },
      })
    },
    [`blog-post-${slug}`],
    {
      tags: [CACHE_TAGS.blog],
      revalidate: 3600,
    }
  )()
}

export async function getBanners(position?: string) {
  return unstable_cache(
    async () => {
      return prisma.banner.findMany({
        where: {
          isActive: true,
          position: position || undefined,
        },
        orderBy: { sortOrder: 'asc' },
      })
    },
    [`banners-${position || 'all'}`],
    {
      tags: [CACHE_TAGS.banners],
      revalidate: 3600,
    }
  )()
}

export async function getTestimonials() {
  return unstable_cache(
    async () => {
      return prisma.testimonial.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      })
    },
    ['testimonials'],
    {
      tags: [CACHE_TAGS.testimonials],
      revalidate: 3600,
    }
  )()
}

export async function getContentPageBySlug(slug: string) {
  return prisma.contentPage.findUnique({
    where: { slug, isPublished: true },
  })
}
