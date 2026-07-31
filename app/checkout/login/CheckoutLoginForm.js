// /app/checkout/login/CheckoutLoginForm.js
// "use client" — handles both login (existing user) and signup.
// Posts to /api/auth/login or /api/auth/signup.

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutLoginForm({ next }) {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
    const body = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
    if (mode === "signup") {
      body.name = formData.get("name");
      body.phone = formData.get("phone");
    }

    startTransition(async () => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Authentication failed");
        return;
      }
      router.push(next);
      router.refresh();
    });
  }

  return (
    <div className="bg-white border border-hairline rounded-card p-6">
      <div className="flex border-b border-hairline mb-6">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`flex-1 pb-3 text-sm font-medium transition-colors ${
            mode === "login"
              ? "text-ink border-b-2 border-clay"
              : "text-muted hover:text-ink"
          }`}
        >
          I have an account
        </button>
        <button
          type="button"
          onClick={() => setMode("signup")}
          className={`flex-1 pb-3 text-sm font-medium transition-colors ${
            mode === "signup"
              ? "text-ink border-b-2 border-clay"
              : "text-muted hover:text-ink"
          }`}
        >
          Create an account
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {mode === "signup" && (
          <>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                name="name"
                type="text"
                required
                className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                name="phone"
                type="tel"
                required
                placeholder="08012345678"
                className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
              />
            </div>
          </>
        )}
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full px-3 py-2 border border-hairline rounded-md focus:outline-none focus:ring-2 focus:ring-clay"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            name="password"
            type="password"
            required
            minLength={8}
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
          className="w-full bg-clay hover:bg-clay-dark text-white font-medium py-2.5 rounded-md transition-colors disabled:opacity-50"
        >
          {isPending
            ? "Please wait…"
            : mode === "login"
            ? "Sign in & continue"
            : "Create account & continue"}
        </button>
      </form>
    </div>
  );
}
