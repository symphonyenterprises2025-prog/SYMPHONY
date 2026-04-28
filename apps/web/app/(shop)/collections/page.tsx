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
import { getCollections } from "@/features/catalog/queries";

export default async function CollectionsPage() {
  const collections = await getCollections().catch(() => []);

  const collectionCards = collections.map((collection) => ({
    title: collection.name,
    description: collection.description || "",
    image: "/images/fnp/products/gift01.webp",
    href: `/collections/${collection.slug}`,
  }));

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Collections" }]} />

          <div className="mt-6">
            <BrandedHero
              eyebrow="Collection-led Shopping"
              title="Start with a gifting theme, not just a single product."
              description="Collections group Symphony products by intent and presentation style, making it easier to shop for occasions, campaigns, and aesthetic direction."
              image="/images/fnp/banner/b20.jpg"
            />
          </div>

          <section className="mt-8">
            <BrandStats
              items={[
                { value: "6", label: "featured collections" },
                { value: "2010", label: "brand legacy" },
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
              {collectionCards.map((collection) => (
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
