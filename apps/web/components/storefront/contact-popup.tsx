"use client";

import { useState, useEffect } from "react";
import { X, Phone, MessageCircle } from "lucide-react";

export function ContactPopup() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show popup after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-[#eadfca] bg-white shadow-[0_24px_60px_rgba(45,36,20,0.2)] p-6 sm:p-8 animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-full border border-[#eadfca] bg-[#fbf8f1] p-2 text-slate-600 transition-colors hover:bg-[#f0e4ca] hover:text-slate-900"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white">
            <Phone className="h-8 w-8" />
          </div>

          {/* Heading */}
          <h3 className="font-sans text-2xl font-semibold text-slate-950 sm:text-3xl">
            IMPORTANT NOTICE
          </h3>

          {/* Message */}
          <p className="mt-3 font-sans text-sm text-slate-600 sm:text-base">
            For quotation, pricing, and product inquiries, please WhatsApp us instead of calling.
          </p>
          <p className="mt-2 font-sans text-sm text-slate-600 sm:text-base">
            Kindly call only after order confirmation or for urgent matters.
          </p>

          {/* Phone Number */}
          <div className="mt-6 rounded-2xl border border-[#eadfca] bg-[#fbf8f1] p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#8d6a2f]">
              Call or WhatsApp
            </p>
            <a
              href="tel:+917978974823"
              className="mt-2 block font-sans text-xl font-bold text-slate-900 sm:text-2xl hover:text-[#1f3763] transition-colors"
            >
              +91 79 7897 4823
            </a>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex justify-center">
            <a
              href="https://wa.me/917978974823"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172c53]"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Message Us on WhatsApp
            </a>
          </div>

          {/* Thank You Message */}
          <p className="mt-4 text-xs font-semibold text-slate-700">
            Thank you for Cooperation!
          </p>
        </div>
      </div>
    </div>
  );
}
