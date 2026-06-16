'use server'

import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/db'
import { revalidateProducts, revalidateCategories } from '@/lib/revalidate'
import { requireAdmin } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'

export async function toggleProductFeatured(productId: string) {
  await requireAdmin()
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

export async function toggleProductActive(productId: string) {
  await requireAdmin()
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, isActive: true },
  })

  if (!product) {
    throw new Error('Product not found')
  }

  await prisma.product.update({
    where: { id: productId },
    data: { isActive: !product.isActive },
  })

  revalidateProducts()
}

export async function createProduct(data: {
  name: string
  slug: string
  description: string
  shortDesc?: string
  categoryIds: string[]
  isActive?: boolean
  isFeatured?: boolean
  hasCustomization?: boolean
  customizationLabel?: string
  socialProofLine1?: string
  socialProofLine2?: string
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
      isActive: data.isActive ?? true,
      isFeatured: data.isFeatured ?? false,
      hasCustomization: data.hasCustomization ?? false,
      customizationLabel: data.customizationLabel,
      socialProofLine1: data.socialProofLine1,
      socialProofLine2: data.socialProofLine2,
      categories: {
        connect: data.categoryIds.map(id => ({ id })),
      },
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
      categories: true,
    },
  })

  revalidateProducts()
  return product
}

export async function updateProduct(id: string, data: any) {
  await requireAdmin()
  const { categoryIds, hasCustomization, customizationLabel, socialProofLine1, socialProofLine2, ...rest } = data

  const updateData: any = { ...rest }
  if (hasCustomization !== undefined) updateData.hasCustomization = hasCustomization
  if (customizationLabel !== undefined) updateData.customizationLabel = customizationLabel
  if (socialProofLine1 !== undefined) updateData.socialProofLine1 = socialProofLine1
  if (socialProofLine2 !== undefined) updateData.socialProofLine2 = socialProofLine2

  if (categoryIds && Array.isArray(categoryIds)) {
    updateData.categories = {
      set: categoryIds.map((id: string) => ({ id })),
    }
  }

  const product = await prisma.product.update({
    where: { id },
    data: updateData,
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
        'Mark it as inactive instead, or use Hard Delete from the product page to remove everything.'
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

/**
 * Hard delete: removes the product AND every related history row
 * (OrderItem, CartItem, WishlistItem, ProductReview, ProductImage,
 * ProductVariant). MediaAsset.productId is set to NULL by the schema.
 *
 * GUARD: only allowed if the product is already marked isActive=false.
 * This is a two-step process by design -- admin must first take the
 * product out of the storefront, then escalate to a destructive
 * delete. Prevents accidental data loss.
 *
 * Also: the action is irreversible. We do not log the deletion
 * because there is no audit log model in the schema. If compliance
 * requires one in the future, add a deletion_log table and write
 * to it inside the same transaction.
 */
export async function hardDeleteProduct(id: string) {
  await requireAdmin()

  const product = await prisma.product.findUnique({
    where: { id },
    select: { id: true, isActive: true, name: true },
  })

  if (!product) {
    throw new Error('Product not found.')
  }

  if (product.isActive) {
    throw new Error(
      `Hard delete blocked: "${product.name}" is still active. ` +
        'Mark it inactive first, then return here to hard delete.'
    )
  }

  // Count what we are about to destroy, so the error path can
  // mention them by name. (Not used on the success path because
  // the UI already shows the breakdown before this action runs.)
  const [orderItems, cartItems, wishlistItems, reviews] = await Promise.all([
    prisma.orderItem.count({ where: { productId: id } }),
    prisma.cartItem.count({ where: { productId: id } }),
    prisma.wishlistItem.count({ where: { productId: id } }),
    prisma.productReview.count({ where: { productId: id } }),
  ])

  try {
    await prisma.$transaction(async (tx) => {
      // OrderItem first: variants cascade-delete with the product,
      // but OrderItem.productId is non-cascading, so it must go first
      // to avoid an FK violation when the product (and its variants)
      // are dropped.
      await tx.orderItem.deleteMany({ where: { productId: id } })
      await tx.cartItem.deleteMany({ where: { productId: id } })
      await tx.wishlistItem.deleteMany({ where: { productId: id } })
      // ProductVariant, ProductImage, ProductReview cascade.
      // MediaAsset is onDelete:SetNull.
      await tx.product.delete({ where: { id } })
    })
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
      throw new Error(
        `Hard delete failed: a related record is blocking the delete. ` +
          `(${orderItems} orders, ${cartItems} cart items, ${wishlistItems} wishlist items, ${reviews} reviews were found.) ` +
          'A schema change may have introduced a new FK. Contact the developer.'
      )
    }
    throw err
  }

  revalidateProducts()
}

export async function addProductImage(productId: string, url: string, alt?: string) {
  await requireAdmin()
  const maxOrder = await prisma.productImage.findFirst({
    where: { productId },
    orderBy: { sortOrder: 'desc' },
  })

  const image = await prisma.productImage.create({
    data: {
      productId,
      url: url,
      alt: alt || '',
      sortOrder: (maxOrder?.sortOrder ?? -1) + 1,
    },
  })

  revalidateProducts()
  return image
}

export async function deleteProductImage(imageId: string) {
  await requireAdmin()
  await prisma.productImage.delete({
    where: { id: imageId },
  })

  revalidateProducts()
}

export async function updateProductImageOrder(imageId: string, sortOrder: number) {
  await requireAdmin()
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

export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  image?: string
  isActive?: boolean
  sortOrder?: number
}) {
  await requireAdmin()
  await prisma.category.create({ data })
  revalidateCategories()
  redirect('/admin/categories')
}

export async function updateCategory(id: string, data: {
  name: string
  slug: string
  description?: string
  image?: string
  isActive?: boolean
  sortOrder?: number
}) {
  await requireAdmin()
  await prisma.category.update({ where: { id }, data })
  revalidateCategories()
  redirect('/admin/categories')
}
