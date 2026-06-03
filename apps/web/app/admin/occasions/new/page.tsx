import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { requireAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function NewOccasionPage() {
  await requireAdmin();

  async function createOccasion(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const isActive = formData.get("isActive") === "on";
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    await prisma.occasion.create({
      data: {
        name,
        slug,
        description,
        image,
        isActive,
        sortOrder,
      },
    });

    redirect("/admin/occasions");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Occasion</h1>
        <p className="text-muted-foreground mt-2">
          Create a new occasion for products (festivals, holidays, etc.)
        </p>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <form action={createOccasion} className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required placeholder="e.g., Diwali" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" name="slug" required placeholder="e.g., diwali" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} placeholder="Description of this occasion..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" placeholder="/images/fnp/banner/diwali.jpg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isActive" name="isActive" defaultChecked />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit">Create Occasion</Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
