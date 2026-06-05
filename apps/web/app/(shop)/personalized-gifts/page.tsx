import Image from "next/image";
import Link from "next/link";
import { Heart, ImageIcon, PenTool, Sparkles, Trophy } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header-server";
import {
  BrandInfoCard,
  BrandSplitCallout,
  BrandVisualCard,
  BrandStats,
  BrandedHero,
  SectionHeading,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";
import { HeroRotator } from "@/components/storefront/hero-rotator";
import { getProducts, getCategories } from "@/features/catalog/queries";

// Make this page dynamic to avoid build-time database access
export const dynamic = 'force-dynamic'

// Type inferred from query return
type Category = Awaited<ReturnType<typeof getCategories>>[number];
type Product = Awaited<ReturnType<typeof getProducts>>[number];

const reasons = [
  {
    icon: Heart,
    title: "Emotion travels better",
    description:
      "Personalization turns a product into memory, which is why these gifts stay with people longer.",
  },
  {
    icon: ImageIcon,
    title: "Photo-friendly formats",
    description:
      "Frames, mugs, keepsakes, and desk products allow memories to be part of the object itself.",
  },
  {
    icon: PenTool,
    title: "Name, message, or engraving",
    description: "Simple customization options can make even small gifts feel purpose-built.",
  },
];

export default async function PersonalizedGiftsPage() {
  const [categories, products] = await Promise.all([
    getCategories().catch(() => [] as Category[]),
    getProducts({ limit: 8 }).catch(() => [] as Product[]),
  ]);

  const parentCategory = categories.find((c: Category) => c.slug === 'personalized-gifts');
  
  const personalizedCategories = categories
    .filter((c: Category) => c.parentId === parentCategory?.id)
    .map((c: Category) => ({
      title: c.name,
      description: c.description || "",
      image: c.image || "/images/collections/personalized-gifts.jpg",
      href: `/shop?category=${c.slug}`,
    }));
  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Personalized Gifts" }]} />

          <div className="mt-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_28px_70px_rgba(46,37,20,0.12)]">
              <div className="relative h-[380px] sm:h-[460px]">
                <HeroRotator
                  images={[
                    { url: "/images/personalized/banner1.jpg", alt: "Personalized Gifts Banner 1" },
                    { url: "/images/personalized/banner2.jpg", alt: "Personalized Gifts Banner 2" },
                  ]}
                  interval={5000}
                />
                <div className="via-[#11345c]/30 absolute inset-0 bg-gradient-to-r from-[#081d34]/40 to-[#1f3763]/10" />
                <div className="relative z-10 flex h-[380px] items-center px-6 py-10 sm:h-[460px] sm:px-10">
                  <div className="max-w-3xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-sans text-sm font-semibold text-white backdrop-blur">
                      <svg className="h-4 w-4 text-[#f5cf83]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Personalization Studio
                    </span>
                    <h1 className="mt-5 font-sans text-[2.5rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[4rem]">
                      Custom gifts that still look premium.
                    </h1>
                    <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-white/85 sm:text-xl">
                      Symphony focuses on personalized products that do not feel like quick print jobs. The aim is a cleaner finish, better presentation, and a stronger emotional hit.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/shop"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172c53]"
                      >
                        Explore Products
                      </Link>
                      <Link
                        href="/contact"
                        className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur transition-colors hover:bg-white/20"
                      >
                        Ask About Custom Work
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
                { value: "₹249+", label: "starting price" },
                { value: "Photo", label: "print options" },
                { value: "Laser", label: "engraving support" },
                { value: "Same Day", label: "selected cities" },
              ]}
            />
          </section>

          <section className="mt-10 grid gap-8 xl:grid-cols-[0.98fr_1.02fr]">
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
              <SectionHeading
                eyebrow="Why It Works"
                title="Personalized gifts feel stronger when the execution is cleaner."
                description="The best custom gifts are not just about adding a name. They need the right format, the right finish, and enough restraint to still look elegant."
              />
              <div className="mt-8 grid gap-5">
                {reasons.map((reason: typeof reasons[number]) => (
                  <BrandInfoCard key={reason.title} {...reason} />
                ))}
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
              <div className="relative min-h-[420px]">
                <Image
                  src="/images/personalized/highlight.jpg"
                  alt="Personalized gift highlight"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-[#f5cf83]">
                    Best For
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {[
                      "Birthdays",
                      "Anniversaries",
                      "Thank You gifts",
                      "Photo keepsakes",
                      "Recognition pieces",
                    ].map((item: string) => (
                      <span
                        key={item}
                        className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Popular Custom Directions"
              title="Common formats customers personalize first."
              description="These categories cover the most practical custom gift routes while keeping the finished result visually strong."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {personalizedCategories.map((item: typeof personalizedCategories[number]) => (
                <BrandVisualCard key={item.title} {...item} />
              ))}
            </div>
          </section>

          <section className="mt-10">
            <BrandSplitCallout
              title="Have artwork, photos, or a custom idea already?"
              description="If you know what needs to be added, we can guide you to the best base product and finishing style before you place the order."
              primaryHref="/contact"
              primaryLabel="Send Your Brief"
              secondaryHref="/shop"
              secondaryLabel="Browse Catalog"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <ImageIcon className="mx-auto h-8 w-8 text-[#1f3763]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Photo upload</p>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-[#1f7a57]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Premium finish</p>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <Trophy className="mx-auto h-8 w-8 text-[#c59a46]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Keepsake impact</p>
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
