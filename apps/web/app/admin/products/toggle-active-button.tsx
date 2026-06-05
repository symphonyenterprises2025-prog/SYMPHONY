'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Power } from 'lucide-react'
import { toggleProductActive } from '@/features/catalog/actions'

export function ToggleActiveButton({
  productId,
  productName,
  isActive,
}: {
  productId: string
  productName: string
  isActive: boolean
}) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleToggle() {
    const next = !isActive
    const verb = next ? 'deactivate' : 'activate'
    const warn = next
      ? `"${productName}" will be hidden from the storefront. You can reactivate it later, or hard-delete it from the product page.`
      : `"${productName}" will be visible on the storefront again.`
    if (!confirm(`${verb.charAt(0).toUpperCase() + verb.slice(1)} this product?\n\n${warn}`)) {
      return
    }
    setLoading(true)
    try {
      await toggleProductActive(productId)
      router.refresh()
    } catch (err: any) {
      alert(err.message || `Failed to ${verb} product`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="p-1.5 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
      title={isActive ? 'Deactivate product (hide from store)' : 'Activate product (show on store)'}
      aria-label={isActive ? 'Deactivate product' : 'Activate product'}
    >
      <Power
        className={`w-4 h-4 ${isActive ? 'text-green-600' : 'text-gray-400'}`}
      />
    </button>
  )
}
