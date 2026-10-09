import { createHmac, timingSafeEqual } from "node:crypto";
import type { Product } from "@/lib/products";
import { SITE } from "@/lib/site";

/**
 * Stripe, without an SDK: Checkout Sessions over the REST API and webhook
 * signature verification with Node's crypto (blueprint §13).
 */

export function stripeConfigured(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

function siteUrl(): string {
  return SITE.url.replace(/\/+$/, "");
}

export async function createCheckoutSession(product: Product, email?: string | null): Promise<{ url: string } | { error: string }> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || product.price == null) return { error: "not-available" };

  const form = new URLSearchParams();
  form.set("mode", "payment");
  form.set("line_items[0][price_data][currency]", product.currency.toLowerCase());
  form.set("line_items[0][price_data][unit_amount]", String(Math.round(product.price * 100)));
  form.set("line_items[0][price_data][product_data][name]", product.name);
  form.set("line_items[0][price_data][product_data][description]", product.summary);
  form.set("line_items[0][quantity]", "1");
  form.set("success_url", `${siteUrl()}/my?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
  form.set("cancel_url", `${siteUrl()}/${product.pillar}`);
  form.set("metadata[productId]", product.id);
  form.set("payment_intent_data[metadata][productId]", product.id);
  if (email) form.set("customer_email", email);

  try {
    const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Version": "2024-06-20",
      },
      body: form.toString(),
      signal: AbortSignal.timeout(15_000),
    });
    const data = (await res.json().catch(() => null)) as { url?: string; error?: { type?: string } } | null;
    if (!res.ok || !data?.url) {
      console.error(`[checkout] Stripe responded ${res.status}${data?.error?.type ? ` (${data.error.type})` : ""}`);
      return { error: "stripe-error" };
    }
    return { url: data.url };
  } catch (err) {
    console.error("[checkout] Stripe request failed:", err instanceof Error ? err.name : "unknown");
    return { error: "stripe-unreachable" };
  }
}

/**
 * Verify a `Stripe-Signature` header (t=…,v1=…[,v1=…]) against the raw body.
 * HMAC-SHA256 of `${t}.${body}` with the endpoint secret, timing-safe compare,
 * and a tolerance window against replays.
 */
export function verifyStripeSignature(
  rawBody: string,
  header: string | null,
  secret: string,
  toleranceSeconds = 300,
  nowSeconds = Math.floor(Date.now() / 1000),
): { ok: true } | { ok: false; reason: string } {
  if (!header) return { ok: false, reason: "missing-signature" };
  let timestamp: number | null = null;
  const signatures: string[] = [];
  for (const part of header.split(",")) {
    const [k, v] = part.split("=", 2).map((x) => x?.trim());
    if (k === "t" && v && /^\d+$/.test(v)) timestamp = Number(v);
    else if (k === "v1" && v && /^[0-9a-f]{64}$/i.test(v)) signatures.push(v.toLowerCase());
  }
  if (timestamp == null || signatures.length === 0) return { ok: false, reason: "malformed-signature" };
  if (Math.abs(nowSeconds - timestamp) > toleranceSeconds) return { ok: false, reason: "timestamp-outside-tolerance" };

  const expected = Buffer.from(createHmac("sha256", secret).update(`${timestamp}.${rawBody}`, "utf8").digest("hex"), "utf8");
  const match = signatures.some((sig) => {
    const given = Buffer.from(sig, "utf8");
    return given.length === expected.length && timingSafeEqual(given, expected);
  });
  return match ? { ok: true } : { ok: false, reason: "signature-mismatch" };
}
