"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Edit, MapPin, Plus, Trash2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";

export function AddressesContent() {
  const { status } = useSession();
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  const addresses = [
    { id: 1, name: "Home", fullName: "John Doe", phone: "+91 98765 43210", address: "54, Gopabandhu - Siripur Rd", city: "Bhubaneswar", state: "Odisha", pincode: "751003", isDefault: true },
    { id: 2, name: "Office", fullName: "John Doe", phone: "+91 98765 43210", address: "Tech Park, Building A", city: "Bhubaneswar", state: "Odisha", pincode: "751001", isDefault: false },
  ];

  return (
    <StorefrontCanvas>
      <SiteHeader />
      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "My Account", href: "/account" }, { label: "Addresses" }]} />
          <div className="mt-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="font-sans text-[2.6rem] font-semibold tracking-tight text-slate-950">My Addresses</h1>
                <p className="mt-2 font-sans text-[1rem] text-slate-600">Manage your shipping addresses</p>
              </div>
              <Button className="h-11 rounded-full bg-[#1f3763] px-6 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]" onClick={() => setShowAddForm(!showAddForm)}>
                <Plus className="mr-2 h-4 w-4" />Add New Address
              </Button>
            </div>
            {showAddForm && (
              <div className="mt-8 rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
                <h3 className="font-sans text-[1.7rem] font-semibold text-slate-950">Add New Address</h3>
                <form className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="fullName">Full Name *</Label><Input id="fullName" placeholder="John Doe" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                    <div className="space-y-2"><Label htmlFor="phone">Phone *</Label><Input id="phone" placeholder="+91 98765 43210" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="address">Address *</Label><Input id="address" placeholder="123 Gift Street" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div className="space-y-2"><Label htmlFor="city">City *</Label><Input id="city" placeholder="Bhubaneswar" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                    <div className="space-y-2"><Label htmlFor="state">State *</Label><Input id="state" placeholder="Odisha" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                    <div className="space-y-2"><Label htmlFor="pincode">PIN Code *</Label><Input id="pincode" placeholder="751001" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="addressName">Address Name (Home, Office, etc.)</Label><Input id="addressName" placeholder="Home" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                  <div className="flex gap-4 pt-2">
                    <Button type="submit" className="h-12 rounded-full bg-[#1f3763] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]">Save Address</Button>
                    <Button type="button" variant="outline" className="h-12 rounded-full border-[#d0b57a] bg-white px-8 text-sm font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5]" onClick={() => setShowAddForm(false)}>Cancel</Button>
                  </div>
                </form>
              </div>
            )}
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {addresses.map((address: typeof addresses[number]) => (
                <div key={address.id} className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white"><MapPin className="h-5 w-5" /></div>
                      <div>
                        <h3 className="font-sans text-base font-semibold text-slate-950">{address.name}</h3>
                        {address.isDefault && <span className="text-xs font-semibold text-[#c59a46]">Default</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="rounded-full"><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="rounded-full text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 font-sans text-sm text-slate-600">
                    <p className="font-medium text-slate-950">{address.fullName}</p>
                    <p>{address.phone}</p>
                    <p>{address.address}</p>
                    <p>{address.city}, {address.state} - {address.pincode}</p>
                  </div>
                  {!address.isDefault && (
                    <Button variant="outline" size="sm" className="mt-4 w-full rounded-full border-[#d0b57a] bg-white text-xs font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5]">Set as Default</Button>
                  )}
                </div>
              ))}
            </div>
            {addresses.length === 0 && (
              <div className="mt-10 rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f2e8] text-[#1f3763]"><MapPin className="h-9 w-9" /></div>
                <h2 className="mt-6 font-sans text-[2rem] font-semibold text-slate-950">No addresses saved</h2>
                <p className="mx-auto mt-3 max-w-xl font-sans text-[1rem] leading-7 text-slate-600">Add your shipping addresses for faster checkout</p>
                <Button className="mt-6 h-12 rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]" onClick={() => setShowAddForm(true)}><Plus className="mr-2 h-4 w-4" />Add Your First Address</Button>
              </div>
            )}
          </div>
        </StorefrontContainer>
      </main>
      <SiteFooter />
    </StorefrontCanvas>
  );
}
