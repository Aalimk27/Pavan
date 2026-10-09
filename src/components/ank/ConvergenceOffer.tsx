"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { PRODUCTS, formatPrice } from "@/lib/products";
import { track } from "@/lib/analytics";
import { sakhi } from "@/components/sakhi/bus";
import s from "./convergence.module.css";

const PRODUCT = PRODUCTS["ank-convergence"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type SubState = { state: "idle" | "sending" | "done" | "error"; error?: string };

/** The one paid step on /ank — ANK Convergence — via /api/checkout, with a graceful pre-launch fallback. */
export default function ConvergenceOffer({ known }: { known: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLHeadingElement>(null);
  const seen = useRef(false);
  const [pending, setPending] = useState(false);
  const [fallback, setFallback] = useState<{ message?: string } | null>(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sub, setSub] = useState<SubState>({ state: "idle" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen.current) {
          seen.current = true;
          track("upsell_viewed", { placement: "ank_convergence", product_id: PRODUCT.id, numbers_known: known });
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [known]);

  useEffect(() => {
    if (fallback) fallbackRef.current?.focus();
  }, [fallback]);

  async function checkout() {
    setPending(true);
    track("begin_checkout", { product_id: PRODUCT.id, value: PRODUCT.price ?? undefined, currency: PRODUCT.currency, pillar: "ank" });
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: PRODUCT.id }) });
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setFallback({ message: data.message });
    } catch {
      setFallback({});
    } finally {
      setPending(false);
    }
    sakhi.whisper("Checkout opens at launch. Leave your email and I'll tell you first — nothing else unless you ask.", { selector: "#ank-fallback" });
  }

  async function subscribe(e: FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setSub({ state: "error", error: "Please enter a valid email address." });
      return;
    }
    if (!consent) {
      setSub({ state: "error", error: "Please tick the box so we have your permission to write to you." });
      return;
    }
    setSub({ state: "sending" });
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), lists: ["early-access"], consent: true }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setSub({ state: "done" });
        sakhi.celebrate("You're on the early-access list. I'll tell you first when ANK Convergence opens.");
      } else {
        setSub({ state: "error", error: data.error || "We couldn't save that just now — please try again in a moment." });
      }
    } catch {
      setSub({ state: "error", error: "We couldn't reach the server — please check your connection and try again." });
    }
  }

  return (
    <div ref={ref} className={s.offer}>
      <div className={s.offerHead}>
        <p className={s.offerKicker}>The full reading</p>
        <h3 className={s.offerName}>{PRODUCT.name}</h3>
        <p className={s.offerSummary}>{PRODUCT.summary}</p>
      </div>
      <ul className={s.offerIncludes}>
        {PRODUCT.includes.map((x) => (
          <li key={x}>{x}</li>
        ))}
      </ul>
      <div className={s.offerFoot}>
        <p className={s.offerPrice} data-sakhi="We'll publish the price before checkout opens — no surprises, and nothing is charged until you choose.">
          {formatPrice(PRODUCT)}
        </p>
        <button type="button" className="btn btn--lg" onClick={checkout} disabled={pending} aria-busy={pending}>
          {pending ? "Opening…" : "Request ANK Convergence"}
        </button>
      </div>

      {fallback && (
        <div className={s.fallback} id="ank-fallback" role="region" aria-labelledby="ank-fallback-title">
          <h4 id="ank-fallback-title" ref={fallbackRef} tabIndex={-1} className={s.fallbackTitle}>
            Checkout opens at launch — leave your email and Sakhi will tell you first
          </h4>
          {fallback.message && <p className={s.fallbackMsg}>{fallback.message}</p>}
          {sub.state === "done" ? (
            <p className={s.fallbackDone} role="status">
              ✓ Thank you. We&apos;ll write once, when ANK Convergence opens.
            </p>
          ) : (
            <form onSubmit={subscribe} noValidate className={s.fallbackForm}>
              <div className="field">
                <label htmlFor="ank-email">Email</label>
                <input
                  id="ank-email"
                  className="input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={sub.state === "error" && !EMAIL_RE.test(email.trim())}
                  aria-describedby={sub.state === "error" ? "ank-email-err" : undefined}
                  placeholder="you@example.com"
                />
              </div>
              <label className="checkbox">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>Yes, email me when checkout opens and occasional Prem Marg updates. I can unsubscribe any time.</span>
              </label>
              {sub.state === "error" && (
                <p id="ank-email-err" className="error-text" role="alert">
                  {sub.error}
                </p>
              )}
              <button type="submit" className="btn" disabled={sub.state === "sending"}>
                {sub.state === "sending" ? "Saving…" : "Tell me first"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
