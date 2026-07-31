// "use client" — handles item checklist, per-item notes
// (revealed on selection), submission, errors.

"use client";

import { useState, useTransition } from "react";
import { submitMerchInquiry } from "./actions";

const ITEMS = [
  { value: "Bags", label: "Bags" },
  { value: "Cups", label: "Cups" },
  { value: "Books", label: "Books" },
  { value: "Banners", label: "Banners" },
  { value: "Flex Banners", label: "Flex banners" },
  { value: "Gift Bags", label: "Gift bags" },
  { value: "Party Bags", label: "Party bags" },
  { value: "Gift Boxes", label: "Gift boxes" },
  { value: "Pens", label: "Pens" },
  { value: "T-Shirts", label: "T-shirts" },
  { value: "Other", label: "Other" },
];

export default function MerchInquiryForm({ customer }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState([]);

  function toggleItem(value) {
    setSelected((prev) =>
      prev.includes(value)
        ? prev.filter((i) => i !== value)
        : [...prev, value]
    );
  }

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    // Clear and re-add selected item types so unchecked ones aren't submitted.
    formData.delete("itemTypes");
    for (const item of selected) {
      formData.append("itemTypes", item);
    }

    startTransition(async () => {
      const result = await submitMerchInquiry(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      window.location.href = `/inquiry/success/${result.ref}`;
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {!customer && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              name="customerName"
              type="text"
              required
              className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="customerPhone"
              type="tel"
              required
              placeholder="08012345678"
              className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Email <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              name="customerEmail"
              type="email"
              className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
            />
          </div>
        </div>
      )}

      {customer && (
        <div className="bg-cream border border-hairline rounded-md p-3 text-sm">
          Submitting as <strong>{customer.name}</strong> · {customer.phone}
        </div>
      )}

      {/* Items checklist */}
      <div>
        <label className="block text-sm font-medium mb-2">
          What do you need?
        </label>
        <div className="flex flex-wrap gap-2 mb-4">
          {ITEMS.map((item) => {
            const isSelected = selected.includes(item.value);
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => toggleItem(item.value)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  isSelected
                    ? "bg-ink text-white"
                    : "bg-white text-ink border border-hairline hover:border-clay"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Per-item notes — revealed on selection */}
        {selected.length > 0 && (
          <div className="space-y-3 pt-2 border-t border-hairline">
            {selected.map((itemType) => (
              <div
                key={itemType}
                className="bg-cream border border-hairline rounded-md p-3 space-y-2"
              >
                <p className="text-sm font-medium">{itemType}</p>
                {itemType === "Other" && (
                  <input
                    name="customLabel"
                    type="text"
                    placeholder="Describe the item"
                    className="w-full px-2 py-1.5 text-sm border border-hairline rounded focus:outline-none focus:ring-2 focus:ring-clay"
                  />
                )}
                <div className="grid grid-cols-3 gap-2">
                  <input
                    name={`qty-${itemType}`}
                    type="number"
                    min="1"
                    placeholder="Qty"
                    className="px-2 py-1.5 text-sm border border-hairline rounded focus:outline-none focus:ring-2 focus:ring-clay"
                  />
                  <input
                    name={`notes-${itemType}`}
                    type="text"
                    placeholder="Notes (color, logo, size, etc.)"
                    className="col-span-2 px-2 py-1.5 text-sm border border-hairline rounded focus:outline-none focus:ring-2 focus:ring-clay"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Needed-by date */}
      <div>
        <label className="block text-sm font-medium mb-1">Needed by</label>
        <input
          name="neededByDate"
          type="date"
          required
          className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
        />
      </div>

      {/* Overall notes */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Notes <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Anything else we should know? Budget, deadline flexibility, etc."
          className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
        />
      </div>

      {error && (
        <p className="text-sm text-terracotta bg-cream border border-terracotta rounded-md p-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-clay hover:bg-clay-dark text-white font-medium py-3 rounded-md transition-colors disabled:opacity-50"
      >
        {isPending ? "Submitting…" : "Send inquiry via WhatsApp"}
      </button>
    </form>
  );
}
