import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Share2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";
import { getBlogPostBySlug } from "@/features/content/queries";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) notFound();

  const paragraphs = post.content.split(/\n\n+/);

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

          <div className="mt-6">
            <Link
              href="/blog"
              className="inline-flex h-11 items-center justify-center rounded-full border border-[#d0b57a] bg-white px-5 text-sm font-semibold uppercase tracking-wide text-slate-900 shadow-sm hover:bg-[#f8f2e5]"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </div>

          <article className="mx-auto mt-8 max-w-[1100px] overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
            {post.coverImage && (
              <div className="relative min-h-[320px] sm:min-h-[420px]">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
              </div>
            )}
            <div className="p-8 sm:p-10">
              <h1 className="mt-5 font-sans text-[2.4rem] font-semibold leading-tight text-slate-950 sm:text-[3.2rem]">
                {post.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                {post.publishedAt && (
                  <span className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    {new Date(post.publishedAt).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                )}
                {post.author && (
                  <span className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                )}
              </div>

              <div className="mt-8 space-y-6 font-sans text-[1.04rem] leading-8 text-slate-600">
                {paragraphs.map((paragraph: string, i: number) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 grid gap-5 lg:grid-cols-2">
                <div className="rounded-[1.6rem] border border-[#eadfca] bg-[#fbf8f1] p-6">
                  <h2 className="flex items-center gap-2 font-sans text-[1.1rem] font-semibold text-slate-950">
                    <Share2 className="h-4 w-4" />
                    Share this article
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {["Facebook", "WhatsApp", "Instagram"].map((item: string) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#eadfca] bg-white px-4 py-2 text-sm font-medium text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </article>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
