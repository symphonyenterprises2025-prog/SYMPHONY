import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header-server";
import {
  BrandStats,
  BrandVisualCard,
  BrandedHero,
  SectionHeading,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";
import { getPaginatedProducts } from "@/features/catalog/queries";

type ProductWithRelations = Awaited<ReturnType<typeof getPaginatedProducts>>['products'][number];

export default async function CustomizedTShirtsPage() {
  const paginatedData = await getPaginatedProducts({ 
    categorySlug: 'customized-t-shirts',
    limit: 12 
  }).catch(() => ({ products: [], total: 0, totalPages: 0, currentPage: 1 }));

  const products = paginatedData.products;

  const productCards = products.map((product: ProductWithRelations) => ({
    name: product.name,
    price: Number(product.variants[0]?.price || 0),
    image: product.images[0]?.url || "/images/fnp/products/gift01.webp",
    href: `/shop/${product.slug}`,
  }));

  const customizationOptions = [
    {
      title: "Photo Prints",
      description: "Upload your favorite photos to print on T-shirts",
      icon: "📷",
    },
    {
      title: "Name Customization",
      description: "Add names, dates, or custom text",
      icon: "✏️",
    },
    {
      title: "God & Deity Prints",
      description: "Religious and spiritual designs",
      icon: "🙏",
    },
    {
      title: "Anime Characters",
      description: "Popular anime and cartoon characters",
      icon: "🎨",
    },
    {
      title: "Quotes & Messages",
      description: "Inspirational quotes and custom messages",
      icon: "💬",
    },
    {
      title: "Custom Designs",
      description: "Any custom artwork or design",
      icon: "🎭",
    },
  ];

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Customized T-Shirts" }]} />

          <div className="mt-6">
            <BrandedHero
              eyebrow="T-Shirt Personalization"
              title="Design Your Own Custom T-Shirts"
              description="Create unique T-shirts with photos, names, quotes, anime characters, god prints, and custom designs. Perfect for personal use, events, and gifting."
              image="/images/fnp/banner/b19.jpg"
              actions={
                <Link
                  href="/shop?category=customized-t-shirts"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172c53]"
                >
                  Browse T-Shirts
                </Link>
              }
            />
          </div>

          <section className="mt-8">
            <BrandStats
              items={[
                { value: "100+", label: "design options" },
                { value: "Premium", label: "cotton quality" },
                { value: "Custom", label: "printing" },
                { value: "Fast", label: "delivery" },
              ]}
            />
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Customization Options"
              title="Choose Your Personalization Style"
              description="Select from our wide range of customization options to create your perfect T-shirt."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {customizationOptions.map((option) => (
                <div
                  key={option.title}
                  className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] hover:shadow-[0_32px_80px_rgba(45,36,20,0.15)] transition-shadow"
                >
                  <div className="text-4xl mb-4">{option.icon}</div>
                  <h3 className="font-sans text-xl font-semibold text-slate-950">
                    {option.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">{option.description}</p>
                </div>
              ))}
            </div>
          </section>

          {products.length > 0 && (
            <section className="mt-10">
              <SectionHeading
                eyebrow="Featured T-Shirts"
                title="Popular Custom T-Shirt Designs"
                description="Explore our most popular customized T-shirt designs."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {productCards.map((product: typeof productCards[number]) => (
                  <Link key={product.href} href={product.href}>
                    <div className="rounded-[2rem] border border-[#eadfca] bg-white p-4 shadow-[0_24px_60px_rgba(45,36,20,0.1)] hover:shadow-[0_32px_80px_rgba(45,36,20,0.15)] transition-all hover:-translate-y-1">
                      <div className="aspect-square rounded-xl bg-[#fbf8f1] overflow-hidden mb-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="font-sans text-lg font-semibold text-slate-950">
                        {product.name}
                      </h3>
                      <p className="mt-2 text-sm font-semibold text-[#1f3763]">
                        ₹{product.price}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  href="/shop?category=customized-t-shirts"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]"
                >
                  View All T-Shirts
                </Link>
              </div>
            </section>
          )}

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_0.4fr]">
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-8 shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
              <SectionHeading
                eyebrow="How It Works"
                title="Simple 3-Step Customization Process"
                description="Get your custom T-shirt in just a few easy steps."
              />
              <div className="mt-6 space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f3763] text-white font-semibold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">Choose Your Design</h3>
                    <p className="mt-1 text-sm text-slate-600">Select from our templates or upload your own design</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f3763] text-white font-semibold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">Customize Details</h3>
                    <p className="mt-1 text-sm text-slate-600">Add photos, names, quotes, or any custom text</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1f3763] text-white font-semibold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-950">Place Order</h3>
                    <p className="mt-1 text-sm text-slate-600">Review and checkout - we'll print and deliver</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#eadfca] bg-gradient-to-br from-[#1f3763] to-[#2b8b68] p-8 shadow-[0_24px_60px_rgba(45,36,20,0.1)] text-white">
              <h3 className="font-sans text-2xl font-semibold tracking-tight">Bulk Orders Welcome</h3>
              <p className="mt-3 text-white/90">Planning an event or need multiple T-shirts? Get special pricing for bulk orders.</p>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center gap-2">
                  <span className="text-[#f5cf83]">✓</span>
                  <span className="text-sm">Corporate events</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#f5cf83]">✓</span>
                  <span className="text-sm">Team uniforms</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#f5cf83]">✓</span>
                  <span className="text-sm">Festival merchandise</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#f5cf83]">✓</span>
                  <span className="text-sm">Family reunions</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-white px-6 text-sm font-semibold uppercase tracking-wide text-[#1f3763] hover:bg-[#f5f5f5]"
              >
                Get Quote
              </Link>
            </div>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
