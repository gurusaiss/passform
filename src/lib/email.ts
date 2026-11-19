import { Resend } from "resend";
import { defaultPlatformConfig } from "@/config/platform.config";

const resendApiKey = process.env.RESEND_API_KEY || "";
const resendFromEmail =
  process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

const resend = resendApiKey ? new Resend(resendApiKey) : null;

export interface SendConfirmationEmailParams {
  to: string;
  fullName: string;
  referenceId: string;
  whatsappUrl: string;
}

export async function sendConfirmationEmail(
  params: SendConfirmationEmailParams
): Promise<{ success: boolean; error?: string }> {
  const { to, fullName, referenceId, whatsappUrl } = params;

  if (!resend) {
    // Graceful skip when API key is not configured
    return { success: true };
  }

  const { event, branding } = defaultPlatformConfig;

  try {
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Registration Confirmed - ${event.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: #0f172a; color: #ffffff; padding: 32px 24px; text-align: center; }
    .badge { display: inline-block; background: #10b981; color: #ffffff; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; }
    .content { padding: 32px 24px; }
    .ref-box { background: #f1f5f9; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 16px; text-align: center; margin: 24px 0; }
    .ref-code { font-size: 24px; font-weight: 800; letter-spacing: 2px; color: #0f172a; margin: 4px 0; font-family: monospace; }
    .details { background: #f8fafc; border-radius: 8px; padding: 16px; margin-bottom: 24px; font-size: 14px; line-height: 1.6; }
    .btn-wa { display: block; background: #25D366; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px; text-align: center; padding: 14px 20px; border-radius: 8px; margin: 24px 0; }
    .footer { text-align: center; font-size: 12px; color: #64748b; padding: 24px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="badge">Registration Confirmed</div>
      <h1 style="margin:0; font-size: 22px;">${event.title}</h1>
      <p style="margin: 8px 0 0 0; color: #94a3b8; font-size: 14px;">${branding.organizationName}</p>
    </div>
    <div class="content">
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>Your registration for <strong>${event.title}</strong> has been successfully confirmed!</p>
      
      <div class="ref-box">
        <div style="font-size: 12px; color: #64748b; text-transform: uppercase;">Your Registration Reference</div>
        <div class="ref-code">${referenceId}</div>
        <div style="font-size: 11px; color: #64748b;">Save this reference or show this email at check-in</div>
      </div>

      <div class="details">
        <strong>📅 Date:</strong> ${event.date}<br>
        <strong>⏰ Time:</strong> ${event.time}<br>
        <strong>📍 Venue:</strong> ${event.venue}
      </div>

      <h3 style="margin-top: 24px; margin-bottom: 8px; font-size: 16px;">Step 2: Join the Official WhatsApp Community</h3>
      <p style="font-size: 14px; color: #475569; margin: 0 0 16px 0;">
        Tap the button below to join the attendees-only WhatsApp group for session schedules, exclusive speaker slide decks, and live networking:
      </p>

      <a href="${whatsappUrl}" class="btn-wa">👉 Join WhatsApp Group Now</a>

      <p style="font-size: 13px; color: #64748b; margin-top: 24px;">
        If you have any questions or require special accommodations, reply to this email or reach us at <a href="mailto:${branding.supportEmail}">${branding.supportEmail}</a>.
      </p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} ${branding.organizationName}. All rights reserved.<br>
      You received this email because you registered for ${event.title}.
    </div>
  </div>
</body>
</html>
    `;

    const { error } = await resend.emails.send({
      from: `${branding.platformName} <${resendFromEmail}>`,
      to,
      subject: `Registration Confirmed: ${event.title} [${referenceId}]`,
      html: htmlContent,
    });

    if (error) {
      console.warn("Resend email delivery error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Resend unexpected exception:", err);
    return { success: false, error: err.message || "Failed to send email" };
  }
}
