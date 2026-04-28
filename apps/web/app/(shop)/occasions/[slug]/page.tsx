import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  BrandProductCard,
  BrandedHero,
  SectionHeading,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";

const occasion = {
  name: "Birthday",
  description:
    "A birthday-focused mix of personalized keepsakes, custom drinkware, framed memories, and celebration-ready gift sets.",
  image: "/images/fnp/products/gift09.webp",
};

const products = [
  {
    name: "Personalized Birthday Cushion",
    price: 1499,
    image: "/images/fnp/products/gift01.webp",
    href: "/shop",
    label: "Bestseller",
  },
  {
    name: "Birthday Photo Frame",
    price: 999,
    image: "/images/fnp/products/gift03.webp",
    href: "/shop",
  },
  {
    name: "Custom Birthday Mug",
    price: 499,
    image: "/images/fnp/products/gift15.webp",
    href: "/shop",
    label: "Popular",
  },
  {
    name: "Birthday Gift Hamper",
    price: 2499,
    image: "/images/fnp/products/gift06.webp",
    href: "/shop",
    label: "New",
  },
  {
    name: "Engraved Birthday Pen",
    price: 699,
    image: "/images/fnp/products/gift02.webp",
    href: "/shop",
  },
  {
    name: "Birthday Crystal Trophy",
    price: 1299,
    image: "/images/fnp/products/gift22.webp",
    href: "/shop",
    label: "Premium",
  },
  {
    name: "Personalized Calendar",
    price: 549,
    image: "/images/fnp/products/gift08.webp",
    href: "/shop",
  },
  {
    name: "Birthday LED Sign",
    price: 1499,
    image: "/images/fnp/products/gift12.webp",
    href: "/shop",
  },
];

export default function OccasionDetailPage() {
  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs
            items={[{ label: "Occasions", href: "/occasions" }, { label: occasion.name }]}
          />

          <div className="mt-6">
            <BrandedHero
              eyebrow="Occasion Detail"
              title={`${occasion.name} Gifts`}
              description={occasion.description}
              image={occasion.image}
              overlayClassName="absolute inset-0 bg-gradient-to-r from-[#231330]/72 via-[#4b2a66]/35 to-transparent"
            />
          </div>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Selected for the Occasion"
              title="Products that fit the moment without feeling generic."
              description="The selection balances quick personal gifts with higher-impact presentation pieces for milestone birthdays."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {products.map((product: typeof products[number]) => (
                <BrandProductCard key={product.name} {...product} />
              ))}
            </div>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
