import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  Boxes,
  BriefcaseBusiness,
  Building2,
  Clock3,
  Gift,
  Palette,
  ShieldCheck,
  Truck,
  Users,
} from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header-server";
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

const serviceCards = [
  {
    icon: Boxes,
    title: "Bulk-ready curation",
    description:
      "Gift sets designed for employees, clients, partners, events, and seasonal campaigns.",
  },
  {
    icon: Palette,
    title: "Logo and brand alignment",
    description:
      "Add logos, names, sleeves, inserts, packaging, and presentation details that feel on-brand.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable fulfillment",
    description:
      "Clear approvals, packaging discipline, and dispatch planning for multi-piece orders.",
  },
];

const useCases = [
  {
    title: "Employee appreciation kits",
    description:
      "Onboarding boxes, festive gifts, and recognition sets that feel premium without looking generic.",
    image: "/images/fnp/products/gift01.webp",
    href: "/contact",
  },
  {
    title: "Client and partner gifting",
    description: "Polished branded sets for relationship-building, launches, and premium outreach.",
    image: "/images/fnp/products/gift11.webp",
    href: "/contact",
  },
  {
    title: "Awards and event recognition",
    description:
      "Laser engraved trophies, plaques, and commemorative pieces for ceremonies and milestones.",
    image: "/images/fnp/products/gift22.webp",
    href: "/contact",
  },
];

const process = [
  {
    icon: BriefcaseBusiness,
    title: "1. Share the brief",
    description:
      "Tell us the quantity, occasion, deadline, budget, and what should be personalized.",
  },
  {
    icon: Gift,
    title: "2. Curate and brand",
    description:
      "We suggest sets, packaging, and customization options that fit the brief and the brand.",
  },
  {
    icon: BadgeCheck,
    title: "3. Approve production",
    description: "Artwork, copy, and finishing details are aligned before the order is executed.",
  },
  {
    icon: Truck,
    title: "4. Dispatch with confidence",
    description:
      "Orders are packed and coordinated for timely delivery across destinations where needed.",
  },
];

export default function CorporateGiftingPage() {
  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Corporate Gifting" }]} />

          <div className="mt-6">
            <BrandedHero
              eyebrow="Corporate Solutions"
              title="Premium corporate gifting that looks considered, not mass-produced."
              description="Symphony Enterprise helps businesses create branded gift sets, festive hampers, recognition pieces, and personalized presentation boxes that feel polished from unboxing to delivery."
              image="/images/fnp/banner/b19.jpg"
              actions={
                <>
                  <Link
                    href="/contact"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172c53]"
                  >
                    Start an Inquiry
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur transition-colors hover:bg-white/20"
                  >
                    Browse Ready Categories
                  </Link>
                </>
              }
            />
          </div>

          <section className="mt-8">
            <BrandStats
              items={[
                { value: "500+", label: "corporate clients" },
                { value: "10K+", label: "orders fulfilled" },
                { value: "50+", label: "delivery cities" },
                { value: "98%", label: "satisfaction" },
              ]}
            />
          </section>

          <section className="mt-10 grid gap-5 md:grid-cols-3">
            {serviceCards.map((item) => (
              <BrandInfoCard key={item.title} {...item} />
            ))}
          </section>

          <section className="mt-10 grid gap-8 xl:grid-cols-[1.02fr_0.98fr]">
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
              <SectionHeading
                eyebrow="Why Teams Choose Symphony"
                title="One partner for kits, hampers, awards, and presentation."
                description="The advantage is not just product range. It is the ability to make different product types feel visually coherent across the same campaign."
              />
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.5rem] border border-[#f0e4ca] bg-[#fffaf1] p-5">
                  <Building2 className="h-8 w-8 text-[#1f3763]" />
                  <p className="mt-4 font-sans text-lg font-semibold text-slate-950">
                    Festive gifting
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Diwali, year-end, and event gifting built for scale and presentation.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[#f0e4ca] bg-[#fffaf1] p-5">
                  <Users className="h-8 w-8 text-[#1f7a57]" />
                  <p className="mt-4 font-sans text-lg font-semibold text-slate-950">
                    Employee kits
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Welcome kits, appreciation gifts, and internal milestone packages.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[#f0e4ca] bg-[#fffaf1] p-5">
                  <Clock3 className="h-8 w-8 text-[#c59a46]" />
                  <p className="mt-4 font-sans text-lg font-semibold text-slate-950">
                    Deadline-aware execution
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Practical support around production windows, proofs, and dispatch timing.
                  </p>
                </div>
                <div className="rounded-[1.5rem] border border-[#f0e4ca] bg-[#fffaf1] p-5">
                  <Gift className="h-8 w-8 text-[#1f3763]" />
                  <p className="mt-4 font-sans text-lg font-semibold text-slate-950">
                    Brandable formats
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Mugs, hampers, plaques, trophies, and curated premium sets with brand
                    integration.
                  </p>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
              <div className="relative min-h-[320px]">
                <Image
                  src="/images/fnp/products/gift15.webp"
                  alt="Corporate gifting hero"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
              </div>
              <div className="p-6">
                <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-[#8d6a2f]">
                  Suitable For
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {[
                    "Festive campaigns",
                    "New joiner kits",
                    "Awards nights",
                    "Client outreach",
                    "Partner gifting",
                    "Leadership gifts",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#eadfca] bg-[#fbf8f1] px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Use Cases"
              title="Common corporate formats we help build."
              description="You can start with a ready direction or bring a fully defined brief. Both work."
              align="center"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {useCases.map((item) => (
                <BrandVisualCard key={item.title} {...item} />
              ))}
            </div>
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Process"
              title="A simple workflow that keeps approvals and delivery under control."
              align="center"
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {process.map((item) => (
                <BrandInfoCard key={item.title} {...item} />
              ))}
            </div>
          </section>

          <section className="mt-10">
            <BrandSplitCallout
              title="Ready to plan a branded gifting run?"
              description="Send quantity, budget, timeline, city list, and branding requirements. We will help shape the right combination of products and presentation."
              primaryHref="/contact"
              primaryLabel="Request a Quote"
              secondaryHref="tel:+917978974823"
              secondaryLabel="Call the Team"
            >
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <Boxes className="mx-auto h-8 w-8 text-[#1f7a57]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Bulk sets</p>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <Palette className="mx-auto h-8 w-8 text-[#1f3763]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Branding</p>
                </div>
                <div className="rounded-[1.4rem] border border-[#eadfca] bg-white p-5 text-center">
                  <Truck className="mx-auto h-8 w-8 text-[#c59a46]" />
                  <p className="mt-3 text-sm font-semibold text-slate-900">Dispatch</p>
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
