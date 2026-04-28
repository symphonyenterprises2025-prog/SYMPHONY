import { MapPin, PackageSearch, Search, Truck } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BrandInfoCard,
  BrandedHero,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";

export default function TrackOrderPage() {
  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Track Order" }]} />

          <div className="mt-6">
            <BrandedHero
              eyebrow="Delivery Updates"
              title="Track the latest movement on your Symphony order."
              description="Enter the order number and the email or phone used at checkout. This helps you check dispatch and delivery progress without contacting support first."
              image="/images/fnp/banner/b2.jpg"
              overlayClassName="absolute inset-0 bg-gradient-to-r from-[#0f2230]/76 via-[#173a53]/35 to-transparent"
            />
          </div>

          <section className="mt-10 grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white">
                <PackageSearch className="h-7 w-7" />
              </div>
              <h1 className="mt-5 font-sans text-[2rem] font-semibold tracking-tight text-slate-950">
                Track Your Order
              </h1>
              <p className="mt-3 font-sans text-[1rem] leading-7 text-slate-600">
                Found in your confirmation message. If you placed a customized or bulk order, the
                same reference can help us support you faster if needed.
              </p>

              <form className="mt-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="orderNumber">Order Number</Label>
                  <Input
                    id="orderNumber"
                    placeholder="e.g. SYM-1049284"
                    className="h-12 rounded-xl border-[#e6dbc4]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact">Email or Phone</Label>
                  <Input
                    id="contact"
                    placeholder="Enter the contact used during checkout"
                    className="h-12 rounded-xl border-[#e6dbc4]"
                  />
                </div>
                <Button className="h-12 rounded-full bg-[#1f3763] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]">
                  <Search className="mr-2 h-4 w-4" />
                  Track Order
                </Button>
              </form>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
              <BrandInfoCard
                icon={Truck}
                title="Standard Delivery Visibility"
                description="Tracking usually updates after the order is packed and handed to the delivery partner."
              />
              <BrandInfoCard
                icon={MapPin}
                title="Nationwide Fulfillment"
                description="We support delivery across India and coordinate custom orders with the same care as ready products."
              />
            </div>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
