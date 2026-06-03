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

export default async function CollectionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [collection, products] = await Promise.all([
    prisma.collection.findUnique({
      where: { slug, isActive: true },
    }),
    prisma.product.findMany({
      where: {
        collections: { some: { slug } },
        isActive: true,
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        variants: { where: { isActive: true }, select: { price: true, comparePrice: true } },
      },
      take: 20,
    }),
  ]);

  if (!collection) {
    notFound();
  }

  return (
    <StorefrontCanvas>
      <SiteHeader />
      <main className="pb-16">
        <BrandedHero
          eyebrow="Collection"
          title={collection.name}
          description={collection.description || `Browse our ${collection.name} collection`}
          image={collection.image || "/images/collections/gift-hampers.jpg"}
        />
        <StorefrontContainer>
          <div className="mt-6">
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Collections", href: "/collections" },
                { label: collection.name },
              ]}
            />
          </div>
          <SectionHeading
            eyebrow={`${products.length} products`}
            title={collection.name}
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
                  images={product.images.map(img => img.url)}
                  href={`/shop/${product.slug}`}
                />
              );
            })}
          </div>
          {products.length === 0 && (
            <div className="mt-10 rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center">
              <p className="text-slate-500">No products found in this collection.</p>
            </div>
          )}
        </StorefrontContainer>
      </main>
      <SiteFooter />
    </StorefrontCanvas>
  );
}
