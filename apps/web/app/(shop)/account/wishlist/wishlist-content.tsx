"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";
import { useEffect, useState } from "react";

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    images: { url: string }[];
  };
}

export function WishlistContent() {
  const { status } = useSession();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchWishlist();
    }
  }, [status, router]);

  const fetchWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist");
      if (res.ok) {
        const data = await res.json();
        setWishlistItems(data || []);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "unauthenticated" || loading) {
    return null;
  }

  return (
    <StorefrontCanvas>
      <SiteHeader />
      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "My Account", href: "/account" }, { label: "Wishlist" }]} />
          <div className="mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-sans text-[2.6rem] font-semibold tracking-tight text-slate-950">My Wishlist</h1>
                <p className="mt-2 font-sans text-[1rem] text-slate-600">{wishlistItems.length} items saved</p>
              </div>
            </div>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {wishlistItems.map((item: WishlistItem) => (
                <div key={item.id} className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                  <div className="relative aspect-square overflow-hidden bg-[#f7f2e8]">
                    <Image 
                      src={item.product.images[0]?.url || "/images/fnp/products/gift01.webp"} 
                      alt={item.product.name} 
                      fill 
                      className="object-cover transition-transform duration-500 hover:scale-105" 
                    />
                    <button className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfca] bg-white/90 text-red-500 shadow-sm backdrop-blur transition-colors hover:bg-red-50">
                      <Heart className="h-5 w-5 fill-current" />
                    </button>
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 font-sans text-base font-semibold text-slate-950">{item.product.name}</h3>
                    <p className="mt-2 font-sans text-lg font-bold text-slate-950">₹{item.product.price}</p>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" className="h-9 flex-1 rounded-full bg-[#1f3763] text-xs font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]">
                        <ShoppingBag className="mr-2 h-3.5 w-3.5" />Add to Cart
                      </Button>
                      <Button size="sm" variant="outline" className="h-9 rounded-full border-[#d0b57a] bg-white text-xs font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5]">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {wishlistItems.length === 0 && (
              <div className="mt-10 rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f2e8] text-[#1f3763]"><Heart className="h-9 w-9" /></div>
                <h2 className="mt-6 font-sans text-[2rem] font-semibold text-slate-950">Your wishlist is empty</h2>
                <p className="mx-auto mt-3 max-w-xl font-sans text-[1rem] leading-7 text-slate-600">Save items you love by clicking the heart icon</p>
                <Button asChild className="mt-6 h-12 rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]">
                  <Link href="/shop">Explore Products</Link>
                </Button>
              </div>
            )}
          </div>
        </StorefrontContainer>
      </main>
      <SiteFooter />
    </StorefrontCanvas>
  );
}
