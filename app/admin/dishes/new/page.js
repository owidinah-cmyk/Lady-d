// /app/admin/dishes/new/page.js
// Form to add a new dish. Includes fields for the dish itself
// PLUS the first variant (size + price) so the dish is
// immediately orderable. Additional variants are added
// via the edit page (5.2b).

import Link from "next/link";
import NewDishForm from "./NewDishForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add dish — Admin",
};

export default function NewDishPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <Link href="/admin/dishes" className="text-sm text-[#D4AF5A] hover:underline mb-2 inline-block">
          ← All dishes
        </Link>
        <h1 className="font-serif text-3xl">Add dish</h1>
        <p className="text-sm text-[#A69A88] mt-1">
          New dishes get a unique code automatically. Add at
          least one variant (size + price) so it can be ordered.
        </p>
      </header>

      <NewDishForm />
    </div>
  );
}
