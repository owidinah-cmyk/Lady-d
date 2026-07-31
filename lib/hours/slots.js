// /lib/hours/slots.js
// Generates valid 30-minute delivery slots for a given date,
// respecting kitchen opening hours and minimum lead time.

import { isOpenAt } from "./index";

export async function getValidTimeSlots({ dateStr, leadTimeHours = 0 }) {
  const check = await isOpenAt(dateStr, "12:00");
  if (!check.open) {
    return { open: false, slots: [], reason: check.reason || "Closed" };
  }

  const { openTime, closeTime } = check;
  if (!openTime || !closeTime) {
    return { open: false, slots: [], reason: "Hours not configured" };
  }

  const slots = [];
  const [openH, openM] = openTime.split(":").map(Number);
  const [closeH, closeM] = closeTime.split(":").map(Number);
  let cur = openH * 60 + openM;
  const end = closeH * 60 + closeM;
  while (cur < end) {
    const h = Math.floor(cur / 60);
    const m = cur % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    cur += 30;
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  if (dateStr === today && leadTimeHours > 0) {
    const earliest = new Date(now.getTime() + leadTimeHours * 60 * 60 * 1000);
    const earliestMinutes = earliest.getHours() * 60 + earliest.getMinutes();
    return {
      open: true,
      slots: slots.filter((slot) => {
        const [h, m] = slot.split(":").map(Number);
        return h * 60 + m >= earliestMinutes;
      }),
    };
  }

  return { open: true, slots };
}
