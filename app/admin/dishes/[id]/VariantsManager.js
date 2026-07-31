"use client";

import { useState, useTransition } from "react";
import { addVariant, removeVariant } from "../actions";
import { formatPrice } from "@/lib/menu/dishes";

export default function VariantsManager({ dishId, variants }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function onAdd(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addVariant(dishId, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      e.target.reset();
    });
  }

  function onRemove(variantId) {
    if (!confirm("Remove this variant? If any past orders used it, it'll be deactivated instead.")) return;
    startTransition(async () => {
      const result = await removeVariant(variantId);
      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-card p-6 space-y-5">
      <h2 className="font-medium">Variants</h2>

      {variants.length === 0 ? (
        <p className="text-sm text-[#A69A88]">No variants yet.</p>
      ) : (
        <div className="space-y-2">
          {variants.map((v) => (
            <div
              key={v.id}
              className={`flex items-center justify-between p-3 border rounded-md ${
                v.isActive ? "border-[#E8E2D5] bg-white" : "border-[#E8E2D5] bg-[#F7F5F1]"
              }`}
            >
              <div>
                <p className="text-sm font-medium">
                  {v.size}{" "}
                  <span className="text-[#A69A88] font-mono text-xs ml-1">
                    {v.code}
                  </span>
                  {!v.isActive && (
                    <span className="ml-2 text-[10px] uppercase tracking-wide bg-[#7A2634] text-white px-1.5 py-0.5 rounded">
                      Inactive
                    </span>
                  )}
                </p>
                <p className="text-sm text-[#D4AF5A]">{formatPrice(v.price)}</p>
              </div>
              <button
                onClick={() => onRemove(v.id)}
                disabled={isPending}
                className="text-sm text-[#7A2634] hover:underline disabled:opacity-50"
              >
                {v.isActive ? "Remove" : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add variant form */}
      <form onSubmit={onAdd} className="pt-4 border-t border-[#E8E2D5] space-y-3">
        <p className="text-sm font-medium">Add a variant</p>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <label className="block text-xs text-[#A69A88] mb-1">Size</label>
            <input
              name="size"
              type="text"
              required
              placeholder="e.g. 2L"
              className="w-full px-3 py-2 border border-[#E8E2D5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-[#A69A88] mb-1">Price (₦)</label>
            <div className="flex gap-2">
              <input
                name="price"
                type="number"
                min="0"
                required
                placeholder="e.g. 8500"
                className="flex-1 px-3 py-2 border border-[#E8E2D5] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF5A]"
              />
              <button
                type="submit"
                disabled={isPending}
                className="bg-[#D4AF5A] hover:bg-[#B8933F] text-white font-medium px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
              >
                {isPending ? "Adding…" : "Add"}
              </button>
            </div>
          </div>
        </div>
        {error && <p className="text-sm text-[#7A2634]">{error}</p>}
      </form>
    </section>
  );
}
