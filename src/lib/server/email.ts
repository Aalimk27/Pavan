/**
 * Transactional email via the Resend REST API (blueprint §18).
 * When RESEND_API_KEY is not configured, the message is logged (without its body)
 * and the caller still succeeds — forms never fail just because email is not wired yet.
 */

export interface OutgoingEmail {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  /** Short label for logs, e.g. "advisory:PM-7K2Q9" — never PII. */
  tag: string;
}

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail(msg: OutgoingEmail): Promise<{ sent: boolean }> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) {
    console.info(`[email] not configured — would send "${msg.tag}"`);
    return { sent: false };
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: Array.isArray(msg.to) ? msg.to : [msg.to],
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`[email] Resend responded ${res.status} for "${msg.tag}"`);
      return { sent: false };
    }
    return { sent: true };
  } catch (err) {
    console.error(`[email] send failed for "${msg.tag}":`, err instanceof Error ? err.name : "unknown");
    return { sent: false };
  }
}

/** A calm, on-brand wrapper for plain transactional HTML. */
export function emailShell(title: string, bodyHtml: string): string {
  return `<!doctype html><html><body style="margin:0;background:#fbf6ea;font-family:Georgia,serif;color:#10221a">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" style="max-width:560px;background:#fffdf7;border:1px solid #e9dec4;border-radius:18px" cellpadding="0" cellspacing="0">
<tr><td style="padding:28px 32px 8px;font-family:Georgia,serif;letter-spacing:.24em;font-size:12px;color:#8a6420">PREM MARG · A BETTER WAY TO LIVE</td></tr>
<tr><td style="padding:8px 32px 4px"><h1 style="font-weight:400;font-size:26px;margin:0 0 12px">${title}</h1></td></tr>
<tr><td style="padding:0 32px 28px;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.6;color:#3f5249">${bodyHtml}</td></tr>
</table></td></tr></table></body></html>`;
}
