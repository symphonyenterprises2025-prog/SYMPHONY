export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/admin-auth";
import { WishlistContent } from "./wishlist-content";

export default async function AccountWishlistPage() {
  await requireAuth();
  return <WishlistContent />;
}
