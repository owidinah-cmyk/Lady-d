"use client";

import { useState, useTransition } from "react";
import { updateDish } from "../actions";

export default function DishEditForm({ dish }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateDish(dish.id, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-[#E8E2D5] rounded-card p-6 space-y-5">
      <h2 className="font-medium">Dish details</h2>

      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          name="name"
          type="text"
          required
          defaultValue={dish.name}
          className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          name="category"
          type="text"
          required
          defaultValue={dish.category}
          className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          rows={2}
          defaultValue={dish.description}
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
            defaultValue={dish.leadTimeHours}
            className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Min order</label>
          <input
            name="minOrder"
            type="number"
            min="1"
            defaultValue={dish.minOrder}
            className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
          />
        </div>
      </div>

      <div className="pt-4 border-t border-[#E8E2D5] space-y-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={dish.isActive} className="accent-[#D4AF5A]" />
          Active (visible on menu)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={dish.isFeatured} className="accent-[#D4AF5A]" />
          Featured (shown on landing page)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="abujaAvailable" defaultChecked={dish.abujaAvailable} className="accent-[#D4AF5A]" />
          Available in Abuja
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="phAvailable" defaultChecked={dish.phAvailable} className="accent-[#D4AF5A]" />
          Available in Port Harcourt
        </label>
      </div>

      {error && (
        <p className="text-sm text-[#7A2634] bg-[#F7F5F1] border border-[#7A2634] rounded-md p-3">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-[#1A1614] bg-[#F7F5F1] border border-[#D4AF5A] rounded-md p-3">
          Dish saved.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#D4AF5A] hover:bg-[#B8933F] text-white font-medium px-5 py-2.5 rounded-md transition-colors disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
