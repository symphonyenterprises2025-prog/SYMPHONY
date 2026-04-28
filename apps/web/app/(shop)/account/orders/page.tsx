export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/admin-auth";
import { OrdersContent } from "./orders-content";

export default async function AccountOrdersPage() {
  await requireAuth();
  return <OrdersContent />;
}
