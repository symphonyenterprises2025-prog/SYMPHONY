type BlogPost = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  author: string | null
  isPublished: boolean
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

type Banner = {
  id: string
  title: string
  image: string
  link: string | null
  position: string
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

type Testimonial = {
  id: string
  name: string
  role: string | null
  content: string
  rating: number
  avatar: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

type ContentPage = {
  id: string
  title: string
  slug: string
  content: string
  metaTitle: string | null
  metaDesc: string | null
  isPublished: boolean
  publishedAt: Date | null
  createdAt: Date
  updatedAt: Date
}

export type BlogPostWithDetails = BlogPost
export type BannerWithDetails = Banner
export type TestimonialWithDetails = Testimonial
export type ContentPageWithDetails = ContentPage
