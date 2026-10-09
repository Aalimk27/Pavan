"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { GurukulSlug } from "@/lib/content/types";
import { usePremMarg } from "@/lib/store";
import { Diya } from "./Ornament";
import styles from "./marg.module.css";

export interface MargTopic {
  slug: GurukulSlug;
  title: string;
  sanskrit: string;
  sanskritRoman: string;
  tagline: string;
}

const N_DAYS = 7;
const STEP = 10; // SVG units between lamps

/** x position (0–100) of lamp i along the winding Marg. */
const xAt = (i: number) => 50 + 30 * Math.sin(i * 0.95 + 0.2);

/** Smooth Catmull-Rom curve through the lamp points, as an SVG path. */
function pathThrough(pts: [number, number][]): string {
  let d = `M ${pts[0][0]} ${pts[0][1] - STEP / 2} L ${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C ${c1[0].toFixed(2)} ${c1[1].toFixed(2)}, ${c2[0].toFixed(2)} ${c2[1].toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L ${last[0]} ${last[1] + STEP / 2}`;
}

/** GURUKUL — the thirteen topics as lamps along a winding path. */
export default function MargPath({ topics }: { topics: MargTopic[] }) {
  const progress = usePremMarg((s) => s.gurukul);
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const pts: [number, number][] = topics.map((_, i) => [xAt(i), i * STEP + STEP / 2]);
  const d = pathThrough(pts);
  const h = topics.length * STEP;

  const days = (slug: string) => progress[slug]?.length ?? 0;
  const started = topics.findIndex((t) => days(t.slug) > 0 && days(t.slug) < N_DAYS);
  const nextIdx = started >= 0 ? started : topics.findIndex((t) => days(t.slug) === 0);
  const anyProgress = topics.some((t) => days(t.slug) > 0);
  const totalDays = topics.reduce((a, t) => a + days(t.slug), 0);

  return (
    <div>
      <p className={styles.summary} aria-live="polite">
        {anyProgress ? (
          <>
            <strong>{totalDays}</strong> of {topics.length * N_DAYS} practice days kept on this device · the lamps glow as you practise
          </>
        ) : (
          <>Thirteen lamps, seven days each. Begin with whichever topic feels true today.</>
        )}
      </p>
      <div ref={ref} className={`${styles.marg} ${drawn ? styles.drawn : ""}`} style={{ ["--n" as string]: topics.length }}>
        <svg className={styles.road} viewBox={`0 0 100 ${h}`} preserveAspectRatio="none" aria-hidden focusable="false">
          <path d={d} className={styles.roadBed} vectorEffect="non-scaling-stroke" />
          <path d={d} className={styles.roadEdge} vectorEffect="non-scaling-stroke" />
          <path d={d} className={styles.roadLight} pathLength={1} vectorEffect="non-scaling-stroke" />
        </svg>

        <ol className={styles.lamps}>
          {topics.map((t, i) => {
            const n = days(t.slug);
            const glow = n / N_DAYS;
            const left = Math.sin(i * 0.95 + 0.2) >= 0; // label sits on the open side
            const isNext = i === nextIdx;
            return (
              <li
                key={t.slug}
                className={`${styles.stop} ${left ? styles.labelLeft : styles.labelRight} ${n ? styles.lit : ""} ${n >= N_DAYS ? styles.full : ""} ${isNext ? styles.next : ""}`}
                style={{ left: `${pts[i][0]}%`, top: `${(pts[i][1] / h) * 100}%`, ["--glow" as string]: glow, ["--x" as string]: pts[i][0].toFixed(1), ["--d" as string]: `${i * 90}ms` }}
              >
                <Link
                  href={`/gurukul/${t.slug}`}
                  className={styles.lampLink}
                  data-sakhi={`${t.sanskritRoman} — ${t.tagline}${n ? ` You've kept ${n} of 7 days.` : ""}`}
                >
                  <span className={styles.lamp}>
                    <svg className={styles.ring} viewBox="0 0 72 72" aria-hidden focusable="false">
                      <circle cx="36" cy="36" r="33" className={styles.ringTrack} />
                      <circle cx="36" cy="36" r="33" className={styles.ringFill} pathLength={1} style={{ strokeDashoffset: 1 - glow }} />
                    </svg>
                    <Diya glow={n ? 0.35 + 0.65 * glow : 0} className={styles.diya} />
                  </span>
                  <span className={styles.label}>
                    <span className={styles.num}>
                      {String(i + 1).padStart(2, "0")} · <span className="sanskrit">{t.sanskrit}</span>
                    </span>
                    <span className={styles.title}>{t.title}</span>
                    <span className={styles.tagline}>{t.tagline}</span>
                    <span className={styles.days}>
                      {n >= N_DAYS ? "All 7 days kept ✦" : n ? `${n} of 7 days` : isNext ? "Begin here" : "7-day practice"}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
