"use client";

import { useState, useTransition } from "react";
import { sendTestEmail } from "./actions";

export default function TestEmailForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState(null);

  function onSubmit(e) {
    e.preventDefault();
    setResult(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const r = await sendTestEmail(formData);
      setResult(r);
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-hairline rounded-card p-5 space-y-3">
      <div>
        <label className="block text-sm font-medium mb-1">To</label>
        <input
          name="to"
          type="email"
          required
          placeholder="you@example.com"
          className="w-full px-3 py-2 border border-hairline rounded text-sm focus:outline-none focus:ring-2 focus:ring-clay"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Template</label>
        <select name="template" className="w-full px-3 py-2 border border-hairline rounded text-sm">
          <option value="password-reset">Password reset</option>
          <option value="order-placed">Order placed</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="bg-clay hover:bg-clay-dark text-white font-medium px-4 py-2 rounded text-sm disabled:opacity-50"
      >
        {isPending ? "Sending…" : "Send test email"}
      </button>
      {result && (
        <p className={`text-sm ${result.ok ? "text-success-text" : "text-terracotta"}`}>
          {result.ok ? `✓ Sent. Message ID: ${result.messageId}` : `✗ ${result.error}`}
        </p>
      )}
    </form>
  );
}
