// /app/checkout/CheckoutForm.js
// "use client" — calls placeOrder server action, handles
// loading + error states, opens WhatsApp on success.

"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { placeOrder } from "./actions";
import { fetchTimeSlots } from "./slot-actions";
import { formatPrice } from "@/lib/menu/dishes";

export default function CheckoutForm({
  customer,
  savedAddress,
  defaultZoneName,
  itemCount,
  subtotal,
  deliveryFee,
  total,
  maxLeadTimeHours = 0,
  initialLineItems = [],
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [closedReason, setClosedReason] = useState(null);

  // Default delivery date: tomorrow.
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().slice(0, 10);

  const maxLeadTime = initialLineItems.length > 0
    ? Math.max(...initialLineItems.map((i) => Number(i.dishLeadTimeHours ?? 0)))
    : 0;

  function formatTime12h(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    const period = h >= 12 ? "PM" : "AM";
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${String(m).padStart(2, "0")} ${period}`;
  }

  async function onDateChange(dateStr) {
    setSlotsLoading(true);
    setClosedReason(null);
    setSlots([]);
    try {
      const result = await fetchTimeSlots({ dateStr, leadTimeHours: maxLeadTime });
      if (!result.open) {
        setClosedReason(result.reason || "Closed");
        setSlots([]);
      } else {
        setClosedReason(null);
        setSlots(result.slots || []);
      }
    } catch (err) {
      console.error("[fetchTimeSlots] error:", err.message);
      setClosedReason("Could not load available times.");
      setSlots([]);
    } finally {
      setSlotsLoading(false);
    }
  }

  useEffect(() => {
    onDateChange(defaultDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await placeOrder(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      window.location.href = `/order/success/${result.ref}`;
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Customer details */}
      <div className="bg-white border border-hairline rounded-card p-6">
        <h2 className="font-medium mb-3">Your details</h2>
        <div className="text-sm space-y-1">
          <p><span className="text-muted">Name:</span> {customer.name}</p>
          <p><span className="text-muted">Email:</span> {customer.email}</p>
          {customer.phone && (
            <p><span className="text-muted">Phone:</span> {customer.phone}</p>
          )}
        </div>
        <p className="text-xs text-muted mt-3">
          Need to change these? Edit your{" "}
          <Link href="/account/profile" className="text-clay hover:underline">
            profile
          </Link>
          .
        </p>
      </div>

      {/* Delivery details */}
      <div className="bg-white border border-hairline rounded-card p-6 space-y-4">
        <h2 className="font-medium mb-2">Delivery details</h2>

        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">
            Delivery address
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows={2}
            defaultValue={savedAddress?.address || ""}
            placeholder="House number, street, area, landmarks"
            className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Delivery date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              required
              defaultValue={defaultDate}
              min={defaultDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1">
              Delivery time
            </label>
            {slotsLoading ? (
              <p className="text-xs text-muted py-2">Loading available times…</p>
            ) : closedReason ? (
              <p className="text-sm text-terracotta py-2">
                We're closed on this day. Please pick another date.
              </p>
            ) : (
              <select
                id="time"
                name="time"
                required
                defaultValue={slots[0] || ""}
                className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
              >
                {slots.map((slot) => (
                  <option key={slot} value={slot}>
                    {formatTime12h(slot)}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {defaultZoneName && (
          <p className="text-sm text-muted">
            Delivering to <strong>{defaultZoneName}</strong> —{" "}
            <Link href="/menu" className="text-clay hover:underline">
              change
            </Link>
          </p>
        )}

        <label className="flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            name="rememberAddress"
            defaultChecked={!!savedAddress?.address}
            className="accent-clay"
          />
          Remember this address for next time
        </label>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium mb-1">
            Notes <span className="text-muted font-normal">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={2}
            placeholder="Gate code, landmarks, dietary notes…"
            className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
          />
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-white border border-hairline rounded-card p-6">
        <h2 className="font-medium mb-3">Order summary</h2>
        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted">Subtotal ({itemCount} items)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Delivery</span>
            <span>{formatPrice(deliveryFee)}</span>
          </div>
          <div className="pt-2 mt-2 border-t border-hairline flex justify-between font-semibold">
            <span>Total</span>
            <span className="text-clay">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-muted pt-2">
            Pay a 50% deposit by bank transfer after we confirm via
            WhatsApp. Balance on delivery.
          </p>
        </div>
      </div>

      {/* Terms checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="agreed"
          name="agreed"
          required
          className="mt-1 accent-clay"
        />
        <label htmlFor="agreed" className="text-sm">
          I have read and agree to the{" "}
          <Link href="/terms" target="_blank" rel="noopener noreferrer" className="text-clay hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="text-clay hover:underline">
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      {/* Error */}
      {error && (
        <div className="text-sm text-terracotta bg-cream border border-terracotta rounded-md p-3">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-clay hover:bg-clay-dark text-white font-medium py-3 rounded-md transition-colors disabled:opacity-50"
      >
        {isPending ? "Placing order…" : "Place order via WhatsApp"}
      </button>
    </form>
  );
}
