"use server";

import { getValidTimeSlots } from "@/lib/hours/slots";

export async function fetchTimeSlots({ dateStr, leadTimeHours }) {
  return getValidTimeSlots({
    dateStr,
    leadTimeHours: Number(leadTimeHours) || 0,
    });
}
