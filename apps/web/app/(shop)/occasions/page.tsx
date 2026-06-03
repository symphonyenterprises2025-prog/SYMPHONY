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
import { HeroRotator } from "@/components/storefront/hero-rotator";
import { getOccasions } from "@/features/catalog/queries";

// Type inferred from query return
type Occasion = Awaited<ReturnType<typeof getOccasions>>[number];

// Occasion-specific image mapping
const getOccasionImage = (slug: string): string => {
  const imageMap: Record<string, string> = {
    'birthday': '/images/occasions/birthday.jpg',
    'anniversary': '/images/occasions/anniversary.jpg',
    'wedding': '/images/occasions/wedding.jpg',
    'diwali': '/images/occasions/diwali.jpg',
    'holi': '/images/occasions/holi.jpg',
    'rakhi': '/images/occasions/rakhi.jpg',
    'fathers-day': '/images/occasions/fathers-day.jpg',
    'mothers-day': '/images/occasions/mothers-day.jpg',
    'valentines-day': '/images/occasions/valentines-day.jpg',
    'republic-day': '/images/occasions/republic-day.jpg',
    'bolbum': '/images/occasions/bolbum.jpg',
    'congratulations': '/images/occasions/congratulations.jpg',
    'thank-you': '/images/occasions/thank-you.jpg',
  };
  return imageMap[slug] || '/images/occasions/birthday.jpg';
};

export default async function OccasionsPage() {
  const occasions = await getOccasions().catch(() => [] as Occasion[]);

  const occasionCards = occasions.map((occasion: Occasion) => ({
    title: occasion.name,
    description: occasion.description || "",
    image: getOccasionImage(occasion.slug),
    href: `/occasions/${occasion.slug}`,
  }));

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Occasions" }]} />

          <div className="mt-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_28px_70px_rgba(46,37,20,0.12)]">
              <div className="relative min-h-[380px] sm:min-h-[460px]">
                <HeroRotator
                  images={[
                    { url: "/images/occasions/birthday.jpg", alt: "Occasions Banner 1" },
                    { url: "/images/occasions/anniversary.jpg", alt: "Occasions Banner 2" },
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
                      Occasion-led Shopping
                    </span>
                    <h1 className="mt-5 font-sans text-[2.5rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[4rem]">
                      Find gifts by moment, not by guesswork.
                    </h1>
                    <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-white/85 sm:text-xl">
                      Whether the goal is celebration, gratitude, recognition, or festive warmth, Symphony organizes gifting around the emotion first and the product second.
                    </p>
                  </div>
                </div>
              </div>
            </section>
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
              {occasionCards.map((occasion: typeof occasionCards[number]) => (
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
