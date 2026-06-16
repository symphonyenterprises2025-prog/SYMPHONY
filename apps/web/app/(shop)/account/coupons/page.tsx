'use client'

import { SiteHeader } from '@/components/layout/site-header'
import { SiteFooter } from '@/components/layout/site-footer'
import { StorefrontCanvas, StorefrontContainer } from '@/components/storefront/brand-system'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Ticket, Copy, Check, Clock } from 'lucide-react'

export default function MyCouponsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [coupons, setCoupons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
      return
    }

    if (status === 'authenticated') {
      fetchCoupons()
    }
  }, [status, router])

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/user-coupons')
      if (res.ok) {
        const data = await res.json()
        setCoupons(data.coupons || [])
      }
    } catch (error) {
      console.error('Error fetching coupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (status === 'unauthenticated' || loading) {
    return null
  }

  return (
    <StorefrontCanvas>
      <SiteHeader />
      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: 'My Account', href: '/account' }, { label: 'My Coupons' }]} />
          <div className="mt-6">
            <h1 className="font-sans text-[2.6rem] font-semibold tracking-tight text-slate-950">My Coupons</h1>
            <p className="mt-2 font-sans text-[1rem] text-slate-600">Your available discount coupons</p>
          </div>

          <div className="mt-8 space-y-4">
            {coupons.length === 0 ? (
              <div className="rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center">
                <Ticket className="mx-auto h-12 w-12 text-[#d0b57a]" />
                <h3 className="mt-4 text-xl font-semibold text-slate-900">No Coupons Yet</h3>
                <p className="mt-2 text-slate-500">You will receive a coupon after placing an order.</p>
              </div>
            ) : (
              coupons.map((coupon: any) => (
                <div
                  key={coupon.id}
                  className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_18px_40px_rgba(46,38,22,0.08)]"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white">
                        <Ticket className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="rounded-lg bg-[#f8f2e5] px-3 py-1.5 font-mono text-lg font-bold tracking-wider text-[#1f3763]">
                            {coupon.code}
                          </code>
                          <button
                            onClick={() => handleCopy(coupon.code)}
                            className="rounded-full p-2 text-slate-400 hover:bg-[#f8f2e5] hover:text-slate-700 transition-colors"
                            title="Copy code"
                          >
                            {copiedCode === coupon.code ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        {coupon.description && (
                          <p className="mt-1 text-sm text-slate-600">{coupon.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-[#1f7a57]">
                        {coupon.discountType === 'PERCENTAGE' ? `${Number(coupon.discountValue)}% OFF` : `₹${Number(coupon.discountValue)} OFF`}
                      </p>
                      {coupon.expiresAt && (
                        <p className="mt-1 flex items-center justify-end gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" />
                          Expires {new Date(coupon.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </StorefrontContainer>
      </main>
      <SiteFooter />
    </StorefrontCanvas>
  )
}
