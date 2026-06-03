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
    
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const image = formData.get("image") as string;
    const isActive = formData.get("isActive") === "on";
    const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

    await prisma.occasion.update({
      where: { id },
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

  async function deleteOccasion() {
    "use server";
    await prisma.occasion.delete({
      where: { id },
    });
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

      <div className="border rounded-lg bg-white p-6">
        <form action={updateOccasion} className="space-y-4 max-w-2xl">
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
            <Button type="button" variant="outline" onClick={() => window.history.back()}>
              Cancel
            </Button>
            <form action={deleteOccasion}>
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
