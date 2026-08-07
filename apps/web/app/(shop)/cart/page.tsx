"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "@/components/ui/safe-link";
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: string;
  customization?: { text?: string } | null;
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  // The cart lives against a user row, so a logged-out visitor gets a 401 and
  // no items. Showing "your cart is empty" there reads as "we lost your cart".
  const [signedOut, setSignedOut] = useState(false);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
      if (res.status === 401) {
        setSignedOut(true);
      } else if (res.ok) {
        const data = await res.json();
        if (data.items) {
          setCartItems(data.items.map((item: any) => ({
            id: item.id,
            name: item.product?.name || item.productName,
            price: Number(item.variant?.price || item.price || 0),
            quantity: item.quantity,
            image: item.product?.images?.[0]?.url || item.image || "/images/collections/gift-hampers.jpg",
            variant: item.variant?.name || item.variantName || "Standard",
            customization: item.customization ?? null,
          })));
        }
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }

  async function updateQuantity(itemId: string, newQuantity: number) {
    if (newQuantity < 1) return;
    setUpdatingItem(itemId);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId, quantity: newQuantity }),
      });
      if (res.ok) {
        setCartItems((prev) =>
          prev.map((item: CartItem) =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        );
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
    } finally {
      setUpdatingItem(null);
    }
  }

  async function removeItem(itemId: string) {
    setUpdatingItem(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      if (res.ok) {
        setCartItems((prev) => prev.filter((item: CartItem) => item.id !== itemId));
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setUpdatingItem(null);
    }
  }

  async function applyDiscount() {
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: discountCode, subtotal }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscountAmount(data.coupon.discountAmount);
        setDiscountApplied(true);
      } else {
        alert(data.error || "Invalid discount code");
      }
    } catch {
      alert("Failed to validate coupon. Please try again.");
    }
  }

  const subtotal = cartItems.reduce((acc: number, item: CartItem) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const total = subtotal + shipping - discountAmount;

  if (loading) {
    return (
      <StorefrontCanvas>
        <SiteHeader />
        <main className="pb-16 pt-8">
          <StorefrontContainer>
            <div className="flex h-64 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#1f3763]" />
            </div>
          </StorefrontContainer>
        </main>
        <SiteFooter />
      </StorefrontCanvas>
    );
  }

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Shopping Cart" }]} />

          <section className="mt-8">
            <h1 className="font-sans text-[2.6rem] font-semibold tracking-tight text-slate-950">
              Your Cart
            </h1>
            <p className="mt-2 font-sans text-[1rem] text-slate-600">
              Review the products, quantities, and add-ons before checkout.
            </p>
          </section>

          {cartItems.length > 0 ? (
            <section className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.38fr]">
              <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                <div className="hidden grid-cols-[1.4fr_0.35fr_0.35fr] gap-4 border-b border-[#efe4d1] pb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 lg:grid">
                  <span>Product</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                </div>
                <div className="mt-6 space-y-6">
                  {cartItems.map((item: CartItem) => (
                    <div
                      key={item.id}
                      className="grid gap-4 border-b border-[#efe4d1] pb-6 last:border-0 last:pb-0 lg:grid-cols-[1.4fr_0.35fr_0.35fr]"
                    >
                      <div className="flex gap-4">
                        <div className="relative h-28 w-28 overflow-hidden rounded-[1.2rem] bg-[#f7f2e8]">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h2 className="font-sans text-[1.15rem] font-semibold text-slate-950">
                            {item.name}
                          </h2>
                          <p className="mt-2 text-sm text-slate-500">{item.variant}</p>
                          {item.customization?.text && (
                            <p className="mt-2 text-sm text-[#8d6a2f]">
                              <span className="font-semibold">Personalized: </span>
                              &ldquo;{item.customization.text}&rdquo;
                            </p>
                          )}
                          <p className="mt-3 text-sm font-semibold text-[#1f3763] lg:hidden">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center lg:justify-center">
                        <div className="inline-flex items-center rounded-full border border-[#eadfca] bg-[#fbf8f1] p-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updatingItem === item.id || item.quantity <= 1}
                            className="rounded-full text-slate-600 hover:bg-white disabled:opacity-50"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-10 text-center font-semibold text-slate-950">
                            {updatingItem === item.id ? (
                              <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                            ) : (
                              item.quantity
                            )}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updatingItem === item.id}
                            className="rounded-full text-slate-600 hover:bg-white disabled:opacity-50"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between lg:justify-end">
                        <span className="hidden font-semibold text-slate-950 lg:block">
                          ₹{item.price * item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          disabled={updatingItem === item.id}
                          className="rounded-full text-slate-500 hover:bg-[#fff1f0] hover:text-red-500 disabled:opacity-50"
                        >
                          {updatingItem === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <aside className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                <h2 className="font-sans text-[1.7rem] font-semibold text-slate-950">
                  Order Summary
                </h2>
                <div className="mt-6 space-y-4 font-sans text-[0.98rem] text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-950">₹{subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-slate-950">
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  <Separator className="bg-[#efe4d1]" />
                  <div className="flex items-center justify-between text-lg">
                    <span className="font-semibold text-slate-950">Total</span>
                    <span className="font-bold text-[#1f3763]">₹{total}</span>
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Input
                    placeholder="Discount code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="h-11 rounded-xl border-[#e6dbc4]"
                  />
                  <Button
                    variant="outline"
                    onClick={applyDiscount}
                    disabled={!discountCode || discountApplied}
                    className="h-11 rounded-full border-[#d0b57a] bg-white px-5 text-sm font-semibold uppercase tracking-wide disabled:opacity-50"
                  >
                    {discountApplied ? "Applied" : "Apply"}
                  </Button>
                </div>
                {discountApplied && (
                  <p className="mt-2 text-sm text-green-600">
                    Discount applied: -₹{discountAmount}
                  </p>
                )}
                <Button
                  asChild
                  className="mt-6 h-12 w-full rounded-full bg-[#1f3763] text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]"
                >
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </aside>
            </section>
          ) : signedOut ? (
            <section className="mt-10 rounded-[2rem] border border-[#eadfca] bg-white p-6 text-center shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f2e8] text-[#1f3763] sm:h-20 sm:w-20">
                <ShoppingBag className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>
              <h2 className="mt-6 font-sans text-2xl font-semibold text-slate-950 sm:text-[2rem]">
                Sign in to see your cart
              </h2>
              <p className="mx-auto mt-3 max-w-xl font-sans text-[0.95rem] leading-7 text-slate-600 sm:text-[1rem]">
                Your cart is saved to your account so it&apos;s waiting for you on any device.
                Sign in to pick up where you left off.
              </p>
              <div className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  href="/login?callbackUrl=%2Fcart"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172c53] sm:w-auto"
                >
                  Sign in
                </Link>
                <Link
                  href="/register?callbackUrl=%2Fcart"
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-[#d0b57a] bg-white px-7 text-sm font-semibold uppercase tracking-wide text-slate-700 transition-colors hover:bg-[#f8f2e5] sm:w-auto"
                >
                  Create account
                </Link>
              </div>
              <Link
                href="/shop"
                className="mt-5 inline-block text-sm font-semibold text-[#1f3763] underline underline-offset-4"
              >
                Continue browsing
              </Link>
            </section>
          ) : (
            <section className="mt-10 rounded-[2rem] border border-[#eadfca] bg-white p-6 text-center shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-10">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7f2e8] text-[#1f3763] sm:h-20 sm:w-20">
                <ShoppingBag className="h-8 w-8 sm:h-9 sm:w-9" />
              </div>
              <h2 className="mt-6 font-sans text-2xl font-semibold text-slate-950 sm:text-[2rem]">
                Your cart is empty
              </h2>
              <p className="mx-auto mt-3 max-w-xl font-sans text-[0.95rem] leading-7 text-slate-600 sm:text-[1rem]">
                Start with the catalog, collections, or personalized gifts section to build a cart
                that fits the occasion.
              </p>
              <Button
                asChild
                className="mt-6 h-12 w-full rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53] sm:w-auto"
              >
                <Link href="/shop">Explore Products</Link>
              </Button>
            </section>
          )}
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
