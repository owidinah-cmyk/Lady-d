"use client";

import { useState, useTransition } from "react";
import { addSpecialHours } from "./actions";

export default function NewSpecialHoursForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addSpecialHours(formData);
      if (!result.ok) { setError(result.error); return; }
      e.target.reset();
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-[#E8E2D5] rounded-card p-6 space-y-4">
      <h2 className="font-medium">Add a special date</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-[#A69A88] mb-1">Date</label>
          <input name="date" type="date" required className="w-full px-3 py-1.5 border border-[#E8E2D5] rounded text-sm" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-[#A69A88] mb-1">Label</label>
          <input name="label" type="text" placeholder="e.g. Christmas" className="w-full px-3 py-1.5 border border-[#E8E2D5] rounded text-sm" />
        </div>
        <div>
          <label className="block text-xs text-[#A69A88] mb-1">Open</label>
          <input name="openTime" type="time" defaultValue="09:00" className="w-full px-3 py-1.5 border border-[#E8E2D5] rounded text-sm" />
        </div>
        <div>
          <label className="block text-xs text-[#A69A88] mb-1">Close</label>
          <input name="closeTime" type="time" defaultValue="20:00" className="w-full px-3 py-1.5 border border-[#E8E2D5] rounded text-sm" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isClosed" className="accent-[#D4AF5A]" />
        Closed all day
      </label>
      {error && <p className="text-sm text-[#7A2634]">{error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="bg-[#D4AF5A] hover:bg-[#B8933F] text-white font-medium px-4 py-1.5 rounded text-sm disabled:opacity-50"
      >
        {isPending ? "Adding…" : "+ Add date"}
      </button>
    </form>
  );
}
