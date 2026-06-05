'use server'

import { prisma } from '@/lib/db'
import { revalidateContent, revalidateBlog } from '@/lib/revalidate'

export async function createBlogPost(data: {
  title: string
  slug: string
  excerpt?: string
  content: string
  coverImage?: string
  author?: string
  isPublished?: boolean
  publishedAt?: Date | null
}) {
  const post = await prisma.blogPost.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage,
      author: data.author,
      isPublished: data.isPublished ?? false,
      publishedAt: data.publishedAt ?? null,
    },
  })

  revalidateBlog()
  return post
}

export async function updateBlogPost(id: string, data: any) {
  const post = await prisma.blogPost.update({
    where: { id },
    data,
  })

  revalidateBlog()
  return post
}

export async function deleteBlogPost(id: string) {
  await prisma.blogPost.delete({
    where: { id },
  })

  revalidateBlog()
}

export async function createBanner(data: {
  title: string
  image: string
  link?: string
  position: string
}) {
  const banner = await prisma.banner.create({
    data,
  })

  revalidateContent()
  return banner
}

export async function updateBanner(id: string, data: any) {
  const banner = await prisma.banner.update({
    where: { id },
    data,
  })

  revalidateContent()
  return banner
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({
    where: { id },
  })

  revalidateContent()
}

export async function createContentPage(data: {
  title: string
  slug: string
  content: string
  metaTitle?: string
  metaDesc?: string
  isPublished?: boolean
}) {
  const page = await prisma.contentPage.create({
    data: {
      ...data,
      publishedAt: data.isPublished ? new Date() : null,
    },
  })

  revalidateContent()
  return page
}

export async function updateContentPage(id: string, data: any) {
  const page = await prisma.contentPage.update({
    where: { id },
    data,
  })

  revalidateContent()
  return page
}

export async function deleteContentPage(id: string) {
  await prisma.contentPage.delete({
    where: { id },
  })

  revalidateContent()
}
