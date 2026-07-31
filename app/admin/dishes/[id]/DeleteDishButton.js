"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteDish } from "../actions";

export default function DeleteDishButton({ dishId, dishName }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [confirming, setConfirming] = useState(false);

  function onDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    if (!confirm(`Permanently delete "${dishName}"? This cannot be undone. (If past orders use this dish, delete will be refused.)`)) {
      setConfirming(false);
      return;
    }
    startTransition(async () => {
      const result = await deleteDish(dishId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/admin/dishes");
    });
  }

  return (
    <section className="bg-white border border-[#7A2634] rounded-card p-6 space-y-3">
      <h2 className="font-medium text-[#7A2634]">Danger zone</h2>
      <p className="text-sm text-[#A69A88]">
        Deleting a dish removes it permanently. If any past order
        used this dish, delete will be refused and you should
        mark it inactive instead.
      </p>
      {confirming && !error && (
        <p className="text-sm text-[#7A2634]">
          Click delete again to confirm.
        </p>
      )}
      {error && (
        <p className="text-sm text-[#7A2634] bg-[#F7F5F1] border border-[#7A2634] rounded-md p-3">
          {error}
        </p>
      )}
      <button
        onClick={onDelete}
        disabled={isPending}
        className="border border-[#7A2634] text-[#7A2634] hover:bg-[#7A2634] hover:text-white font-medium px-4 py-2 rounded-md transition-colors text-sm disabled:opacity-50"
      >
        {isPending ? "Deleting…" : "Delete dish"}
      </button>
    </section>
  );
}
