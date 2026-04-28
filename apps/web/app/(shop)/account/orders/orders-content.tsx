"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ExternalLink, Package } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";
import { useEffect, useState } from "react";

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: string;
  total: number;
  items: {
    productName: string;
    quantity: number;
    price: number;
  }[];
}

export function OrdersContent() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/my");
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "unauthenticated" || loading) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-[#eaf7f1] text-[#1f7a57]";
      case "In Transit": return "bg-[#eef3fb] text-[#1f3763]";
      case "Processing": return "bg-[#fffaf1] text-[#c59a46]";
      case "Cancelled": return "bg-[#fff0f0] text-red-600";
      default: return "bg-[#f8f8f8] text-slate-600";
    }
  };

  return (
    <StorefrontCanvas>
      <SiteHeader />
      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "My Account", href: "/account" }, { label: "Orders" }]} />
          <div className="mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-sans text-[2.6rem] font-semibold tracking-tight text-slate-950">My Orders</h1>
                <p className="mt-2 font-sans text-[1rem] text-slate-600">View and track your order history</p>
              </div>
            </div>
            <div className="mt-8 space-y-5">
              {orders.map((order: Order) => (
                <div key={order.id} className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-sans text-lg font-semibold text-slate-950">{order.orderNumber}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusColor(order.status)}`}>{order.status}</span>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-slate-500">Total</p>
                        <p className="font-sans text-lg font-bold text-slate-950">₹{order.total}</p>
                      </div>
                      <Button variant="outline" size="sm" className="h-11 rounded-full border-[#d0b57a] bg-white px-5 text-xs font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5]">
                        <ExternalLink className="mr-2 h-3.5 w-3.5" />Track Order
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-[#efe4d1] pt-4">
                    <h4 className="font-sans text-sm font-semibold uppercase tracking-wide text-slate-500">Items</h4>
                    <div className="mt-3 space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between font-sans text-sm text-slate-600">
                          <span>{item.productName} x {item.quantity}</span>
                          <span className="font-medium text-slate-950">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {orders.length === 0 && (
              <div className="mt-10 rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f2e8] text-[#1f3763]"><Package className="h-9 w-9" /></div>
                <h2 className="mt-6 font-sans text-[2rem] font-semibold text-slate-950">No orders yet</h2>
                <p className="mx-auto mt-3 max-w-xl font-sans text-[1rem] leading-7 text-slate-600">Start shopping to see your orders here</p>
                <Button asChild className="mt-6 h-12 rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]">
                  <Link href="/shop">Start Shopping</Link>
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
