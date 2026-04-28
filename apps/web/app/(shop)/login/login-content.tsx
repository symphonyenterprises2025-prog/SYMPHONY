"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { LockKeyhole, Mail } from "lucide-react";
import { signIn } from "next-auth/react";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";

export function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <StorefrontCanvas>
      <SiteHeader />
      <main className="pb-16 pt-10">
        <StorefrontContainer>
          <div className="mx-auto max-w-[1100px] rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_24px_60px_rgba(45,36,20,0.1)] lg:grid lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-[linear-gradient(135deg,#1f3763_0%,#2b8b68_100%)] p-8 text-white sm:p-10">
              <p className="font-sans text-sm font-semibold uppercase tracking-[0.22em] text-[#f5cf83]">Welcome Back</p>
              <h1 className="mt-4 font-sans text-[2.2rem] font-semibold leading-tight">Sign in to continue your Symphony journey.</h1>
              <p className="mt-4 max-w-md font-sans text-[1rem] leading-7 text-white/85">Access your saved orders, addresses, personalized gifting history, and wishlist from one place.</p>
            </div>
            <div className="p-8 sm:p-10">
              <h2 className="font-sans text-[2rem] font-semibold text-slate-950">Account Login</h2>
              <p className="mt-2 font-sans text-[1rem] text-slate-600">Use your registered credentials to enter the storefront.</p>
              <form onSubmit={onSubmit} className="mt-8 space-y-5">
                {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input id="email" name="email" type="email" placeholder="admin@symphonyenterprise.co.in" className="h-12 rounded-xl border-[#e6dbc4] pl-11" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input id="password" name="password" type="password" className="h-12 rounded-xl border-[#e6dbc4] pl-11" required />
                  </div>
                </div>
                <Button className="h-12 w-full rounded-full bg-[#1f3763] text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]" disabled={loading}>
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
              <p className="mt-6 text-sm text-slate-600">
                New here? <Link href="/register" className="font-semibold text-[#1f3763] hover:text-[#172c53]">Create an account</Link>
              </p>
              <p className="mt-2 text-sm text-slate-600">
                <Link href="/admin-sign-in" className="font-semibold text-slate-500 hover:text-slate-700">
                  Admin Login →
                </Link>
              </p>
            </div>
          </div>
        </StorefrontContainer>
      </main>
      <SiteFooter />
    </StorefrontCanvas>
  );
}
