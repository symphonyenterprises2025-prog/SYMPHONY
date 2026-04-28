export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/admin-auth";
import { ProfileContent } from "./profile-content";

export default async function AccountProfilePage() {
  await requireAuth();
  return <ProfileContent />;
}
