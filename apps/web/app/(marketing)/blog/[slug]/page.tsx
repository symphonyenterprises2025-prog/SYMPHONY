import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Share2, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";

const post = {
  title: "Top personalized gifting ideas for anniversaries",
  content: [
    "Anniversaries are strongest when the gift reflects memory as much as utility. Personalized gifting works well because it creates an object that belongs specifically to the relationship, not just to the occasion.",
    "The safest high-impact formats are photo frames, custom mugs, curated keepsake boxes, engraved desk accents, and premium presentation-led hampers. These categories allow a name, date, or message to sit naturally inside the design instead of feeling forced onto it.",
    "The key is restraint. A premium personalized gift usually uses fewer elements, better materials, and cleaner finishing. The more elegant the base product, the more meaningful the customization feels.",
    "At Symphony, the goal is to keep personalization warm without making it visually noisy. That applies to packaging, message placement, engraving depth, and the overall reveal.",
  ],
  image: "/images/fnp/products/gift24.webp",
  date: "April 15, 2026",
  author: "Symphony Editorial",
  category: "Gifting Guide",
  readTime: "8 min read",
};

export default function BlogDetailPage() {
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
            <div className="relative min-h-[320px] sm:min-h-[420px]">
              <Image src={post.image} alt={post.title} fill className="object-cover" />
            </div>
            <div className="p-8 sm:p-10">
              <Badge className="border-0 bg-[#f8f2e5] text-[#8d6a2f]">{post.category}</Badge>
              <h1 className="mt-5 font-sans text-[2.4rem] font-semibold leading-tight text-slate-950 sm:text-[3.2rem]">
                {post.title}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-5 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {post.date}
                </span>
                <span className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author}
                </span>
                <span>{post.readTime}</span>
              </div>

              <div className="mt-8 space-y-6 font-sans text-[1.04rem] leading-8 text-slate-600">
                {post.content.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 grid gap-5 lg:grid-cols-2">
                <div className="rounded-[1.6rem] border border-[#eadfca] bg-[#fbf8f1] p-6">
                  <h2 className="flex items-center gap-2 font-sans text-[1.1rem] font-semibold text-slate-950">
                    <Share2 className="h-4 w-4" />
                    Share this article
                  </h2>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {["Facebook", "WhatsApp", "Instagram"].map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[#eadfca] bg-white px-4 py-2 text-sm font-medium text-slate-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-[1.6rem] border border-[#eadfca] bg-[#fbf8f1] p-6">
                  <h2 className="font-sans text-[1.1rem] font-semibold text-slate-950">
                    Related Reading
                  </h2>
                  <div className="mt-4 space-y-3">
                    <Link
                      href="/blog/art-of-corporate-gifting"
                      className="block text-sm font-semibold text-[#1f3763] hover:text-[#172c53]"
                    >
                      What corporate gifting gets right when presentation is consistent
                    </Link>
                    <Link
                      href="/blog/customized-hampers-perfect-birthday-gift"
                      className="block text-sm font-semibold text-[#1f3763] hover:text-[#172c53]"
                    >
                      How curated festive hampers create stronger first impressions
                    </Link>
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
