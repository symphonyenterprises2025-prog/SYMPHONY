import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminShopByCategoriesPage() {
  await requireAdmin();

  const shopByCategories = await prisma.shopByCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      category: true,
      collection: true,
      occasion: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shop By Categories</h1>
          <p className="text-muted-foreground mt-2">
            Manage dynamic shop-by-category sections (Festivals, Occasions, Offers, Best Selling, etc.)
          </p>
        </div>
        <Link href="/admin/shop-by-categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Shop By Category
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">All Shop By Categories</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Linked To</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shopByCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No shop-by-categories found.
                  </td>
                </tr>
              ) : (
                shopByCategories.map((item: typeof shopByCategories[number]) => (
                  <tr key={item.id} className="border-b">
                    <td className="px-4 py-4 font-medium">{item.name}</td>
                    <td className="px-4 py-4 capitalize">{item.type}</td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {item.category?.name || item.collection?.name || item.occasion?.name || '-'}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {item.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/admin/shop-by-categories/${item.id}`} className="font-semibold hover:underline">
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
