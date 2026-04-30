'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { deleteProduct } from '@/features/catalog/actions'

export function DeleteProductButton({ productId, productName }: { productId: string, productName: string }) {
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
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
      disabled={deleting}
      className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
      title="Delete product"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
