// "use client" — handles the form, submission, errors.
// Pre-fills name/phone/email if the customer is logged in.

"use client";

import { useState, useTransition } from "react";
import { submitEventInquiry } from "./actions";

const CATEGORIES = [
  { value: "Wedding", label: "Wedding" },
  { value: "Corporate Event", label: "Corporate event" },
  { value: "Birthday", label: "Birthday" },
  { value: "Naming Ceremony", label: "Naming ceremony" },
  { value: "Anniversary", label: "Anniversary" },
  { value: "Other", label: "Other" },
];

export default function EventInquiryForm({ customer }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);

  function toggleCategory(value) {
    setSelectedCategories((prev) =>
      prev.includes(value)
        ? prev.filter((c) => c !== value)
        : [...prev, value]
    );
  }

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    // Clear and re-add selected categories so unchecked ones aren't submitted.
    formData.delete("categories");
    for (const cat of selectedCategories) {
      formData.append("categories", cat);
    }

    startTransition(async () => {
      const result = await submitEventInquiry(formData);
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

      <div>
        <label className="block text-sm font-medium mb-2">
          Event type(s)
        </label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const selected = selectedCategories.includes(cat.value);
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleCategory(cat.value)}
                className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
                  selected
                    ? "bg-ink text-white"
                    : "bg-white text-ink border border-hairline hover:border-clay"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Event date</label>
          <input
            name="eventDate"
            type="date"
            required
            className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Guest count</label>
          <input
            name="guestCount"
            type="number"
            min="1"
            required
            placeholder="e.g. 150"
            className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Location</label>
        <input
          name="location"
          type="text"
          required
          placeholder="Venue name or address"
          className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Package interest
        </label>
        <select
          name="packageInterest"
          className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
        >
          <option value="">Not sure yet</option>
          <option value="Standard (from ₦3,500/head)">
            Standard — from ₦3,500/head
          </option>
          <option value="Premium (from ₦6,500/head)">
            Premium — from ₦6,500/head
          </option>
          <option value="Custom">Custom (let&apos;s discuss)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Notes <span className="text-muted font-normal">(optional)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Dietary needs, theme, special requests…"
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
