import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StorefrontCanvas, StorefrontContainer } from '@/components/storefront/brand-system';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <StorefrontCanvas>
      <SiteHeader />
      <main className="pb-16 pt-24">
        <StorefrontContainer>
          <div className="mx-auto max-w-[600px] text-center">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f7f2e8]">
              <span className="text-4xl font-bold text-[#1f3763]">404</span>
            </div>
            <h1 className="mt-8 font-sans text-[2.6rem] font-semibold tracking-tight text-slate-950">
              Page Not Found
            </h1>
            <p className="mt-4 font-sans text-[1rem] leading-7 text-slate-600">
              The page you are looking for does not exist or has been moved. 
              Let us help you find what you need.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button asChild className="h-12 rounded-full bg-[#1f3763] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-12 rounded-full border-[#d0b57a] px-8 text-sm font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5]">
                <Link href="/shop">
                  <Search className="mr-2 h-4 w-4" />
                  Browse Shop
                </Link>
              </Button>
            </div>
          </div>
        </StorefrontContainer>
      </main>
      <SiteFooter />
    </StorefrontCanvas>
  );
}
