type Product = {
  id: string
  name: string
  slug: string
  description: string
  shortDesc: string | null
  categoryId: string
  isActive: boolean
  isFeatured: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

type Category = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  parentId: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

type Collection = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

type Occasion = {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  isActive: boolean
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}

type ProductVariant = {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  comparePrice: number | null
  costPrice: number | null
  stock: number
  lowStock: number
  weight: number | null
  attributes: any
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

type ProductImage = {
  id: string
  productId: string
  url: string
  alt: string | null
  sortOrder: number
  createdAt: Date
}

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
