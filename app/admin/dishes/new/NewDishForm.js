// /app/admin/dishes/new/NewDishForm.js
// "use client" — calls createDish, redirects to the edit page
// on success so staff can immediately add more variants and
// upload photos.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createDish } from "../actions";

export default function NewDishForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createDish(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/admin/dishes/${result.id}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-[#E8E2D5] rounded-card p-6 space-y-5">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          type="text"
          required
          className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          name="category"
          type="text"
          required
          placeholder="e.g. Rice dishes, Soups, Proteins, Sides"
          className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows={2}
          placeholder="One-line, scannable, Temu-style"
          className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Lead time (hours)</label>
          <input
            name="leadTimeHours"
            type="number"
            min="0"
            defaultValue="24"
            className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Min order</label>
          <input
            name="minOrder"
            type="number"
            min="1"
            defaultValue="1"
            className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
          />
        </div>
      </div>

      {/* First variant (required) */}
      <div className="pt-4 border-t border-[#E8E2D5]">
        <p className="text-sm font-medium mb-3">First variant (required)</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Size</label>
            <input
              name="variantSize"
              type="text"
              required
              placeholder="e.g. 1.5L, 2L, piece"
              className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price (₦)</label>
            <input
              name="variantPrice"
              type="number"
              min="0"
              step="1"
              required
              placeholder="e.g. 6500"
              className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
            />
            <p className="text-xs text-[#A69A88] mt-1">
              In Naira, no decimals. Stored as kobo internally.
            </p>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="pt-4 border-t border-[#E8E2D5] space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked className="accent-[#D4AF5A]" />
          Active (visible on menu)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" className="accent-[#D4AF5A]" />
          Featured (shown on landing page)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="abujaAvailable" defaultChecked className="accent-[#D4AF5A]" />
          Available in Abuja
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="phAvailable" defaultChecked className="accent-[#D4AF5A]" />
          Available in Port Harcourt
        </label>
      </div>

      {error && (
        <p className="text-sm text-[#7A2634] bg-[#F7F5F1] border border-[#7A2634] rounded-md p-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="bg-[#D4AF5A] hover:bg-[#B8933F] text-white font-medium px-5 py-2.5 rounded-md transition-colors disabled:opacity-50"
        >
          {isPending ? "Creating…" : "Create dish"}
        </button>
        <Link
          href="/admin/dishes"
          className="text-sm text-[#A69A88] hover:text-[#1A1614]"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}
