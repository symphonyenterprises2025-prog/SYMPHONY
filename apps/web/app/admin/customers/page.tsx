import Link from "next/link";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  await requireAdmin();

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <p className="text-muted-foreground mt-2">
          View your registered customers
        </p>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">All Customers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Joined Date</th>
                <th className="px-4 py-3 font-semibold">Orders Count</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer: typeof customers[number]) => (
                  <tr key={customer.id} className="border-b">
                    <td className="px-4 py-4 font-medium">{customer.name || "N/A"}</td>
                    <td className="px-4 py-4 text-muted-foreground">{customer.email}</td>
                    <td className="px-4 py-4 text-muted-foreground">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-muted-foreground">{customer._count.orders}</td>
                    <td className="px-4 py-4 text-right">
                      <Link href={`/admin/customers/${customer.id}`} className="font-semibold hover:underline">
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
