/**
 * A deliberately simple in-memory sliding-window rate limiter.
 * Per server instance only — good enough to blunt form spam at MVP scale.
 * Replace with a shared store (e.g. Redis / Upstash) when running many instances.
 */

const buckets = new Map<string, number[]>();
let lastSweep = Date.now();

export function clientKey(req: Request, scope: string): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = fwd || req.headers.get("x-real-ip") || "local";
  return `${scope}:${ip}`;
}

/** Returns `true` when the request is allowed. */
export function rateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  if (now - lastSweep > 10 * 60_000) {
    for (const [k, hits] of buckets) if (!hits.length || now - hits[hits.length - 1] > windowMs) buckets.delete(k);
    lastSweep = now;
  }
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) {
    buckets.set(key, hits);
    return { ok: false, retryAfter: Math.ceil((windowMs - (now - hits[0])) / 1000) };
  }
  hits.push(now);
  buckets.set(key, hits);
  return { ok: true, retryAfter: 0 };
}
