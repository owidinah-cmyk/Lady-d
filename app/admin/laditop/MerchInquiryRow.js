"use client";

import { useState, useTransition } from "react";
import { setMerchStatus } from "./actions";

const STATUS_COLORS = {
  NEW: "bg-[#F7F5F1] text-[#A69A88]",
  QUOTED: "bg-[#D4AF5A] text-white",
  CONFIRMED: "bg-[#1A1614] text-white",
  COMPLETED: "bg-[#B8933F] text-white",
  CANCELLED: "bg-[#7A2634] text-white",
};

const NEXT = {
  NEW: ["QUOTED", "CANCELLED"],
  QUOTED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export default function MerchInquiryRow({ inquiry }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function setStatus(status) {
    if (!confirm(`Update status to ${status}?`)) return;
    setError(null);
    startTransition(async () => {
      const result = await setMerchStatus(inquiry.id, status);
      if (!result.ok) setError(result.error);
    });
  }

  return (
    <div className="bg-white border border-[#E8E2D5] rounded-card p-4">
      <div className="flex items-start justify-between mb-2 gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-mono text-sm text-[#D4AF5A]">{inquiry.ref}</p>
          <p className="text-sm font-medium">{inquiry.customerName} · {inquiry.customerPhone}</p>
          <p className="text-xs text-[#A69A88] mt-1">
            Needed by {new Date(inquiry.neededByDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <span className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[inquiry.status]}`}>
          {inquiry.status}
        </span>
      </div>
      <div className="space-y-1 mt-2">
        {inquiry.items.map((item) => (
          <p key={item.id} className="text-xs text-[#1A1614]">
            • {item.itemType}{item.customLabel ? ` "${item.customLabel}"` : ""}
            {item.quantity ? ` × ${item.quantity}` : ""}
            {item.notes && <span className="text-[#A69A88]"> — {item.notes}</span>}
          </p>
        ))}
      </div>
      {inquiry.notes && <p className="text-xs text-[#1A1614] mt-2 italic">"{inquiry.notes}"</p>}
      {NEXT[inquiry.status].length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {NEXT[inquiry.status].map((s) => (
            <button key={s} onClick={() => setStatus(s)} disabled={isPending}
              className={`text-sm px-3 py-1 rounded font-medium transition-colors disabled:opacity-50 ${
                s === "CANCELLED"
                  ? "border border-[#7A2634] text-[#7A2634] hover:bg-[#7A2634] hover:text-white"
                  : "bg-[#D4AF5A] hover:bg-[#B8933F] text-white"
              }`}>
              {s === "QUOTED" ? "Mark quoted" : s === "CONFIRMED" ? "Mark confirmed" : s === "COMPLETED" ? "Mark completed" : "Cancel"}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-[#7A2634] mt-2">{error}</p>}
    </div>
  );
}
