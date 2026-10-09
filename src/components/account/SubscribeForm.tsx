"use client";

import { useId, useState, type FormEvent } from "react";
import { sakhi } from "@/components/sakhi/bus";
import s from "./account.module.css";

export type SubscribeList = "gita" | "katha" | "early-access" | "membership";

/**
 * Email list sign-up with explicit, unticked-by-default marketing consent
 * (blueprint §18–19). Posts to /api/subscribe.
 */
export default function SubscribeForm({
  lists,
  cta = "Join the list",
  consentText = "Yes, Prem Marg may email me about this. I can unsubscribe at any time.",
  successText = "You're on the list. Sakhi will write to you — only about what you chose.",
  tone = "light",
  id,
}: {
  lists: SubscribeList[];
  cta?: string;
  consentText?: string;
  successText?: string;
  tone?: "light" | "dark";
  id?: string;
}) {
  const uid = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) return setError("Please enter a valid email address.");
    if (!consent) return setError("Please tick the consent box so we may write to you.");
    setState("sending");
    sakhi.mood("thinking", 2000);
    const website = (e.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), lists, consent: true, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.");
      setState("done");
      sakhi.celebrate("You're on the list. I'll write only about what you chose. 🙏");
    } catch (err) {
      setState("idle");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      sakhi.mood("attentive", 2000);
    }
  }

  if (state === "done") {
    return (
      <div className={`${s.success} ${tone === "dark" ? s.onDark : ""}`} role="status" id={id}>
        <span className={s.successSeal} aria-hidden>
          ✓
        </span>
        <p>{successText}</p>
      </div>
    );
  }

  return (
    <form className={`${s.subscribe} ${tone === "dark" ? s.onDark : ""}`} onSubmit={submit} noValidate id={id}>
      <div className={s.subscribeRow}>
        <div className="field">
          <label htmlFor={`${uid}-email`}>Email</label>
          <input
            id={`${uid}-email`}
            className="input"
            type="email"
            name="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${uid}-err` : undefined}
            required
          />
        </div>
        <button className="btn" type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Sending…" : cta}
        </button>
      </div>
      <div className={s.honey} aria-hidden>
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <label className={`checkbox ${s.consent}`} htmlFor={`${uid}-consent`}>
        <input id={`${uid}-consent`} type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>{consentText}</span>
      </label>
      <p className={`hint ${s.hint}`}>Marketing consent is separate from service messages such as receipts — those never need this box.</p>
      {error && (
        <p className="error-text" id={`${uid}-err`} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
