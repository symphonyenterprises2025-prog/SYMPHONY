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

const collection = {
  name: "Gift Hampers",
  description:
    "A presentation-led selection of festive boxes, celebration hampers, and premium bundles that work for both personal and corporate gifting.",
  image: "/images/fnp/products/gift23.webp",
};

const products = [
  {
    name: "Premium Birthday Hamper",
    price: 2499,
    image: "/images/fnp/products/gift06.webp",
    href: "/shop",
    label: "Bestseller",
  },
  {
    name: "Anniversary Special Hamper",
    price: 3499,
    image: "/images/fnp/products/gift12.webp",
    href: "/shop",
    label: "New",
  },
  {
    name: "Diwali Gift Hamper",
    price: 4999,
    image: "/images/fnp/products/gift16.webp",
    href: "/shop",
  },
  {
    name: "Corporate Gift Box",
    price: 5999,
    image: "/images/fnp/products/gift11.webp",
    href: "/shop",
    label: "Corporate",
  },
  {
    name: "Chocolate Delight Hamper",
    price: 1999,
    image: "/images/fnp/products/gift20.webp",
    href: "/shop",
  },
  {
    name: "Personalized Gift Set",
    price: 2999,
    image: "/images/fnp/products/gift22.webp",
    href: "/shop",
    label: "Popular",
  },
  {
    name: "Flower and Cake Combo",
    price: 1799,
    image: "/images/fnp/products/gift18.webp",
    href: "/shop",
  },
  {
    name: "Spa and Wellness Hamper",
    price: 3999,
    image: "/images/fnp/products/gift24.webp",
    href: "/shop",
    label: "Premium",
  },
];

export default function CollectionDetailPage() {
  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs
            items={[{ label: "Collections", href: "/collections" }, { label: collection.name }]}
          />

          <div className="mt-6">
            <BrandedHero
              eyebrow="Collection Detail"
              title={collection.name}
              description={collection.description}
              image={collection.image}
              overlayClassName="absolute inset-0 bg-gradient-to-r from-[#2a1207]/72 via-[#4e2410]/40 to-transparent"
            />
          </div>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Inside This Collection"
              title="Products curated for presentation-led gifting."
              description="This mix is built for celebrations and polished gifting moments where the box, the reveal, and the overall composition matter."
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
