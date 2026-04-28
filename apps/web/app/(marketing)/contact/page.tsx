"use client";

import { useState } from "react";
import { Clock3, Instagram, Mail, MapPin, MessageCircle, CheckCircle, Phone } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BrandInfoCard,
  BrandedHero,
  SectionHeading,
  StorefrontCanvas,
  StorefrontContainer,
} from "@/components/storefront/brand-system";

const contactCards = [
  {
    icon: Phone,
    title: "Call or WhatsApp",
    description: "+91 7978974823 for quick order help, bulk gifting, and customization support.",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "symphonyenterprise2025@gmail.com for approvals, artwork sharing, and inquiries.",
  },
  {
    icon: MapPin,
    title: "Visit the Studio",
    description: "Siripur Market, Unit-8, Bhubaneswar, Odisha 751003.",
  },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to send inquiry");
      }

      setSuccess(true);
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err.message || "Failed to send inquiry");
    } finally {
      setLoading(false);
    }
  }

  return (
    <StorefrontCanvas>
      <SiteHeader />

      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "Contact" }]} />

          <div className="mt-6">
            <BrandedHero
              eyebrow="Let us help you plan it"
              title="Contact Symphony for gifting, personalization, and corporate orders."
              description="Use the form for detailed inquiries, or reach out directly for fast help on design proofs, pricing, delivery timelines, and bulk customization."
              image="/images/fnp/banner/b4.jpg"
              actions={
                <>
                  <a
                    href="tel:+917978974823"
                    className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172c53]"
                  >
                    Call Now
                  </a>
                  <a
                    href="https://wa.me/917978974823"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-sm font-semibold uppercase tracking-wide text-white backdrop-blur transition-colors hover:bg-white/20"
                  >
                    WhatsApp Us
                  </a>
                </>
              }
            />
          </div>

          <section className="mt-10 grid gap-5 md:grid-cols-3">
            {contactCards.map((card) => (
              <BrandInfoCard key={card.title} {...card} />
            ))}
          </section>

          <section className="mt-10 grid gap-8 xl:grid-cols-[1fr_1.1fr]">
            <div className="space-y-8">
              <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
                <SectionHeading
                  eyebrow="Reach Us Directly"
                  title="If it needs brand alignment, timing, or custom finishing, tell us early."
                  description="We are best when the brief includes quantity, deadline, occasion, branding needs, and any personalization details such as names, photos, or engraving instructions."
                />
                <div className="mt-6 space-y-5 font-sans text-[0.98rem] text-slate-600">
                  <p className="flex items-start gap-3">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#c59a46]" />
                    <span>Siripur Market, Unit-8, Bhubaneswar, Odisha 751003</span>
                  </p>
                  <p className="flex items-center gap-3">
                    <Clock3 className="h-5 w-5 shrink-0 text-[#1f3763]" />
                    <span>Mon - Sat: 9:00 AM to 8:00 PM | Sun: 10:00 AM to 6:00 PM</span>
                  </p>
                  <div className="flex gap-3 pt-2">
                    <a
                      href="https://wa.me/917978974823"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#eadfca] bg-[#f7f2e8] text-[#1f7a57] transition-colors hover:bg-[#eaf7f1]"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </a>
                    <a
                      href="https://www.instagram.com/symphonyenterprises"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#eadfca] bg-[#f7f2e8] text-[#c4555a] transition-colors hover:bg-[#fff0f2]"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                    <a
                      href="mailto:symphonyenterprise2025@gmail.com"
                      className="flex h-12 w-12 items-center justify-center rounded-full border border-[#eadfca] bg-[#f7f2e8] text-[#1f3763] transition-colors hover:bg-[#eef3fb]"
                    >
                      <Mail className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d119743.53374955685!2d85.73805178659132!3d20.30087021703673!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a1909d2d5170aa5%3A0xfc580e2b68b33c8b!2sBhubaneswar%2C%20Odisha!5e0!3m2!1sen!2sin!4v1713880534213!5m2!1sen!2sin"
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Symphony location map"
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
              <SectionHeading
                eyebrow="Inquiry Form"
                title="Send us the brief."
                description="The more specific the brief, the faster we can guide you toward the right gifting format."
              />
              {success ? (
                <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-600" />
                  <h3 className="mt-4 text-lg font-semibold text-green-900">Thank You!</h3>
                  <p className="mt-2 text-green-700">
                    Your inquiry has been sent successfully. We'll get back to you within 24 hours.
                  </p>
                  <Button
                    onClick={() => setSuccess(false)}
                    className="mt-4 h-10 rounded-full bg-green-600 px-6 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      placeholder="John"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      placeholder="Doe"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                      required
                    />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      className="h-12 rounded-xl border-[#e6dbc4]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Corporate Diwali gifting for 40 employees"
                    className="h-12 rounded-xl border-[#e6dbc4]"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell us the quantity, occasion, delivery deadline, personalization details, and budget range."
                    className="min-h-[180px] rounded-2xl border-[#e6dbc4]"
                  />
                </div>
                {error ? (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                  </div>
                ) : null}

                <Button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-full bg-[#1f3763] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53] disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Inquiry"}
                </Button>
              </form>
              )}
            </div>
          </section>
        </StorefrontContainer>
      </main>

      <SiteFooter />
    </StorefrontCanvas>
  );
}
