import { clientKey, rateLimit } from "@/lib/server/rateLimit";
import { emailShell, sendEmail } from "@/lib/server/email";
import { cleanEmail, json, maskEmail, readJson } from "@/lib/server/validate";

/**
 * POST /api/subscribe {email, lists, consent:true}
 * lists ⊆ "gita" | "katha" | "early-access" | "membership".
 * Marketing consent is explicit and separate from service messages (blueprint §19).
 */

const LISTS = ["gita", "katha", "early-access", "membership"] as const;
type List = (typeof LISTS)[number];

const LIST_LABEL: Record<List, string> = {
  gita: "Daily Gita verse",
  katha: "Daily Katha story",
  "early-access": "Early access — checkout opening",
  membership: "Membership founding list",
};

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "subscribe"), { limit: 6, windowMs: 10 * 60_000 });
  if (!rl.ok) return json({ error: "Too many sign-ups from here just now. Please try again in a few minutes." }, 429, { "retry-after": String(rl.retryAfter) });

  const body = await readJson(req, 4_000);
  if (!body) return json({ error: "Invalid request." }, 400);

  // Honeypot — real people never fill a hidden field.
  if (typeof body.website === "string" && body.website.trim() !== "") return json({ ok: true });

  const email = cleanEmail(body.email);
  if (!email) return json({ error: "Please enter a valid email address." }, 400);

  if (!Array.isArray(body.lists) || body.lists.length === 0 || body.lists.length > LISTS.length) {
    return json({ error: "Please choose what you would like to receive." }, 400);
  }
  const lists = [...new Set(body.lists)].filter((l): l is List => typeof l === "string" && (LISTS as readonly string[]).includes(l));
  if (lists.length !== new Set(body.lists).size) return json({ error: "Unknown list." }, 400);

  if (body.consent !== true) return json({ error: "Please tick the consent box so we may write to you." }, 400);

  // ── INTEGRATION POINT: upsert contact { email, lists, consent_at, consent_source: "web-form", ip_country } in the ESP / DB.
  console.info(`[subscribe] ${maskEmail(email)} → ${lists.join(", ")}`);

  const audience = process.env.ADVISORY_INBOX;
  await sendEmail({
    to: email,
    subject: "You're on the list — Prem Marg",
    tag: `subscribe:${lists.join("+")}`,
    text: `Thank you for joining: ${lists.map((l) => LIST_LABEL[l]).join(", ")}.\n\nYou can unsubscribe at any time by replying "unsubscribe".\n\n— Sakhi, for Prem Marg`,
    html: emailShell(
      "You're on the list",
      `<p>Thank you for joining:</p><ul>${lists.map((l) => `<li>${LIST_LABEL[l]}</li>`).join("")}</ul><p>We will only write about what you chose. Reply “unsubscribe” at any time.</p><p>— Sakhi, for Prem Marg</p>`,
    ),
    ...(audience ? { replyTo: audience } : {}),
  });

  return json({ ok: true });
}

export function GET() {
  return json({ error: "Method not allowed." }, 405, { allow: "POST" });
}
