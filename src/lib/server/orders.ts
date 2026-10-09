/**
 * Order lifecycle integration points (blueprint §13).
 *
 * The MVP has no database yet. Everything a real order needs is marked here as an
 * INTEGRATION POINT so the persistence layer can be dropped in without touching
 * the webhook route. Idempotency is enforced by Stripe event id (in memory per
 * instance today; move to a unique index on `stripe_event_id` with the database).
 */

const processed = new Map<string, number>();
const MAX_REMEMBERED = 5_000;

/** Returns false if this event id was already handled (Stripe retries deliveries). */
export function claimEvent(eventId: string): boolean {
  if (processed.has(eventId)) return false;
  processed.set(eventId, Date.now());
  if (processed.size > MAX_REMEMBERED) {
    const oldest = processed.keys().next().value;
    if (oldest) processed.delete(oldest);
  }
  return true;
}

/** Undo a claim so a failed handler can be retried by Stripe. */
export function releaseEvent(eventId: string): void {
  processed.delete(eventId);
}

export interface PaidOrderInput {
  eventId: string;
  sessionId: string;
  productId: string | null;
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
  paymentStatus: string | null;
}

export async function onCheckoutCompleted(o: PaidOrderInput): Promise<void> {
  if (o.paymentStatus !== "paid") {
    // Delayed payment methods complete later via checkout.session.async_payment_succeeded.
    console.info(`[orders] session ${o.sessionId} completed with payment_status=${o.paymentStatus ?? "unknown"} — awaiting payment`);
    return;
  }
  // ── INTEGRATION POINT: create paid order ─────────────────────────────────
  // 1. Upsert order { id, stripe_session_id (unique), product_id, amount, currency, email, status: "paid" }.
  // 2. Freeze the customer's inputs (birth details / floor plan / numbers) captured before checkout,
  //    stamped with CALC_VERSION / VASTU_RULES_VERSION / report version for reproducibility (§19).
  // 3. Enqueue calculation → QA → render → private storage → "report ready" email with a signed link.
  //    Missing data ⇒ status "needs-information" + Sakhi/email request.
  // 4. Send the receipt (transactional, not marketing).
  // ────────────────────────────────────────────────────────────────────────
  console.info(`[orders] paid order received: product=${o.productId ?? "?"} session=${o.sessionId} amount=${o.amountTotal ?? "?"} ${o.currency ?? ""}`);
}

export async function onChargeRefunded(chargeId: string, amountRefunded: number | null): Promise<void> {
  // ── INTEGRATION POINT: mark order refunded / partially refunded; revoke report link if fully refunded.
  console.info(`[orders] refund recorded: charge=${chargeId} amount_refunded=${amountRefunded ?? "?"}`);
}

export async function onSubscriptionDeleted(subscriptionId: string): Promise<void> {
  // ── INTEGRATION POINT: end membership benefits at period end; send a gentle billing notice.
  console.info(`[orders] subscription ended: ${subscriptionId}`);
}
