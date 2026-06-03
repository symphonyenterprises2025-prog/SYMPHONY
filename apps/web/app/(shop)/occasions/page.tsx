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
    'birthday': 'https://images.unsplash.com/photo-1558636508-e0db3814bd1d?w=800&q=80',
    'anniversary': 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80',
    'wedding': 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    'diwali': 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07ad7?w=800&q=80',
    'holi': 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=800&q=80',
    'rakhi': 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&q=80',
    'fathers-day': 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&q=80',
    'mothers-day': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
    'valentines-day': 'https://images.unsplash.com/photo-1518199266791-5375a8e90d61?w=800&q=80',
    'republic-day': 'https://images.unsplash.com/photo-1561164154-9de4bf5b5789?w=800&q=80',
    'bolbum': 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&q=80',
    'congratulations': 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80',
    'thank-you': 'https://images.unsplash.com/photo-1518176258769-f227c798150e?w=800&q=80',
  };
  return imageMap[slug] || 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800&q=80';
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
                    { url: "/images/fnp/banner/b17.jpg", alt: "Occasions Banner 1" },
                    { url: "/images/fnp/banner/b18.jpg", alt: "Occasions Banner 2" },
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
