export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/admin-auth";
import { AddressesContent } from "./addresses-content";

export default async function AccountAddressesPage() {
  await requireAuth();
  return <AddressesContent />;
}
