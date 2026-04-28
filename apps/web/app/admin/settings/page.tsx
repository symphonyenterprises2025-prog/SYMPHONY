import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function updateSettings(formData: FormData) {
  "use server";

  const storeName = formData.get("storeName") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const pincode = formData.get("pincode") as string;
  const currency = formData.get("currency") as string;

  const settings = [
    { key: "STORE_NAME", value: storeName },
    { key: "CONTACT_EMAIL", value: contactEmail },
    { key: "CONTACT_PHONE", value: contactPhone },
    { key: "ADDRESS", value: address },
    { key: "CITY", value: city },
    { key: "STATE", value: state },
    { key: "PINCODE", value: pincode },
    { key: "CURRENCY", value: currency },
  ];

  for (const setting of settings) {
    await prisma.storeSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: { key: setting.key, value: setting.value },
    });
  }

  redirect("/admin/settings");
}

export default async function AdminSettingsPage() {
  await requireAdmin();

  const settings = await prisma.storeSetting.findMany();

  const getSetting = (key: string) => settings.find((s) => s.key === key)?.value || "";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your store configurations
        </p>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">General Settings</h2>
        <p className="text-muted-foreground mb-6">Update your store information</p>
        <form action={updateSettings} className="space-y-5 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name *</Label>
            <Input
              id="storeName"
              name="storeName"
              defaultValue={getSetting("STORE_NAME") || "Symphony eCommerce"}
              className="h-10"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={getSetting("CONTACT_EMAIL") || "symphonyenterprise2025@gmail.com"}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                defaultValue={getSetting("CONTACT_PHONE") || "+91 7978974823"}
                className="h-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              name="address"
              rows={2}
              defaultValue={getSetting("ADDRESS") || "54, Gopabandhu - Siripur Rd, Siripur, Bhubaneswar"}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                defaultValue={getSetting("CITY") || "Bhubaneswar"}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                defaultValue={getSetting("STATE") || "Odisha"}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pincode">PIN Code</Label>
              <Input
                id="pincode"
                name="pincode"
                defaultValue={getSetting("PINCODE") || "751003"}
                className="h-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              name="currency"
              defaultValue={getSetting("CURRENCY") || "INR"}
              disabled
              className="h-10 bg-gray-100"
            />
          </div>
          <div className="pt-2">
            <Button type="submit">
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
