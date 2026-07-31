"use client";

import { useState, useTransition } from "react";
import { updateRider, removeRider } from "./actions";

export default function RiderRow({ rider }) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  function onSave(formData) {
    startTransition(async () => {
      const result = await updateRider(rider.id, formData);
      if (!result.ok) { setError(result.error); return; }
      setEditing(false);
      setError(null);
    });
  }

  function onRemove() {
    if (!confirm(`Remove rider "${rider.name}"? (If past orders used them, removal is refused.)`)) return;
    startTransition(async () => {
      const result = await removeRider(rider.id);
      if (!result.ok) alert(result.error);
    });
  }

  if (editing) {
    return (
      <tr className="border-t border-[#E8E2D5] bg-[#F7F5F1]">
        <td className="px-4 py-2 font-mono text-xs text-[#A69A88]">{rider.code}</td>
        <td colSpan="4" className="px-4 py-2">
          <form
            onSubmit={(e) => { e.preventDefault(); onSave(new FormData(e.currentTarget)); }}
            className="flex items-center gap-2 flex-wrap"
          >
            <input name="name" defaultValue={rider.name} required className="px-2 py-1 border border-[#E8E2D5] rounded text-sm w-40" />
            <input name="phone" defaultValue={rider.phone} required className="px-2 py-1 border border-[#E8E2D5] rounded text-sm w-36" />
            <label className="text-xs flex items-center gap-1">
              <input type="checkbox" name="isActive" defaultChecked={rider.isActive} className="accent-[#D4AF5A]" />
              Active
            </label>
            <button type="submit" disabled={isPending} className="bg-[#D4AF5A] hover:bg-[#B8933F] text-white text-xs px-3 py-1 rounded">
              {isPending ? "…" : "Save"}
            </button>
            <button type="button" onClick={() => { setEditing(false); setError(null); }} className="text-xs text-[#A69A88] hover:text-[#1A1614]">
              Cancel
            </button>
            {error && <span className="text-xs text-[#7A2634] ml-2">{error}</span>}
          </form>
        </td>
      </tr>
    );
  }

  return (
    <tr className="border-t border-[#E8E2D5]">
      <td className="px-4 py-2 font-mono text-xs">{rider.code}</td>
      <td className="px-4 py-2 font-medium">{rider.name}</td>
      <td className="px-4 py-2 text-[#A69A88]">{rider.phone}</td>
      <td className="px-4 py-2">
        <span className={`text-xs px-2 py-0.5 rounded ${rider.isActive ? "bg-[#D4AF5A] text-white" : "bg-[#F7F5F1] text-[#A69A88]"}`}>
          {rider.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-4 py-2 text-right space-x-3">
        <button onClick={() => setEditing(true)} className="text-sm text-[#D4AF5A] hover:underline">Edit</button>
        <button onClick={onRemove} disabled={isPending} className="text-sm text-[#7A2634] hover:underline disabled:opacity-50">Remove</button>
      </td>
    </tr>
  );
}
