import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header-server";
import {
  BrandVisualCard,
  BrandStats,
  BrandedHero,
  SectionHeading,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";
import { HeroRotator } from "@/components/storefront/hero-rotator";
import { getCollections } from "@/features/catalog/queries";

// Make this page dynamic to avoid build-time database access
export const dynamic = 'force-dynamic'

// Type inferred from query return
type Collection = Awaited<ReturnType<typeof getCollections>>[number];

// Collection-specific image mapping
const getCollectionImage = (slug: string): string => {
  const imageMap: Record<string, string> = {
    'gift-hampers': '/images/collections/gift-hampers.jpg',
    'personalized-gifts': '/images/collections/personalized-gifts.jpg',
    'corporate-sets': '/images/collections/corporate-sets.jpg',
    'awards-recognition': '/images/collections/awards-recognition.jpg',
    'anniversary-stories': '/images/collections/anniversary-stories.jpg',
    'festival-specials': '/images/collections/festival-specials.jpg',
  };
  return imageMap[slug] || '/images/collections/gift-hampers.jpg';
};

export default async function CollectionsPage() {
  const collections = await getCollections().catch(() => [] as Collection[]);

  const collectionCards = collections.map((collection: Collection) => ({
    title: collection.name,
    description: collection.description || "",
    image: getCollectionImage(collection.slug),
    href: `/collections/${collection.slug}`,
  }));

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Collections" }]} />

          <div className="mt-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_28px_70px_rgba(46,37,20,0.12)]">
              <div className="relative h-[380px] sm:h-[460px]">
                <HeroRotator
                  images={[
                    { url: "/images/home/banner2.jpg", alt: "Collections Banner 1" },
                    { url: "/images/home/banner3.jpg", alt: "Collections Banner 2" },
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
                      Collection-led Shopping
                    </span>
                    <h1 className="mt-5 font-sans text-[2.5rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[4rem]">
                      Start with a gifting theme, not just a single product.
                    </h1>
                    <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-white/85 sm:text-xl">
                      Collections group Symphony products by intent and presentation style, making it easier to shop for occasions, campaigns, and aesthetic direction.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="mt-8">
            <BrandStats
              items={[
                { value: "6", label: "featured collections" },
                { value: "2020", label: "brand legacy" },
                { value: "50+", label: "delivery cities" },
                { value: "Premium", label: "presentation focus" },
              ]}
            />
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Curated Paths"
              title="Browse the store the way customers actually shop."
              description="Not by SKU first, but by gifting intent: festive, personalized, corporate, recognition, or memory-led gifting."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {collectionCards.map((collection: typeof collectionCards[number]) => (
                <BrandVisualCard key={collection.title} {...collection} className="h-full" />
              ))}
            </div>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
