import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminInquiriesPage() {
  await requireAdmin();

  const inquiries = await prisma.corporateInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Corporate Inquiries</h1>
        <p className="text-muted-foreground mt-2">
          View messages from the contact form
        </p>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">All Inquiries</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Budget</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Date</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                    No inquiries yet.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq.id} className="border-b">
                    <td className="px-4 py-4 font-medium">{inq.name}</td>
                    <td className="px-4 py-4 text-muted-foreground">{inq.email}</td>
                    <td className="px-4 py-4 text-muted-foreground">{inq.company || "N/A"}</td>
                    <td className="px-4 py-4 text-muted-foreground">{inq.budget || "N/A"}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${inq.status === "pending" ? "bg-yellow-100 text-yellow-800" : inq.status === "contacted" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{new Date(inq.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/admin/inquiries/${inq.id}`} className="font-semibold hover:underline">
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
