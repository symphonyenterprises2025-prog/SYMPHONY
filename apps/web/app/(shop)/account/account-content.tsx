"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, LogOut, MapPin, Package, Settings, User } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";
import { useEffect, useState } from "react";

interface MenuItem {
  title: string;
  description: string;
  icon: any;
  href: string;
  count: number | null;
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
}

const menuItemsBase = [
  { title: "My Orders", description: "View your order history and track shipments", icon: Package, href: "/account/orders" },
  { title: "Wishlist", description: "View items you've saved for later", icon: Heart, href: "/account/wishlist" },
  { title: "Addresses", description: "Manage your shipping addresses", icon: MapPin, href: "/account/addresses" },
  { title: "Profile", description: "Update your personal information", icon: User, href: "/account/profile" },
  { title: "Settings", description: "Account preferences and notifications", icon: Settings, href: "/account/settings" },
];

export function AccountContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(menuItemsBase);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchAccountData();
    }
  }, [status, router]);

  const fetchAccountData = async () => {
    try {
      // Fetch orders count
      const ordersRes = await fetch("/api/orders/my");
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        const ordersCount = ordersData.orders?.length || 0;
        
        // Fetch wishlist count
        const wishlistRes = await fetch("/api/wishlist");
        if (wishlistRes.ok) {
          const wishlistData = await wishlistRes.json();
          const wishlistCount = wishlistData.length || 0;
          
          // Fetch addresses count
          const addressesRes = await fetch("/api/addresses");
          let addressesCount = 0;
          if (addressesRes.ok) {
            const addressesData = await addressesRes.json();
            addressesCount = addressesData.addresses?.length || 0;
          }

          // Update menu items with counts
          setMenuItems([
            { ...menuItemsBase[0], count: ordersCount },
            { ...menuItemsBase[1], count: wishlistCount },
            { ...menuItemsBase[2], count: addressesCount },
            { ...menuItemsBase[3], count: null },
            { ...menuItemsBase[4], count: null },
          ]);

          // Set recent orders (last 3)
          setRecentOrders(ordersData.orders?.slice(0, 3) || []);
        }
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
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
          <Breadcrumbs items={[{ label: "My Account" }]} />
          <div className="mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-sans text-[2.6rem] font-semibold tracking-tight text-slate-950">My Account</h1>
                <p className="mt-2 font-sans text-[1rem] text-slate-600">Welcome back, {session?.user?.name || "Customer"}!</p>
              </div>
              <Button variant="outline" className="h-11 rounded-full border-[#d0b57a] bg-white px-6 text-sm font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5]" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="mr-2 h-4 w-4" />Sign Out
              </Button>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href} className="group overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white"><item.icon className="h-6 w-6" /></div>
                    {item.count !== null ? <span className="rounded-full border border-[#c59a46] bg-[#f8f2e5] px-3 py-1 text-sm font-semibold text-slate-950">{item.count}</span> : null}
                  </div>
                  <h3 className="mt-4 font-sans text-[1.3rem] font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 font-sans text-[0.95rem] text-slate-600">{item.description}</p>
                </Link>
              ))}
            </div>
            <div className="mt-10 rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
              <div className="flex items-center justify-between">
                <h2 className="font-sans text-[1.7rem] font-semibold text-slate-950">Recent Orders</h2>
                <Link href="/account/orders" className="inline-flex h-11 items-center justify-center rounded-full border border-[#d0b57a] bg-[#f8f2e5] px-5 text-sm font-semibold uppercase tracking-wide text-slate-900">View All</Link>
              </div>
              <div className="mt-6 space-y-4">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between rounded-[1.4rem] border border-[#eadfca] bg-[#fbf8f1] p-4">
                      <div><p className="font-sans text-base font-semibold text-slate-950">{order.orderNumber}</p><p className="mt-1 text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                      <div className="text-right"><p className="font-sans text-base font-semibold text-slate-950">₹{order.total}</p><p className="mt-1 text-sm font-semibold text-[#1f7a57]">{order.status}</p></div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-500 py-8">No recent orders</p>
                )}
              </div>
            </div>
          </div>
        </StorefrontContainer>
      </main>
      <SiteFooter />
    </StorefrontCanvas>
  );
}
