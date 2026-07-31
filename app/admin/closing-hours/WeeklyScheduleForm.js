"use client";

import { useState, useTransition } from "react";
import { updateWeeklySchedule } from "./actions";

export default function WeeklyScheduleForm({ weekly }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateWeeklySchedule(formData);
      if (!result.ok) { setError(result.error); return; }
      setSuccess(true);
    });
  }

  return (
    <form onSubmit={onSubmit} className="bg-white border border-[#E8E2D5] rounded-card p-6 space-y-4">
      <h2 className="font-medium">Weekly schedule</h2>

      <div className="space-y-3">
        {weekly.map((day) => (
          <div key={day.dayOfWeek} className="flex items-center gap-3 flex-wrap">
            <div className="w-16 font-medium">{day.label}</div>
            <label className="text-sm flex items-center gap-1.5">
              <input
                type="checkbox"
                name={`closed-${day.key}`}
                defaultChecked={day.isClosed}
                className="accent-[#D4AF5A]"
              />
              Closed
            </label>
            <input
              type="time"
              name={`open-${day.key}`}
              defaultValue={day.openTime || "09:00"}
              disabled={day.isClosed}
              className="px-2 py-1 border border-[#E8E2D5] rounded text-sm disabled:opacity-50"
            />
            <span className="text-[#A69A88] text-sm">to</span>
            <input
              type="time"
              name={`close-${day.key}`}
              defaultValue={day.closeTime || "20:00"}
              disabled={day.isClosed}
              className="px-2 py-1 border border-[#E8E2D5] rounded text-sm disabled:opacity-50"
            />
          </div>
        ))}
      </div>

      {error && <p className="text-sm text-[#7A2634]">{error}</p>}
      {success && <p className="text-sm text-[#1A1614]">Schedule saved.</p>}

      <button
        type="submit"
        disabled={isPending}
        className="bg-[#D4AF5A] hover:bg-[#B8933F] text-white font-medium px-5 py-2 rounded-md text-sm disabled:opacity-50"
      >
        {isPending ? "Saving…" : "Save weekly schedule"}
      </button>
    </form>
  );
}
