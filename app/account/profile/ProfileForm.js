// /app/account/profile/ProfileForm.js
// "use client" — calls updateProfile server action, shows
// success/error feedback.

"use client";

import { useState, useTransition } from "react";
import { updateProfile } from "./actions";

export default function ProfileForm({ initialName, initialPhone, email }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          disabled
          className="w-full px-3 py-2 border border-hairline rounded-md bg-cream text-muted cursor-not-allowed"
        />
        <p className="text-xs text-muted mt-1">
          To change your email, contact us on WhatsApp.
        </p>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          defaultValue={initialName}
          className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          defaultValue={initialPhone}
          placeholder="08012345678"
          className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
        />
      </div>

      {error && (
        <p className="text-sm text-terracotta bg-cream border border-terracotta rounded-md p-3">
          {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-ink bg-cream border border-clay rounded-md p-3">
          Profile updated.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="bg-clay hover:bg-clay-dark text-white font-medium px-5 py-2.5 rounded-md transition-colors disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
