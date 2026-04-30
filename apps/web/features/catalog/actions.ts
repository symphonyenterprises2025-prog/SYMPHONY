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
  price?: number
  comparePrice?: number
  stock?: number
  sku?: string
}) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      shortDesc: data.shortDesc,
      categoryId: data.categoryId,
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      variants: {
        create: {
          name: 'Default',
          sku: data.sku || `${data.slug}-default`,
          price: data.price || 0,
          comparePrice: data.comparePrice || null,
          stock: data.stock || 0,
          isActive: true,
          attributes: {},
        },
      },
    },
    include: {
      variants: true,
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

export async function addProductImage(productId: string, url: string, alt?: string) {
  const maxOrder = await prisma.productImage.findFirst({
    where: { productId },
    orderBy: { sortOrder: 'desc' },
  })

  const image = await prisma.productImage.create({
    data: {
      productId,
      url,
      alt: alt || '',
      sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
    },
  })

  revalidateProducts()
  return image
}

export async function deleteProductImage(imageId: string) {
  await prisma.productImage.delete({
    where: { id: imageId },
  })

  revalidateProducts()
}

export async function updateProductImageOrder(imageId: string, sortOrder: number) {
  await prisma.productImage.update({
    where: { id: imageId },
    data: { sortOrder },
  })

  revalidateProducts()
}

export async function updateProductVariant(variantId: string, data: {
  price?: number
  comparePrice?: number | null
  stock?: number
  sku?: string
}) {
  const variant = await prisma.productVariant.update({
    where: { id: variantId },
    data: {
      price: data.price,
      comparePrice: data.comparePrice,
      stock: data.stock,
      sku: data.sku,
    },
  })

  revalidateProducts()
  return variant
}
