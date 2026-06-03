import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  await requireAdmin();

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const activeCount = subscribers.filter((s) => s.isActive).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Newsletter Subscribers</h1>
        <p className="text-muted-foreground mt-2">
          {activeCount} active subscriber{subscribers.length !== 1 ? "s" : ""} ({subscribers.length} total)
        </p>
      </div>

      <div className="border rounded-lg bg-white p-6">
        <h2 className="text-xl font-semibold mb-4">All Subscribers</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="border-b">
              <tr>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Subscribed At</th>
                <th className="px-4 py-3 font-semibold">Unsubscribed At</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    No subscribers yet.
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub.id} className="border-b">
                    <td className="px-4 py-4 font-medium">{sub.email}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${sub.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                        {sub.isActive ? "Active" : "Unsubscribed"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-4 text-muted-foreground">{sub.unsubscribedAt ? new Date(sub.unsubscribedAt).toLocaleDateString() : "N/A"}</td>
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
