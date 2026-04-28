import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminBlogsPage() {
  await requireAdmin();

  const blogs = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground mt-2">
            Manage your store&apos;s blog content
          </p>
        </div>
        <Link href="/admin/blogs/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Blog Post
          </Button>
        </Link>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">All Blog Posts</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Title</th>
                <th className="px-4 py-3 font-semibold">Author</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Published At</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No blog posts found. Add one to get started.
                  </td>
                </tr>
              ) : (
                blogs.map((blog: typeof blogs[number]) => (
                  <tr key={blog.id} className="border-b">
                    <td className="px-4 py-4 font-medium">{blog.title}</td>
                    <td className="px-4 py-4 text-muted-foreground">{blog.author || "Anonymous"}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${blog.isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">
                      {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/admin/blogs/${blog.id}`} className="font-semibold hover:underline">
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
