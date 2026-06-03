"use client";

import { useState } from "react";
import { MapPin, PackageSearch, Search, Truck, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BrandInfoCard,
  BrandedHero,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";

interface OrderResult {
  orderNumber: string;
  customerName: string;
  status: string;
  createdAt: string;
  total: number;
  items: Array<{ productName: string; quantity: number; price: number }>;
}

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [contact, setContact] = useState("");
  const [tracking, setTracking] = useState(false);
  const [result, setResult] = useState<OrderResult | null>(null);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !contact) return;

    setTracking(true);
    setError("");
    setResult(null);

    try {
      // Try fetching via orders/my (requires auth) or direct search
      const res = await fetch(`/api/orders/my`);
      if (res.ok) {
        const data = await res.json();
        const found = data.orders?.find(
          (o: any) =>
            o.orderNumber?.toLowerCase() === orderNumber.toLowerCase() &&
            (o.customerEmail?.toLowerCase() === contact.toLowerCase() ||
             o.customerPhone === contact)
        );
        if (found) {
          setResult(found);
        } else {
          setError("Order not found. Please check your order number and contact info.");
        }
      } else {
        setError("Please sign in to track your orders, or contact support.");
      }
    } catch {
      setError("Failed to look up order. Please try again.");
    } finally {
      setTracking(false);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-indigo-100 text-indigo-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Track Order" }]} />

          <div className="mt-6">
            <BrandedHero
              eyebrow="Delivery Updates"
              title="Track the latest movement on your Symphony order."
              description="Enter the order number and the email or phone used at checkout."
              image="/images/fnp/banner/b2.jpg"
              overlayClassName="absolute inset-0 bg-gradient-to-r from-[#0f2230]/76 via-[#173a53]/35 to-transparent"
            />
          </div>

          <section className="mt-10 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white">
                <PackageSearch className="h-7 w-7" />
              </div>
              <h1 className="mt-5 font-sans text-[2rem] font-semibold tracking-tight text-slate-950">
                Track Your Order
              </h1>
              <p className="mt-3 font-sans text-[1rem] leading-7 text-slate-600">
                Found in your confirmation message. Sign in to your account to see all your orders.
              </p>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {result ? (
                <div className="mt-8 space-y-4">
                  <div className="rounded-xl border border-[#eadfca] bg-[#fbf8f1] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-slate-500">Order #{result.orderNumber}</p>
                        <p className="text-sm text-slate-500">{new Date(result.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[result.status] || 'bg-gray-100 text-gray-800'}`}>
                        {result.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {result.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span>{item.productName} x{item.quantity}</span>
                          <span className="font-medium">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-[#eadfca] mt-3 pt-3 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{Number(result.total)}</span>
                    </div>
                  </div>
                  <Button className="w-full h-12 rounded-full bg-[#1f3763] text-sm font-semibold text-white hover:bg-[#172c53]" onClick={() => { setResult(null); setError(""); }}>
                    Track Another Order
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleTrack} className="mt-8 space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="orderNumber">Order Number</Label>
                    <Input
                      id="orderNumber"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                      placeholder="e.g. SYM-1049284"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact">Email or Phone</Label>
                    <Input
                      id="contact"
                      value={contact}
                      onChange={(e) => setContact(e.target.value)}
                      placeholder="Enter the contact used during checkout"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                      required
                    />
                  </div>
                  <Button type="submit" disabled={tracking} className="h-12 w-full rounded-full bg-[#1f3763] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]">
                    {tracking ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</> : <><Search className="mr-2 h-4 w-4" /> Track Order</>}
                  </Button>
                </form>
              )}
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
              <BrandInfoCard
                icon={Truck}
                title="Standard Delivery Visibility"
                description="Tracking usually updates after the order is packed and handed to the delivery partner."
              />
              <BrandInfoCard
                icon={MapPin}
                title="Nationwide Fulfillment"
                description="We support delivery across India and coordinate custom orders with the same care as ready products."
              />
            </div>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
