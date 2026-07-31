// /app/admin/layout.js
// Auth-guards the entire /admin area, then renders the shell
// with the signed-in admin's email.

import { requireAdmin } from "@/lib/auth/admin-guard";
import AdminShell from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin — Lady D Kitchen",
};

export default async function AdminLayout({ children }) {
  const admin = await requireAdmin();
  return (
    <AdminShell adminEmail={admin.email}>{children}</AdminShell>
  );
}
