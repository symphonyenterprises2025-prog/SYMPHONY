import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { requireAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function EditOccasionPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const occasion = await prisma.occasion.findUnique({
    where: { id },
  });

  if (!occasion) {
    notFound();
  }

  async function updateOccasion(formData: FormData) {
    "use server";
    await requireAdmin();
    
    const name = (formData.get("name") as string)?.trim();
    const slug = (formData.get("slug") as string)?.trim().toLowerCase().replace(/\s+/g, '-');
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const isActive = formData.get("isActive") === "on";
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!name || !slug) {
      throw new Error("Name and slug are required");
    }

    try {
      await prisma.occasion.update({
        where: { id },
        data: { name, slug, description: description || null, image: image || null, isActive, sortOrder },
      });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
        throw new Error("A occasion with this slug already exists");
      }
      throw error;
    }

    redirect("/admin/occasions");
  }

  async function deleteOccasion(formData: FormData) {
    "use server";
    await requireAdmin();
    try {
      await prisma.occasion.delete({ where: { id } });
    } catch {
      throw new Error("Failed to delete occasion. It may be linked to existing products.");
    }
    redirect("/admin/occasions");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Occasion</h1>
        <p className="text-muted-foreground mt-2">
          Edit occasion details
        </p>
      </div>

      <form action={updateOccasion} className="space-y-4 max-w-2xl">
        <div className="border rounded-lg bg-white p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required defaultValue={occasion.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" name="slug" required defaultValue={occasion.slug} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={occasion.description || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" defaultValue={occasion.image || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={occasion.sortOrder} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isActive" name="isActive" defaultChecked={occasion.isActive} />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit">Update Occasion</Button>
            <Link href="/admin/occasions">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
        </div>
      </form>

      <div className="border rounded-lg bg-white p-6">
        <h3 className="text-lg font-semibold text-red-600 mb-2">Danger Zone</h3>
        <p className="text-sm text-muted-foreground mb-4">Deleting this occasion cannot be undone.</p>
        <form action={deleteOccasion} onSubmit={(e) => { if (!confirm('Are you sure you want to delete this occasion?')) e.preventDefault(); }}>
          <Button type="submit" variant="destructive">Delete Occasion</Button>
        </form>
      </div>
    </div>
  );
}
