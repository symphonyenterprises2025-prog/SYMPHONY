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
import { getProducts, getCollections } from "@/features/catalog/queries";

type ProductWithRelations = Awaited<ReturnType<typeof getProducts>>[number];
type Collection = Awaited<ReturnType<typeof getCollections>>[number];

export default async function HomePage() {
  const [products, collections] = await Promise.all([
    getProducts({ limit: 8 }).catch(() => [] as ProductWithRelations[]),
    getCollections().catch(() => [] as Collection[]),
  ]);

  const productCards = products.slice(0, 8).map((product: ProductWithRelations) => ({
    name: product.name,
    price: Number(product.variants[0]?.price || 0),
    image: product.images[0]?.url || "/images/fnp/products/gift01.webp",
    href: `/shop/${product.slug}`,
  }));

  const collectionCards = collections.slice(0, 4).map((collection: Collection) => ({
    title: collection.name,
    description: collection.description,
    image: "/images/fnp/products/gift01.webp",
    href: `/collections/${collection.slug}`,
  }));

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <div className="mt-6">
            <BrandedHero
              eyebrow="India's Premium Gifting Destination"
              title="Make Every Moment Memorable with Symphony"
              description="Discover personalized gifts, curated hampers, and corporate gifting solutions across India. From custom engravings to premium hampers, we help you celebrate every occasion in style."
              image="/images/fnp/banner/b19.jpg"
            />
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
              {collectionCards.map((tile: any) => (
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
