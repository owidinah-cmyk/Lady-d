"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("[GlobalError]", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-cream text-ink flex items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-serif text-5xl text-terracotta mb-4">⚠</p>
        <h1 className="font-serif text-3xl mb-3">Something went wrong</h1>
        <p className="text-muted mb-8">
          We hit a snag. Please try again, or head back home
          and start fresh.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="bg-clay hover:bg-clay-dark text-white font-medium px-5 py-2.5 rounded-md transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-hairline text-ink hover:bg-cream font-medium px-5 py-2.5 rounded-md transition-colors"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
