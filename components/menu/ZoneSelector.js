// /components/menu/ZoneSelector.js
// "use client" — the selector updates the cart cookie via
// the setZone server action.
// Renders a native <select> for simplicity and accessibility.

"use client";

import { useTransition } from "react";
import { setZone } from "@/lib/cart/actions";
import { formatPrice } from "@/lib/menu/dishes";

export default function ZoneSelector({ zones, currentZoneId }) {
  const [isPending, startTransition] = useTransition();

  function onChange(e) {
    const zoneId = e.target.value || undefined;
    startTransition(async () => {
      await setZone({ zoneId });
    });
  }

  // Group zones by city for cleaner display.
  const grouped = zones.reduce((acc, z) => {
    if (!acc[z.city]) acc[z.city] = [];
    acc[z.city].push(z);
    return acc;
  }, {});

  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="zone-select"
        className="text-sm text-muted whitespace-nowrap"
      >
        Delivering to:
      </label>
      <select
        id="zone-select"
        value={currentZoneId || ""}
        onChange={onChange}
        disabled={isPending}
        className="text-sm border border-hairline rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-clay disabled:opacity-50"
      >
        <option value="">Choose a zone…</option>
        {Object.entries(grouped).map(([city, cityZones]) => (
          <optgroup key={city} label={city}>
            {cityZones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name} (+{formatPrice(z.deliveryFee)} delivery)
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
