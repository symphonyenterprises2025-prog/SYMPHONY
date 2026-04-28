"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LockKeyhole, Mail, User, Phone, MessageCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";

export function ProfileContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const whatsapp = formData.get("whatsapp") as string;

    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, whatsapp }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <StorefrontCanvas>
      <SiteHeader />
      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "My Account", href: "/account" }, { label: "Profile" }]} />
          <div className="mt-6 max-w-3xl">
            <div className="mb-8">
              <h1 className="font-sans text-[2.6rem] font-semibold tracking-tight text-slate-950">Profile Settings</h1>
              <p className="mt-2 font-sans text-[1rem] text-slate-600">Update your personal information</p>
            </div>
            <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
              {success && (
                <div className="mb-6 rounded-2xl border border-[#c5e8c7] bg-[#eaf7f1] px-4 py-3 text-center text-sm font-semibold text-[#1f7a57]">
                  Profile updated successfully!
                </div>
              )}
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2"><User className="h-4 w-4" />Full Name</Label>
                  <Input id="name" name="name" defaultValue={session?.user?.name || ""} placeholder="John Doe" className="h-12 rounded-xl border-[#e6dbc4]" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2"><Mail className="h-4 w-4" />Email Address</Label>
                  <Input id="email" name="email" type="email" defaultValue={session?.user?.email || ""} placeholder="john@example.com" disabled className="h-12 rounded-xl border-[#e6dbc4] bg-[#f8f8f8]" />
                  <p className="text-xs text-slate-500">Email cannot be changed</p>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2"><Phone className="h-4 w-4" />Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" defaultValue={session?.user?.phone || ""} placeholder="+91 98765 43210" className="h-12 rounded-xl border-[#e6dbc4]" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp" className="flex items-center gap-2"><MessageCircle className="h-4 w-4" />WhatsApp Number</Label>
                    <Input id="whatsapp" name="whatsapp" type="tel" defaultValue={session?.user?.whatsapp || ""} placeholder="+91 98765 43210" className="h-12 rounded-xl border-[#e6dbc4]" />
                  </div>
                </div>
                <div className="pt-2">
                  <Button type="submit" className="h-12 rounded-full bg-[#1f3763] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
            <div className="mt-8 rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
              <h3 className="font-sans text-[1.7rem] font-semibold text-slate-950">Change Password</h3>
              <form className="mt-6 space-y-5">
                <div className="space-y-2"><Label htmlFor="currentPassword">Current Password</Label><Input id="currentPassword" type="password" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                <div className="space-y-2"><Label htmlFor="newPassword">New Password</Label><Input id="newPassword" type="password" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                <div className="space-y-2"><Label htmlFor="confirmPassword">Confirm New Password</Label><Input id="confirmPassword" type="password" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                <Button type="submit" variant="outline" className="h-12 rounded-full border-[#d0b57a] bg-white px-8 text-sm font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5]">Update Password</Button>
              </form>
            </div>
          </div>
        </StorefrontContainer>
      </main>
      <SiteFooter />
    </StorefrontCanvas>
  );
}
