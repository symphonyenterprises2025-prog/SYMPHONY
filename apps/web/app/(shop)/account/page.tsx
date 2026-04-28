export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/admin-auth";
import { AccountContent } from "./account-content";

export default async function AccountPage() {
  await requireAuth();
  return <AccountContent />;
}
