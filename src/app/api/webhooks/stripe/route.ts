import { verifyStripeSignature } from "@/lib/server/stripe";
import { claimEvent, onChargeRefunded, onCheckoutCompleted, onSubscriptionDeleted, releaseEvent } from "@/lib/server/orders";
import { json } from "@/lib/server/validate";

/**
 * POST /api/webhooks/stripe — Stripe → Prem Marg (blueprint §13).
 * The raw body is verified before anything is parsed. Handlers are idempotent
 * by event id; a handler failure releases the claim and returns 500 so Stripe retries.
 */

interface StripeEvent {
  id: string;
  type: string;
  data: { object: Record<string, unknown> };
}

const str = (v: unknown): string | null => (typeof v === "string" ? v : null);
const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set");
    return json({ error: "Webhook not configured." }, 503);
  }

  const raw = await req.text();
  if (raw.length > 512_000) return json({ error: "Payload too large." }, 413);

  const verdict = verifyStripeSignature(raw, req.headers.get("stripe-signature"), secret);
  if (!verdict.ok) {
    console.warn(`[stripe-webhook] rejected: ${verdict.reason}`);
    return json({ error: "Invalid signature." }, 400);
  }

  let event: StripeEvent;
  try {
    event = JSON.parse(raw) as StripeEvent;
    if (!event?.id || !event?.type || !event?.data?.object) throw new Error("shape");
  } catch {
    return json({ error: "Invalid payload." }, 400);
  }

  if (!claimEvent(event.id)) return json({ received: true, duplicate: true });

  const obj = event.data.object;
  try {
    switch (event.type) {
      case "checkout.session.completed":
      case "checkout.session.async_payment_succeeded": {
        const metadata = (obj.metadata ?? {}) as Record<string, unknown>;
        const details = (obj.customer_details ?? {}) as Record<string, unknown>;
        await onCheckoutCompleted({
          eventId: event.id,
          sessionId: str(obj.id) ?? "unknown",
          productId: str(metadata.productId),
          amountTotal: num(obj.amount_total),
          currency: str(obj.currency),
          customerEmail: str(details.email) ?? str(obj.customer_email),
          paymentStatus: event.type === "checkout.session.async_payment_succeeded" ? "paid" : str(obj.payment_status),
        });
        break;
      }
      case "charge.refunded":
        await onChargeRefunded(str(obj.id) ?? "unknown", num(obj.amount_refunded));
        break;
      case "customer.subscription.deleted":
        await onSubscriptionDeleted(str(obj.id) ?? "unknown");
        break;
      default:
        // Acknowledge everything else so Stripe stops retrying.
        break;
    }
  } catch (err) {
    releaseEvent(event.id);
    console.error(`[stripe-webhook] handler failed for ${event.type}:`, err instanceof Error ? err.message : "unknown");
    return json({ error: "Handler failed." }, 500);
  }

  return json({ received: true });
}
