'use client'

import { useRouter, useSearchParams } from 'next/navigation'

export function SortDropdown() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', value)
    }
    
    // Reset to page 1 when sorting
    params.delete('page')
    
    router.push(`/shop?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm font-medium text-slate-600">Sort by:</label>
      <select
        id="sort"
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="rounded-lg border border-[#e6dbc4] bg-white px-4 py-2 text-sm text-slate-700 focus:border-[#d0b57a] focus:outline-none focus:ring-1 focus:ring-[#d0b57a]"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
      </select>
    </div>
  )
}
