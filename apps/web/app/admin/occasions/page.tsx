import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminOccasionsPage() {
  await requireAdmin();

  const occasions = await prisma.occasion.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Occasions</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product occasions (festivals, holidays, etc.)
          </p>
        </div>
        <Link href="/admin/occasions/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Occasion
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">All Occasions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Products Count</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {occasions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No occasions found.
                  </td>
                </tr>
              ) : (
                occasions.map((occasion: typeof occasions[number]) => (
                  <tr key={occasion.id} className="border-b">
                    <td className="px-4 py-4 font-medium">{occasion.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">{occasion.slug}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${occasion.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {occasion.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{occasion._count.products}</td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/admin/occasions/${occasion.id}`} className="font-semibold hover:underline">
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
