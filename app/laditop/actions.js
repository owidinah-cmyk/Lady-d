// Server Action: validates input, creates the MerchInquiry +
// MerchInquiryItem rows, builds the WhatsApp URL, returns
// the ref + URL.

"use server";

import { revalidatePath } from "next/cache";
import { getCurrentCustomer } from "@/lib/auth/current-customer";
import { createMerchInquiry } from "@/lib/laditop/inquiry";
import { buildMerchInquiryMessage, buildWhatsAppUrl } from "@/lib/laditop/wa-handoff";
import {
  validateName,
  validateEmail,
  validateOptionalPhone,
} from "@/lib/auth/validators";

const VALID_ITEM_TYPES = [
  "Bags", "Cups", "Books", "Banners", "Flex Banners",
  "Gift Bags", "Party Bags", "Gift Boxes", "Pens",
  "T-Shirts", "Other",
];

export async function submitMerchInquiry(formData) {
  const customer = await getCurrentCustomer();

  // Customer name.
  const customerName = customer
    ? customer.name
    : (() => {
        const r = validateName(formData.get("customerName"));
        return r.ok ? r.value : null;
      })();
  if (!customerName) {
    return { ok: false, error: "Please enter your name." };
  }

  // Phone.
  const phoneR = validateOptionalPhone(
    customer ? customer.phone : formData.get("customerPhone")
  );
  if (!phoneR.ok) {
    return { ok: false, error: phoneR.error };
  }
  if (!phoneR.value) {
    return { ok: false, error: "Please enter a phone number." };
  }

  // Email.
  const emailInput = customer ? customer.email : formData.get("customerEmail");
  let emailValue = null;
  if (emailInput) {
    const r = validateEmail(emailInput);
    if (r.ok) emailValue = r.value;
  }

  // Needed-by date.
  const neededByDate = String(formData.get("neededByDate") || "").trim();
  if (!neededByDate) {
    return { ok: false, error: "Please pick a needed-by date." };
  }

  // Items.
  const itemTypesRaw = formData.getAll("itemTypes");
  const itemTypes = itemTypesRaw.filter((t) => VALID_ITEM_TYPES.includes(t));
  if (itemTypes.length === 0) {
    return { ok: false, error: "Please pick at least one item." };
  }

  // Build per-item records.
  const items = itemTypes.map((itemType) => {
    const quantityStr = formData.get(`qty-${itemType}`) || "";
    const notes = String(formData.get(`notes-${itemType}`) || "").trim();
    const customLabel = itemType === "Other"
      ? String(formData.get("customLabel") || "").trim()
      : null;

    let quantity = null;
    if (quantityStr) {
      const n = Number(quantityStr);
      if (Number.isInteger(n) && n > 0 && n < 100000) {
        quantity = n;
      }
    }

    return { itemType, customLabel, quantity, notes };
  });

  // Overall notes.
  const notes = String(formData.get("notes") || "").trim();

  // Create the inquiry.
  let inquiry;
  try {
    inquiry = await createMerchInquiry({
      customerId: customer?.id || null,
      customerName,
      customerPhone: phoneR.value,
      customerEmail: emailValue,
      neededByDate,
      notes: notes || null,
      items,
    });
  } catch (err) {
    console.error("[submitMerchInquiry] create error:", err.message);
    return { ok: false, error: "Could not submit your inquiry. Please try again." };
  }

  // Build the WhatsApp URL.
  const message = buildMerchInquiryMessage({ inquiry });
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  const whatsappUrl = buildWhatsAppUrl({ message, phoneNumber });

  revalidatePath("/account");
  return { ok: true, ref: inquiry.ref, whatsappUrl };
}
