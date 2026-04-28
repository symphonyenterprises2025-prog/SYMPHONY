import Image from "next/image";
import Link from "next/link";
import { CalendarDays, PenSquare, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header-server";
import {
  BrandedHero,
  SectionHeading,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";
import { getBlogPosts } from "@/features/catalog/queries";

// Type inferred from getBlogPosts return type
type BlogPost = Awaited<ReturnType<typeof getBlogPosts>>[number];

export default async function BlogPage() {
  const posts = await getBlogPosts().catch(() => [] as BlogPost[]);

  const blogPosts = posts.map((post: BlogPost) => ({
    title: post.title,
    excerpt: post.excerpt || "",
    image: post.coverImage || "/images/fnp/products/gift01.webp",
    date: post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "",
    author: post.author || "Symphony Editorial",
    category: "Gifting",
    slug: post.slug,
  }));

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Blog" }]} />

          <div className="mt-6">
            <BrandedHero
              eyebrow="Symphony Journal"
              title="Notes, guides, and inspiration from a gifting-first brand."
              description="The Journal covers personalization, festive gifting, corporate presentation, awards, and the small decisions that make custom products look more premium."
              image="/images/fnp/banner/b16.jpg"
            />
          </div>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Recent Articles"
              title="Useful reading for better gifting decisions."
              description="The content here is built to help customers, teams, and event planners make more confident choices about products, presentation, and customization."
            />
            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              {blogPosts.map((post, index) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`group overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_24px_60px_rgba(45,36,20,0.1)] transition-transform duration-300 hover:-translate-y-1 ${
                    index === 0 ? "lg:col-span-2 lg:grid lg:grid-cols-[1.05fr_0.95fr]" : ""
                  }`}
                >
                  <div className="relative min-h-[280px] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4">
                      <Badge className="border-0 bg-white/90 text-[#8d6a2f] shadow-sm">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-6 sm:p-8">
                    <div>
                      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {post.author}
                        </span>
                      </div>
                      <h2 className="font-sans text-[1.7rem] font-semibold leading-tight text-slate-950 transition-colors group-hover:text-[#be9548]">
                        {post.title}
                      </h2>
                      <p className="mt-4 font-sans text-[1rem] leading-7 text-slate-600">
                        {post.excerpt}
                      </p>
                    </div>
                    <div className="mt-6 inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-wide text-[#1f3763]">
                      Read Article
                      <PenSquare className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
