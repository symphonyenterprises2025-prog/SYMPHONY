import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import {
  BrandSplitCallout,
  BrandStats,
  BrandedHero,
  SectionHeading,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";

const faqs = [
  {
    category: "Ordering and Delivery",
    questions: [
      {
        q: "How do I place an order?",
        a: "Browse the store, add the items you want, and continue to checkout. If the order needs personalization or bulk handling, contact us before checkout so we can guide the format.",
      },
      {
        q: "What delivery options are available?",
        a: "We support standard delivery across India, and we can guide same-day or faster handling for selected products and cities where feasible.",
      },
      {
        q: "Can I track my order?",
        a: "Yes. Once an order is dispatched, tracking details can be shared through the contact information used at checkout.",
      },
    ],
  },
  {
    category: "Customization",
    questions: [
      {
        q: "Can I add names, logos, or photos?",
        a: "Yes. Many products support names, messages, images, engraving, or logo application depending on the material and format.",
      },
      {
        q: "What files should I share for branded orders?",
        a: "Vector or high-resolution artwork is best. If you already have logo files, color references, and copy, send them early with the brief.",
      },
      {
        q: "How long do personalized orders take?",
        a: "Timelines depend on the product type, quantity, and finishing method. Simpler jobs can move quickly, while branded bulk orders need approval time.",
      },
    ],
  },
  {
    category: "Payments and Support",
    questions: [
      {
        q: "Which payment methods are supported?",
        a: "We accept standard digital payment methods used on the storefront checkout flow, including major card and UPI options where configured.",
      },
      {
        q: "What if there is an issue with my order?",
        a: "Contact us as soon as possible with the order number and photos if needed. We will review the issue and guide the next step.",
      },
      {
        q: "Do you handle corporate and bulk quotes?",
        a: "Yes. Corporate gifting is a core offering. Share quantity, deadline, cities, and branding needs through the contact page.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "FAQ" }]} />

          <div className="mt-6">
            <BrandedHero
              eyebrow="Support Center"
              title="Answers to the questions customers ask before they order."
              description="This covers the practical side of gifting with Symphony: timelines, personalization, bulk orders, proofs, and how to contact us when an order needs guidance."
              image="/images/fnp/banner/b18.jpg"
            />
          </div>

          <section className="mt-8">
            <BrandStats
              items={[
                { value: "24/7", label: "support access" },
                { value: "50+", label: "delivery cities" },
                { value: "10+", label: "gift formats" },
                { value: "2010", label: "brand legacy" },
              ]}
            />
          </section>

          <section className="mt-10">
            <SectionHeading
              eyebrow="Frequently Asked"
              title="The essentials, grouped by topic."
              description="If the answer you need is not here, the fastest route is still direct contact with your product details and timeline."
            />
            <div className="mt-8 space-y-8">
              {faqs.map((section) => (
                <div
                  key={section.category}
                  className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8"
                >
                  <h2 className="font-sans text-[1.6rem] font-semibold text-slate-950">
                    {section.category}
                  </h2>
                  <Accordion type="single" collapsible className="mt-6">
                    {section.questions.map((faq, index) => (
                      <AccordionItem
                        key={faq.q}
                        value={`${section.category}-${index}`}
                        className="border-[#efe4d1]"
                      >
                        <AccordionTrigger className="text-left font-sans text-[1rem] font-semibold text-slate-950 hover:text-[#be9548]">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="font-sans text-[0.98rem] leading-7 text-slate-600">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-10">
            <BrandSplitCallout
              title="Need a faster answer for a live order?"
              description="If the question is tied to quantity, customization, or delivery timing, contact us directly. That gets you to a real answer faster than a generic support queue."
              primaryHref="/contact"
              primaryLabel="Contact Symphony"
              secondaryHref="/track-order"
              secondaryLabel="Track an Order"
            >
              <div className="rounded-[1.6rem] border border-[#eadfca] bg-white p-6">
                <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-[#8d6a2f]">
                  Best for
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {[
                    "Bulk quotes",
                    "Artwork proofs",
                    "Delivery questions",
                    "Gift customization",
                  ].map((item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[#eadfca] bg-[#fbf8f1] px-4 py-2 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <Link
                  href="/contact"
                  className="mt-6 inline-flex text-sm font-semibold text-[#1f3763] hover:text-[#172c53]"
                >
                  Go to the contact page
                </Link>
              </div>
            </BrandSplitCallout>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
