import { PRODUCTS, type ProductId } from "@/lib/products";
import { createCheckoutSession, stripeConfigured } from "@/lib/server/stripe";
import { clientKey, rateLimit } from "@/lib/server/rateLimit";
import { cleanEmail, json, readJson } from "@/lib/server/validate";

/**
 * POST /api/checkout {productId, email?}
 *   200 {url}                       → redirect to Stripe Checkout
 *   503 {available:false, message}  → payments not open yet (or product not priced)
 *   400 {error}                     → bad request
 */

const NOT_YET = "Checkout opens at launch — leave your email and Sakhi will tell you first.";

export async function POST(req: Request) {
  const rl = rateLimit(clientKey(req, "checkout"), { limit: 20, windowMs: 10 * 60_000 });
  if (!rl.ok) return json({ error: "Too many attempts. Please wait a moment and try again." }, 429, { "retry-after": String(rl.retryAfter) });

  const body = await readJson(req, 4_000);
  if (!body) return json({ error: "Invalid request." }, 400);

  const productId = typeof body.productId === "string" ? body.productId : "";
  if (!Object.prototype.hasOwnProperty.call(PRODUCTS, productId)) return json({ error: "Unknown product." }, 400);
  const product = PRODUCTS[productId as ProductId];

  let email: string | null = null;
  if (body.email != null && body.email !== "") {
    email = cleanEmail(body.email);
    if (!email) return json({ error: "Please check your email address." }, 400);
  }

  if (product.price == null) {
    return json({ available: false, message: "This report's launch price is still being finalised. " + NOT_YET }, 503);
  }
  if (!stripeConfigured()) return json({ available: false, message: NOT_YET }, 503);

  const result = await createCheckoutSession(product, email);
  if ("url" in result) return json({ url: result.url });
  return json({ available: false, message: "Checkout is resting for a moment. Please try again shortly — or leave your email and we will write to you." }, 503);
}

export function GET() {
  return json({ error: "Method not allowed." }, 405, { allow: "POST" });
}
