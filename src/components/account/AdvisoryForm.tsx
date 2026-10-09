"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { track } from "@/lib/analytics";
import { sakhi } from "@/components/sakhi/bus";
import s from "./advisory.module.css";

type Topic = "property" | "consultation" | "vastu" | "other";
const TOPICS: { value: Topic; label: string; sakhi: string }[] = [
  { value: "property", label: "Property selection", sakhi: "Buying, renting or choosing between homes — the team can help you weigh it in person." },
  { value: "consultation", label: "Human consultation", sakhi: "Sometimes you want a person, not a page. A human consultation is a calm, private conversation." },
  { value: "vastu", label: "Vastu for a home or property", sakhi: "For a home you're about to buy or build, a person can look at the plan with you — Vastu here is guidance, never fear." },
  { value: "other", label: "Something else", sakhi: "Tell us in your own words — we'll find the right person." },
];

type Errors = Partial<Record<"name" | "email" | "phone" | "message" | "consent" | "form", string>>;

export default function AdvisoryForm() {
  const [topic, setTopic] = useState<Topic>("property");
  const [values, setValues] = useState({ name: "", email: "", phone: "", country: "", message: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [reference, setReference] = useState<string | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state !== "done" || !doneRef.current) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    doneRef.current.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
    doneRef.current.focus({ preventScroll: true });
  }, [state]);

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("topic");
    if (t && TOPICS.some((x) => x.value === t)) setTopic(t as Topic);
  }, []);

  const set = (k: keyof typeof values) => (e: { target: { value: string } }) => setValues((v) => ({ ...v, [k]: e.target.value }));

  function validate(): Errors {
    const e: Errors = {};
    if (values.name.trim().length < 2) e.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) e.email = "Please enter a valid email address.";
    if (values.phone.trim() && !/^[+()\-.\s0-9]{6,24}$/.test(values.phone.trim())) e.phone = "Please check the number, or leave it blank.";
    if (values.message.trim().length < 20) e.message = "A few sentences help us prepare — at least 20 characters.";
    if (!consent) e.consent = "Please agree so we may contact you about this request.";
    return e;
  }

  async function submit(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      const first = Object.keys(e)[0];
      document.getElementById(`adv-${first}`)?.focus();
      sakhi.mood("attentive", 2000);
      return;
    }
    setState("sending");
    sakhi.mood("thinking", 4000);
    const website = (ev.currentTarget.elements.namedItem("website") as HTMLInputElement | null)?.value ?? "";
    try {
      const res = await fetch("/api/advisory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, topic, consent: true, website }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reference?: string; error?: string };
      if (!res.ok || !data.ok) throw new Error(data.error || "We couldn't send that just now. Please try again.");
      track("advisory_requested", { topic });
      setReference(data.reference ?? null);
      setState("done");
      sakhi.celebrate("Your request is with the RadheyShyam Realtor team. A person will reply to you — not a bot. 🙏");
    } catch (err) {
      setState("idle");
      setErrors({ form: err instanceof Error ? err.message : "We couldn't send that just now. Please try again." });
    }
  }

  if (state === "done") {
    return (
      <div className={s.done} role="status" aria-live="polite" ref={doneRef} tabIndex={-1}>
        <span className={s.doneSeal} aria-hidden>
          ॐ
        </span>
        <h3 className={s.doneTitle}>Your request is received</h3>
        {reference && (
          <p className={s.ref} data-sakhi="Keep this reference — it helps the team find your request quickly.">
            Reference <strong>{reference}</strong>
          </p>
        )}
        <p>A member of the RadheyShyam Realtor team will reply to you personally by email. If you shared a phone number, they may call at a reasonable hour in your country.</p>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? (
      <p className="error-text" id={`adv-${k}-err`}>
        {errors[k]}
      </p>
    ) : null;
  const described = (k: keyof Errors) => (errors[k] ? `adv-${k}-err` : undefined);

  return (
    <form className={s.form} onSubmit={submit} noValidate aria-describedby={errors.form ? "adv-form-err" : undefined}>
      <fieldset className={s.topics}>
        <legend className="label">What is it about?</legend>
        <div className={s.topicGrid}>
          {TOPICS.map((t) => (
            <label key={t.value} className={`${s.topic} ${topic === t.value ? s.topicOn : ""}`} data-sakhi={t.sakhi}>
              <input type="radio" name="topic" value={t.value} checked={topic === t.value} onChange={() => setTopic(t.value)} />
              <span>{t.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className={s.two}>
        <div className="field">
          <label htmlFor="adv-name">Name</label>
          <input id="adv-name" className="input" autoComplete="name" maxLength={80} value={values.name} onChange={set("name")} aria-invalid={!!errors.name} aria-describedby={described("name")} required />
          {err("name")}
        </div>
        <div className="field">
          <label htmlFor="adv-email">Email</label>
          <input id="adv-email" className="input" type="email" inputMode="email" autoComplete="email" maxLength={254} value={values.email} onChange={set("email")} aria-invalid={!!errors.email} aria-describedby={described("email")} required />
          {err("email")}
        </div>
        <div className="field">
          <label htmlFor="adv-phone">
            Phone <span className={s.optional}>optional</span>
          </label>
          <input id="adv-phone" className="input" type="tel" inputMode="tel" autoComplete="tel" maxLength={24} placeholder="+91 …" value={values.phone} onChange={set("phone")} aria-invalid={!!errors.phone} aria-describedby={described("phone")} />
          {err("phone")}
        </div>
        <div className="field">
          <label htmlFor="adv-country">
            Country <span className={s.optional}>optional</span>
          </label>
          <input id="adv-country" className="input" autoComplete="country-name" maxLength={60} value={values.country} onChange={set("country")} />
        </div>
      </div>

      <div className="field">
        <label htmlFor="adv-message">Your situation</label>
        <textarea
          id="adv-message"
          className="textarea"
          maxLength={2000}
          rows={5}
          placeholder="For example: we're choosing between two flats in Pune and would like a human view on the layouts and the decision."
          value={values.message}
          onChange={set("message")}
          aria-invalid={!!errors.message}
          aria-describedby={`adv-message-count${errors.message ? " adv-message-err" : ""}`}
          required
        />
        <span className="hint" id="adv-message-count">
          {values.message.length}/2000 · Please don&rsquo;t include birth details, ID numbers or financial account details here.
        </span>
        {err("message")}
      </div>

      <div className={s.honey} aria-hidden>
        <label htmlFor="adv-website">Website</label>
        <input id="adv-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <label className="checkbox" htmlFor="adv-consent">
        <input id="adv-consent" type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-describedby={described("consent")} />
        <span>I agree that Prem Marg and RadheyShyam Realtor may contact me about this request. This is not a marketing sign-up.</span>
      </label>
      {err("consent")}

      {errors.form && (
        <p className="error-text" id="adv-form-err" role="alert">
          {errors.form}
        </p>
      )}

      <div className={s.submitRow}>
        <button type="submit" className="btn btn--lg" disabled={state === "sending"} aria-busy={state === "sending"}>
          {state === "sending" ? "Sending…" : "Request a private conversation"}
        </button>
        <span className="hint">A person reads every request and replies by email.</span>
      </div>
    </form>
  );
}
