'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@/features/catalog/actions'

export function DeleteProductButton({
  productId,
  productName,
  orderItemCount,
  cartItemCount,
  wishlistItemCount,
  isActive,
}: {
  productId: string
  productName: string
  orderItemCount: number
  cartItemCount: number
  wishlistItemCount: number
  isActive: boolean
}) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  const blocked = orderItemCount > 0

  async function handleDelete() {
    let msg: string

    if (blocked) {
      msg =
        `"${productName}" is part of ${orderItemCount} past order${orderItemCount === 1 ? '' : 's'}.\n\n` +
        'Soft delete is blocked because it would destroy order history. ' +
        'Options:\n' +
        '  - Mark the product Inactive (Power button) to hide it from the store.\n' +
        '  - Open the product page and use Hard Delete to wipe it and its history.'
    } else {
      const extras: string[] = []
      if (cartItemCount > 0) extras.push(`${cartItemCount} cart item${cartItemCount === 1 ? '' : 's'}`)
      if (wishlistItemCount > 0) extras.push(`${wishlistItemCount} wishlist item${wishlistItemCount === 1 ? '' : 's'}`)
      const extraLine = extras.length > 0 ? `\n\nRelated data that will also be removed: ${extras.join(', ')}.` : ''
      msg =
        `Are you sure you want to delete "${productName}"?\n\n` +
        `It has no past orders, so this is safe.${extraLine}\n\n` +
        'This action cannot be undone.'
    }

    if (!confirm(msg)) {
      return
    }

    setDeleting(true)
    try {
      await deleteProduct(productId)
      router.refresh()
    } catch (err: any) {
      alert(err.message || 'Failed to delete product')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting || blocked}
      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      title={
        blocked
          ? `Has ${orderItemCount} order${orderItemCount === 1 ? '' : 's'} - mark inactive and use Hard Delete from the product page`
          : isActive
            ? 'Delete product (will fail if it has order history)'
            : 'Delete product'
      }
      aria-label={`Delete ${productName}`}
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
