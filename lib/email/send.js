// Sends transactional email via Brevo.
// Returns { ok: true, messageId } on success,
//         { ok: false, error } on failure.

export async function sendEmail({ to, subject, html, text }) {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME || "Lady D Kitchen Catering Services";

  if (!apiKey || !senderEmail) {
    console.log("[sendEmail] Brevo not configured. Would have sent:", { to, subject });
    return { ok: false, error: "Email service not configured" };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        textContent: text,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("[sendEmail] Brevo error:", res.status, errBody);
      return { ok: false, error: "Email service error" };
    }

    const data = await res.json();
    return { ok: true, messageId: data.messageId };
  } catch (err) {
    console.error("[sendEmail] fetch failed:", err);
    return { ok: false, error: "Email service unreachable" };
  }
}
