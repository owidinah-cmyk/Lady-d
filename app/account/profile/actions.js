// /app/account/profile/actions.js
// Server Action: updates the current customer's name and phone.
// Email is NOT editable in this flow. If the email change is
// needed, the customer can contact us on WhatsApp.

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/auth/current-customer";
import {
  validateName,
  validatePhone,
} from "@/lib/auth/validators";

export async function updateProfile(formData) {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return { ok: false, error: "You must be signed in." };
  }

  const nameR = validateName(formData.get("name"));
  if (!nameR.ok) {
    return { ok: false, error: nameR.error };
  }

  const phoneR = validatePhone(formData.get("phone"));
  if (!phoneR.ok) {
    return { ok: false, error: phoneR.error };
  }

  try {
    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        name: nameR.value,
        phone: phoneR.value,
      },
    });
  } catch (err) {
    console.error("[updateProfile] DB error:", err.message);
    return { ok: false, error: "Could not save your changes. Please try again." };
  }

  revalidatePath("/account");
  revalidatePath("/account/profile");
  return { ok: true };
}
