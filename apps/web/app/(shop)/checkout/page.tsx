"use client";

import { useEffect, useState } from "react";
import { CreditCard, Lock, ShieldCheck, Truck, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant: string;
  productId: string;
  variantId?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    saveAddress: false,
    paymentMethod: "UPI",
  });
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Fetch cart data on mount
  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setCartItems(data.items);
        } else {
          // Redirect to cart if empty
          router.push("/cart");
        }
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  }

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 999 ? 0 : 99;
  const giftWrapping = 99;
  const tax = Math.round(subtotal * 0.09); // 9% tax
  const total = subtotal + shipping + giftWrapping + tax;

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    if (!formData.email.includes("@")) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    const orderPayload = {
      customerEmail: formData.email,
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerPhone: formData.phone,
      items: cartItems.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        productName: item.name,
        variantName: item.variant,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
      })),
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address1: formData.address,
        city: formData.city,
        state: formData.state,
        postalCode: formData.pincode,
        country: "India",
      },
      subtotal,
      shippingCost: shipping,
      tax,
      discount: 0,
      total,
      paymentMethod: formData.paymentMethod,
    };

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      setOrderNumber(data.orderNumber);
      setOrderSuccess(true);

      // Clear cart after successful order
      await fetch("/api/cart", { method: "DELETE" });
    } catch (err: any) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  }
  if (orderSuccess) {
    return (
      <StorefrontCanvas>
        <SiteHeader />
        <main className="pb-16 pt-8">
          <StorefrontContainer>
            <div className="mx-auto max-w-[600px] rounded-[2rem] border border-[#eadfca] bg-white p-8 text-center shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="font-sans text-[2.2rem] font-semibold text-slate-950">
                Order Placed Successfully!
              </h1>
              <p className="mt-4 text-slate-600">
                Thank you for your order. We've sent a confirmation email to <strong>{formData.email}</strong>.
              </p>
              <div className="mt-6 rounded-xl bg-[#f8f2e5] p-4">
                <p className="text-sm text-slate-500">Order Number</p>
                <p className="text-xl font-bold text-[#1f3763]">{orderNumber}</p>
              </div>
              <p className="mt-6 text-sm text-slate-500">
                You will receive an email confirmation shortly with your order details and tracking information.
              </p>
              <div className="mt-8 flex gap-4 justify-center">
                <Button
                  onClick={() => router.push("/account/orders")}
                  className="h-12 rounded-full bg-[#1f3763] px-8 text-sm font-semibold text-white hover:bg-[#172c53]"
                >
                  View My Orders
                </Button>
                <Button
                  onClick={() => router.push("/shop")}
                  variant="outline"
                  className="h-12 rounded-full border-[#d0b57a] px-8 text-sm font-semibold text-[#1f3763]"
                >
                  Continue Shopping
                </Button>
              </div>
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
          <Breadcrumbs
            items={[
              { label: "Shop", href: "/shop" },
              { label: "Cart", href: "/cart" },
              { label: "Checkout" },
            ]}
          />

          <section className="mt-8">
            <h1 className="font-sans text-[2.6rem] font-semibold tracking-tight text-slate-950">
              Checkout
            </h1>
            <p className="mt-2 font-sans text-[1rem] text-slate-600">
              Finish the order with delivery details, payment selection, and optional gift
              presentation.
            </p>
          </section>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-8 xl:grid-cols-[1fr_0.38fr]">
            <div className="space-y-8">
              <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white">
                    <Truck className="h-5 w-5" />
                  </div>
                  <h2 className="font-sans text-[1.6rem] font-semibold text-slate-950">
                    Shipping Information
                  </h2>
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="John"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Doe"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                      required
                    />
                  </div>
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                      required
                    />
                  </div>
                </div>

                <div className="mt-5 space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Gift Street"
                    className="h-12 rounded-xl border-[#e6dbc4]"
                    required
                  />
                </div>

                <div className="mt-5 grid gap-5 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Bhubaneswar"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Odisha"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      placeholder="751001"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                    />
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <Checkbox
                    id="saveAddress"
                    checked={formData.saveAddress}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, saveAddress: checked as boolean }))
                    }
                  />
                  <Label htmlFor="saveAddress" className="text-sm text-slate-600">
                    Save this address for future orders
                  </Label>
                </div>
              </div>

              <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <h2 className="font-sans text-[1.6rem] font-semibold text-slate-950">
                    Payment Method
                  </h2>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "UPI", detail: "Google Pay, PhonePe, Paytm", active: true },
                    { label: "Credit or Debit Card", detail: "Visa, Mastercard, RuPay" },
                    { label: "Cash on Delivery", detail: "For eligible orders and locations" },
                  ].map((method) => (
                    <div
                      key={method.label}
                      className={`rounded-[1.4rem] border p-4 ${method.active ? "border-[#c59a46] bg-[#f8f2e5]" : "border-[#eadfca] bg-white"}`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <Checkbox id={method.label} checked={method.active} />
                          <Label htmlFor={method.label} className="font-semibold text-slate-950">
                            {method.label}
                          </Label>
                        </div>
                        <span className="text-sm text-slate-500">{method.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="space-y-8">
              <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                <h2 className="font-sans text-[1.6rem] font-semibold text-slate-950">
                  Order Summary
                </h2>
                <div className="mt-6 space-y-3 font-sans text-[0.98rem] text-slate-600">
                  {cartItems.length > 0 ? (
                    cartItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <span>{item.name} x {item.quantity}</span>
                        <span className="font-semibold text-slate-950">₹{item.price * item.quantity}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-slate-500">Loading cart...</div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span className="font-semibold text-slate-950">
                      {shipping === 0 ? "Free" : `₹${shipping}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gift Wrapping</span>
                    <span className="font-semibold text-slate-950">₹{giftWrapping}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Tax (9%)</span>
                    <span className="font-semibold text-slate-950">₹{tax}</span>
                  </div>
                  <div className="border-t border-[#efe4d1] pt-3 text-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-950">Total</span>
                      <span className="font-bold text-[#1f3763]">₹{total}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-[1.4rem] border border-[#eadfca] bg-[#fbf8f1] p-4 text-sm text-slate-600">
                  Add a note, wrapping option, or personalization request after shipping details are
                  confirmed.
                </div>

                <Button
                  type="submit"
                  disabled={loading || cartItems.length === 0}
                  className="mt-6 h-12 w-full rounded-full bg-[#1f3763] text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </div>

              <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                <div className="flex items-start gap-3 text-sm text-slate-600">
                  <Lock className="mt-0.5 h-4 w-4 text-[#1f3763]" />
                  <span>
                    Payment information is encrypted and processed through a secure checkout flow.
                  </span>
                </div>
                <div className="mt-4 flex items-start gap-3 text-sm text-slate-600">
                  <ShieldCheck className="mt-0.5 h-4 w-4 text-[#1f7a57]" />
                  <span>
                    Need help before placing the order? Contact Symphony for customization or
                    delivery guidance.
                  </span>
                </div>
              </div>
            </aside>
          </form>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
