import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  Building2,
  Clock3,
  Gift,
  Palette,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header-server";
import {
  BrandInfoCard,
  BrandSplitCallout,
  BrandStats,
  BrandVisualCard,
  BrandProductCard,
  BrandedHero,
  SectionHeading,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";
import { HeroRotator } from "@/components/storefront/hero-rotator";
import { getCategories, getPaginatedProducts } from "@/features/catalog/queries";

// Make this page dynamic to avoid build-time database access
export const dynamic = 'force-dynamic'

type Category = Awaited<ReturnType<typeof getCategories>>[number];
type ProductWithRelations = Awaited<ReturnType<typeof getPaginatedProducts>>['products'][number];

const serviceCards = [
  {
    icon: Boxes,
    title: "Bulk-ready curation",
    description:
      "Gift sets designed for employees, clients, partners, events, and seasonal campaigns.",
  },
  {
    icon: Palette,
    title: "Logo and brand alignment",
    description:
      "Add logos, names, sleeves, inserts, packaging, and presentation details that feel on-brand.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable fulfillment",
    description:
      "Clear approvals, packaging discipline, and dispatch planning for multi-piece orders.",
  },
];

const useCases = [
  {
    title: "Employee appreciation kits",
    description:
      "Onboarding boxes, festive gifts, and recognition sets that feel premium without looking generic.",
    image: "/images/corporate/employee-kits.jpg",
    href: "/contact",
  },
  {
    title: "Client and partner gifting",
    description: "Polished branded sets for relationship-building, launches, and premium outreach.",
    image: "/images/corporate/client-gifting.jpg",
    href: "/contact",
  },
  {
    title: "Awards and event recognition",
    description:
      "Laser engraved trophies, plaques, and commemorative pieces for ceremonies and milestones.",
    image: "/images/corporate/awards.jpg",
    href: "/contact",
  },
];

const process = [
  {
    icon: BriefcaseBusiness,
    title: "1. Share the brief",
    description:
      "Tell us the quantity, occasion, deadline, budget, and what should be personalized.",
  },
  {
    icon: Gift,
    title: "2. Curate and brand",
    description:
      "We suggest sets, packaging, and customization options that fit the brief and the brand.",
  },
  {
    icon: BadgeCheck,
    title: "3. Approve production",
    description: "Artwork, copy, and finishing details are aligned before the order is executed.",
  },
  {
    icon: Truck,
    title: "4. Dispatch with confidence",
    description:
      "Orders are packed and coordinated for timely delivery across destinations where needed.",
  },
];

export default async function CorporateGiftingPage() {
  const [categories, corporateProducts] = await Promise.all([
    getCategories().catch(() => [] as Category[]),
    getPaginatedProducts({ categorySlug: 'corporate-gifts', limit: 8 }).catch(() => ({ products: [], total: 0, totalPages: 0, currentPage: 1 })),
  ]);

  const corporateCategories = categories.filter((cat) => 
    cat.slug === 'corporate-gifts' || cat.slug === 'personalized-gifts' || cat.slug === 'gift-hampers'
  );

  const productCards = corporateProducts.products.map((product: ProductWithRelations) => ({
    name: product.name,
    price: Number(product.variants[0]?.price || 0),
    images: product.images.map(img => img.url),
    href: `/shop/${product.slug}`,
  }));
  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Corporate Gifting" }]} />

          <div className="mt-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_28px_70px_rgba(46,37,20,0.12)]">
              <div className="relative min-h-[380px] sm:min-h-[460px]">
                <HeroRotator
                  images={[
                    { url: "/images/corporate/meeting.jpg", alt: "Corporate Gifting Banner 1" },
                    { url: "/images/corporate/employee-kits.jpg", alt: "Corporate Gifting Banner 2" },
                  ]}
                  interval={5000}
                />
                <div className="via-[#11345c]/30 absolute inset-0 bg-gradient-to-r from-[#081d34]/40 to-[#1f3763]/10" />
                <div className="relative z-10 flex min-h-[380px] items-center px-6 py-10 sm:min-h-[460px] sm:px-10">
                  <div className="max-w-3xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-sans text-sm font-semibold text-white backdrop-blur">
                      <svg className="h-4 w-4 text-[#f5cf83]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Corporate Solutions
                    </span>
                    <h1 className="mt-5 font-sans text-[2.5rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[4rem]">
                      Premium corporate gifting that looks considered, not mass-produced.
                    </h1>
                    <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-white/85 sm:text-xl">
                      Symphony Enterprise helps businesses create branded gift sets, festive hampers, recognition pieces, and personalized presentation boxes that feel polished from unboxing to delivery.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/contact"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172c53]"
                      >
                        Start an Inquiry
                      </Link>
                      <Link
                        href="/shop"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur transition-colors hover:bg-white/20"
                      >
                        Browse Ready Categories
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
                { value: "500+", label: "corporate clients" },
                { value: "10K+", label: "orders fulfilled" },
                { value: "50+", label: "delivery cities" },
                { value: "98%", label: "satisfaction" },
              ]}
            />
          </section>

          <section className="mt-10 grid gap-5 md:grid-cols-3">
            {serviceCards.map((item: typeof serviceCards[number]) => (
              <BrandInfoCard key={item.title} {...item} />
            ))}
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Browse by Category"
              title="Corporate Gift Categories"
              description="Explore our range of corporate gifting options organized by category."
              align="center"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {corporateCategories.map((category) => (
                <Link key={category.id} href={`/shop?category=${category.slug}`}>
                  <BrandVisualCard
                    title={category.name}
                    description={category.description || ''}
                    image={category.slug === 'corporate-gifts' ? '/images/corporate/employee-kits.jpg' : 
                           category.slug === 'personalized-gifts' ? '/images/collections/personalized-gifts.jpg' :
                           '/images/collections/gift-hampers.jpg'}
                    href={`/shop?category=${category.slug}`}
                  />
                </Link>
              ))}
            </div>
          </section>

          {corporateProducts.products.length > 0 && (
            <section className="mt-10">
              <SectionHeading
                eyebrow="Featured Products"
                title="Corporate Gift Collection"
                description="Premium products perfect for corporate gifting and recognition."
                align="center"
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {productCards.map((product) => (
                  <BrandProductCard key={product.href} {...product} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  href="/shop?category=corporate-gifts"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]"
                >
                  View All Corporate Gifts
                </Link>
              </div>
            </section>
          )}

          <section className="mt-10 grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
              <SectionHeading
                eyebrow="Why Teams Choose Symphony"
                title="One partner for kits, hampers, awards, and presentation."
                description="The advantage is not just product range. It is the ability to make different product types feel visually coherent across the same campaign."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[#f0e4ca] bg-[#fffaf1] p-5">
                  <Building2 className="h-8 w-8 text-[#1f3763]" />
                  <p className="mt-4 font-sans text-lg font-semibold text-slate-950">
                    Festive gifting
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Diwali, year-end, and event gifting built for scale and presentation.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[#f0e4ca] bg-[#fffaf1] p-5">
                  <Users className="h-8 w-8 text-[#1f7a57]" />
                  <p className="mt-4 font-sans text-lg font-semibold text-slate-950">
                    Employee kits
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Welcome kits, appreciation gifts, and internal milestone packages.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[#f0e4ca] bg-[#fffaf1] p-5">
                  <Clock3 className="h-8 w-8 text-[#c59a46]" />
                  <p className="mt-4 font-sans text-lg font-semibold text-slate-950">
                    Deadline-aware execution
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Practical support around production windows, proofs, and dispatch timing.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[#f0e4ca] bg-[#fffaf1] p-5">
                  <Gift className="h-8 w-8 text-[#1f3763]" />
                  <p className="mt-4 font-sans text-lg font-semibold text-slate-950">
                    Brandable formats
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Mugs, hampers, plaques, trophies, and curated premium sets with brand
                    integration.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
              <div className="relative min-h-[320px]">
                <Image
                  src="/images/corporate/meeting.jpg"
                  alt="Corporate gifting hero"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
              </div>
              <div className="p-6">
                <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-[#8d6a2f]">
                  Suitable For
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {[
                    "Festive campaigns",
                    "New joiner kits",
                    "Awards nights",
                    "Client outreach",
                    "Partner gifting",
                    "Leadership gifts",
                  ].map((item: string) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#eadfca] bg-[#fbf8f1] px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Use Cases"
              title="Common corporate formats we help build."
              description="You can start with a ready direction or bring a fully defined brief. Both work."
              align="center"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {useCases.map((item: typeof useCases[number]) => (
                <BrandVisualCard key={item.title} {...item} />
              ))}
            </div>
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Process"
              title="A simple workflow that keeps approvals and delivery under control."
              align="center"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {process.map((item: typeof process[number]) => (
                <BrandInfoCard key={item.title} {...item} />
              ))}
            </div>
          </section>

          <section className="mt-10">
            <BrandSplitCallout
              title="Ready to plan a branded gifting run?"
              description="Send quantity, budget, timeline, city list, and branding requirements. We will help shape the right combination of products and presentation."
              primaryHref="/contact"
              primaryLabel="Request a Quote"
              secondaryHref="tel:+917978974823"
              secondaryLabel="Call the Team"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <Boxes className="mx-auto h-8 w-8 text-[#1f7a57]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Bulk sets</p>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <Palette className="mx-auto h-8 w-8 text-[#1f3763]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Branding</p>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <Truck className="mx-auto h-8 w-8 text-[#c59a46]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Dispatch</p>
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
