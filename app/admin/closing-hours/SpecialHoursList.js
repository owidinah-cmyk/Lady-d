"use client";

import { useTransition } from "react";
import { removeSpecialHours } from "./actions";

export default function SpecialHoursList({ items }) {
  const [isPending, startTransition] = useTransition();

  function onRemove(id) {
    if (!confirm("Remove this date override?")) return;
    startTransition(() => removeSpecialHours(id));
  }

  return (
    <section className="bg-white border border-[#E8E2D5] rounded-card p-6 space-y-4">
      <h2 className="font-medium">Special dates</h2>
      <p className="text-sm text-[#A69A88]">
        Date-specific overrides (holidays, special events). These
        take precedence over the weekly schedule.
      </p>

      {items.length === 0 ? (
        <p className="text-sm text-[#A69A88]">No special dates configured.</p>
      ) : (
        <div className="space-y-2">
          {items.map((s) => (
            <div key={s.id} className="flex items-center justify-between p-3 border border-[#E8E2D5] rounded-md">
              <div>
                <p className="text-sm font-medium">
                  {new Date(s.date).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                  {s.label && <span className="text-[#A69A88] ml-2">— {s.label}</span>}
                </p>
                <p className="text-xs text-[#A69A88]">
                  {s.isClosed
                    ? "Closed all day"
                    : `${s.openTime} – ${s.closeTime}`}
                </p>
              </div>
              <button
                onClick={() => onRemove(s.id)}
                disabled={isPending}
                className="text-sm text-[#7A2634] hover:underline disabled:opacity-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
