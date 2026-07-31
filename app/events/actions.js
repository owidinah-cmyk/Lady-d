// Server Action: validates input, creates the EventInquiry,
// builds the WhatsApp URL, returns the ref + URL.

"use server";

import { revalidatePath } from "next/cache";
import { getCurrentCustomer } from "@/lib/auth/current-customer";
import { createEventInquiry } from "@/lib/events/inquiry";
import { buildEventInquiryMessage, buildWhatsAppUrl } from "@/lib/events/wa-handoff";
import {
  validateName,
  validateEmail,
  validateOptionalPhone,
} from "@/lib/auth/validators";

const VALID_CATEGORIES = [
  "Wedding",
  "Corporate Event",
  "Birthday",
  "Naming Ceremony",
  "Anniversary",
  "Other",
];

export async function submitEventInquiry(formData) {
  const customer = await getCurrentCustomer();

  // Customer name: from logged-in user OR from the form.
  const customerName = customer
    ? customer.name
    : (() => {
        const r = validateName(formData.get("customerName"));
        return r.ok ? r.value : null;
      })();
  if (!customerName) {
    return { ok: false, error: "Please enter your name." };
  }

  // Phone: required.
  const phoneR = validateOptionalPhone(
    customer ? customer.phone : formData.get("customerPhone")
  );
  if (!phoneR.ok) {
    return { ok: false, error: phoneR.error };
  }
  if (!phoneR.value) {
    return { ok: false, error: "Please enter a phone number." };
  }

  // Email: optional.
  const emailInput = customer ? customer.email : formData.get("customerEmail");
  let emailValue = null;
  if (emailInput) {
    const r = validateEmail(emailInput);
    if (r.ok) emailValue = r.value;
  }

  // Event date.
  const eventDate = String(formData.get("eventDate") || "").trim();
  if (!eventDate) {
    return { ok: false, error: "Please pick an event date." };
  }

  // Guest count.
  const guestCount = Number(formData.get("guestCount"));
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 10000) {
    return { ok: false, error: "Please enter a valid guest count." };
  }

  // Location.
  const location = String(formData.get("location") || "").trim();
  if (!location) {
    return { ok: false, error: "Please enter an event location." };
  }

  // Categories.
  const categoryInputs = formData.getAll("categories");
  const categories = categoryInputs.filter((c) => VALID_CATEGORIES.includes(c));
  if (categories.length === 0) {
    return { ok: false, error: "Please pick at least one event type." };
  }

  // Package interest + notes.
  const packageInterest = String(formData.get("packageInterest") || "").trim();
  const notes = String(formData.get("notes") || "").trim();

  // Create the inquiry.
  let inquiry;
  try {
    inquiry = await createEventInquiry({
      customerId: customer?.id || null,
      customerName,
      customerPhone: phoneR.value,
      customerEmail: emailValue,
      eventDate,
      guestCount,
      location,
      categories,
      packageInterest: packageInterest || null,
      notes: notes || null,
    });
  } catch (err) {
    console.error("[submitEventInquiry] create error:", err.message);
    return { ok: false, error: "Could not submit your inquiry. Please try again." };
  }

  // Build the WhatsApp URL.
  const message = buildEventInquiryMessage({ inquiry });
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappUrl = buildWhatsAppUrl({ message, phoneNumber });

  revalidatePath("/account");
  return { ok: true, ref: inquiry.ref, whatsappUrl };
}
