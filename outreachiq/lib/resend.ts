import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  body,
  fromName,
  fromEmail,
  apiKey,
}: {
  to: string;
  subject: string;
  body: string;
  fromName: string;
  fromEmail?: string;
  apiKey?: string;
}) {
  const key = apiKey || process.env.RESEND_API_KEY;

  if (!key) {
    throw new Error("Resend API key not configured");
  }

  const resend = new Resend(key);
  const from = fromEmail || process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

  // Convert plain text body to HTML with line breaks
  const htmlBody = body
    .split("\n")
    .map((line) => `<p style="margin: 0 0 12px 0; color: #1a1a1a; font-family: -apple-system, sans-serif; font-size: 15px; line-height: 1.6;">${line || "&nbsp;"}</p>`)
    .join("");

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="background: #ffffff; padding: 40px 20px; max-width: 600px; margin: 0 auto;">
  <div style="background: #f9fafb; border-radius: 8px; padding: 32px;">
    ${htmlBody}
  </div>
  <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; font-family: sans-serif;">
    Sent via OutreachIQ
  </p>
</body>
</html>`;

  const { data, error } = await resend.emails.send({
    from: `${fromName} <${from}>`,
    to: [to],
    subject,
    html,
    text: body,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data;
}
