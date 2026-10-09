"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { DRISHTI_TIERS, formatPrice, type Product, type ProductId } from "@/lib/products";
import { track } from "@/lib/analytics";
import { sakhi } from "@/components/sakhi/bus";
import styles from "./tiers.module.css";

const TIER_NOTE: Record<string, { tag: string; sakhi: string }> = {
  "drishti-core": {
    tag: "The complete foundation",
    sakhi: "Core is the full 13-slide reading — every calculation, a written summary and a script you can take to a human consultation.",
  },
  "drishti-deep": {
    tag: "Core + the year ahead",
    sakhi: "Deep adds your next twelve months mapped in time, three of your own questions and one deep-dive module you choose.",
  },
  "drishti-signature": {
    tag: "The fullest picture",
    sakhi: "Signature looks about three years ahead and goes deeper into career, relationships, wealth, relocation, property and family — with up to five questions.",
  },
};

type Fallback = { product: Product; message?: string };

export default function Tiers() {
  const ref = useRef<HTMLDivElement>(null);
  const fallbackRef = useRef<HTMLHeadingElement>(null);
  const seen = useRef(false);
  const [pending, setPending] = useState<ProductId | null>(null);
  const [fallback, setFallback] = useState<Fallback | null>(null);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [sub, setSub] = useState<{ state: "idle" | "sending" | "done" | "error"; error?: string }>({ state: "idle" });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !seen.current) {
          seen.current = true;
          track("upsell_viewed", { placement: "drishti_tiers", products: DRISHTI_TIERS.map((p) => p.id) });
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
    track("begin_checkout", { product_id: p.id, value: p.price ?? undefined, currency: p.currency });
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
    sakhi.whisper("Checkout isn’t open just yet. Leave your email and I’ll write the moment it is — nothing else unless you ask.", { selector: "#tiers-fallback" });
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
        sakhi.celebrate("You’re on the early-access list. I’ll tell you first when DRISHTI opens.");
      } else {
        setSub({ state: "error", error: data.error || "We couldn’t save that just now — please try again in a moment." });
      }
    } catch {
      setSub({ state: "error", error: "We couldn’t reach the server — please check your connection and try again." });
    }
  }

  return (
    <div ref={ref}>
      <div className={styles.grid}>
        {DRISHTI_TIERS.map((p, i) => {
          const note = TIER_NOTE[p.id];
          return (
            <article key={p.id} className={`${styles.tier} ${p.highlight ? styles.featured : ""}`} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}>
              {p.highlight && <span className={styles.ribbon}>Recommended</span>}
              <header className={styles.head}>
                <p className={styles.tag}>{note.tag}</p>
                <h3 className={styles.name}>
                  {p.name.replace("DRISHTI ", "")}
                  <span className={styles.brand}>DRISHTI</span>
                </h3>
                <p className={styles.price} data-sakhi={note.sakhi}>
                  <span className={styles.amount}>{formatPrice(p)}</span>
                  {p.price != null && <span className={styles.currency}>USD</span>}
                </p>
                <p className={styles.summary}>{p.summary}</p>
              </header>
              <ul className={styles.list}>
                {p.includes.map((inc) => (
                  <li key={inc}>
                    <span className={styles.tick} aria-hidden>
                      ✦
                    </span>
                    {inc}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                className={`btn ${p.highlight ? "" : "btn--forest"} ${styles.cta}`}
                onClick={() => checkout(p)}
                disabled={pending !== null}
                aria-busy={pending === p.id}
              >
                {pending === p.id ? "Opening checkout…" : `Choose ${p.name.replace("DRISHTI ", "")}`}
              </button>
            </article>
          );
        })}
      </div>

      <p className={styles.after}>
        After checkout: you confirm your birth details and questions → the engines calculate → specialist agents interpret → quality checks → your branded report arrives by email and in My Prem Marg, with Sakhi ready to explain it.
      </p>

      {fallback && (
        <div className={styles.fallback} id="tiers-fallback">
          {sub.state === "done" ? (
            <div className={styles.done} role="status">
              <h3 ref={fallbackRef} tabIndex={-1}>
                Thank you — you&rsquo;re on the list.
              </h3>
              <p>Sakhi will write to {email.trim()} when {fallback.product.name} checkout opens. You can unsubscribe from any email.</p>
            </div>
          ) : (
            <form onSubmit={subscribe} noValidate>
              <h3 ref={fallbackRef} tabIndex={-1}>
                Checkout opens at launch — leave your email and Sakhi will tell you first
              </h3>
              <p className={styles.fbLead}>
                You chose <strong>{fallback.product.name}</strong> ({formatPrice(fallback.product)}). {fallback.message ? fallback.message : "Nothing is charged today."}
              </p>
              <div className={styles.fbRow}>
                <div className="field">
                  <label htmlFor="ea-email">Email</label>
                  <input
                    id="ea-email"
                    className="input"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={sub.state === "error" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? true : undefined}
                    aria-describedby={sub.state === "error" ? "ea-error" : undefined}
                  />
                </div>
                <button type="submit" className="btn btn--forest" disabled={sub.state === "sending"}>
                  {sub.state === "sending" ? "Saving…" : "Tell me first"}
                </button>
              </div>
              <label className={`checkbox ${styles.consent}`}>
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>
                  Yes, email me when DRISHTI checkout opens, plus occasional Prem Marg updates. This is optional marketing consent — unsubscribe any time.
                </span>
              </label>
              <p className="hint">Messages about an order you place are service emails and never depend on this box.</p>
              {sub.state === "error" && (
                <p className="error-text" id="ea-error" role="alert">
                  {sub.error}
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
