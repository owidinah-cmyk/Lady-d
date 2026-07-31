"use client";

import { useState, useTransition } from "react";
import { setEventStatus } from "./actions";

const STATUS_COLORS = {
  NEW: "bg-[#F7F5F1] text-[#A69A88]",
  QUOTED: "bg-[#D4AF5A] text-white",
  BOOKED: "bg-[#1A1614] text-white",
  COMPLETED: "bg-[#B8933F] text-white",
  CANCELLED: "bg-[#7A2634] text-white",
};

const NEXT = {
  NEW: ["QUOTED", "CANCELLED"],
  QUOTED: ["BOOKED", "CANCELLED"],
  BOOKED: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export default function EventInquiryRow({ inquiry }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);

  function setStatus(status) {
    const msg = status === "BOOKED"
      ? "Mark as BOOKED? This will claim the date on the events calendar."
      : status === "CANCELLED"
      ? "Mark as CANCELLED? This will free the date on the events calendar if it was booked."
      : `Update status to ${status}?`;
    if (!confirm(msg)) return;
    setError(null);
    startTransition(async () => {
      const result = await setEventStatus(inquiry.id, status);
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
            {new Date(inquiry.eventDate).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" })} ·{" "}
            {inquiry.guestCount} guests · {inquiry.location}
          </p>
          <p className="text-xs text-[#A69A88] mt-0.5">
            {inquiry.categories.join(", ")}
            {inquiry.packageInterest && ` · ${inquiry.packageInterest}`}
          </p>
          {inquiry.notes && <p className="text-xs text-[#1A1614] mt-2 italic">"{inquiry.notes}"</p>}
        </div>
        <span className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${STATUS_COLORS[inquiry.status]}`}>
          {inquiry.status}
        </span>
      </div>
      {NEXT[inquiry.status].length > 0 && (
        <div className="flex gap-2 mt-3 flex-wrap">
          {NEXT[inquiry.status].map((s) => (
            <button key={s} onClick={() => setStatus(s)} disabled={isPending}
              className={`text-sm px-3 py-1 rounded font-medium transition-colors disabled:opacity-50 ${
                s === "CANCELLED"
                  ? "border border-[#7A2634] text-[#7A2634] hover:bg-[#7A2634] hover:text-white"
                  : "bg-[#D4AF5A] hover:bg-[#B8933F] text-white"
              }`}>
              {s === "QUOTED" ? "Mark quoted" : s === "BOOKED" ? "Mark booked" : s === "COMPLETED" ? "Mark completed" : "Cancel"}
            </button>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-[#7A2634] mt-2">{error}</p>}
    </div>
  );
}
