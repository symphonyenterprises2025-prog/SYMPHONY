'use client'

import { Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function SearchInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  // Update URL when debounced query changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (debouncedQuery) {
      params.set('q', debouncedQuery)
    } else {
      params.delete('q')
    }
    
    // Reset to page 1 when searching
    params.delete('page')
    
    router.push(`/shop?${params.toString()}`)
  }, [debouncedQuery, router, searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products by name..."
        className="h-12 w-full rounded-xl border border-[#e6dbc4] pl-11 pr-12 text-sm outline-none focus:border-[#d0b57a] focus:ring-2 focus:ring-[#d0b57a]/20 transition-all"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg bg-slate-100 p-1.5 text-slate-500 hover:bg-slate-200 transition-colors"
          aria-label="Clear search"
        >
          <Search className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
