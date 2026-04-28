import type { Product, Category, Collection, Occasion, ProductVariant, ProductImage } from '@prisma/client'

export type ProductWithDetails = Product & {
  category: Category
  variants: ProductVariant[]
  images: ProductImage[]
  collections: Collection[]
  occasions: Occasion[]
}

export type ProductListItem = Product & {
  category: Category
  variants: ProductVariant[]
  images: ProductImage[]
}
