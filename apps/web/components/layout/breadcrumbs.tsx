import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav
      className={cn(
        "inline-flex flex-wrap items-center gap-2 rounded-full border border-[#eadfca] bg-white/90 px-4 py-3 text-sm shadow-sm backdrop-blur",
        className
      )}
    >
      <Link href="/" className="text-slate-500 transition-colors hover:text-[#be9548]">
        <Home className="h-4 w-4" />
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-slate-400" />
          {item.href ? (
            <Link
              href={item.href}
              className="font-medium text-slate-500 transition-colors hover:text-[#be9548]"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-slate-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
