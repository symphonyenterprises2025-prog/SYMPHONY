'use server'

import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { revalidateProducts } from '@/lib/revalidate'
import { requireAdmin } from '@/lib/admin-auth'

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
  await requireAdmin()

  // OrderItem rows are order history and must NOT be cascade-deleted.
  // If any exist, refuse the delete and tell the admin to mark the
  // product inactive instead. Otherwise the customer can no longer
  // see what they bought.
  const orderItemCount = await prisma.orderItem.count({ where: { productId: id } })
  if (orderItemCount > 0) {
    throw new Error(
      `Cannot delete: this product is part of ${orderItemCount} past order${orderItemCount === 1 ? '' : 's'}. ` +
        'Mark it as inactive instead to preserve order history.'
    )
  }

  try {
    await prisma.$transaction(async (tx) => {
      // CartItem and WishlistItem have no onDelete:Cascade on
      // productId, so a raw delete would FK-violate. Clean them up
      // explicitly. OrderItem was checked above; ProductVariant,
      // ProductImage, ProductReview cascade automatically;
      // MediaAsset is onDelete:SetNull.
      await tx.cartItem.deleteMany({ where: { productId: id } })
      await tx.wishlistItem.deleteMany({ where: { productId: id } })
      await tx.product.delete({ where: { id } })
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      throw new Error(
        'Cannot delete this product: it has related records (cart items, orders, or reviews) that block deletion. ' +
          'Mark it as inactive instead.'
      )
    }
    throw err
  }

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

export async function upsertProductVariant(productId: string, data: {
  price?: number
  comparePrice?: number | null
  stock?: number
  sku?: string
}) {
  // Check if product has any variants
  const existingVariant = await prisma.productVariant.findFirst({
    where: { productId },
  })

  if (existingVariant) {
    // Update existing variant
    const variant = await prisma.productVariant.update({
      where: { id: existingVariant.id },
      data: {
        price: data.price,
        comparePrice: data.comparePrice,
        stock: data.stock,
        sku: data.sku || existingVariant.sku,
      },
    })
    revalidateProducts()
    return variant
  } else {
    // Create new default variant
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })
    const variant = await prisma.productVariant.create({
      data: {
        productId,
        name: 'Default',
        sku: data.sku || `${product?.slug || 'product'}-default`,
        price: data.price || 0,
        comparePrice: data.comparePrice || null,
        stock: data.stock || 0,
        isActive: true,
        attributes: {},
      },
    })
    revalidateProducts()
    return variant
  }
}
