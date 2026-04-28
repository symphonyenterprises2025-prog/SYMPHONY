import { auth } from "./auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  
  if (!session) {
    redirect("/admin-sign-in");
  }

  // @ts-ignore - role is added to session by JWT callback
  if (session.user?.role !== "ADMIN") {
    redirect("/?error=unauthorized");
  }

  return session;
}

export async function requireAuth() {
  const session = await auth();
  
  if (!session) {
    redirect("/login");
  }

  return session;
}
