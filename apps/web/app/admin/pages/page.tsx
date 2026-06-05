import Link from "@/components/ui/safe-link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  await requireAdmin();

  const pages = await prisma.contentPage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Pages</h1>
          <p className="text-muted-foreground mt-2">
            Manage static content pages (About, FAQ, Contact, etc.)
          </p>
        </div>
        <Link href="/admin/pages/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Page
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">All Pages</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Updated At</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No content pages found. Add one to get started.
                  </td>
                </tr>
              ) : (
                pages.map((page) => (
                  <tr key={page.id} className="border-b">
                    <td className="px-4 py-4 font-medium">{page.title}</td>
                    <td className="px-4 py-4 text-muted-foreground">/{page.slug}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${page.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {page.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{new Date(page.updatedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/admin/pages/${page.id}`} className="font-semibold hover:underline mr-4">
                        Edit
                      </Link>
                      <Link href={`/${page.slug}`} className="text-muted-foreground hover:underline" target="_blank">
                        View
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
