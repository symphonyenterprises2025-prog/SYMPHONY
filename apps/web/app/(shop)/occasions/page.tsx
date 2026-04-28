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
import { getOccasions } from "@/features/catalog/queries";

export default async function OccasionsPage() {
  const occasions = await getOccasions().catch(() => []);

  const occasionCards = occasions.map((occasion) => ({
    title: occasion.name,
    description: occasion.description || "",
    image: "/images/fnp/products/gift01.webp",
    href: `/occasions/${occasion.slug}`,
  }));

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Occasions" }]} />

          <div className="mt-6">
            <BrandedHero
              eyebrow="Occasion-led Shopping"
              title="Find gifts by moment, not by guesswork."
              description="Whether the goal is celebration, gratitude, recognition, or festive warmth, Symphony organizes gifting around the emotion first and the product second."
              image="/images/fnp/banner/b17.jpg"
            />
          </div>

          <section className="mt-8">
            <BrandStats
              items={[
                { value: "6", label: "featured occasions" },
                { value: "Same Day", label: "selected delivery" },
                { value: "Custom", label: "personalization options" },
                { value: "Premium", label: "presentation style" },
              ]}
            />
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Shop by Moment"
              title="A cleaner way to narrow the catalog."
              description="Each occasion page is a faster route into the kinds of products and presentation styles customers actually expect for that moment."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {occasionCards.map((occasion) => (
                <BrandVisualCard key={occasion.title} {...occasion} className="h-full" />
              ))}
            </div>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
