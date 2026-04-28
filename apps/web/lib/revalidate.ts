import { revalidatePath, revalidateTag } from 'next/cache'

// Cache tags for revalidation
export const CACHE_TAGS = {
  products: 'products',
  categories: 'categories',
  collections: 'collections',
  occasions: 'occasions',
  banners: 'banners',
  testimonials: 'testimonials',
  settings: 'settings',
  orders: 'orders',
  content: 'content',
  blog: 'blog',
} as const

export function revalidateProducts() {
  revalidateTag(CACHE_TAGS.products)
  revalidatePath('/shop')
  revalidatePath('/')
}

export function revalidateCategories() {
  revalidateTag(CACHE_TAGS.categories)
  revalidatePath('/shop')
}

export function revalidateCollections() {
  revalidateTag(CACHE_TAGS.collections)
  revalidatePath('/')
  revalidatePath('/shop')
}

export function revalidateBanners() {
  revalidateTag(CACHE_TAGS.banners)
  revalidatePath('/')
}

export function revalidateContent() {
  revalidateTag(CACHE_TAGS.content)
  revalidatePath('/')
}

export function revalidateBlog() {
  revalidateTag(CACHE_TAGS.blog)
  revalidatePath('/blog')
}

export function revalidateSettings() {
  revalidateTag(CACHE_TAGS.settings)
}
