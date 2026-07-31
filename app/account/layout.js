// Shared layout for all /account/* pages. Auth-gates the
// whole account area. If not logged in, redirects to
// /checkout/login?next=<current path>.

import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentCustomer } from "@/lib/auth/current-customer";

export const dynamic = "force-dynamic";

export default async function AccountLayout({ children }) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    // We don't know the exact current path server-side, so
    // we send users to /checkout/login with a generic next
    // pointing at /account. The login form will redirect them
    // back here after they sign in.
    redirect("/checkout/login?next=/account");
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="mb-8">
          <h1 className="font-serif text-3xl mb-1">
            Hello, {customer.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted">
            {customer.email}
          </p>
        </header>

        <nav className="flex flex-wrap gap-2 mb-8 border-b border-hairline pb-4">
          <Link
            href="/account"
            className="text-sm text-ink hover:text-clay px-3 py-1.5 rounded"
          >
            Overview
          </Link>
          <Link
            href="/account/orders"
            className="text-sm text-ink hover:text-clay px-3 py-1.5 rounded"
          >
            Orders
          </Link>
          <Link
            href="/account/profile"
            className="text-sm text-ink hover:text-clay px-3 py-1.5 rounded"
          >
            Profile
          </Link>
          <Link
            href="/account/reviews"
            className="text-sm text-ink hover:text-clay px-3 py-1.5 rounded"
          >
            Reviews
          </Link>
          <form action="/api/auth/logout" method="post" className="ml-auto">
            <button
              type="submit"
              className="text-sm text-terracotta hover:underline px-3 py-1.5"
            >
              Sign out
            </button>
          </form>
        </nav>

        {children}
      </div>
    </div>
  );
}
