// Server-side helpers for protecting admin pages and routes.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  getAdminBySessionToken,
  COOKIE_NAMES,
} from "@/lib/auth";

/**
 * Get the currently-authenticated admin, or null.
 * Use in Server Components to conditionally render admin UI.
 */
export async function getCurrentAdmin() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAMES.adminSession)?.value;
  return getAdminBySessionToken(token);
}

/**
 * Require an authenticated admin. If not authenticated, redirect
 * to /admin/login. Use at the top of admin Server Component pages.
 */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }
  return admin;
}
