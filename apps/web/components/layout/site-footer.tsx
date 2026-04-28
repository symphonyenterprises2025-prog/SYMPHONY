import Link from "next/link";
import { Instagram, Mail, MapPin, MessageCircle, Phone, Send, Facebook, Twitter } from "lucide-react";
import { BrandWordmark, StorefrontContainer } from "@/components/storefront/brand-system";

const quickLinks = [
  { label: "Shop All", href: "/shop" },
  { label: "Personalized Gifts", href: "/personalized-gifts" },
  { label: "Collections", href: "/collections" },
  { label: "Occasions", href: "/occasions" },
  { label: "Corporate Gifting", href: "/corporate-gifting" },
];

const supportLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "FAQ", href: "/faq" },
  { label: "Track Order", href: "/track-order" },
  { label: "My Account", href: "/account" },
];

const paymentMethods = ["AMEX", "VISA", "Mastercard", "PayPal", "Discover", "UPI"];

export function SiteFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <StorefrontContainer className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
          {/* Brand Section */}
          <div className="space-y-6">
            <BrandWordmark />
            <p className="max-w-md font-sans text-[0.95rem] leading-7 text-slate-400">
              Personalized gifts, premium hampers, custom laser engraving, trophies, and corporate
              gifting sets designed to feel memorable before the box is even opened.
            </p>
            
            {/* Social Icons */}
            <div className="flex gap-4">
              <Link
                href="https://wa.me/917978974823"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-slate-400 transition-all duration-300 hover:text-[#25D366]"
              >
                <MessageCircle className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="text-sm">WhatsApp</span>
              </Link>
              <Link
                href="https://www.instagram.com/symphonyenterprises"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-slate-400 transition-all duration-300 hover:text-[#E1306C]"
              >
                <Instagram className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="text-sm">Instagram</span>
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-slate-400 transition-all duration-300 hover:text-[#1877F2]"
              >
                <Facebook className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="text-sm">Facebook</span>
              </Link>
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-slate-400 transition-all duration-300 hover:text-[#1DA1F2]"
              >
                <Twitter className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="text-sm">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="font-sans text-[1.15rem] font-semibold text-white tracking-tight">Explore</h3>
            <ul className="space-y-3 font-sans text-[0.95rem]">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-slate-400 transition-all duration-300 hover:text-[#be9548] hover:translate-x-1 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-6">
            <h3 className="font-sans text-[1.15rem] font-semibold text-white tracking-tight">Support</h3>
            <ul className="space-y-3 font-sans text-[0.95rem]">
              {supportLinks.map((item) => (
                <li key={item.label}>
                  <Link 
                    href={item.href} 
                    className="text-slate-400 transition-all duration-300 hover:text-[#be9548] hover:translate-x-1 inline-block"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h3 className="font-sans text-[1.15rem] font-semibold text-white tracking-tight">Contact</h3>
            <div className="space-y-4 font-sans text-[0.95rem] text-slate-400">
              <p className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#be9548]" />
                <span>Siripur Market, Unit-8, Bhubaneswar, Odisha 751003</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-[#be9548]" />
                <span>+91 7978974823</span>
              </p>
              <p className="flex items-center gap-3 break-all">
                <Mail className="h-4 w-4 shrink-0 text-[#be9548]" />
                <span>symphonyenterprise2025@gmail.com</span>
              </p>
            </div>

            {/* Newsletter */}
            <div className="space-y-3 pt-2">
              <p className="font-sans text-[0.9rem] font-medium text-slate-300">Subscribe to our newsletter</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2.5 font-sans text-[0.9rem] text-white placeholder:text-slate-500 focus:border-[#be9548] focus:outline-none focus:ring-2 focus:ring-[#be9548]/20 transition-all"
                />
                <button className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#be9548] text-white transition-all duration-300 hover:bg-[#a67d3c]">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              {paymentMethods.map((method) => (
                <span
                  key={method}
                  className="font-sans text-[0.8rem] font-semibold uppercase tracking-wider text-slate-500 transition-all hover:text-[#be9548]"
                >
                  {method}
                </span>
              ))}
            </div>
            <p className="font-sans text-[0.85rem] text-slate-500 text-center md:text-right">
              &copy; 2026 Symphony Enterprise. All rights reserved.
            </p>
          </div>
        </div>
      </StorefrontContainer>
    </footer>
  );
}
