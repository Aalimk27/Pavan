"use client";

import { useState, type ReactNode } from "react";
import { track } from "@/lib/analytics";
import { PRODUCTS, type ProductId } from "@/lib/products";
import { sakhi } from "@/components/sakhi/bus";
import SubscribeForm from "./SubscribeForm";
import s from "./account.module.css";

/**
 * Reusable checkout trigger. POST /api/checkout → Stripe; if checkout is not open
 * yet (503), shows the graceful early-access fallback inline.
 */
export default function CheckoutButton({
  productId,
  email,
  children = "Continue to checkout",
  className = "btn btn--lg",
  tone = "light",
}: {
  productId: ProductId;
  email?: string;
  children?: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  const [state, setState] = useState<"idle" | "loading" | "fallback">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function go() {
    const product = PRODUCTS[productId];
    track("begin_checkout", { product_id: productId, value: product.price ?? undefined, currency: product.currency });
    setState("loading");
    sakhi.mood("thinking", 3000);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, ...(email ? { email } : {}) }),
      });
      const data = (await res.json().catch(() => ({}))) as { url?: string; message?: string };
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setMessage(data.message ?? null);
    } catch {
      setMessage(null);
    }
    setState("fallback");
    sakhi.whisper("Checkout opens at launch. Leave your email and I'll tell you the moment it does.");
  }

  if (state === "fallback") {
    return (
      <div className={`${s.fallback} ${tone === "dark" ? s.onDark : ""}`}>
        <p className={s.fallbackLead}>{message && !message.startsWith("Checkout opens") ? message : "Checkout opens at launch — leave your email and Sakhi will tell you first."}</p>
        <SubscribeForm lists={["early-access"]} cta="Tell me first" tone={tone} consentText="Yes, email me when checkout opens. I can unsubscribe at any time." />
      </div>
    );
  }

  return (
    <button type="button" className={className} onClick={go} disabled={state === "loading"} aria-busy={state === "loading"}>
      {state === "loading" ? "Opening checkout…" : children}
    </button>
  );
}
