"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin-guard";

// NOTE: openTime < closeTime is compared as strings, which
// works for daytime windows (e.g. 09:00 < 20:00) but
// does NOT support overnight windows (e.g. 22:00 < 02:00).
// For a daytime catering business this is fine. If we
// ever need overnight hours, the comparison needs to
// be reworked to handle windows that cross midnight.

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function updateWeeklySchedule(formData) {
  await requireAdmin();

  const updates = [];
  for (let day = 0; day < 7; day++) {
    const dayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const key = dayNames[day];
    const isClosed = formData.get(`closed-${key}`) === "on";
    const openTime = isClosed ? null : String(formData.get(`open-${key}`) || "").trim();
    const closeTime = isClosed ? null : String(formData.get(`close-${key}`) || "").trim();

    if (!isClosed) {
      if (!openTime || !TIME_RE.test(openTime)) {
        return { ok: false, error: `Invalid open time for ${key.toUpperCase()}.` };
      }
      if (!closeTime || !TIME_RE.test(closeTime)) {
        return { ok: false, error: `Invalid close time for ${key.toUpperCase()}.` };
      }
      if (openTime >= closeTime) {
        return { ok: false, error: `Open time must be before close time on ${key.toUpperCase()}.` };
      }
    }

    updates.push({
      where: { dayOfWeek: day },
      update: { isClosed, openTime, closeTime },
      create: { dayOfWeek: day, isClosed, openTime, closeTime },
    });
  }

  try {
    await prisma.$transaction(updates.map((u) => prisma.closingHours.upsert(u)));
    revalidatePath("/admin/closing-hours");
    return { ok: true };
  } catch (err) {
    console.error("[updateWeeklySchedule] error:", err.message);
    return { ok: false, error: "Could not save the schedule. Please try again." };
  }
}

export async function addSpecialHours(formData) {
  await requireAdmin();
  const date = String(formData.get("date") || "").trim();
  if (!date) return { ok: false, error: "Date is required." };

  const isClosed = formData.get("isClosed") === "on";
  const openTime = isClosed ? null : String(formData.get("openTime") || "").trim();
  const closeTime = isClosed ? null : String(formData.get("closeTime") || "").trim();
  const label = String(formData.get("label") || "").trim() || null;

  if (!isClosed) {
    if (!openTime || !TIME_RE.test(openTime)) {
      return { ok: false, error: "Invalid open time." };
    }
    if (!closeTime || !TIME_RE.test(closeTime)) {
      return { ok: false, error: "Invalid close time." };
    }
  }

  try {
    await prisma.specialHours.upsert({
      where: { date: new Date(date) },
      update: { isClosed, openTime, closeTime, label },
      create: { date: new Date(date), isClosed, openTime, closeTime, label },
    });
    revalidatePath("/admin/closing-hours");
    return { ok: true };
  } catch (err) {
    console.error("[addSpecialHours] error:", err.message);
    return { ok: false, error: "Could not add the date. Please try again." };
  }
}

export async function removeSpecialHours(id) {
  await requireAdmin();
  try {
    await prisma.specialHours.delete({ where: { id } });
    revalidatePath("/admin/closing-hours");
    return { ok: true };
  } catch (err) {
    console.error("[removeSpecialHours] error:", err.message);
    return { ok: false, error: "Could not remove the date. Please try again." };
  }
}
