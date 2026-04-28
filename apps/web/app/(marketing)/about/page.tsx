import Image from "next/image";
import Link from "next/link";
import {
  Award,
  Clock3,
  Heart,
  MapPin,
  PenTool,
  ShieldCheck,
  Sparkles,
  Trophy,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  BrandInfoCard,
  BrandSplitCallout,
  BrandStats,
  BrandVisualCard,
  BrandedHero,
  SectionHeading,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";

const values = [
  {
    icon: Heart,
    title: "Emotion First",
    description:
      "Every order is designed to feel personal, whether it is a single keepsake or a full gifting campaign.",
  },
  {
    icon: Award,
    title: "Presentation Matters",
    description:
      "Elegant packaging, clean personalization, and premium finishing are part of the product, not an afterthought.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable Execution",
    description:
      "From proofing to dispatch, our process is tuned for consistency so custom work still feels dependable.",
  },
  {
    icon: Sparkles,
    title: "Crafted Variety",
    description:
      "Printing, laser engraving, frames, mugs, hampers, trophies, and curated combos all live under one brand language.",
  },
];

const showcase = [
  {
    title: "Corporate and festive gifting",
    description: "Curated boxes, personalized sets, and presentation-led gift packaging.",
    image: "/images/fnp/products/gift01.webp",
  },
  {
    title: "Laser engraving and recognition",
    description: "Awards, desk pieces, and memorable engraved products for teams and milestones.",
    image: "/images/fnp/products/gift22.webp",
  },
  {
    title: "Photo keepsakes and occasion gifts",
    description: "Frames, mugs, hampers, and celebration-led pieces built for emotional impact.",
    image: "/images/fnp/products/gift24.webp",
  },
];

export default function AboutPage() {
  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "About" }]} />

          <div className="mt-6">
            <BrandedHero
              eyebrow="Inside Symphony Enterprise"
              title="A Bhubaneswar gifting studio built around memorable details."
              description="Since 2010, Symphony Enterprise has focused on customized gifting, laser engraving, trophies, festive boxes, and corporate presentation pieces that look polished before they are opened."
              image="/images/fnp/banner/b19.jpg"
              actions={
                <>
                  <Link
                    href="/shop"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172c53]"
                  >
                    Explore Collection
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur transition-colors hover:bg-white/20"
                  >
                    Visit or Contact Us
                  </Link>
                </>
              }
            />
          </div>

          <section className="mt-8">
            <BrandStats
              items={[
                { value: "2010", label: "since" },
                { value: "500+", label: "custom products" },
                { value: "50+", label: "cities served" },
                { value: "24/7", label: "support" },
              ]}
            />
          </section>

          <section className="mt-10 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
              <SectionHeading
                eyebrow="Our Story"
                title="From local customization work to a full gifting brand."
                description="What began as a customization-focused studio in Bhubaneswar evolved into a storefront that blends printing, engraving, personalized products, and corporate gifting under one recognizable presentation style."
              />
              <div className="mt-6 space-y-5 font-sans text-[1rem] leading-8 text-slate-600">
                <p>
                  We are strongest where emotion and execution meet: milestone gifts, employee kits,
                  festive hampers, keepsake trophies, photo products, and branded gift sets that
                  need to feel thoughtful, polished, and on-time.
                </p>
                <p>
                  The design direction across Symphony is intentional. Gold accents, warm neutrals,
                  deep navy, and crafted details show up in the packaging, the storefront, and now
                  the digital experience as well.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-[#f0e4ca] bg-[#fffaf1] p-5">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f3763] text-white">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-slate-950">Bhubaneswar Studio</p>
                    <p className="mt-1 text-sm text-slate-600">Siripur Market, Unit-8, Odisha</p>
                  </div>
                  <div className="rounded-[1.5rem] border border-[#f0e4ca] bg-[#fffaf1] p-5">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1f7a57] text-white">
                      <Clock3 className="h-6 w-6" />
                    </div>
                    <p className="font-semibold text-slate-950">Fast Turnarounds</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Same-day support on selected custom items
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
              <div className="relative min-h-[280px] border-b border-[#eadfca]">
                <Image
                  src="/images/fnp/products/gift15.webp"
                  alt="Symphony gifting showcase"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-[#fbf8f1] p-5">
                  <Users className="h-8 w-8 text-[#1f3763]" />
                  <p className="mt-4 font-sans text-lg font-semibold text-slate-950">
                    Customer-led customization
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Built for birthdays, weddings, employee gifting, events, and premium one-off
                    keepsakes.
                  </p>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-[#fbf8f1] p-5">
                  <Trophy className="h-8 w-8 text-[#1f7a57]" />
                  <p className="mt-4 font-sans text-lg font-semibold text-slate-950">
                    Recognition and awards
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Premium trophy and award work with engraving, finishing, and packaging support.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="What Guides Us"
              title="The values behind the visual polish."
              description="The storefront should feel premium, but the underlying standard is discipline: better materials, better finishing, and a more considered customer experience."
              align="center"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {values.map((item: typeof values[number]) => (
                <BrandInfoCard key={item.title} {...item} />
              ))}
            </div>
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="What We Make"
              title="Categories that carry the Symphony look."
              description="A single order can move from mugs to hampers to awards, but it should still feel like one brand handled it."
              align="center"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {showcase.map((item: typeof showcase[number]) => (
                <BrandVisualCard key={item.title} {...item} />
              ))}
            </div>
          </section>

          <section className="mt-10">
            <BrandSplitCallout
              title="Need something branded, personalized, or event-ready?"
              description="We handle custom gifting for personal occasions as well as business orders, with support for logos, names, engraving, packaging, and curated combinations."
              primaryHref="/corporate-gifting"
              primaryLabel="Start Corporate Inquiry"
              secondaryHref="/shop"
              secondaryLabel="Browse Products"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <PenTool className="mx-auto h-8 w-8 text-[#1f7a57]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Laser work</p>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <Sparkles className="mx-auto h-8 w-8 text-[#c59a46]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Premium finish</p>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <Trophy className="mx-auto h-8 w-8 text-[#1f3763]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Awards</p>
                </div>
              </div>
            </BrandSplitCallout>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
