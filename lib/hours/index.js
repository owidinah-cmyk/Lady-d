// /lib/hours/index.js
// Determines whether the kitchen is open at a given date+time.
// Consults ClosingHours (weekly) and SpecialHours (date-specific
// overrides, which take precedence). Returns:
//   { open: true,  openTime: "HH:MM", closeTime: "HH:MM" }
//   { open: false, reason: "Closed all day" | "Outside hours" | ... }
//
// NOTE: this does NOT support overnight windows (e.g. 22:00 → 02:00).
// For a daytime catering business this is fine; if overnight delivery
// is ever added, this helper needs to be reworked to handle windows
// that cross midnight.

import { prisma } from "@/lib/db";

export async function isOpenAt(date, time) {
  // date: "YYYY-MM-DD" or Date
  // time: "HH:MM"
  if (!time || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    return { open: false, reason: "Invalid time" };
  }

  let dateObj;
  if (date instanceof Date) dateObj = date;
  else if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
    dateObj = new Date(date + "T00:00:00");
  } else {
    return { open: false, reason: "Invalid date" };
  }
  if (isNaN(dateObj.getTime())) {
    return { open: false, reason: "Invalid date" };
  }

  // Check special hours first (takes precedence).
  const startOfDay = new Date(dateObj);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(dateObj);
  endOfDay.setHours(23, 59, 59, 999);

  let special = null;
  try {
    special = await prisma.specialHours.findFirst({
      where: {
        date: { gte: startOfDay, lte: endOfDay },
      },
    });
  } catch (err) {
    console.error("[isOpenAt] DB error:", err.message);
    return { open: false, reason: "Could not check hours" };
  }

  if (special) {
    if (special.isClosed) {
      return { open: false, reason: "Closed for " + (special.label || "a special date") };
    }
    if (special.openTime && special.closeTime) {
      if (time >= special.openTime && time < special.closeTime) {
        return { open: true, openTime: special.openTime, closeTime: special.closeTime };
      }
      return { open: false, reason: "Outside hours" };
    }
  }

  // Fall back to weekly schedule.
  const dayOfWeek = dateObj.getDay(); // 0 = Sunday
  let weekly = null;
  try {
    weekly = await prisma.closingHours.findUnique({
      where: { dayOfWeek },
    });
  } catch (err) {
    console.error("[isOpenAt] weekly DB error:", err.message);
    return { open: false, reason: "Could not check hours" };
  }

  if (!weekly || weekly.isClosed) {
    return { open: false, reason: "Closed" };
  }
  if (!weekly.openTime || !weekly.closeTime) {
    return { open: false, reason: "Hours not configured" };
  }
  if (time >= weekly.openTime && time < weekly.closeTime) {
    return { open: true, openTime: weekly.openTime, closeTime: weekly.closeTime };
  }
  return { open: false, reason: "Outside hours" };
}
