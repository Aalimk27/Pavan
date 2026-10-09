"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { GRAHA_SANSKRIT, type DashaPeriod } from "@/lib/astro/engine";
import { DASHA_THEME } from "@/lib/content/drishti";
import { GRAHA_TONE, YEAR_MS, antardashasOf, fmtDate, fmtYear } from "./wheel";
import styles from "./dasha.module.css";

const SPAN_YEARS = 120;

export default function DashaBand({
  birth,
  moonLongitude,
  timeline,
  now,
  current,
}: {
  birth: Date;
  moonLongitude: number;
  timeline: DashaPeriod[];
  now: Date;
  current: DashaPeriod;
}) {
  const t0 = birth.getTime();
  const t1 = t0 + SPAN_YEARS * YEAR_MS;
  const scrollRef = useRef<HTMLDivElement>(null);
  const nowRef = useRef<HTMLDivElement>(null);

  const segs = useMemo(
    () =>
      timeline
        .filter((p) => p.end.getTime() > t0 && p.start.getTime() < t1)
        .map((p) => {
          const s = Math.max(p.start.getTime(), t0);
          const e = Math.min(p.end.getTime(), t1);
          return { p, left: ((s - t0) / (t1 - t0)) * 100, width: ((e - s) / (t1 - t0)) * 100, partial: p.start.getTime() < t0 };
        }),
    [timeline, t0, t1],
  );

  const currentIdx = segs.findIndex((x) => x.p.start.getTime() === current.start.getTime());
  const [sel, setSel] = useState(Math.max(0, currentIdx));
  const selected = segs[sel]?.p ?? current;
  const isCurrent = sel === currentIdx;
  const nowPct = ((now.getTime() - t0) / (t1 - t0)) * 100;
  const age = Math.floor((now.getTime() - t0) / YEAR_MS);
  const antars = useMemo(() => antardashasOf(birth, moonLongitude, selected), [birth, moonLongitude, selected]);
  const ageAt = (d: Date) => Math.max(0, Math.floor((d.getTime() - t0) / YEAR_MS));

  // On narrow screens the band scrolls — bring "you are here" into view.
  useEffect(() => {
    const sc = scrollRef.current;
    const mk = nowRef.current;
    if (!sc || !mk || sc.scrollWidth <= sc.clientWidth) return;
    sc.scrollLeft = mk.offsetLeft - sc.clientWidth / 2;
  }, []);

  return (
    <div className={styles.wrap}>
      <div className={styles.scroller} ref={scrollRef}>
        <div className={styles.track} id="dasha-band">
          <div className={styles.band} role="group" aria-label="Vimshottari mahadashas across 120 years from birth">
            {segs.map((x, i) => (
              <button
                key={`${x.p.lord}-${x.p.start.getTime()}`}
                type="button"
                className={`${styles.seg} ${i === sel ? styles.isSel : ""} ${i === currentIdx ? styles.isNow : ""} ${i === currentIdx + 1 ? styles.isNext : ""}`}
                style={{ left: `${x.left}%`, width: `${x.width}%`, ["--tone" as string]: GRAHA_TONE[x.p.lord] }}
                aria-pressed={i === sel}
                aria-label={`${x.p.lord} Mahadasha, ${fmtYear(x.p.start)} to ${fmtYear(x.p.end)}${i === currentIdx ? " — you are here" : ""}`}
                data-sakhi={`${x.p.lord} (${GRAHA_SANSKRIT[x.p.lord]}) — a chapter of ${DASHA_THEME[x.p.lord].theme}.`}
                onClick={() => setSel(i)}
              >
                {x.width > 3.2 && (
                  <span className={styles.segLabel}>
                    <span className={styles.segName}>{x.p.lord}</span>
                    {x.width > 7 && <span className={styles.segYears}>{x.partial ? `to ${fmtYear(x.p.end)}` : fmtYear(x.p.start)}</span>}
                  </span>
                )}
              </button>
            ))}
          </div>

          {nowPct >= 0 && nowPct <= 100 && (
            <div className={styles.now} style={{ left: `${nowPct}%` }} ref={nowRef} aria-hidden>
              <span className={styles.nowLine} />
              <span className={styles.nowDot} />
              <span className={styles.nowLabel}>You are here · age {age}</span>
            </div>
          )}

          <div className={styles.axis} aria-hidden>
            {Array.from({ length: SPAN_YEARS / 10 + 1 }, (_, i) => (
              <span key={i} style={{ left: `${(i * 10 * 100) / SPAN_YEARS}%` }}>
                {i === 0 ? "Birth" : i * 10}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.detail} aria-live="polite" style={{ ["--tone" as string]: GRAHA_TONE[selected.lord] }}>
        <div className={styles.detailHead}>
          <span className={styles.swatch} aria-hidden />
          <div>
            <p className={styles.detailKicker}>
              {isCurrent ? "Your current chapter" : sel < currentIdx ? "A chapter behind you" : "A chapter ahead"} · age {ageAt(selected.start)}–{ageAt(selected.end)}
            </p>
            <p className={styles.detailTitle}>
              {selected.lord} <span className={styles.dim}>({GRAHA_SANSKRIT[selected.lord]})</span> Mahadasha
            </p>
            <p className={styles.detailDates}>
              {fmtDate(selected.start)} – {fmtDate(selected.end)}
              {selected.start.getTime() < t0 && " · began before birth; you were born into its final stretch"}
            </p>
          </div>
        </div>
        <p className={styles.detailTheme}>
          A chapter of <strong>{DASHA_THEME[selected.lord].theme}</strong>. {DASHA_THEME[selected.lord].cultivate}
        </p>

        {antars.length > 0 && (
          <div className={styles.antar}>
            <p className={styles.antarKicker}>Antardashas within it</p>
            <div className={styles.antarBand}>
              {antars.map((a) => {
                const w = ((a.end.getTime() - a.start.getTime()) / (selected.end.getTime() - selected.start.getTime())) * 100;
                const live = now >= a.start && now < a.end;
                return (
                  <span
                    key={a.start.getTime()}
                    className={`${styles.antarSeg} ${live ? styles.antarNow : ""}`}
                    style={{ width: `${w}%`, ["--tone" as string]: GRAHA_TONE[a.lord] }}
                    title={`${a.lord}: ${fmtDate(a.start)} – ${fmtDate(a.end)}`}
                  >
                    <span className={styles.visuallyHidden}>
                      {a.lord} antardasha, {fmtDate(a.start)} to {fmtDate(a.end)}
                      {live ? " — now" : ""}
                    </span>
                  </span>
                );
              })}
            </div>
            <ol className={styles.antarList}>
              {antars.map((a) => {
                const live = now >= a.start && now < a.end;
                return (
                  <li key={a.start.getTime()} className={live ? styles.antarLive : undefined} style={{ ["--tone" as string]: GRAHA_TONE[a.lord] }}>
                    <span className={styles.antarDot} aria-hidden />
                    <span className={styles.antarName}>{a.lord}</span>
                    <span className={styles.antarDate}>until {fmtDate(a.end)}</span>
                    {live && <span className={styles.antarHere}>now</span>}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
