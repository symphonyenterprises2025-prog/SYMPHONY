import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your store&apos;s products
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">All Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Featured</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No products found. Add one to get started.
                  </td>
                </tr>
              ) : (
                products.map((product: typeof products[number]) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-4 py-4 font-medium">{product.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">{product.category?.name || "Uncategorized"}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${product.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {product.isActive ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{product.isFeatured ? "Yes" : "No"}</td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/admin/products/${product.id}`} className="font-semibold hover:underline">
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
