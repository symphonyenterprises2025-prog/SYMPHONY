import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { requireAdmin } from "@/lib/admin-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const VALID_TYPES = ['festival', 'occasion', 'offer', 'best-selling', 'featured', 'new-arrival'] as const;

export const dynamic = "force-dynamic";

export default async function NewShopByCategoryPage() {
  await requireAdmin();

  const [categories, collections, occasions] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    prisma.collection.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
    prisma.occasion.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
  ]);

  async function createShopByCategory(formData: FormData) {
    "use server";
    await requireAdmin();
    
    const name = (formData.get("name") as string)?.trim();
    const slug = (formData.get("slug") as string)?.trim().toLowerCase().replace(/\s+/g, '-');
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const categoryId = formData.get("categoryId") as string || null;
    const collectionId = formData.get("collectionId") as string || null;
    const occasionId = formData.get("occasionId") as string || null;
    const isActive = formData.get("isActive") === "on";
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    if (!name || !slug || !type) {
      throw new Error("Name, slug, and type are required");
    }
    if (!VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
      throw new Error("Invalid type selected");
    }
    if ((categoryId ? 1 : 0) + (collectionId ? 1 : 0) + (occasionId ? 1 : 0) > 1) {
      throw new Error("Only one link (category, collection, or occasion) can be set at a time");
    }

    try {
      await prisma.shopByCategory.create({
        data: { name, slug, type, description: description || null, image: image || null, categoryId, collectionId, occasionId, isActive, sortOrder },
      });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error && (error as { code: string }).code === 'P2002') {
        throw new Error("A shop-by-category with this slug already exists");
      }
      throw error;
    }

    redirect("/admin/shop-by-categories");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Shop By Category</h1>
        <p className="text-muted-foreground mt-2">
          Create a new dynamic shop-by-category section
        </p>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <form action={createShopByCategory} className="space-y-4 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input id="name" name="name" required placeholder="e.g., Diwali Special" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input id="slug" name="slug" required placeholder="e.g., diwali-special" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type *</Label>
            <select
              id="type"
              name="type"
              required
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
            <Textarea id="description" name="description" rows={3} placeholder="Description..." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input id="image" name="image" placeholder="/images/fnp/banner/diwali.jpg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Link to Category (Optional)</Label>
            <select
              id="categoryId"
              name="categoryId"
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
            <Input id="sortOrder" name="sortOrder" type="number" defaultValue={0} />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isActive" name="isActive" defaultChecked />
            <Label htmlFor="isActive">Active</Label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit">Create Shop By Category</Button>
            <Link href="/admin/shop-by-categories">
              <Button type="button" variant="outline">Cancel</Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
