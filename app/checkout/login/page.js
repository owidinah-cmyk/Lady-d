// /app/checkout/login/page.js
// Shown to unauthenticated users clicking "Proceed to checkout".
// Two tabs: I have an account / Create an account.

import CheckoutLoginForm from "./CheckoutLoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in to checkout — Lady D Kitchen",
};

export default function CheckoutLoginPage({ searchParams }) {
  const next = searchParams?.next || "/checkout";
  return (
    <main className="min-h-screen bg-cream text-ink">
      <div className="mx-auto max-w-md px-6 py-16">
        <h1 className="font-serif text-3xl mb-2">Sign in to continue</h1>
        <p className="text-sm text-muted mb-6">
          Create an account in 30 seconds — we&apos;ll save your orders
          and receipts for you.
        </p>
        <CheckoutLoginForm next={next} />
      </div>
    </main>
  );
}
