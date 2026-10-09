"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ZONE_INFO, type Finding, type PlacedRoom, type Severity, type VastuAnalysis } from "@/lib/vastu/engine";
import { saveHome } from "@/lib/store";
import { sakhi } from "@/components/sakhi/bus";
import { DIR16_NAME, REMEDY_LEVELS, ROOM_ASK, SEVERITY_META, SEVERITY_ORDER } from "./studio-data";
import s from "./studio.module.css";

const CONFIDENCE: Record<Finding["confidence"], { label: string; sakhi: string }> = {
  high: { label: "High confidence", sakhi: "High confidence: the pin sits well inside one zone of the boundary you confirmed." },
  medium: {
    label: "Medium confidence",
    sakhi: "Medium confidence: the pin sits close to the line between two zones — a small shift in North or the pin could change it.",
  },
  low: { label: "Low confidence", sakhi: "Low confidence: the pin sits outside the boundary you confirmed, so its zone is only an estimate." },
};

export interface FindingsPanelProps {
  analysis: VastuAnalysis | null;
  measuring: boolean;
  names: Record<string, string>;
  rooms: PlacedRoom[];
  north: number;
  corners: number;
  planKind: "sample" | "upload";
  focusId: string | null;
  onFocus: (id: string | null) => void;
  onAdjust: () => void;
  onRestart: () => void;
}

export default function FindingsPanel({ analysis, measuring, names, rooms, north, corners, planKind, focusId, onFocus, onAdjust, onRestart }: FindingsPanelProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState(planKind === "sample" ? "Sample home · 3 BHK" : "My home");
  const [saved, setSaved] = useState<string | null>(null);

  /* When a pin is tapped on the plan, bring its finding into view inside the panel (never jumps the page). */
  useEffect(() => {
    if (!focusId || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-finding="${CSS.escape(focusId)}"]`);
    const scroller = listRef.current.closest<HTMLElement>("[data-scroll]");
    if (!el || !scroller || scroller.scrollHeight <= scroller.clientHeight + 4) return;
    const top = el.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop - 24;
    scroller.scrollTo({ top, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }, [focusId]);

  if (measuring || !analysis) {
    return (
      <section className={s.pane} aria-labelledby="pane-measuring" aria-busy="true">
        <p className={s.paneKicker}>Step 5 of 5</p>
        <h3 id="pane-measuring">Measuring your home…</h3>
        <ul className={s.measureList}>
          <li>Finding the Brahmasthan from {corners} corners</li>
          <li>Turning the 16-direction wheel to {north}°</li>
          <li>Laying the 3 × 3 Vastu Purusha mandala</li>
          <li>Reading {rooms.length} confirmed labels against the traditional table</li>
        </ul>
      </section>
    );
  }

  const { summary, findings, version } = analysis;
  const groups = SEVERITY_ORDER.map((sev) => ({ sev, items: findings.filter((f) => f.severity === sev) })).filter((g) => g.items.length);
  const counts: Record<Severity, number> = { priority: summary.priority, gentle: summary.gentle, info: summary.info, strength: summary.strengths };

  const save = (e: FormEvent) => {
    e.preventDefault();
    const name = label.trim() || "My home";
    saveHome({ label: name, vastu: { priority: summary.priority, gentle: summary.gentle, strengths: summary.strengths, savedAt: new Date().toISOString() } });
    setSaved(name);
    sakhi.celebrate(`“${name}” is saved in My Prem Marg — on this device only.`);
  };

  const evidence = (f: Finding) =>
    f.id.startsWith("cut-")
      ? `The ${ZONE_INFO[f.zone].name} cell of the mandala grid, measured against your confirmed boundary`
      : f.zone === "C"
        ? `The ${names[f.id] ?? f.subject} pin, inside the central (Brahmasthan) cell`
        : `The ${names[f.id] ?? f.subject} pin, ${f.zone16 ? DIR16_NAME[f.zone16] : ZONE_INFO[f.zone].name} of the Brahmasthan`;

  return (
    <section className={`${s.pane} ${s.findingsPane}`} aria-labelledby="pane-findings">
      <p className={s.paneKicker}>Step 5 of 5 · Preview findings</p>
      <h3 id="pane-findings">What your home says</h3>
      <p className={s.paneText}>
        Every finding below is tied to something you confirmed — a pin, or a corner of the boundary. Tap one to light it up on the plan.
      </p>

      <div className={s.summary} role="list" aria-label="Summary">
        {SEVERITY_ORDER.map((sev) => (
          <a
            key={sev}
            role="listitem"
            href={`#group-${sev}`}
            className={`${s.sumChip} ${counts[sev] ? "" : s.sumZero}`}
            style={{ ["--sev" as string]: SEVERITY_META[sev].colour }}
            data-sakhi={SEVERITY_META[sev].sakhi}
          >
            <span className={s.sumNum}>{counts[sev]}</span>
            <span className={s.sumLabel}>{sev === "strength" ? "Strengths" : SEVERITY_META[sev].label}</span>
          </a>
        ))}
      </div>

      <div className={s.findList} ref={listRef}>
        {groups.map((g) => (
          <div key={g.sev} id={`group-${g.sev}`} className={s.group} style={{ ["--sev" as string]: SEVERITY_META[g.sev].colour }}>
            <h4 className={s.groupHead}>
              <span className={s.groupDot} aria-hidden />
              {SEVERITY_META[g.sev].group}
              <span className={s.groupCount}>{g.items.length}</span>
            </h4>
            <ul className={s.groupList}>
              {g.items.map((f) => {
                const on = focusId === f.id;
                const sev = SEVERITY_META[f.severity];
                return (
                  <li key={f.id} id={`finding-${f.id}`} data-finding={f.id} className={`${s.find} ${on ? s.findOn : ""}`} style={{ ["--sev" as string]: sev.colour }}>
                    <button type="button" className={s.findHead} aria-expanded={on} onClick={() => onFocus(on ? null : f.id)}>
                      <span className={s.findSev}>{sev.label}</span>
                      <span className={s.findTitle}>{names[f.id] ?? f.subject}</span>
                      <span className={s.findZone}>
                        {ZONE_INFO[f.zone].name}
                        {f.zone16 && f.zone16 !== f.zone ? ` · ${f.zone16}` : ""}
                      </span>
                      <span className={s.findChevron} aria-hidden>
                        ⌄
                      </span>
                    </button>
                    <p className={s.findMsg}>{f.message}</p>
                    {on && (
                      <div className={s.findBody}>
                        <dl className={s.findMeta}>
                          <div>
                            <dt>Rule</dt>
                            <dd>{f.rule}</dd>
                          </div>
                          <div>
                            <dt>Confidence</dt>
                            <dd>
                              <span className={`${s.conf} ${s[`conf_${f.confidence}`]}`} data-sakhi={CONFIDENCE[f.confidence].sakhi}>
                                {CONFIDENCE[f.confidence].label}
                              </span>
                            </dd>
                          </div>
                          <div>
                            <dt>Evidence</dt>
                            <dd>{evidence(f)}</dd>
                          </div>
                          <div>
                            <dt>Zone</dt>
                            <dd>
                              {ZONE_INFO[f.zone].deity} · {ZONE_INFO[f.zone].element}
                            </dd>
                          </div>
                        </dl>
                        {f.remedies.length > 0 && (
                          <ol className={s.ladder} aria-label="Remedies, simplest first">
                            {f.remedies.map((r) => {
                              const lvl = REMEDY_LEVELS.find((l) => l.level === r.level);
                              return (
                                <li key={r.level} className={r.level === "renovation" ? s.ladderLast : ""}>
                                  <span className={s.ladderN} aria-hidden>
                                    {lvl?.n}
                                  </span>
                                  <span>
                                    <strong>{lvl?.name}</strong>
                                    {r.text}
                                  </span>
                                </li>
                              );
                            })}
                          </ol>
                        )}
                        {!f.id.startsWith("cut-") && (
                          <button
                            type="button"
                            className={s.askBtn}
                            onClick={() => {
                              const room = rooms.find((r) => r.id === f.id);
                              sakhi.open(room ? ROOM_ASK[room.type] : undefined);
                            }}
                          >
                            Ask Sakhi why →
                          </button>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <p className={`note ${s.noteTight}`}>Structural changes require a qualified architect or engineer. Begin with habit and layout — most guidance needs no renovation at all.</p>

      <form className={s.saveForm} onSubmit={save} aria-labelledby="save-home-title">
        <p id="save-home-title" className={s.saveTitle}>
          Keep this home in My Prem Marg
        </p>
        {saved ? (
          <p className={s.saved} role="status">
            ✓ Saved as “{saved}” on this device. <Link href="/my">Open My Prem Marg →</Link>
          </p>
        ) : (
          <div className={s.saveRow}>
            <label htmlFor="vastu-home-label" className="visually-hidden">
              Name this home
            </label>
            <input id="vastu-home-label" className="input" value={label} maxLength={60} onChange={(e) => setLabel(e.target.value)} placeholder="Name this home" />
            <button type="submit" className="btn btn--forest btn--sm">
              Save home
            </button>
          </div>
        )}
        <p className={s.fine}>Only the summary counts are saved, in this browser. Your plan image is never stored.</p>
      </form>

      <div className={s.paneFoot}>
        <button type="button" className="btn btn--ghost btn--sm" onClick={onAdjust}>
          Adjust labels
        </button>
        <button type="button" className={s.textBtn} onClick={onRestart}>
          Try another plan
        </button>
        <span className={s.version} data-sakhi="The traditional rule table is frozen and versioned, so the same confirmed plan always gives the same findings.">
          {version} · Beta
        </span>
      </div>
    </section>
  );
}
