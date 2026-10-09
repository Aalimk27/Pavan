"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { PRODUCTS, formatPrice, type Product } from "@/lib/products";
import { track } from "@/lib/analytics";
import { sakhi } from "@/components/sakhi/bus";
import s from "./sections.module.css";

const REPORT = PRODUCTS["vastu-report"];
const PAIRED = PRODUCTS["drishti-x-vastu"];

type SubState = { state: "idle" | "sending" | "done" | "error"; error?: string };

export default function ReportOffer() {
  const ref = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLHeadingElement>(null);
  const seen = useRef(false);
  const [pending, setPending] = useState<string | null>(null);
  const [fallback, setFallback] = useState<{ product: Product; message?: string } | null>(null);
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
          track("upsell_viewed", { placement: "vastu_report", product_id: REPORT.id });
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (fallback) fallbackRef.current?.focus();
  }, [fallback]);

  async function checkout(p: Product) {
    setPending(p.id);
    track("begin_checkout", { product_id: p.id, value: p.price ?? undefined, currency: p.currency, pillar: "vastu" });
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ productId: p.id }) });
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setFallback({ product: p, message: data.message });
    } catch {
      setFallback({ product: p });
    } finally {
      setPending(null);
    }
    sakhi.whisper("Checkout opens at launch. Leave your email and I'll tell you first — nothing else unless you ask.", { selector: "#vastu-fallback" });
  }

  async function subscribe(e: FormEvent) {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
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
        sakhi.celebrate(`You're on the early-access list. I'll tell you first when the ${fallback?.product.name ?? "VASTU report"} opens.`);
      } else {
        setSub({ state: "error", error: data.error || "We couldn't save that just now — please try again in a moment." });
      }
    } catch {
      setSub({ state: "error", error: "We couldn't reach the server — please check your connection and try again." });
    }
  }

  return (
    <div ref={ref} className={s.offer}>
      <article className={`card card--gilded ${s.reportCard}`} data-reveal>
        <div className={s.reportHead}>
          <p className={s.reportKicker}>
            The paid report <span className="badge badge--beta">Beta</span>
          </p>
          <h3 className={s.reportName}>{REPORT.name}</h3>
          <p className={s.reportSummary}>{REPORT.summary}</p>
        </div>
        <ul className={s.reportIncludes}>
          {REPORT.includes.map((x) => (
            <li key={x}>{x}</li>
          ))}
          <li>PDF floor plans accepted</li>
        </ul>
        <div className={s.reportFoot}>
          <p className={s.reportPrice} data-sakhi="We'll publish the price before checkout opens — no surprises, and nothing is charged until you choose.">
            {formatPrice(REPORT)}
          </p>
          <button type="button" className="btn btn--forest btn--lg" onClick={() => checkout(REPORT)} disabled={pending !== null} aria-busy={pending === REPORT.id}>
            {pending === REPORT.id ? "Opening…" : "Get the annotated report"}
          </button>
        </div>
      </article>

      <aside className={s.nextStep} data-reveal style={{ ["--reveal-delay" as string]: "120ms" }} aria-labelledby="dxv-title">
        <p className={s.nextKicker}>One next step, when you are ready</p>
        <h3 id="dxv-title" className={s.nextName}>
          {PAIRED.name}
        </h3>
        <p className={s.nextText}>
          Compares the resident profile with the traditional Vastu analysis of the actual home — while keeping both evidence streams separate and transparent.
        </p>
        <ul className={s.nextIncludes}>
          {PAIRED.includes.map((x) => (
            <li key={x}>{x}</li>
          ))}
        </ul>
        <div className={s.nextRow}>
          <span className={s.nextPrice}>{formatPrice(PAIRED)}</span>
          <button type="button" className="link-arrow" onClick={() => checkout(PAIRED)} disabled={pending !== null} data-sakhi="DRISHTI × VASTU keeps your chart and your home side by side — never blending one into the other.">
            {pending === PAIRED.id ? "Opening…" : "Request DRISHTI × VASTU"}
          </button>
        </div>
      </aside>

      {fallback && (
        <div className={s.fallback} id="vastu-fallback" role="region" aria-labelledby="vastu-fallback-title">
          <h3 id="vastu-fallback-title" ref={fallbackRef} tabIndex={-1} className={s.fallbackTitle}>
            Checkout opens at launch — leave your email and Sakhi will tell you first
          </h3>
          {fallback.message && <p className="muted small">{fallback.message}</p>}
          {sub.state === "done" ? (
            <p className={s.fallbackDone} role="status">
              ✓ Thank you. We&apos;ll write once, when the {fallback.product.name} opens.
            </p>
          ) : (
            <form onSubmit={subscribe} noValidate className={s.fallbackForm}>
              <div className="field">
                <label htmlFor="vastu-email">Email</label>
                <input
                  id="vastu-email"
                  className="input"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={sub.state === "error" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())}
                  aria-describedby="vastu-email-err"
                  placeholder="you@example.com"
                />
              </div>
              <label className="checkbox">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>Yes, email me when checkout opens and occasional Prem Marg updates. I can unsubscribe any time.</span>
              </label>
              {sub.state === "error" && (
                <p id="vastu-email-err" className="error-text" role="alert">
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
