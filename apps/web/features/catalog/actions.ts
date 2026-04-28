'use server'

import { prisma } from '@/lib/db'
import { revalidateProducts } from '@/lib/revalidate'

export async function toggleProductFeatured(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  })

  if (!product) {
    throw new Error('Product not found')
  }

  await prisma.product.update({
    where: { id: productId },
    data: { isFeatured: !product.isFeatured },
  })

  revalidateProducts()
}

export async function createProduct(data: {
  name: string
  slug: string
  description: string
  shortDesc?: string
  categoryId: string
  isActive?: boolean
  isFeatured?: boolean
}) {
  const product = await prisma.product.create({
    data: {
      ...data,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
    },
  })

  revalidateProducts()
  return product
}

export async function updateProduct(id: string, data: any) {
  const product = await prisma.product.update({
    where: { id },
    data,
  })

  revalidateProducts()
  return product
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  })

  revalidateProducts()
}
