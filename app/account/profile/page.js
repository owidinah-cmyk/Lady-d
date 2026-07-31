// /app/account/profile/page.js
// Profile page. Renders the ProfileForm with the current
// customer's data. The /account layout already auth-gates.

import { getCurrentCustomer } from "@/lib/auth/current-customer";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Profile — Lady D Kitchen",
};

export default async function ProfilePage() {
  const customer = await getCurrentCustomer();
  if (!customer) return null;

  return (
    <div className="max-w-xl">
      <h2 className="font-serif text-2xl mb-4">Your profile</h2>
      <p className="text-sm text-muted mb-6">
        Update your name and phone. We use these to coordinate your
        orders on WhatsApp.
      </p>
      <ProfileForm
        initialName={customer.name}
        initialPhone={customer.phone || ""}
        email={customer.email}
      />
    </div>
  );
}
