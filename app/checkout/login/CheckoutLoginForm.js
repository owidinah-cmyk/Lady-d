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
        <a
          href="/api/auth/google"
          className="w-full flex items-center justify-center gap-2 border border-hairline hover:border-clay text-ink font-medium py-2.5 rounded-md transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </a>

        <div className="flex items-center gap-3 my-2">
          <div className="flex-1 h-px bg-hairline" />
          <span className="text-xs text-muted uppercase tracking-wide">or</span>
          <div className="flex-1 h-px bg-hairline" />
        </div>

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
