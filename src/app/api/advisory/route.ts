import { SITE } from "@/lib/site";
import { clientKey, rateLimit } from "@/lib/server/rateLimit";
import { emailShell, sendEmail } from "@/lib/server/email";
import { makeReference } from "@/lib/server/reference";
import { cleanEmail, cleanText, escapeHtml, json, readJson } from "@/lib/server/validate";

/**
 * POST /api/advisory {name, email, phone?, country?, topic, message, consent:true}
 *   200 {ok:true, reference}   400 {error}
 * Private Advisory with RadheyShyam Realtor (blueprint §15).
 */

const TOPICS = ["property", "consultation", "vastu", "other"] as const;
type Topic = (typeof TOPICS)[number];
const TOPIC_LABEL: Record<Topic, string> = {
  property: "Property selection",
  consultation: "Human consultation",
  vastu: "Vastu for a home or property",
  other: "Something else",
};

const PHONE_RE = /^[+()\-.\s0-9]{6,24}$/;

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "advisory"), { limit: 4, windowMs: 15 * 60_000 });
  if (!rl.ok) return json({ error: "We have your recent requests. Please wait a few minutes before sending another." }, 429, { "retry-after": String(rl.retryAfter) });

  const body = await readJson(req, 12_000);
  if (!body) return json({ error: "Invalid request." }, 400);
  if (typeof body.website === "string" && body.website.trim() !== "") return json({ ok: true, reference: makeReference() });

  const name = cleanText(body.name, { min: 2, max: 80 });
  if (!name) return json({ error: "Please tell us your name (2–80 characters)." }, 400);

  const email = cleanEmail(body.email);
  if (!email) return json({ error: "Please enter a valid email address." }, 400);

  const phone = cleanText(body.phone, { max: 24 });
  if (phone === null || (phone && !PHONE_RE.test(phone))) return json({ error: "Please check your phone number, or leave it blank." }, 400);

  const country = cleanText(body.country, { max: 60 });
  if (country === null) return json({ error: "Please keep the country under 60 characters." }, 400);

  const topic = typeof body.topic === "string" && (TOPICS as readonly string[]).includes(body.topic) ? (body.topic as Topic) : null;
  if (!topic) return json({ error: "Please choose what the advisory is about." }, 400);

  const message = cleanText(body.message, { min: 20, max: 2000, multiline: true });
  if (!message) return json({ error: "Please share a little about your situation (20–2000 characters)." }, 400);

  if (body.consent !== true) return json({ error: "Please agree to be contacted about this request." }, 400);

  const reference = makeReference();

  // ── INTEGRATION POINT: persist the request { reference, topic, created_at, contact } in the CRM / DB.
  console.info(`[advisory] ${reference} received · topic=${topic}${country ? ` · ${country}` : ""}`);

  const inbox = process.env.ADVISORY_INBOX;
  const rows: [string, string][] = [
    ["Reference", reference],
    ["Topic", TOPIC_LABEL[topic]],
    ["Name", name],
    ["Email", email],
    ...(phone ? ([["Phone", phone]] as [string, string][]) : []),
    ...(country ? ([["Country", country]] as [string, string][]) : []),
  ];
  if (inbox) {
    await sendEmail({
      to: inbox,
      replyTo: email,
      subject: `[Advisory ${reference}] ${TOPIC_LABEL[topic]} — ${name}`,
      tag: `advisory-inbox:${reference}`,
      text: `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message}`,
      html: emailShell(
        `Advisory request ${reference}`,
        `<table cellpadding="4">${rows.map(([k, v]) => `<tr><td><b>${k}</b></td><td>${escapeHtml(v)}</td></tr>`).join("")}</table><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`,
      ),
    });
  } else {
    console.info(`[advisory] ADVISORY_INBOX not set — ${reference} logged only`);
  }

  await sendEmail({
    to: email,
    subject: `We received your request — ${reference}`,
    tag: `advisory-ack:${reference}`,
    text: `Namaste ${name},\n\nThank you for reaching out to Private Advisory with ${SITE.founderBrand}. Your reference is ${reference}. A member of the team will reply personally.\n\n— Prem Marg`,
    html: emailShell(
      "We received your request",
      `<p>Namaste ${escapeHtml(name)},</p><p>Thank you for reaching out to Private Advisory with ${SITE.founderBrand}. Your reference is <b>${reference}</b>. A member of the team will reply to you personally.</p><p>— Prem Marg</p>`,
    ),
    ...(inbox ? { replyTo: inbox } : {}),
  });

  return json({ ok: true, reference });
}

export function GET() {
  return json({ error: "Method not allowed." }, 405, { allow: "POST" });
}
