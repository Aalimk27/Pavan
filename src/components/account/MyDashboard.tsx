"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { clearAll, getState, removeHome, removeProfile, setSakhiPrefs, usePremMarg, type BirthProfile, type SavedHome } from "@/lib/store";
import { gitaById } from "@/lib/content/gita";
import { kathaBySlug } from "@/lib/content/katha";
import { gurukulBySlug } from "@/lib/content/gurukul";
import { HOME_MEANING } from "@/lib/ank";
import { dayKey } from "@/lib/daily";
import { sakhi } from "@/components/sakhi/bus";
import SakhiMark from "@/components/sakhi/SakhiMark";
import s from "./my.module.css";

/* ─────────────── small helpers ─────────────── */

function fmtDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short", year: "numeric" }) {
  const d = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T12:00:00Z`) : new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { timeZone: "UTC", ...opts });
}

function Panel({ id, title, eyebrow, count, children, wide, sakhiLine }: { id: string; title: string; eyebrow: string; count?: number; children: ReactNode; wide?: boolean; sakhiLine?: string }) {
  return (
    <section className={`${s.panel} ${wide ? s.panelWide : ""}`} aria-labelledby={`${id}-title`} id={id} data-reveal>
      <header className={s.panelHead} data-sakhi={sakhiLine}>
        <p className={s.panelEyebrow}>{eyebrow}</p>
        <h2 id={`${id}-title`} className={s.panelTitle}>
          {title}
          {count != null && count > 0 && <span className={s.count}>{count}</span>}
        </h2>
      </header>
      {children}
    </section>
  );
}

function Empty({ glyph, children, action }: { glyph: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className={s.empty}>
      <span className={`${s.emptyGlyph} sanskrit`} aria-hidden>
        {glyph}
      </span>
      <div>
        <p>{children}</p>
        {action}
      </div>
    </div>
  );
}

function Switch({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  const id = useId();
  return (
    <div className={s.switchRow}>
      <div>
        <span className={s.switchLabel} id={`${id}-l`}>
          {label}
        </span>
        <span className={s.switchHint} id={`${id}-h`}>
          {hint}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-l`}
        aria-describedby={`${id}-h`}
        className={s.switch}
        onClick={() => onChange(!checked)}
      >
        <span className={s.switchKnob} aria-hidden />
      </button>
    </div>
  );
}

/* ─────────────── the dashboard ─────────────── */

export default function MyDashboard() {
  const profiles = usePremMarg((st) => st.profiles);
  const homes = usePremMarg((st) => st.homes);
  const wisdom = usePremMarg((st) => st.wisdom);
  const lamps = usePremMarg((st) => st.lamps);
  const gurukul = usePremMarg((st) => st.gurukul);
  const prefs = usePremMarg((st) => st.sakhi);

  const [checkout, setCheckout] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [cleared, setCleared] = useState(false);
  const [name, setName] = useState("");
  const [nameSaved, setNameSaved] = useState(false);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("checkout") === "success") {
      setCheckout(true);
      window.setTimeout(() => sakhi.whisper("Thank you. If your payment completed, your receipt is on its way by email — and your report will follow.", { selector: "#checkout-note", ms: 7000 }), 900);
    }
  }, []);

  useEffect(() => {
    setName(prefs.name ?? "");
  }, [prefs.name]);

  useEffect(() => {
    if (confirming) confirmRef.current?.focus();
  }, [confirming]);

  const wisdomDays = Object.entries(wisdom)
    .filter(([, v]) => v.gita || v.katha)
    .sort(([a], [b]) => (a < b ? 1 : -1));
  const gurukulTopics = Object.entries(gurukul).filter(([, days]) => days.length > 0);
  const totalItems = profiles.length + homes.length + wisdomDays.length + lamps.length + gurukulTopics.length;

  function exportData() {
    const data = { exportedAt: new Date().toISOString(), source: "premarga.com — My Prem Marg (this device)", ...getState() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prem-marg-${dayKey()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    sakhi.whisper("Your data is downloaded — a plain JSON file that's yours to keep.", { ms: 4500 });
  }

  function deleteAll() {
    clearAll();
    setConfirming(false);
    setCleared(true);
    sakhi.mood("resting", 2500);
    sakhi.whisper("Everything on this device is cleared. You can begin again whenever you like.", { ms: 5000 });
  }

  function onRemoveProfile(p: BirthProfile) {
    removeProfile(p.id);
    sakhi.whisper(`${p.name || "That profile"} is removed from this device.`, { ms: 3500 });
  }

  function onRemoveHome(h: SavedHome) {
    removeHome(h.id);
    sakhi.whisper(`${h.label || "That home"} is removed from this device.`, { ms: 3500 });
  }

  function saveName(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = name.trim().slice(0, 40);
    setSakhiPrefs({ name: n || undefined });
    setNameSaved(true);
    window.setTimeout(() => setNameSaved(false), 2400);
    if (n) sakhi.whisper(`Namaste, ${n}. I'll remember — on this device.`, { ms: 4000 });
  }

  return (
    <div className={s.wrap}>
      {checkout && (
        <div className={s.checkout} id="checkout-note" role="status">
          <span className={s.checkoutSeal} aria-hidden>
            🙏
          </span>
          <div>
            <h2 className={s.checkoutTitle}>Thank you for choosing Prem Marg</h2>
            <p>
              If your payment completed, your receipt is on its way by email. Your report follows by email with a private link as soon as it is prepared — nothing more is needed from you
              unless we write to ask.
            </p>
          </div>
          <button type="button" className={s.dismiss} onClick={() => setCheckout(false)} aria-label="Dismiss this message">
            ×
          </button>
        </div>
      )}

      <p className={`note ${s.localNote}`} data-sakhi="Everything here stays in this browser. When passwordless sign-in arrives, you'll be able to carry it across devices.">
        <span>
          <strong>Saved only on this device.</strong> Passwordless sign-in arrives at launch.
        </span>
      </p>

      {cleared && totalItems === 0 && (
        <p className={s.cleared} role="status">
          All cleared. My Prem Marg is empty on this device.
        </p>
      )}

      <div className={s.grid}>
        {/* ── Birth profiles ── */}
        <Panel id="profiles" eyebrow="DRISHTI" title="Birth profiles" count={profiles.length} sakhiLine="Profiles you save from the DRISHTI snapshot appear here — open one to see your chart again.">
          {profiles.length === 0 ? (
            <Empty
              glyph="दृ"
              action={
                <Link className="link-arrow" href="/drishti#snapshot">
                  Get your free snapshot
                </Link>
              }
            >
              No birth profiles yet. Save one from your free DRISHTI snapshot and it will wait for you here.
            </Empty>
          ) : (
            <ul className={s.list}>
              {profiles.map((p) => (
                <li key={p.id} className={s.item}>
                  <div className={s.itemMain}>
                    <h3 className={s.itemTitle}>{p.name || "Unnamed profile"}</h3>
                    <p className={s.itemMeta}>
                      {fmtDate(p.date)} · {p.time ?? "time unknown"} · {p.place}
                    </p>
                    {p.summary && (
                      <dl className={s.chips}>
                        {p.summary.lagna && (
                          <div data-sakhi="Lagna — the rising sign at your birth. It colours how you meet the world.">
                            <dt>Lagna</dt>
                            <dd>{p.summary.lagna}</dd>
                          </div>
                        )}
                        <div data-sakhi="Your Moon sign — the nature of your mind and feelings.">
                          <dt>Moon</dt>
                          <dd>{p.summary.moon}</dd>
                        </div>
                        <div data-sakhi="Your birth Nakshatra — the lunar mansion the Moon stood in when you were born.">
                          <dt>Nakshatra</dt>
                          <dd>{p.summary.nakshatra}</dd>
                        </div>
                        <div data-sakhi="Your Mahadasha — the long life period you were in when this profile was saved.">
                          <dt>Mahadasha</dt>
                          <dd>{p.summary.mahadasha}</dd>
                        </div>
                      </dl>
                    )}
                  </div>
                  <div className={s.itemActions}>
                    <Link className="btn btn--sm btn--forest" href={`/drishti?profile=${encodeURIComponent(p.id)}`}>
                      Open in DRISHTI
                    </Link>
                    <button type="button" className={s.remove} onClick={() => onRemoveProfile(p)} aria-label={`Remove ${p.name || "profile"}`}>
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        {/* ── Homes ── */}
        <Panel id="homes" eyebrow="ANK · VASTU" title="Saved homes" count={homes.length} sakhiLine="Homes you save from ANK or the Vastu studio gather here — number, root and findings.">
          {homes.length === 0 ? (
            <Empty
              glyph="गृ"
              action={
                <div className="row">
                  <Link className="link-arrow" href="/ank">
                    Home number
                  </Link>
                  <Link className="link-arrow" href="/vastu">
                    Vastu studio
                  </Link>
                </div>
              }
            >
              No homes saved yet. Check a house number in ANK or open the Vastu studio to save one.
            </Empty>
          ) : (
            <ul className={s.list}>
              {homes.map((h) => {
                const meaning = h.root ? HOME_MEANING[h.root] : undefined;
                return (
                  <li key={h.id} className={s.item}>
                    <div className={s.itemMain}>
                      <div className={s.homeHead}>
                        {h.root != null && (
                          <span className={s.homeRoot} data-sakhi={`Root ${h.root}${meaning ? ` — ${meaning.title}.` : "."} A tendency of the home, never a verdict.`}>
                            {h.root}
                          </span>
                        )}
                        <div>
                          <h3 className={s.itemTitle}>{h.label || "My home"}</h3>
                          <p className={s.itemMeta}>
                            {h.number ? `No. ${h.number}` : "No number saved"}
                            {h.root != null ? ` · root ${h.root}` : ""}
                            {meaning ? ` · ${meaning.title}` : ""}
                          </p>
                        </div>
                      </div>
                      {h.vastu && (
                        <div className={s.vastu} data-sakhi="Your Vastu preview: what to look at first, what's gentle, and what already supports you.">
                          <span className="badge badge--beta">Vastu · Beta</span>
                          <span className={s.vPriority}>{h.vastu.priority} priority</span>
                          <span className={s.vGentle}>{h.vastu.gentle} gentle</span>
                          <span className={s.vStrength}>{h.vastu.strengths} strengths</span>
                        </div>
                      )}
                    </div>
                    <div className={s.itemActions}>
                      <Link className="btn btn--sm btn--ghost" href="/ank">
                        ANK
                      </Link>
                      <Link className="btn btn--sm btn--ghost" href="/vastu">
                        Vastu
                      </Link>
                      <button type="button" className={s.remove} onClick={() => onRemoveHome(h)} aria-label={`Remove ${h.label || "home"}`}>
                        Remove
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* ── Reports ── */}
        <Panel id="reports" eyebrow="Reports" title="Your reports" sakhiLine="After a purchase, each report arrives by email with a private link — and appears here once sign-in is live.">
          <Empty
            glyph="प"
            action={
              <Link className="link-arrow" href="/drishti#tiers">
                See DRISHTI reports
              </Link>
            }
          >
            Reports appear here after purchase. Each one is delivered by email with a private, secure link — never a public page.
          </Empty>
        </Panel>

        {/* ── Subscriptions ── */}
        <Panel id="subscriptions" eyebrow="Membership" title="Subscriptions" sakhiLine="Copper, Gold and Platinum open at launch — prices are set fairly, after real usage is measured.">
          <Empty
            glyph="स"
            action={
              <Link className="link-arrow" href="/membership">
                Explore Copper, Gold &amp; Platinum
              </Link>
            }
          >
            No subscriptions yet. Membership opens at launch — the daily wisdom stays free either way.
          </Empty>
        </Panel>

        {/* ── Daily wisdom ── */}
        <Panel id="wisdom" eyebrow="Gita · Katha" title="Daily Wisdom history" count={wisdomDays.length} wide sakhiLine="Every verse and story you've read, day by day. A quiet record of your practice.">
          <div className={s.wisdomTop}>
            <div className={s.lampSummary}>
              <span className={s.lampCount} data-sakhi="Lamps you've lit in all — no streaks, no pressure. Each one is a day you paused.">
                {lamps.length}
              </span>
              <span className={s.lampLabel}>
                lamp{lamps.length === 1 ? "" : "s"} lit in all
                <br />
                <span className="muted small">The garland of seven is at the top of this page.</span>
              </span>
            </div>
          </div>
          {wisdomDays.length === 0 ? (
            <Empty
              glyph="गी"
              action={
                <div className="row">
                  <Link className="link-arrow" href="/gita">
                    Today&rsquo;s verse
                  </Link>
                  <Link className="link-arrow" href="/katha">
                    Today&rsquo;s story
                  </Link>
                </div>
              }
            >
              Nothing read yet on this device. Today&rsquo;s verse and story are waiting.
            </Empty>
          ) : (
            <ol className={s.timeline}>
              {wisdomDays.slice(0, 30).map(([day, v]) => {
                const verse = v.gita ? gitaById(v.gita) : undefined;
                const katha = v.katha ? kathaBySlug(v.katha) : undefined;
                return (
                  <li key={day} className={s.tlDay}>
                    <time className={s.tlDate} dateTime={day}>
                      {fmtDate(day, { day: "numeric", month: "short" })}
                      <span>{fmtDate(day, { weekday: "short" })}</span>
                    </time>
                    <div className={s.tlItems}>
                      {v.gita && (
                        <Link className={s.tlItem} href={`/gita/${v.gita.replace(".", "-")}`}>
                          <span className={s.tlKind}>Gita</span>
                          <span className={s.tlText}>
                            Bhagavad Gita {v.gita}
                            {verse ? <span className="muted"> · {verse.chapterName}</span> : null}
                          </span>
                        </Link>
                      )}
                      {v.katha && (
                        <Link className={s.tlItem} href={`/katha/${v.katha}`}>
                          <span className={`${s.tlKind} ${s.tlKatha}`}>Katha</span>
                          <span className={s.tlText}>{katha?.title ?? v.katha}</span>
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </Panel>

        {/* ── Gurukul ── */}
        <Panel id="gurukul" eyebrow="Gurukul" title="Learning paths" count={gurukulTopics.length} sakhiLine="Each Gurukul topic has seven days of practice. Tick them off on the topic page — gently, at your own pace.">
          {gurukulTopics.length === 0 ? (
            <Empty
              glyph="गु"
              action={
                <Link className="link-arrow" href="/gurukul">
                  Enter Gurukul
                </Link>
              }
            >
              No practice days marked yet. Each topic is a seven-day path — anger, ego, comparison, duty and more.
            </Empty>
          ) : (
            <ul className={s.paths}>
              {gurukulTopics.map(([slug, days]) => {
                const topic = gurukulBySlug(slug);
                const total = topic?.practice.length || 7;
                const done = Math.min(days.length, total);
                return (
                  <li key={slug}>
                    <Link href={`/gurukul/${slug}`} className={s.path}>
                      <span className={`${s.pathSanskrit} sanskrit`} lang="sa" aria-hidden>
                        {topic?.sanskrit ?? "॰"}
                      </span>
                      <span className={s.pathBody}>
                        <span className={s.pathTitle}>{topic?.title ?? slug}</span>
                        <span className={s.beads} aria-label={`${done} of ${total} practice days`}>
                          {Array.from({ length: total }, (_, i) => (
                            <span key={i} className={days.includes(i + 1) ? s.beadOn : s.bead} />
                          ))}
                        </span>
                      </span>
                      <span className={s.pathCount}>
                        {done}/{total}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        {/* ── Sakhi prefs ── */}
        <Panel id="sakhi-prefs" eyebrow="Sakhi" title="How Sakhi keeps you company" sakhiLine="You decide how present I am. I'll respect it everywhere on Prem Marg.">
          <div className={s.prefs}>
            <div className={s.prefsMark}>
              <SakhiMark size={64} mood={prefs.whispers ? "attentive" : "resting"} />
            </div>
            <Switch
              label="Voice"
              hint="Sakhi reads Sanskrit and replies aloud."
              checked={prefs.voice}
              onChange={(v) => {
                setSakhiPrefs({ voice: v });
                sakhi.whisper(v ? "Voice is on. I'll speak softly." : "Voice is off. I'll keep to words on the screen.", { ms: 3500 });
              }}
            />
            <Switch
              label="Whispers"
              hint="Small notes when you linger on something meaningful."
              checked={prefs.whispers}
              onChange={(v) => {
                setSakhiPrefs({ whispers: v });
                if (v) window.setTimeout(() => sakhi.whisper("Whispers are back. I'll only speak when you linger.", { ms: 3500 }), 50);
              }}
            />
            <form className={s.nameForm} onSubmit={saveName}>
              <div className="field">
                <label htmlFor="sakhi-name">What should Sakhi call you?</label>
                <div className={s.nameRow}>
                  <input id="sakhi-name" className="input" value={name} maxLength={40} autoComplete="given-name" placeholder="Your first name (optional)" onChange={(e) => setName(e.target.value)} />
                  <button type="submit" className="btn btn--sm btn--forest">
                    {nameSaved ? "Saved ✓" : "Save"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Panel>

        {/* ── Privacy ── */}
        <Panel id="privacy" eyebrow="Privacy" title="Your data, your choice" wide sakhiLine="Your birth details and homes are personal. Take a copy, or clear them — it's always your choice.">
          <div className={s.privacy}>
            <p className={s.privacyText}>
              Birth details and floor-plan findings are sensitive. On this device they live only in your browser&rsquo;s storage — nothing on this page is sent to our servers. Download a copy
              any time, or clear everything.
            </p>
            <div className={s.privacyActions}>
              <button type="button" className="btn btn--ghost" onClick={exportData}>
                Export my data (JSON)
              </button>
              {!confirming ? (
                <button type="button" className={`btn btn--ghost ${s.danger}`} onClick={() => setConfirming(true)} disabled={totalItems === 0 && !prefs.name}>
                  Delete everything
                </button>
              ) : (
                <div className={s.confirm} role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-desc">
                  <p id="confirm-title" className={s.confirmTitle}>
                    Delete everything on this device?
                  </p>
                  <p id="confirm-desc" className="small">
                    Profiles, homes, wisdom history, lamps, Gurukul progress and Sakhi preferences will be removed. This cannot be undone.
                  </p>
                  <div className="row">
                    <button ref={confirmRef} type="button" className={`btn btn--sm ${s.dangerSolid}`} onClick={deleteAll}>
                      Yes, delete all
                    </button>
                    <button type="button" className="btn btn--sm btn--ghost" onClick={() => setConfirming(false)}>
                      Keep my data
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
