// Email templates. Returns { subject, html, text }.

const SITE_NAME = "Lady D Kitchen Catering Services";
const BRAND_COLOR = "#B8933F";
const INK_COLOR = "#2A2520";
const MUTED_COLOR = "#9A8E7E";
const BG_COLOR = "#FAF7F2";
const HAIRLINE_COLOR = "#EAE3D5";

const WORDMARK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 100" width="200" height="33" role="img" aria-label="Lady D Kitchen"><style>.word{font-family:Georgia,'Times New Roman',serif;font-weight:500;fill:${INK_COLOR};}.accent{fill:${BRAND_COLOR};}</style><text x="0" y="68" font-size="56" class="word">Lady D Kitchen</text><circle cx="222" cy="20" r="5" class="accent"/></svg>`;

function formatPhone(raw) {
  const digits = String(raw).replace(/\D/g, "");
  if (digits.length === 13 && digits.startsWith("234")) {
    return `+234 ${digits.slice(3, 6)} ${digits.slice(6, 9)} ${digits.slice(9)}`;
  }
  return `+${digits}`;
}

function wrap({ preheader, content }) {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
    ? formatPhone(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER)
    : "(configure NEXT_PUBLIC_WHATSAPP_NUMBER)";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${SITE_NAME}</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_COLOR};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${INK_COLOR};">
<span style="display:none;font-size:1px;color:${BG_COLOR};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheader}</span>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BG_COLOR};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
<tr><td style="padding:0 0 24px 0;text-align:left;">
${WORDMARK_SVG}
</td></tr>
<tr><td style="background-color:#ffffff;border:1px solid ${HAIRLINE_COLOR};border-radius:14px;padding:32px;">
${content}
</td></tr>
<tr><td style="padding:24px 16px 0 16px;font-size:12px;line-height:1.5;color:${MUTED_COLOR};text-align:center;">
<p style="margin:0 0 8px 0;"><strong>${SITE_NAME}</strong></p>
<p style="margin:0 0 8px 0;">Abuja &amp; Port Harcourt</p>
<p style="margin:0 0 16px 0;">WhatsApp: ${whatsapp}</p>
<p style="margin:0;">You&apos;re receiving this because you placed an order or created an account with us.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function ctaButton({ url, label, color = BRAND_COLOR }) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0;">
<tr><td style="background-color:${color};border-radius:8px;">
<a href="${url}" target="_blank" style="display:inline-block;padding:12px 24px;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">${label}</a>
</td></tr>
</table>`;
}

// === TEMPLATE 1: Password Reset ===

export function buildPasswordResetEmail({ name, resetUrl }) {
  const displayName = name || "there";

  return {
    subject: "Reset your Lady D Kitchen password",
    html: wrap({
      preheader: "Reset your password — link is valid for 15 minutes.",
      content: `
        <h1 style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:24px;font-weight:500;color:${INK_COLOR};">Reset your password</h1>
        <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${INK_COLOR};">Hi ${displayName},</p>
        <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${INK_COLOR};">We received a request to reset the password for your Lady D Kitchen account. Click the button below to choose a new password.</p>
        <p style="margin:0 0 8px 0;font-size:13px;color:${MUTED_COLOR};">This link is valid for 15 minutes and can be used once.</p>
        ${ctaButton({ url: resetUrl, label: "Reset your password" })}
        <p style="margin:24px 0 0 0;font-size:13px;line-height:1.5;color:${MUTED_COLOR};">If the button doesn&apos;t work, copy and paste this link into your browser:</p>
        <p style="margin:4px 0 0 0;font-size:12px;line-height:1.4;color:${MUTED_COLOR};word-break:break-all;">${resetUrl}</p>
        <p style="margin:24px 0 0 0;font-size:13px;line-height:1.5;color:${MUTED_COLOR};">If you didn&apos;t request this, you can safely ignore this email — your password will stay the same.</p>
      `,
    }),
    text: `Hi ${displayName},

We received a request to reset the password for your Lady D Kitchen account.

Click this link to choose a new password (valid for 15 minutes, single use):

${resetUrl}

If you didn't request this, you can ignore this email — your password will stay the same.

— ${SITE_NAME}`,
  };
}

// === TEMPLATE 2: Order Placed ===

export function buildOrderPlacedEmail({ name, orderRef, orderUrl, itemCount, totalLabel, deliveryDate, deliveryTime, address }) {
  const displayName = name || "there";
  const totalDisplay = totalLabel || "—";

  return {
    subject: `Order ${orderRef} received — we'll be in touch on WhatsApp`,
    html: wrap({
      preheader: `Order ${orderRef} received. ${itemCount} item${itemCount === 1 ? "" : "s"} for ${totalDisplay}.`,
      content: `
        <h1 style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:24px;font-weight:500;color:${INK_COLOR};">Order received</h1>
        <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:${INK_COLOR};">Hi ${displayName},</p>
        <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:${INK_COLOR};">Thanks for ordering from ${SITE_NAME}. We&apos;ve received your order and our team will reach out on WhatsApp shortly to confirm availability and share payment details.</p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BG_COLOR};border-radius:8px;margin:0 0 24px 0;">
          <tr><td style="padding:16px;">
            <p style="margin:0 0 8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:${MUTED_COLOR};">Order ref</p>
            <p style="margin:0 0 16px 0;font-family:Menlo,Monaco,monospace;font-size:18px;color:${INK_COLOR};">${orderRef}</p>
            <p style="margin:0 0 8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:${MUTED_COLOR};">Items</p>
            <p style="margin:0 0 16px 0;font-size:15px;color:${INK_COLOR};">${itemCount} item${itemCount === 1 ? "" : "s"} &middot; ${totalDisplay}</p>
            <p style="margin:0 0 8px 0;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;color:${MUTED_COLOR};">Delivery</p>
            <p style="margin:0 0 4px 0;font-size:15px;color:${INK_COLOR};">${deliveryDate} at ${deliveryTime}</p>
            <p style="margin:0;font-size:14px;color:${MUTED_COLOR};">${address}</p>
          </td></tr>
        </table>

        ${ctaButton({ url: orderUrl, label: "View your order" })}

        <p style="margin:0 0 8px 0;font-size:15px;line-height:1.6;color:${INK_COLOR};">Next steps:</p>
        <ol style="margin:0 0 0 20px;padding:0;font-size:14px;line-height:1.7;color:${INK_COLOR};">
          <li>We&apos;ll message you on WhatsApp to confirm your order and share our bank details.</li>
          <li>Pay a 50% deposit to lock the order in. Balance on delivery.</li>
          <li>We cook and deliver at the time above.</li>
        </ol>
        <p style="margin:24px 0 0 0;font-size:14px;line-height:1.6;color:${MUTED_COLOR};">Your order details are saved to your account — you can view them anytime.</p>
      `,
    }),
    text: `Hi ${displayName},

Thanks for ordering from ${SITE_NAME}. We've received your order and our team will reach out on WhatsApp shortly to confirm availability and share payment details.

Order ref: ${orderRef}
Items: ${itemCount} · ${totalDisplay}
Delivery: ${deliveryDate} at ${deliveryTime}
Address: ${address}

View your order: ${orderUrl}

Next steps:
1. We'll message you on WhatsApp to confirm your order and share our bank details.
2. Pay a 50% deposit to lock the order in. Balance on delivery.
3. We cook and deliver at the time above.

Your order details are saved to your account.

— ${SITE_NAME}`,
  };
}
