import Link from "next/link";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header-server";
import {
  BrandProductCard,
  BrandStats,
  BrandVisualCard,
  BrandedHero,
  SectionHeading,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";
import { HeroRotator } from "@/components/storefront/hero-rotator";
import { getCategories, getCollections, getPaginatedProducts } from "@/features/catalog/queries";

// Make this page dynamic to avoid build-time database access
export const dynamic = 'force-dynamic'

// Types inferred from query returns
type ProductWithRelations = Awaited<ReturnType<typeof getPaginatedProducts>>['products'][number];
type Category = Awaited<ReturnType<typeof getCategories>>[number];
import { SortDropdown } from "@/components/shop/sort-dropdown";
import { SearchInput } from "@/components/shop/search-input";

export default async function ShopPage(props: {
  searchParams?: Promise<{
    category?: string;
    collection?: string;
    q?: string;
    page?: string;
    sort?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const categorySlug = searchParams?.category || "";
  const collectionSlug = searchParams?.collection || "";
  const searchQuery = searchParams?.q || "";
  const currentPage = Number(searchParams?.page) || 1;
  const sortOption = searchParams?.sort || "newest";
  const limit = 12;

  const [paginatedData, categories, collections] = await Promise.all([
    getPaginatedProducts({
      categorySlug: categorySlug || undefined,
      collectionSlug: collectionSlug || undefined,
      search: searchQuery || undefined,
      limit,
      page: currentPage,
      sort: sortOption,
    }).catch(() => ({ products: [], total: 0, totalPages: 0, currentPage: 1 })),
    getCategories().catch(() => []),
    getCollections().catch(() => []),
  ]);

  const { products, total, totalPages } = paginatedData;

  const productCards = products.map((product: ProductWithRelations, index: number) => ({
    name: product.name,
    price: Number(product.variants[0]?.price || 0),
    images: product.images.map(img => img.url),
    href: `/shop/${product.slug}`,
    label: index === 0 && !categorySlug && !searchQuery && currentPage === 1 ? "Featured" : undefined,
  }));

  const getCategoryImage = (slug: string): string => {
    const imageMap: Record<string, string> = {
      'festive-hampers': '/images/categories/festive-hampers.jpg',
      'gift-hampers': '/images/categories/gift-hampers.jpg',
      'corporate-gifts': '/images/categories/corporate-gifts.jpg',
      'onboarding-welcome-kits': '/images/categories/onboarding-kits.jpg',
      'corporate-gifting': '/images/categories/corporate-gifts.jpg',
    };
    return imageMap[slug] || '/images/collections/gift-hampers.jpg';
  };

  const categoryCards = categories.slice(0, 4).map((category: Category) => ({
    title: category.name,
    description: category.description,
    image: category.image || getCategoryImage(category.slug),
    href: `/shop?category=${category.slug}`,
  }));

  const buildUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams();
    if (categorySlug) params.set("category", categorySlug);
    if (collectionSlug) params.set("collection", collectionSlug);
    if (searchQuery) params.set("q", searchQuery);
    if (sortOption !== "newest") params.set("sort", sortOption);
    // Only set current page if not being updated
    if (!updates.page && currentPage > 1) params.set("page", currentPage.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    const query = params.toString();
    return `/shop${query ? `?${query}` : ""}`;
  };

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Shop" }]} />

          {!categorySlug && !searchQuery && !collectionSlug && currentPage === 1 && (
            <>
              <div className="mt-6">
                <section className="relative overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_28px_70px_rgba(46,37,20,0.12)]">
                  <div className="relative h-[380px] sm:h-[460px]">
                    <HeroRotator
                      images={[
                        { url: "/images/home/banner1.jpg", alt: "Shop Banner 1" },
                        { url: "/images/home/banner2.jpg", alt: "Shop Banner 2" },
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
                          Browse the Catalog
                        </span>
                        <h1 className="mt-5 font-sans text-[2.5rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[4rem]">
                          Curated gifting, personalization, hampers, and recognition products in one storefront.
                        </h1>
                        <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-white/85 sm:text-xl">
                          Use the catalog to explore premium gifts for occasions, corporate needs, and custom keepsakes. The strongest categories are the ones where presentation and personalization matter.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section className="mt-8">
                <BrandStats
                  items={[
                    { value: `${Math.max(total, 8)}+`, label: "featured items" },
                    { value: `${Math.max(categories.length, 4)}`, label: "categories" },
                    { value: `${Math.max(collections.length, 4)}`, label: "collections" },
                    { value: "50+", label: "delivery cities" },
                  ]}
                />
              </section>

              <section className="mt-10">
                <SectionHeading
                  eyebrow="Browse Faster"
                  title="Start with the product families customers use most."
                  description="These paths mirror how Symphony typically gets used: custom gifts, bulk gifting, and presentation-led recognition."
                />
                <div className="mt-8 grid gap-5 md:grid-cols-4">
                  {categoryCards.map((tile: any) => (
                    <BrandVisualCard key={tile.title} {...tile} />
                  ))}
                </div>
              </section>
            </>
          )}

          <section className={`mt-10 grid gap-8 xl:grid-cols-[0.25fr_1fr] ${(categorySlug || searchQuery || collectionSlug || currentPage > 1) ? 'pt-4' : ''}`}>
            <aside className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] h-fit sticky top-24">
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-[#8d6a2f]">
                Filters
              </p>
              <div className="mt-6">
                <SearchInput />
              </div>
              <div className="mt-6 space-y-6">
                <div>
                  <p className="font-sans text-sm font-semibold uppercase tracking-wide text-slate-500">
                    Categories
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Link
                      href={buildUrl({ category: null, page: "1" })}
                      className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                        !categorySlug
                          ? "border-[#1f3763] bg-[#1f3763] text-white"
                          : "border-[#eadfca] bg-[#fbf8f1] text-slate-700 hover:bg-[#f1ebe0]"
                      }`}
                    >
                      All Categories
                    </Link>
                    {categories.map((item: any) => (
                      <Link
                        key={item.slug}
                        href={buildUrl({ category: item.slug, page: "1" })}
                        className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                          categorySlug === item.slug
                            ? "border-[#1f3763] bg-[#1f3763] text-white"
                            : "border-[#eadfca] bg-[#fbf8f1] text-slate-700 hover:bg-[#f1ebe0]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
                {collections.length > 0 && (
                  <div>
                    <p className="font-sans text-sm font-semibold uppercase tracking-wide text-slate-500">
                      Collections
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={buildUrl({ collection: null, page: "1" })}
                        className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                          !collectionSlug
                            ? "border-[#1f3763] bg-[#1f3763] text-white"
                            : "border-[#eadfca] bg-[#fbf8f1] text-slate-700 hover:bg-[#f1ebe0]"
                        }`}
                      >
                        All Collections
                      </Link>
                      {collections.map((item: any) => (
                        <Link
                          key={item.slug}
                          href={buildUrl({ collection: item.slug, page: "1" })}
                          className={`rounded-full border px-3 py-2 text-sm font-medium transition-colors ${
                            collectionSlug === item.slug
                              ? "border-[#1f3763] bg-[#1f3763] text-white"
                              : "border-[#eadfca] bg-[#fbf8f1] text-slate-700 hover:bg-[#f1ebe0]"
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                {(categorySlug || collectionSlug || searchQuery) && (
                  <Link
                    href="/shop"
                    className="flex h-11 w-full items-center justify-center rounded-full border border-[#d0b57a] bg-white text-sm font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5] transition-colors"
                  >
                    Clear All Filters
                  </Link>
                )}
              </div>
            </aside>

            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] min-h-[500px] flex flex-col">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-sans text-[2rem] font-semibold tracking-tight text-slate-950">
                    {searchQuery
                      ? `Search: "${searchQuery}"`
                      : categorySlug
                      ? categories.find((c: any) => c.slug === categorySlug)?.name || "Category"
                      : collectionSlug
                      ? collections.find((c: any) => c.slug === collectionSlug)?.name || "Collection"
                      : "All Products"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Showing {products.length} of {total} products
                  </p>
                </div>
                <SortDropdown />
              </div>
              
              {products.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 mb-8">
                  {productCards.map((product: any) => (
                    <BrandProductCard key={`${product.name}-${product.href}`} {...product} />
                  ))}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                  <div className="h-16 w-16 rounded-full bg-[#fbf8f1] flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-[#d0b57a]" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                  <p className="text-slate-500 max-w-md mx-auto mb-6">
                    We could not find any products matching your current filters. Try removing some filters to see more results.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#1f3763] px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172c53]"
                  >
                    Clear Filters
                  </Link>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-auto pt-8 flex items-center justify-center border-t border-[#eadfca]/50">
                  <div className="flex items-center gap-2">
                    {currentPage > 1 ? (
                      <Link
                        href={buildUrl({ page: (currentPage - 1).toString() })}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfca] text-slate-600 hover:bg-[#fbf8f1] hover:text-slate-900 transition-colors"
                      >
                        <ChevronLeft className="h-5 w-5" />
                        <span className="sr-only">Previous page</span>
                      </Link>
                    ) : (
                      <button disabled className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfca]/50 text-slate-300 cursor-not-allowed">
                        <ChevronLeft className="h-5 w-5" />
                        <span className="sr-only">Previous page</span>
                      </button>
                    )}
                    
                    <div className="flex items-center gap-1 mx-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page: number) => {
                        // Show current page, first, last, and pages adjacent to current
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <Link
                              key={page}
                              href={buildUrl({ page: page.toString() })}
                              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? "bg-[#1f3763] text-white"
                                  : "hover:bg-[#fbf8f1] text-slate-600"
                              }`}
                            >
                              {page}
                            </Link>
                          );
                        }
                        
                        // Show ellipsis for skipped pages
                        if (
                          (page === 2 && currentPage > 3) ||
                          (page === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <span key={`ellipsis-${page}`} className="flex h-10 w-6 items-center justify-center text-slate-400">
                              ...
                            </span>
                          );
                        }
                        
                        return null;
                      })}
                    </div>

                    {currentPage < totalPages ? (
                      <Link
                        href={buildUrl({ page: (currentPage + 1).toString() })}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfca] text-slate-600 hover:bg-[#fbf8f1] hover:text-slate-900 transition-colors"
                      >
                        <ChevronRight className="h-5 w-5" />
                        <span className="sr-only">Next page</span>
                      </Link>
                    ) : (
                      <button disabled className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eadfca]/50 text-slate-300 cursor-not-allowed">
                        <ChevronRight className="h-5 w-5" />
                        <span className="sr-only">Next page</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}