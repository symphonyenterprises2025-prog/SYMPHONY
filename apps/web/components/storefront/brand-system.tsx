import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LucideIcon, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function BrandWordmark({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 text-slate-900", className)}>
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border border-[#d1b47a] bg-gradient-to-b from-[#f8ddb0] to-[#c99e50] shadow-[0_14px_34px_rgba(142,104,34,0.22)]",
          compact ? "h-12 w-12" : "h-14 w-14"
        )}
      >
        <Image
          src="/images/logo.png"
          alt="Symphony logo"
          fill
          className="object-cover p-2"
          sizes={compact ? "48px" : "56px"}
        />
      </div>
      <div className="leading-none">
        <p
          className={cn(
            "font-sans font-semibold tracking-tight text-[#1c325a]",
            compact ? "text-[1.55rem]" : "text-[2rem]"
          )}
        >
          Symphony
        </p>
        <p
          className={cn("font-sans font-medium text-slate-700", compact ? "text-sm" : "text-base")}
        >
          Enterprise
        </p>
      </div>
    </Link>
  );
}

export function StorefrontCanvas({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("relative min-h-screen overflow-hidden bg-[#f7f2e8] text-slate-900", className)}
    >
      <div className="pointer-events-none absolute left-6 top-52 hidden h-24 w-24 rounded-full border border-[#dfc588] lg:block" />
      <div className="pointer-events-none absolute right-8 top-36 hidden h-28 w-28 rounded-full border border-dashed border-[#dfc588] lg:block" />
      <div className="pointer-events-none absolute bottom-40 left-0 hidden h-44 w-44 border-[3px] border-[#ead7ab]/80 [clip-path:polygon(0_35%,35%_0,100%_0,100%_65%,65%_100%,0_100%)] lg:block" />
      <div className="pointer-events-none absolute bottom-56 right-0 hidden h-36 w-36 border-[3px] border-[#ead7ab]/80 [clip-path:polygon(35%_0,100%_0,100%_65%,65%_100%,0_100%,0_35%)] lg:block" />
      {children}
    </div>
  );
}

export function StorefrontContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[1600px] px-4 sm:px-6 xl:px-10", className)}>{children}</div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div className={cn(align === "center" ? "mx-auto text-center" : "", className)}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 rounded-full border border-[#ead9b8] bg-[#fffaf1] px-4 py-2 font-sans text-sm font-semibold text-[#8d6a2f] shadow-sm">
          <Sparkles className="h-4 w-4" />
          {eyebrow}
        </span>
      ) : null}
      <h2 className="mt-4 font-sans text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.75rem]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 max-w-3xl font-sans text-base leading-7 text-slate-600 sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function BrandedHero({
  eyebrow,
  title,
  description,
  image,
  actions,
  children,
  overlayClassName,
  contentClassName,
  className,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  image: string;
  actions?: ReactNode;
  children?: ReactNode;
  overlayClassName?: string;
  contentClassName?: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_28px_70px_rgba(46,37,20,0.12)]",
        className
      )}
    >
      <div className="relative min-h-[380px] sm:min-h-[460px]">
        <Image src={image} alt={title} fill className="object-cover" priority />
        <div
          className={cn(
            "via-[#11345c]/48 absolute inset-0 bg-gradient-to-r from-[#081d34]/80 to-[#1f3763]/20",
            overlayClassName
          )}
        />
        <div
          className={cn(
            "relative z-10 flex min-h-[380px] items-center px-6 py-10 sm:min-h-[460px] sm:px-10",
            contentClassName
          )}
        >
          <div className="max-w-3xl">
            {eyebrow ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-sans text-sm font-semibold text-white backdrop-blur">
                <Sparkles className="h-4 w-4 text-[#f5cf83]" />
                {eyebrow}
              </span>
            ) : null}
            <h1 className="mt-5 font-sans text-[2.5rem] font-semibold leading-[1.02] tracking-tight text-white sm:text-[4rem]">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl font-sans text-base leading-7 text-white/85 sm:text-xl">
              {description}
            </p>
            {actions ? <div className="mt-8 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function BrandInfoCard({
  icon: Icon,
  title,
  description,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-[1.6rem] border border-[#eadfca] bg-white p-6 shadow-[0_18px_45px_rgba(46,37,20,0.08)] transition-transform duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white shadow-lg">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="font-sans text-xl font-semibold text-slate-950">{title}</h3>
      <p className="mt-3 font-sans text-[0.98rem] leading-7 text-slate-600">{description}</p>
    </div>
  );
}

export function BrandVisualCard({
  title,
  description,
  image,
  href,
  className,
}: {
  title: string;
  description?: string;
  image: string;
  href?: string;
  className?: string;
}) {
  const content = (
    <div
      className={cn(
        "group overflow-hidden rounded-[1.7rem] border border-[#eadfca] bg-white shadow-[0_18px_45px_rgba(46,37,20,0.08)] transition-transform duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className="relative aspect-[4/4.3] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="from-black/78 via-black/18 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-sans text-xl font-semibold text-white">{title}</h3>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-white/80">{description}</p>
          ) : null}
        </div>
      </div>
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}

export function BrandProductCard({
  name,
  price,
  image,
  href,
  label,
}: {
  name: string;
  price: number;
  image: string;
  href: string;
  label?: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-[#eadfca] bg-white p-2 shadow-[0_18px_40px_rgba(46,38,22,0.08)]">
      <Link href={href} className="group block">
        <div className="relative aspect-[1.02] overflow-hidden rounded-[1.15rem] bg-[#f7f2e8]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {label ? (
            <span className="absolute left-3 top-3 rounded-full bg-[#1f3763] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
              {label}
            </span>
          ) : null}
        </div>
      </Link>
      <div className="space-y-2 px-1 pb-1 pt-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] font-sans text-[1rem] font-semibold leading-5 text-slate-950">
          {name}
        </h3>
        <div className="flex items-center gap-1 text-[#efb423]">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star key={index} className="h-3.5 w-3.5 fill-current" />
          ))}
        </div>
        <p className="font-sans text-[1.25rem] font-bold text-slate-900">₹{price}</p>
        <div className="flex gap-2 pt-1">
          <Button
            asChild
            variant="outline"
            className="h-9 flex-1 rounded-full border-[#2d8a67] bg-white px-3 text-[0.75rem] font-semibold text-[#256f53] hover:bg-[#effaf5]"
          >
            <Link href={href}>Quick View</Link>
          </Button>
          <Button
            asChild
            className="h-9 flex-1 rounded-full bg-[#1f7a57] px-3 text-[0.75rem] font-semibold text-white hover:bg-[#196449]"
          >
            <Link href="/cart">Add to Cart</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export function BrandStats({
  items,
  className,
}: {
  items: Array<{ value: string; label: string }>;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-4 rounded-[1.8rem] border border-[#eadfca] bg-white p-5 shadow-[0_18px_45px_rgba(46,37,20,0.08)] sm:grid-cols-2 xl:grid-cols-4",
        className
      )}
    >
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-[1.3rem] border border-[#f0e4ca] bg-gradient-to-br from-[#fffdf8] to-[#f7f2e8] px-5 py-6 text-center"
        >
          <p className="font-sans text-[2rem] font-semibold text-[#1f3763]">{item.value}</p>
          <p className="mt-2 font-sans text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
            {item.label}
          </p>
        </div>
      ))}
    </div>
  );
}

export function BrandSplitCallout({
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  children,
  className,
}: {
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[2rem] border border-[#eadfca] bg-gradient-to-r from-[#fbf8f1] via-white to-[#f6efe3] p-6 shadow-[0_22px_55px_rgba(45,36,20,0.1)] sm:p-8",
        className
      )}
    >
      <div className="grid items-center gap-8 md:grid-cols-[0.92fr_1.08fr]">
        <div>{children}</div>
        <div>
          <h2 className="font-sans text-[2rem] font-semibold tracking-tight text-slate-950 sm:text-[2.45rem]">
            {title}
          </h2>
          <p className="mt-4 font-sans text-base leading-7 text-slate-600 sm:text-lg">
            {description}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-11 rounded-full bg-[#1f3763] px-6 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]"
            >
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            {secondaryHref && secondaryLabel ? (
              <Button
                asChild
                variant="outline"
                className="h-11 rounded-full border-[#d0b57a] bg-white px-6 text-sm font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5]"
              >
                <Link href={secondaryHref}>{secondaryLabel}</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
