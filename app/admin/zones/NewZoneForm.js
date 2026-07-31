"use client";

import { useState, useTransition } from "react";
import { createZone } from "./actions";

export default function NewZoneForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createZone(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      e.target.reset();
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white border border-[#E8E2D5] rounded-card p-4 flex items-end gap-3 flex-wrap"
    >
      <div>
        <label className="block text-xs text-[#A69A88] mb-1">Name</label>
        <input
          name="name"
          type="text"
          required
          placeholder="e.g. Maitama"
          className="px-3 py-1.5 border border-[#E8E2D5] rounded text-sm w-40"
        />
      </div>
      <div>
        <label className="block text-xs text-[#A69A88] mb-1">City</label>
        <select
          name="city"
          required
          className="px-3 py-1.5 border border-[#E8E2D5] rounded text-sm"
        >
          <option value="">Choose…</option>
          <option value="Abuja">Abuja</option>
          <option value="Port Harcourt">Port Harcourt</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-[#A69A88] mb-1">Delivery fee (₦)</label>
        <input
          name="deliveryFee"
          type="number"
          min="0"
          required
          placeholder="e.g. 1500"
          className="px-3 py-1.5 border border-[#E8E2D5] rounded text-sm w-32"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-[#D4AF5A] hover:bg-[#B8933F] text-white text-sm font-medium px-4 py-1.5 rounded"
      >
        {isPending ? "Adding…" : "+ Add zone"}
      </button>
      {error && <span className="text-sm text-[#7A2634]">{error}</span>}
    </form>
  );
}
