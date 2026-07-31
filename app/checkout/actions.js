"use server";

import { revalidatePath } from "next/cache";
import { readCart, clearCart } from "@/lib/cart/cookie";
import { getCurrentCustomer } from "@/lib/auth/current-customer";
import { createOrder } from "@/lib/orders/create";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/orders/wa-handoff";

export async function placeOrder(formData) {
  // 1. Auth.
  const customer = await getCurrentCustomer();
  if (!customer) {
    return { ok: false, error: "You must be signed in to place an order." };
  }

  // 2. Read the cart.
  const cart = readCart();
  if (!cart.items || cart.items.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }
  if (!cart.zoneId) {
    return { ok: false, error: "Please pick a delivery zone." };
  }

  // 3. Validate form fields.
  const address = String(formData.get("address") || "").trim();
  const date = String(formData.get("date") || "").trim();
  const time = String(formData.get("time") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const agreed = formData.get("agreed") === "on";

  if (!address) {
    return { ok: false, error: "Please enter a delivery address." };
  }
  if (!date) {
    return { ok: false, error: "Please pick a delivery date." };
  }
  if (!time) {
    return { ok: false, error: "Please pick a delivery time." };
  }
  if (!agreed) {
    return { ok: false, error: "Please agree to the Terms and Privacy Policy." };
  }

  // 4. Check closing hours for the requested slot.
  const { isOpenAt } = await import("@/lib/hours");
  const openCheck = await isOpenAt(date, time);
  if (!openCheck.open) {
    return {
      ok: false,
      error: `We're ${openCheck.reason.toLowerCase()} at that time. Please pick a different delivery slot.`,
    };
  }

  // 5. Create the order.
  const result = await createOrder({
    customerId: customer.id,
    zoneId: cart.zoneId,
    deliveryAddress: address,
    deliveryDate: date,
    deliveryTime: time,
    notes: notes || undefined,
    cartItems: cart.items,
  });

  if (!result.ok) {
    return { ok: false, error: result.error || "Could not create order." };
  }

  // 5. Build the WhatsApp message.
  const message = buildOrderMessage({
    order: result.order,
    lineItems: result.lineItems,
    customer: result.customer,
    zone: result.zone,
  });

  // 6. Build the wa.me URL.
  const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "";
  if (process.env.NODE_ENV === "production" && !phoneNumber) {
    console.error("[placeOrder] NEXT_PUBLIC_WHATSAPP_NUMBER is not set");
  }
  const whatsappUrl = buildWhatsAppUrl({ message, phoneNumber });

  // 7. Optionally remember the address.
  if (formData.get("rememberAddress") === "on") {
    try {
      const { setSavedAddress } = await import("@/lib/cart/actions");
      await setSavedAddress({ address });
    } catch (err) {
      console.error("[placeOrder] setSavedAddress error:", err.message);
    }
  }

  // 8. Send order-placed email (best effort).
  try {
    const customerEmail = customer.email;
    if (customerEmail) {
      const { buildOrderPlacedEmail } = await import("@/lib/email/templates");
      const { sendEmail } = await import("@/lib/email/send");
      const { formatPrice } = await import("@/lib/menu/dishes");

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
      const siteUrl = baseUrl || "http://localhost:3000";
      const orderUrl = `${siteUrl}/account/orders/${result.order.ref}`;
      const itemCount = result.lineItems.reduce((s, item) => s + item.quantity, 0);
      const formattedDate = new Date(result.order.deliveryDate).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });

      const email = buildOrderPlacedEmail({
        name: result.customer.name,
        orderRef: result.order.ref,
        orderUrl,
        itemCount,
        totalLabel: formatPrice(result.order.total),
        deliveryDate: formattedDate,
        deliveryTime: result.order.deliveryTime,
        address: result.order.deliveryAddress,
      });

      await sendEmail({
        to: customerEmail,
        subject: email.subject,
        html: email.html,
        text: email.text,
      });
    }
  } catch (err) {
    // Don't fail the order if email fails.
    console.error("[placeOrder] email send failed:", err.message);
  }

  // 9. Clear the cart.
  clearCart();

  // 10. Revalidate.
  revalidatePath("/order");
  revalidatePath("/account");

  return {
    ok: true,
    ref: result.order.ref,
    whatsappUrl,
  };
}
