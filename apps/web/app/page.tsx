import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header-server";
import {
  BrandProductCard,
  BrandStats,
  BrandVisualCard,
  BrandedHero,
  SectionHeading,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";
import { HeroRotator } from "@/components/storefront/hero-rotator";
import { ContactPopup } from "@/components/storefront/contact-popup";
import { getProducts, getShopByCategories } from "@/features/catalog/queries";

// Make this page dynamic to avoid build-time database access
export const dynamic = 'force-dynamic'

type ProductWithRelations = Awaited<ReturnType<typeof getProducts>>[number];
type ShopByCategory = Awaited<ReturnType<typeof getShopByCategories>>[number];

export default async function HomePage() {
  const [products, shopByCategories] = await Promise.all([
    getProducts({ limit: 8 }).catch(() => [] as ProductWithRelations[]),
    getShopByCategories().catch(() => [] as ShopByCategory[]),
  ]);

  const productCards = products.slice(0, 8).map((product: ProductWithRelations) => ({
    name: product.name,
    price: Number(product.variants[0]?.price || 0),
    images: product.images.map(img => img.url),
    href: `/shop/${product.slug}`,
  }));

  const shopByCategoryCards = shopByCategories.slice(0, 4).map((item: ShopByCategory) => ({
    title: item.name,
    description: item.description,
    image: item.image || "/images/collections/gift-hampers.jpg",
    href: item.category ? `/shop?category=${item.category.slug}` : 
           item.collection ? `/shop?collection=${item.collection.slug}` :
           item.occasion ? `/occasions/${item.occasion.slug}` : '/shop',
  }));

  return (
    <StorefrontCanvas>
      <SiteHeader />
      <ContactPopup />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <div className="mt-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_28px_70px_rgba(46,37,20,0.12)]">
              <div className="relative min-h-[380px] sm:min-h-[460px]">
                <HeroRotator
                  images={[
                    { url: "/images/home/banner1.jpg", alt: "Symphony Gifts Banner 1" },
                    { url: "/images/home/banner2.jpg", alt: "Symphony Gifts Banner 2" },
                    { url: "/images/home/banner3.jpg", alt: "Symphony Gifts Banner 3" },
                  ]}
                  interval={5000}
                />
                <div className="via-[#11345c]/48 absolute inset-0 bg-gradient-to-r from-[#081d34]/80 to-[#1f3763]/20" />
                <div className="relative z-10 flex min-h-[380px] items-center px-6 py-10 sm:min-h-[460px] sm:px-10">
                  <div className="max-w-3xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-sans text-sm font-semibold text-white backdrop-blur">
                      <svg className="h-4 w-4 text-[#f5cf83]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      India&apos;s Premium Gifting Destination
                    </span>
                    <h1 className="mt-5 font-sans text-[2.5rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[4rem]">
                      Make Every Moment Memorable with Symphony
                    </h1>
                    <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-white/85 sm:text-xl">
                      Discover personalized gifts, curated hampers, and corporate gifting solutions across India. From custom engravings to premium hampers, we help you celebrate every occasion in style.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/shop"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]"
                      >
                        Shop Now
                      </Link>
                      <Link
                        href="/customized-t-shirts"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-[#d0b57a] bg-white px-6 text-sm font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5]"
                      >
                        Customize Gifts
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="mt-8">
            <BrandStats
              items={[
                { value: "1000+", label: "products" },
                { value: "100+", label: "cities" },
                { value: "50K+", label: "happy customers" },
                { value: "4.9★", label: "rating" },
              ]}
            />
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Shop by Category"
              title="Find the Perfect Gift for Every Occasion"
              description="Explore our curated collections designed to make your gifting experience memorable and special."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {shopByCategoryCards.map((tile: any) => (
                <BrandVisualCard key={tile.title} {...tile} />
              ))}
            </div>
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Featured Products"
              title="Our Most Loved Gifts"
              description="Handpicked favorites that customers keep coming back for. Quality guaranteed with every purchase."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {productCards.map((product: typeof productCards[number]) => (
                <BrandProductCard key={`${product.name}-${product.href}`} {...product} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/shop"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]"
              >
                View All Products
              </Link>
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.4fr]">
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
              <div className="text-center">
                <h2 className="font-sans text-[2.2rem] font-semibold tracking-tight text-slate-950">
                  Why Choose Symphony?
                </h2>
                <p className="mt-2 text-slate-600">
                  Premium quality, personalized service, and timely delivery across India.
                </p>
              </div>
              <div className="mt-8 grid gap-6 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-sans text-lg font-semibold text-slate-950">Premium Quality</h3>
                  <p className="mt-2 text-sm text-slate-600">Handcrafted with care using the finest materials</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-sans text-lg font-semibold text-slate-950">Fast Delivery</h3>
                  <p className="mt-2 text-sm text-slate-600">Same-day delivery in 100+ cities across India</p>
                </div>
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-sans text-lg font-semibold text-slate-950">Personalized Touch</h3>
                  <p className="mt-2 text-sm text-slate-600">Custom engraving and personalization options</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-[#eadfca] bg-gradient-to-br from-[#1f3763] to-[#2b8b68] p-8 shadow-[0_24px_60px_rgba(45,36,20,0.1)] text-white">
              <h3 className="font-sans text-2xl font-semibold tracking-tight">Customization Corner</h3>
              <p className="mt-3 text-white/90">Create something unique with our personalization services.</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-[#f5cf83]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Name Engraving</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-[#f5cf83]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Photo Printing</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-[#f5cf83]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Custom Messages</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-[#f5cf83]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Logo Branding</span>
                </li>
              </ul>
              <Link
                href="/personalized-gifts"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold uppercase tracking-wide text-[#1f3763] hover:bg-[#f5f5f5]"
              >
                Start Customizing
              </Link>
            </div>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
