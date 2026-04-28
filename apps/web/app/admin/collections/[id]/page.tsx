import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

async function updateCollection(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const isActive = formData.get("isActive") === "true";

  await prisma.collection.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      sortOrder,
      isActive,
    },
  });

  redirect("/admin/collections");
}

async function deleteCollection(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;

  await prisma.collection.delete({
    where: { id },
  });

  redirect("/admin/collections");
}

export default async function EditCollectionPage({ params }: { params: { id: string } }) {
  await requireAdmin();

  const collection = await prisma.collection.findUnique({
    where: { id: params.id },
  });

  if (!collection) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Collection</h1>
        <p className="text-muted-foreground mt-2">
          Update collection details
        </p>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <form action={updateCollection} className="space-y-5 max-w-2xl">
          <input type="hidden" name="id" value={collection.id} />
          <div className="space-y-2">
            <Label htmlFor="name">Collection Name *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={collection.name}
              required
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              name="slug"
              defaultValue={collection.slug}
              required
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={collection.description || ""}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              name="sortOrder"
              type="number"
              defaultValue={collection.sortOrder}
              className="h-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              value="true"
              defaultChecked={collection.isActive}
              className="h-4 w-4"
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit">
              Update Collection
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

        <form action={deleteCollection} className="mt-8">
          <input type="hidden" name="id" value={collection.id} />
          <Button type="submit" variant="destructive">
            Delete Collection
          </Button>
        </form>
      </div>
    </div>
  );
}
