"use client";

import { useState, useTransition } from "react";
import { assignRider } from "../actions";

export default function RiderAssigner({ orderId, currentRiderId, riders }) {
  const [selected, setSelected] = useState(currentRiderId || "");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function onAssign() {
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const result = await assignRider(orderId, selected || null);
      if (!result.ok) { setError(result.error); return; }
      setSuccess(true);
    });
  }

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-card p-5 space-y-3">
      <h2 className="font-medium">Rider</h2>
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="w-full px-3 py-2 border border-[#E8E2D5] rounded text-sm"
      >
        <option value="">Unassigned</option>
        {riders.map((r) => (
          <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
        ))}
      </select>
      <button
        onClick={onAssign}
        disabled={isPending}
        className="w-full bg-[#1A1614] hover:bg-[#7A2634] text-white font-medium py-2 rounded text-sm disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save rider"}
      </button>
      {error && <p className="text-sm text-[#7A2634]">{error}</p>}
      {success && <p className="text-sm text-[#1A1614]">Rider assigned.</p>}
    </section>
  );
}
