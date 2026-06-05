"use client";

import { useState, useEffect } from "react";
import { X, Phone, MessageCircle } from "lucide-react";

export function ContactPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Check if user has already closed the popup
    const hasClosed = localStorage.getItem("contactPopupClosed");
    if (!hasClosed) {
      // Show popup after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setIsClosed(true);
    // Store in localStorage so it doesn't show again
    localStorage.setItem("contactPopupClosed", "true");
  };

  if (!isVisible || isClosed) return null;

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
            Need Help?
          </h3>

          {/* Message */}
          <p className="mt-3 font-sans text-sm text-slate-600 sm:text-base">
            We're here to assist you with orders, customization, and gifting inquiries.
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
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href="tel:+917978974823"
              className="inline-flex h-12 items-center justify-center rounded-full bg-[#1f3763] px-6 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#172c53]"
            >
              <Phone className="mr-2 h-4 w-4" />
              Call Now
            </a>
            <a
              href="https://wa.me/917978974823"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-full border border-[#d0b57a] bg-white px-6 text-sm font-semibold uppercase tracking-wide text-slate-900 transition-colors hover:bg-[#f8f2e5]"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              WhatsApp
            </a>
          </div>

          {/* Dismiss Text */}
          <button
            onClick={handleClose}
            className="mt-4 text-xs text-slate-500 hover:text-slate-700 underline"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
