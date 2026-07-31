"use client";

import { useState, useTransition } from "react";
import { updateZone, removeZone } from "./actions";

export default function ZoneRow({ zone }) {
  const [isPending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null);

  function onSave(formData) {
    startTransition(async () => {
      const result = await updateZone(zone.id, formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setEditing(false);
      setError(null);
    });
  }

  function onRemove() {
    if (!confirm(`Remove zone "${zone.name}"? (If any past order used it, removal is refused.)`)) return;
    startTransition(async () => {
      const result = await removeZone(zone.id);
      if (!result.ok) {
        alert(result.error);
      }
    });
  }

  if (editing) {
    return (
      <tr className="border-t border-[#E8E2D5] bg-[#F7F5F1]">
        <td className="px-4 py-2 font-mono text-xs text-[#A69A88]">{zone.code}</td>
        <td colSpan="5" className="px-4 py-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSave(new FormData(e.currentTarget));
            }}
            className="flex items-center gap-2 flex-wrap"
          >
            <input
              name="name"
              defaultValue={zone.name}
              required
              className="px-2 py-1 border border-[#E8E2D5] rounded text-sm w-32"
            />
            <input
              name="deliveryFee"
              type="number"
              min="0"
              defaultValue={zone.deliveryFee}
              required
              className="px-2 py-1 border border-[#E8E2D5] rounded text-sm w-24"
            />
            <label className="text-xs flex items-center gap-1">
              <input
                type="checkbox"
                name="isActive"
                defaultChecked={zone.isActive}
                className="accent-[#D4AF5A]"
              />
              Active
            </label>
            <button
              type="submit"
              disabled={isPending}
              className="bg-[#D4AF5A] hover:bg-[#B8933F] text-white text-xs px-3 py-1 rounded"
            >
              {isPending ? "…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => { setEditing(false); setError(null); }}
              className="text-xs text-[#A69A88] hover:text-[#1A1614]"
            >
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
      <td className="px-4 py-2 font-mono text-xs">{zone.code}</td>
      <td className="px-4 py-2 font-medium">{zone.name}</td>
      <td className="px-4 py-2 text-[#A69A88]">{zone.city}</td>
      <td className="px-4 py-2">{zone.deliveryFee} <span className="text-xs text-[#A69A88]">kobo</span></td>
      <td className="px-4 py-2">
        <span
          className={`text-xs px-2 py-0.5 rounded ${
            zone.isActive
              ? "bg-[#D4AF5A] text-white"
              : "bg-[#F7F5F1] text-[#A69A88]"
          }`}
        >
          {zone.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-4 py-2 text-right space-x-3">
        <button
          onClick={() => setEditing(true)}
          className="text-sm text-[#D4AF5A] hover:underline"
        >
          Edit
        </button>
        <button
          onClick={onRemove}
          disabled={isPending}
          className="text-sm text-[#7A2634] hover:underline disabled:opacity-50"
        >
          Remove
        </button>
      </td>
    </tr>
  );
}
