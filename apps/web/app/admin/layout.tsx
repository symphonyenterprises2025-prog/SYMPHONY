import Link from '@/components/ui/safe-link'
import Image from 'next/image'
import { ReactNode } from 'react'
import { Providers } from './providers'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen">
        <aside className="w-64 border-r bg-white">
          <div className="p-6 border-b">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-slate-200">
                <Image
                  src="/images/logo.png"
                  alt="Symphony logo"
                  fill
                  className="object-cover p-1"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">Symphony</h1>
                <p className="text-xs text-slate-500">Admin Panel</p>
              </div>
            </Link>
          </div>
          <nav className="p-4">
            <ul className="space-y-1">
              <li>
                <Link href="/admin" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/products" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/admin/categories" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/admin/collections" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Collections
                </Link>
              </li>
              <li>
                <Link href="/admin/occasions" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Occasions
                </Link>
              </li>
              <li>
                <Link href="/admin/add-ons" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Add-Ons
                </Link>
              </li>
              <li>
                <Link href="/admin/shop-by-categories" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Shop By Categories
                </Link>
              </li>
              <li>
                <Link href="/admin/orders" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Orders
                </Link>
              </li>
              <li>
                <Link href="/admin/customers" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Customers
                </Link>
              </li>
              <li>
                <Link href="/admin/blogs" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/admin/pages" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Pages
                </Link>
              </li>
              <li>
                <Link href="/admin/coupons" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Coupons
                </Link>
              </li>
              <li>
                <Link href="/admin/newsletter" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Newsletter
                </Link>
              </li>
              <li>
                <Link href="/admin/inquiries" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Inquiries
                </Link>
              </li>
              <li>
                <Link href="/admin/analytics" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Analytics
                </Link>
              </li>
              <li>
                <Link href="/admin/settings" className="block px-3 py-2 rounded-md hover:bg-slate-100 transition-colors">
                  Settings
                </Link>
              </li>
              <li className="pt-4 mt-4 border-t">
                <Link href="/" className="block px-3 py-2 rounded-md text-muted-foreground hover:bg-slate-100 hover:text-foreground transition-colors">
                  ← Back to Store
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 bg-slate-50 p-8">
          {children}
        </main>
      </div>
    </Providers>
  )
}
