"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Edit, MapPin, Plus, Trash2, Loader2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";

interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export function AddressesContent() {
  const { status } = useSession();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchAddresses();
    }
  }, [status, router]);

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({ firstName: "", lastName: "", phone: "", address1: "", address2: "", city: "", state: "", postalCode: "", country: "India", isDefault: false });
    setEditingId(null);
    setShowAddForm(false);
  };

  const startEdit = (address: Address) => {
    setFormData({
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone || "",
      address1: address.address1,
      address2: address.address2 || "",
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setEditingId(address.id);
    setShowAddForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingId ? "/api/addresses" : "/api/addresses";
      const method = editingId ? "PUT" : "POST";
      const body = editingId ? { ...formData, id: editingId } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        resetForm();
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setSaving(false);
    }
  };

  const deleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      const res = await fetch(`/api/addresses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const setDefault = async (address: Address) => {
    try {
      const res = await fetch("/api/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...address, isDefault: true }),
      });
      if (res.ok) {
        fetchAddresses();
      }
    } catch (error) {
      console.error("Error setting default address:", error);
    }
  };

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

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
              <Button className="h-11 rounded-full bg-[#1f3763] px-6 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]" onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}>
                <Plus className="mr-2 h-4 w-4" />{showAddForm ? "Cancel" : "Add New Address"}
              </Button>
            </div>
            {showAddForm && (
              <div className="mt-8 rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)] sm:p-8">
                <h3 className="font-sans text-[1.7rem] font-semibold text-slate-950">{editingId ? "Edit Address" : "Add New Address"}</h3>
                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="firstName">First Name *</Label><Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder="John" className="h-12 rounded-xl border-[#e6dbc4]" required /></div>
                    <div className="space-y-2"><Label htmlFor="lastName">Last Name</Label><Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder="Doe" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+91 98765 43210" className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                    <div className="space-y-2"><Label htmlFor="country">Country</Label><Input id="country" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                  </div>
                  <div className="space-y-2"><Label htmlFor="address1">Address *</Label><Input id="address1" value={formData.address1} onChange={(e) => setFormData({ ...formData, address1: e.target.value })} placeholder="123 Gift Street" className="h-12 rounded-xl border-[#e6dbc4]" required /></div>
                  <div className="space-y-2"><Label htmlFor="address2">Address Line 2</Label><Input id="address2" value={formData.address2} onChange={(e) => setFormData({ ...formData, address2: e.target.value })} placeholder="Apartment, suite, etc." className="h-12 rounded-xl border-[#e6dbc4]" /></div>
                  <div className="grid gap-5 sm:grid-cols-3">
                    <div className="space-y-2"><Label htmlFor="city">City *</Label><Input id="city" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} placeholder="Bhubaneswar" className="h-12 rounded-xl border-[#e6dbc4]" required /></div>
                    <div className="space-y-2"><Label htmlFor="state">State *</Label><Input id="state" value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} placeholder="Odisha" className="h-12 rounded-xl border-[#e6dbc4]" required /></div>
                    <div className="space-y-2"><Label htmlFor="postalCode">PIN Code *</Label><Input id="postalCode" value={formData.postalCode} onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })} placeholder="751001" className="h-12 rounded-xl border-[#e6dbc4]" required /></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Checkbox id="isDefault" checked={formData.isDefault} onCheckedChange={(checked) => setFormData({ ...formData, isDefault: checked as boolean })} />
                    <Label htmlFor="isDefault" className="text-sm text-slate-600 cursor-pointer">Set as default address</Label>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <Button type="submit" className="h-12 rounded-full bg-[#1f3763] px-8 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]" disabled={saving}>
                      {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : (editingId ? "Update Address" : "Save Address")}
                    </Button>
                    <Button type="button" variant="outline" className="h-12 rounded-full border-[#d0b57a] bg-white px-8 text-sm font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5]" onClick={resetForm}>Cancel</Button>
                  </div>
                </form>
              </div>
            )}
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {addresses.map((address: Address) => (
                <div key={address.id} className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f3763] to-[#2b8b68] text-white"><MapPin className="h-5 w-5" /></div>
                      <div>
                        <h3 className="font-sans text-base font-semibold text-slate-950">{address.firstName} {address.lastName}</h3>
                        {address.isDefault && <span className="text-xs font-semibold text-[#c59a46]">Default</span>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" className="rounded-full" onClick={() => startEdit(address)}><Edit className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" className="rounded-full text-red-500 hover:bg-red-50" onClick={() => deleteAddress(address.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 font-sans text-sm text-slate-600">
                    <p className="font-medium text-slate-950">{address.phone && <>{address.phone}<br /></>}</p>
                    <p>{address.address1}{address.address2 ? `, ${address.address2}` : ""}</p>
                    <p>{address.city}, {address.state} - {address.postalCode}</p>
                    <p>{address.country}</p>
                  </div>
                  {!address.isDefault && (
                    <Button variant="outline" size="sm" className="mt-4 w-full rounded-full border-[#d0b57a] bg-white text-xs font-semibold uppercase tracking-wide text-slate-900 hover:bg-[#f8f2e5]" onClick={() => setDefault(address)}>Set as Default</Button>
                  )}
                </div>
              ))}
            </div>
            {!loading && addresses.length === 0 && (
              <div className="mt-10 rounded-[2rem] border border-[#eadfca] bg-white p-10 text-center shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#f7f2e8] text-[#1f3763]"><MapPin className="h-9 w-9" /></div>
                <h2 className="mt-6 font-sans text-[2rem] font-semibold text-slate-950">No addresses saved</h2>
                <p className="mx-auto mt-3 max-w-xl font-sans text-[1rem] leading-7 text-slate-600">Add your shipping addresses for faster checkout</p>
                <Button className="mt-6 h-12 rounded-full bg-[#1f3763] px-7 text-sm font-semibold uppercase tracking-wide text-white hover:bg-[#172c53]" onClick={() => { resetForm(); setShowAddForm(true); }}><Plus className="mr-2 h-4 w-4" />Add Your First Address</Button>
              </div>
            )}
          </div>
        </StorefrontContainer>
      </main>
      <SiteFooter />
    </StorefrontCanvas>
  );
}