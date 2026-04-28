"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Menu, Search, ShoppingCart, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BrandWordmark, StorefrontContainer } from "@/components/storefront/brand-system";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Shop By Occasion", href: "/occasions" },
  { label: "Corporate Gifts", href: "/corporate-gifting" },
  { label: "Collections", href: "/collections" },
  { label: "Personalized", href: "/personalized-gifts" },
  { label: "Blog", href: "/blog" },
];

const actionItems = [
  { label: "Search", href: "/shop", icon: Search },
  { label: "User Account", href: "/account", icon: User },
  { label: "Wishlist", href: "/account/wishlist", icon: Heart },
  { label: "Shopping Cart", href: "/cart", icon: ShoppingCart },
];

export function SiteHeader({ cartCount = 0 }: { cartCount?: number }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#eadfca] bg-white/95 shadow-[0_12px_35px_rgba(33,27,17,0.08)] backdrop-blur">
      <div className="h-9 bg-gradient-to-r from-[#c79b45] via-[#e1bf75] to-[#c79b45]" />

      <StorefrontContainer className="flex flex-wrap items-center justify-between gap-6 py-4">
        <BrandWordmark compact />

        <nav className="hidden items-center gap-8 xl:flex">
          {navItems.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "relative font-sans text-[1rem] font-semibold text-slate-900 transition-colors hover:text-[#be9548]",
                  active && "text-slate-950"
                )}
              >
                {item.label}
                {active ? (
                  <span className="absolute -bottom-3 left-0 h-[3px] w-full rounded-full bg-[#c6a056]" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 sm:gap-5">
          {actionItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.label}
                href={item.href}
                className="group hidden text-center md:flex md:flex-col md:items-center md:gap-1"
              >
                <span className="relative">
                  <Icon
                    className="h-6 w-6 text-slate-900 transition-colors group-hover:text-[#be9548]"
                    strokeWidth={1.9}
                  />
                  {item.label === "Shopping Cart" && cartCount > 0 ? (
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#243c68] text-[0.7rem] font-bold text-white">
                      {cartCount}
                    </span>
                  ) : null}
                </span>
                <span className="text-[0.72rem] font-medium text-slate-900 lg:text-[0.82rem]">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-[#eadfca] bg-white text-slate-900 hover:bg-[#f8f2e5] xl:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] border-r-[#eadfca] bg-[#fbf8f1] px-6">
              <div className="pt-6">
                <BrandWordmark compact />
              </div>
              <div className="mt-10 space-y-8">
                <nav className="flex flex-col space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="rounded-2xl border border-[#eadfca] bg-white px-4 py-3 text-base font-semibold text-slate-900 shadow-sm transition-colors hover:bg-[#f8f2e5]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="grid grid-cols-2 gap-3">
                  {actionItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="rounded-2xl border border-[#eadfca] bg-white px-4 py-4 text-center shadow-sm"
                      >
                        <Icon className="mx-auto h-5 w-5 text-[#1f3763]" />
                        <p className="mt-2 text-xs font-semibold text-slate-900">{item.label}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </StorefrontContainer>

      <div className="border-t border-[#eee4d2] bg-gradient-to-r from-[#fbfaf6] via-[#f4f0e6] to-[#fbfaf6] px-4 py-3 text-center font-sans text-[0.95rem] font-semibold text-slate-900 sm:text-[1.05rem]">
        Making Every Occasion Special Since 2010. Nationwide Delivery.
      </div>
    </header>
  );
}
