import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function createCollection(formData: FormData) {
  "use server";

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  await prisma.collection.create({
    data: {
      name,
      slug,
      description,
      sortOrder,
    },
  });

  redirect("/admin/collections");
}

export default async function NewCollectionPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Collection</h1>
        <p className="text-muted-foreground mt-2">
          Create a new product collection
        </p>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <form action={createCollection} className="space-y-5 max-w-2xl">
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name *</Label>
            <Input
              id="name"
              name="name"
              required
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              required
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue="0"
              className="h-10"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit">
              Create Collection
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => redirect("/admin/collections")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
