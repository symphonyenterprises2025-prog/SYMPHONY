import { prisma } from '@/lib/db'
import { CACHE_TAGS } from '@/lib/revalidate'
import { unstable_cache } from 'next/cache'

export async function getProducts({
  categoryId,
  collectionId,
  occasionId,
  featured = false,
  limit = 20,
  offset = 0,
}: {
  categoryId?: string
  collectionId?: string
  occasionId?: string
  featured?: boolean
  limit?: number
  offset?: number
} = {}) {
  return unstable_cache(
    async () => {
      return prisma.product.findMany({
        where: {
          isActive: true,
          categoryId: categoryId || undefined,
          collections: collectionId ? { some: { id: collectionId } } : undefined,
          occasions: occasionId ? { some: { id: occasionId } } : undefined,
          isFeatured: featured || undefined,
        },
        include: {
          category: true,
          variants: {
            where: { isActive: true },
            orderBy: { price: 'asc' },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
        },
        orderBy: { sortOrder: 'asc' },
        take: limit,
        skip: offset,
      })
    },
    [`products-${categoryId}-${collectionId}-${occasionId}-${featured}-${limit}-${offset}`],
    {
      tags: [CACHE_TAGS.products],
      revalidate: 3600, // 1 hour
    }
  )()
}

export async function getProductBySlug(slug: string) {
  return unstable_cache(
    async () => {
      return prisma.product.findUnique({
        where: { slug, isActive: true },
        include: {
          category: true,
          variants: {
            where: { isActive: true },
          },
          images: {
            orderBy: { sortOrder: 'asc' },
          },
          collections: true,
          occasions: true,
        },
      })
    },
    [`product-${slug}`],
    {
      tags: [CACHE_TAGS.products],
      revalidate: 3600,
    }
  )()
}

export async function getCategories() {
  return unstable_cache(
    async () => {
      return prisma.category.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      })
    },
    ['categories'],
    {
      tags: [CACHE_TAGS.categories],
      revalidate: 3600,
    }
  )()
}

export async function getCollections() {
  return unstable_cache(
    async () => {
      return prisma.collection.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      })
    },
    ['collections'],
    {
      tags: [CACHE_TAGS.collections],
      revalidate: 3600,
    }
  )()
}

export async function getOccasions() {
  return unstable_cache(
    async () => {
      return prisma.occasion.findMany({
        where: { isActive: true },
        orderBy: { sortOrder: 'asc' },
      })
    },
    ['occasions'],
    {
      tags: [CACHE_TAGS.occasions],
      revalidate: 3600,
    }
  )()
}

export async function getBlogPosts() {
  return unstable_cache(
    async () => {
      return prisma.blogPost.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 10,
      })
    },
    ['blog-posts'],
    {
      tags: [CACHE_TAGS.products],
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
      tags: [CACHE_TAGS.products],
      revalidate: 3600,
    }
  )()
}

export async function getBanners(position?: string) {
  return unstable_cache(
    async () => {
      return prisma.banner.findMany({
        where: { isActive: true, position: position || undefined },
        orderBy: { sortOrder: 'asc' },
      })
    },
    ['banners'],
    {
      tags: [CACHE_TAGS.products],
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
      tags: [CACHE_TAGS.products],
      revalidate: 3600,
    }
  )()
}

export async function getPaginatedProducts({
  categorySlug,
  collectionSlug,
  occasionSlug,
  search,
  featured,
  limit = 12,
  page = 1,
  sort = 'newest',
}: {
  categorySlug?: string
  collectionSlug?: string
  occasionSlug?: string
  search?: string
  featured?: boolean
  limit?: number
  page?: number
  sort?: string
} = {}) {
  const offset = (page - 1) * limit

  return unstable_cache(
    async () => {
      const where: any = {
        isActive: true,
        isFeatured: featured || undefined,
      }

      if (categorySlug) {
        where.category = { slug: categorySlug }
      }
      if (collectionSlug) {
        where.collections = { some: { slug: collectionSlug } }
      }
      if (occasionSlug) {
        where.occasions = { some: { slug: occasionSlug } }
      }
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }

      let orderBy: any = { createdAt: 'desc' }
      if (sort === 'oldest') {
        orderBy = { createdAt: 'asc' }
      }

      const [products, total] = await Promise.all([
        prisma.product.findMany({
          where,
          include: {
            category: true,
            variants: {
              where: { isActive: true },
              orderBy: { price: 'asc' },
            },
            images: {
              orderBy: { sortOrder: 'asc' },
            },
          },
          orderBy,
          take: limit,
          skip: offset,
        }),
        prisma.product.count({ where }),
      ])

      // Apply price-based sorting in JavaScript
      if (sort === 'price-low') {
        products.sort((a, b) => {
          const priceA = a.variants[0]?.price || 0
          const priceB = b.variants[0]?.price || 0
          return Number(priceA) - Number(priceB)
        })
      } else if (sort === 'price-high') {
        products.sort((a, b) => {
          const priceA = a.variants[0]?.price || 0
          const priceB = b.variants[0]?.price || 0
          return Number(priceB) - Number(priceA)
        })
      }

      return {
        products,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      }
    },
    [`paginated-products-${categorySlug}-${collectionSlug}-${occasionSlug}-${search}-${featured}-${limit}-${page}-${sort}`],
    {
      tags: [CACHE_TAGS.products],
      revalidate: 3600, // 1 hour
    }
  )()
}
