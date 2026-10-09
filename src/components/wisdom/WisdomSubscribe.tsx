"use client";

import { useId, useState } from "react";
import { track } from "@/lib/analytics";
import { sakhi } from "@/components/sakhi/bus";
import styles from "./wisdom.module.css";

type List = "gita" | "katha";

/** Optional morning email. Consent is explicit and unticked by default. */
export default function WisdomSubscribe({ list, title, text }: { list: List; title: string; text: string }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setState("error");
      setError("Please enter a valid email address.");
      return;
    }
    if (!consent) {
      setState("error");
      setError("Please tick the box so we know you'd like these emails.");
      return;
    }
    setState("sending");
    setError("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), lists: [list], consent: true }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setState("done");
        track("subscription_started", { lists: [list] });
        sakhi.celebrate(list === "gita" ? "See you at sunrise — one verse, nothing else." : "A story will be waiting for you each morning.");
      } else {
        setState("error");
        setError(data.error || "We couldn't save that just now. Please try again in a moment.");
      }
    } catch {
      setState("error");
      setError("We couldn't reach the server. Please check your connection and try again.");
    }
  };

  if (state === "done") {
    return (
      <div className={styles.subDone} role="status">
        <p className={styles.subTitle}>You&rsquo;re on the list.</p>
        <p>Check your inbox for a confirmation. Every email has a one-click link to change frequency or unsubscribe.</p>
      </div>
    );
  }

  return (
    <form className={styles.sub} onSubmit={submit} noValidate>
      <div className={styles.subIntro}>
        <p className={styles.subTitle}>{title}</p>
        <p className={styles.subText}>{text}</p>
      </div>
      <div className={styles.subRow}>
        <div className="field">
          <label htmlFor={`${id}-email`}>Email</label>
          <input
            id={`${id}-email`}
            className="input"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-invalid={state === "error" && !!error && error.includes("email")}
          />
        </div>
        <button type="submit" className="btn btn--forest" disabled={state === "sending"}>
          {state === "sending" ? "Saving…" : "Send it each morning"}
        </button>
      </div>
      <label className={`checkbox ${styles.subConsent}`}>
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          Yes, email me the daily {list === "gita" ? "Gita verse" : "Katha story"}. This is optional and separate from any order or account messages.
        </span>
      </label>
      <p className="hint">Daily wisdom stays useful content, never disguised sales. You choose the frequency and can unsubscribe in one click, any time.</p>
      {state === "error" && error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
