"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, RefreshCw, Shield, Star, Truck, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BrandSplitCallout,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishlist, setAddedToWishlist] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [pageLoading, setPageLoading] = useState(true);

  // Fetch product data from API
  useEffect(() => {
    const loadProduct = async () => {
      const { slug } = await params;
      try {
        const res = await fetch(`/api/products/by-slug/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
          setSelectedVariant(data.variants[0]?.id || null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setPageLoading(false);
      }
    };
    loadProduct();
  }, [params]);

  if (pageLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="flex min-h-screen items-center justify-center">Product not found</div>;
  }

  const firstVariant = product.variants.find((v: any) => v.id === selectedVariant) || product.variants[0];
  const mainImage = product.images[0]?.url || "/images/fnp/products/gift01.webp";
  const gallery =
    product.images.length > 0
      ? product.images
      : [{ id: "fallback", url: mainImage, alt: product.name }];

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: firstVariant.id,
          quantity,
        }),
      });

      if (res.ok) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id }),
      });

      if (res.ok) {
        setAddedToWishlist(true);
        setTimeout(() => setAddedToWishlist(false), 2000);
      }
    } catch (error) {
      console.error("Error adding to wishlist:", error);
    }
  };

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Shop", href: "/shop" }, { label: product.name }]} />

          <section className="mt-8 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="space-y-4">
              <div className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white p-4 shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                <div className="relative aspect-square overflow-hidden rounded-[1.4rem] bg-[#f7f2e8]">
                  <Image
                    src={mainImage}
                    alt={gallery[0]?.alt || product.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {gallery.slice(0, 4).map((image: any, index: number) => (
                  <div
                    key={image.id}
                    className={`overflow-hidden rounded-[1.2rem] border bg-white p-2 shadow-sm ${index === 0 ? "border-[#c59a46]" : "border-[#eadfca]"}`}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-[#f7f2e8]">
                      <Image
                        src={image.url}
                        alt={image.alt || product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-[#8d6a2f]">
                {product.category.name}
              </p>
              <h1 className="mt-3 font-sans text-[2.3rem] font-semibold leading-tight text-slate-950 sm:text-[3rem]">
                {product.name}
              </h1>

              <div className="mt-4 flex items-center gap-3">
                <div className="flex items-center gap-1 text-[#efb423]">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-500">4.8 rating</span>
              </div>

              <div className="mt-5 flex items-end gap-3">
                <span className="font-sans text-[2rem] font-bold text-slate-950">
                  ₹{Number(firstVariant?.price || 0)}
                </span>
                {firstVariant?.comparePrice &&
                Number(firstVariant.comparePrice) > Number(firstVariant.price) ? (
                  <span className="text-lg text-slate-400 line-through">
                    ₹{Number(firstVariant.comparePrice)}
                  </span>
                ) : null}
              </div>

              <p className="mt-5 font-sans text-[1rem] leading-8 text-slate-600">
                {product.description}
              </p>

              {product.variants.length > 1 ? (
                <div className="mt-6">
                  <p className="font-sans text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Variant
                  </p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    {product.variants.map((variant: any) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`rounded-full border px-4 py-2 text-sm font-semibold ${variant.id === selectedVariant ? "border-[#c59a46] bg-[#f8f2e5] text-slate-950" : "border-[#eadfca] bg-white text-slate-600"}`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="inline-flex items-center rounded-full border border-[#eadfca] bg-[#fbf8f1] p-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-full text-slate-600 hover:bg-white"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-10 text-center font-semibold text-slate-950">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-full text-slate-600 hover:bg-white"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  onClick={handleAddToCart}
                  disabled={loading}
                  className="h-12 flex-1 rounded-full bg-[#1f3763] text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]"
                >
                  {loading ? "Adding..." : addedToCart ? "Added!" : "Add to Cart"}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleAddToWishlist}
                  className="h-12 w-12 rounded-full border-[#d0b57a] bg-white text-slate-600 hover:bg-[#f8f2e5]"
                >
                  <Heart className={`h-5 w-5 ${addedToWishlist ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-[#fbf8f1] p-4 text-center">
                  <Truck className="mx-auto h-6 w-6 text-[#1f3763]" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">Nationwide Delivery</p>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-[#fbf8f1] p-4 text-center">
                  <Shield className="mx-auto h-6 w-6 text-[#1f7a57]" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">Secure Checkout</p>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-[#fbf8f1] p-4 text-center">
                  <RefreshCw className="mx-auto h-6 w-6 text-[#c59a46]" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">
                    Support on Custom Orders
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10 rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
            <Tabs defaultValue="description">
              <TabsList className="grid w-full max-w-xl grid-cols-3 rounded-full bg-[#f7f2e8] p-1">
                <TabsTrigger value="description" className="rounded-full">
                  Description
                </TabsTrigger>
                <TabsTrigger value="specifications" className="rounded-full">
                  Specifications
                </TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-full">
                  Reviews
                </TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <Card className="border-[#eadfca] shadow-none">
                  <CardContent className="p-6 font-sans text-[1rem] leading-8 text-slate-600">
                    <p>{product.description}</p>
                    {product.shortDesc ? <p className="mt-4">{product.shortDesc}</p> : null}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="specifications" className="mt-6">
                <Card className="border-[#eadfca] shadow-none">
                  <CardContent className="p-6">
                    <div className="grid gap-4 font-sans text-[0.98rem] text-slate-600">
                      <div className="flex items-center justify-between border-b border-[#efe4d1] pb-3">
                        <span>SKU</span>
                        <span className="font-semibold text-slate-950">
                          {firstVariant?.sku || "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between border-b border-[#efe4d1] pb-3">
                        <span>Category</span>
                        <span className="font-semibold text-slate-950">
                          {product.category.name}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Stock</span>
                        <span className="font-semibold text-slate-950">
                          {firstVariant?.stock || 0} available
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <Card className="border-[#eadfca] shadow-none">
                  <CardContent className="p-6 font-sans text-[1rem] text-slate-600">
                    Reviews will appear here as customer feedback is collected.
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </section>

          <section className="mt-10">
            <BrandSplitCallout
              title="Need this item customized or quoted in bulk?"
              description="If this product is part of a corporate run, event order, or personalized brief, contact us with the exact quantity and finishing requirements before checkout."
              primaryHref="/contact"
              primaryLabel="Request Custom Help"
              secondaryHref="/corporate-gifting"
              secondaryLabel="Corporate Gifting"
            >
              <div className="rounded-[1.6rem] border border-[#eadfca] bg-white p-6">
                <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-[#8d6a2f]">
                  Typical add-ons
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {["Names", "Logos", "Message cards", "Gift boxing", "Engraving"].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#eadfca] bg-[#fbf8f1] px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </BrandSplitCallout>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
