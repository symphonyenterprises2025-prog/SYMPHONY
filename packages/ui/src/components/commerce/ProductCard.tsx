'use client'

import Link from 'next/link'
import Image from 'next/image'
import { cn } from '../../lib/utils'
import { Price } from '../base/Price'
import { ProductBadge } from './ProductBadge'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    shortDesc?: string
    variants: Array<{ price: number; comparePrice?: number }>
    images: Array<{ url: string; alt?: string }>
    isFeatured?: boolean
  }
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const firstVariant = product.variants[0]
  const firstImage = product.images[0]

  return (
    <Link href={`/shop/${product.slug}`} className={cn('group', className)}>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        {firstImage && (
          <Image
            src={firstImage.url}
            alt={firstImage.alt || product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        )}
        {product.isFeatured && <ProductBadge>Featured</ProductBadge>}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="font-medium line-clamp-1">{product.name}</h3>
        {product.shortDesc && (
          <p className="text-sm text-muted-foreground line-clamp-2">{product.shortDesc}</p>
        )}
        {firstVariant && (
          <Price
            amount={firstVariant.price}
            compareAmount={firstVariant.comparePrice}
            size="sm"
          />
        )}
      </div>
    </Link>
  )
}
