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
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function OccasionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [occasion, products] = await Promise.all([
    prisma.occasion.findUnique({
      where: { slug, isActive: true },
    }),
    prisma.product.findMany({
      where: {
        occasions: { some: { slug } },
        isActive: true,
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        variants: { where: { isActive: true }, select: { price: true, comparePrice: true } },
      },
      take: 20,
    }),
  ]);

  if (!occasion) {
    notFound();
  }

  return (
    <StorefrontCanvas>
      <SiteHeader />
      <main className="pb-16">
        <BrandedHero
          eyebrow="Occasion"
          title={occasion.name}
          description={occasion.description || `Find the perfect gift for ${occasion.name}`}
          image={occasion.image || "/images/fnp/banner/b2.jpg"}
        />
        <StorefrontContainer>
          <div className="mt-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Occasions", href: "/occasions" },
                { label: occasion.name },
              ]}
            />
          </div>
          <SectionHeading
            eyebrow={`${products.length} products`}
            title={occasion.name}
            className="mt-8"
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => {
              const firstVariant = product.variants[0];
              return (
                <BrandProductCard
                  key={product.id}
                  name={product.name}
                  price={firstVariant ? Number(firstVariant.price) : 0}
                  image={product.images[0]?.url || "/images/fnp/products/gift01.webp"}
                  href={`/shop/${product.slug}`}
                />
              );
            })}
          </div>
          {products.length === 0 && (
            <div className="mt-10 rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center">
              <p className="text-slate-500">No products found for this occasion.</p>
            </div>
          )}
        </StorefrontContainer>
      </main>
      <SiteFooter />
    </StorefrontCanvas>
  );
}
