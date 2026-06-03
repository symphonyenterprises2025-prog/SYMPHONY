import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { requireAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditShopByCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;

  const shopByCategory = await prisma.shopByCategory.findUnique({
    where: { id },
    include: {
      category: true,
      collection: true,
      occasion: true,
    },
  });

  if (!shopByCategory) {
    notFound();
  }

  const categories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  const collections = await prisma.collection.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });
  const occasions = await prisma.occasion.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } });

  async function updateShopByCategory(formData: FormData) {
    "use server";
    
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const categoryId = formData.get("categoryId") as string || null;
    const collectionId = formData.get("collectionId") as string || null;
    const occasionId = formData.get("occasionId") as string || null;
    const isActive = formData.get("isActive") === "on";
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    await prisma.shopByCategory.update({
      where: { id },
      data: {
        name,
        slug,
        type,
        description,
        image,
        categoryId: categoryId || null,
        collectionId: collectionId || null,
        occasionId: occasionId || null,
        isActive,
        sortOrder,
      },
    });

    redirect("/admin/shop-by-categories");
  }

  async function deleteShopByCategory() {
    "use server";
    await prisma.shopByCategory.delete({
      where: { id },
    });
    redirect("/admin/shop-by-categories");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Shop By Category</h1>
        <p className="text-muted-foreground mt-2">
          Edit shop-by-category details
        </p>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <form action={updateShopByCategory} className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required defaultValue={shopByCategory.name} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" name="slug" required defaultValue={shopByCategory.slug} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <select
              id="type"
              name="type"
              required
              defaultValue={shopByCategory.type}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select type...</option>
              <option value="festival">Festival</option>
              <option value="occasion">Occasion</option>
              <option value="offer">Offer</option>
              <option value="best-selling">Best Selling</option>
              <option value="featured">Featured</option>
              <option value="new-arrival">New Arrival</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} defaultValue={shopByCategory.description || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" defaultValue={shopByCategory.image || ""} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Link to Category (Optional)</Label>
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={shopByCategory.categoryId || ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="collectionId">Link to Collection (Optional)</Label>
            <select
              id="collectionId"
              name="collectionId"
              defaultValue={shopByCategory.collectionId || ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>{col.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occasionId">Link to Occasion (Optional)</Label>
            <select
              id="occasionId"
              name="occasionId"
              defaultValue={shopByCategory.occasionId || ""}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">None</option>
              {occasions.map((occ) => (
                <option key={occ.id} value={occ.id}>{occ.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={shopByCategory.sortOrder} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isActive" name="isActive" defaultChecked={shopByCategory.isActive} />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit">Update Shop By Category</Button>
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <form action={deleteShopByCategory}>
              <Button type="submit" variant="destructive">
                Delete
              </Button>
            </form>
          </div>
        </form>
      </div>
    </div>
  );
}
