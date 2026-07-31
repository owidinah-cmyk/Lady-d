"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { reorderFromPastOrder } from "./actions";

export default function ReorderButton({ orderRef }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const router = useRouter();

  function onClick() {
    setError(null);
    startTransition(async () => {
      const result = await reorderFromPastOrder(orderRef);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/order");
      router.refresh();
    });
  }

  return (
    <div>
      <button
        onClick={onClick}
        disabled={isPending}
        className="bg-clay hover:bg-clay-dark text-white font-medium px-4 py-2 rounded-md text-sm transition-colors disabled:opacity-50"
      >
        {isPending ? "Adding…" : "Reorder these items"}
      </button>
      {error && <p className="text-sm text-terracotta mt-2">{error}</p>}
    </div>
  );
}
