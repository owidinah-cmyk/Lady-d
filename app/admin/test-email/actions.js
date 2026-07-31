"use server";

import { requireAdmin } from "@/lib/auth/admin-guard";
import { sendEmail } from "@/lib/email/send";
import { buildPasswordResetEmail, buildOrderPlacedEmail } from "@/lib/email/templates";

export async function sendTestEmail(formData) {
  await requireAdmin();
  const to = String(formData.get("to") || "").trim();
  const template = String(formData.get("template") || "");
  if (!to) return { ok: false, error: "Recipient email is required" };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (template === "password-reset") {
    const email = buildPasswordResetEmail({
      name: "Test",
      resetUrl: `${siteUrl}/reset-password?token=test_token_placeholder`,
    });
    return await sendEmail({
      to,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
  }

  if (template === "order-placed") {
    const email = buildOrderPlacedEmail({
      name: "Test Customer",
      orderRef: "LDK-2026-TEST",
      orderUrl: `${siteUrl}/account/orders/LDK-2026-TEST`,
      itemCount: 3,
      totalLabel: "₦12,500",
      deliveryDate: "Saturday, 15 November",
      deliveryTime: "12:00 PM",
      address: "House 12, Street 5, Maitama, Abuja",
    });
    return await sendEmail({
      to,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
  }

  return { ok: false, error: "Unknown template" };
}
