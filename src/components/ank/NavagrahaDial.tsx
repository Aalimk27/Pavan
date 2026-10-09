"use client";

import { useEffect, useRef, useState } from "react";
import { PERSONAL_MEANING } from "@/lib/ank";
import { sakhi } from "@/components/sakhi/bus";
import { DEVANAGARI_DIGIT, NUMBERS, grahaLabel, planetOf } from "./ank-data";
import s from "./dial.module.css";

const R = 41; // node orbit radius, % of the dial
const angleOf = (n: number) => ((n - 1) * 40 - 90) * (Math.PI / 180);
/** Rounded so server and client render identical attribute strings. */
const rd = (v: number) => Math.round(v * 1000) / 1000;
const pos = (n: number, r = R) => ({ x: rd(50 + r * Math.cos(angleOf(n))), y: rd(50 + r * Math.sin(angleOf(n))) });

/** 108 ticks — a mala's count — around the rim; every twelfth is long. */
const TICKS = Array.from({ length: 108 }, (_, i) => {
  const a = (i / 108) * Math.PI * 2;
  const long = i % 12 === 0;
  const r1 = long ? 46.2 : 47.2;
  return { long, x1: rd(50 + r1 * Math.cos(a)), y1: rd(50 + r1 * Math.sin(a)), x2: rd(50 + 48.4 * Math.cos(a)), y2: rd(50 + 48.4 * Math.sin(a)) };
});

/** The nine-pointed star {9/4}: every node joined to the one four steps on. */
const STAR = NUMBERS.map((_, i) => {
  const n = ((i * 4) % 9) + 1;
  const p = pos(n, R);
  return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
}).join(" ");

/**
 * The Navagraha dial — the nine numbers around their grahas.
 * Hover, focus or tap a number and it lights, its graha and meaning appear at the centre.
 * While nobody is touching it, the light walks slowly around the circle (not with reduced motion).
 */
export default function NavagrahaDial() {
  const [active, setActive] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const [walk, setWalk] = useState<number | null>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (touched) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let n = 0;
    timer.current = window.setInterval(() => {
      n = (n % 9) + 1;
      setWalk(n);
    }, 2200);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [touched]);

  const engage = (n: number) => {
    if (!touched) setTouched(true);
    setWalk(null);
    setActive(n);
  };

  const lit = active ?? walk;
  const meaning = lit ? PERSONAL_MEANING[lit] : null;
  const planet = lit ? planetOf(lit) : null;

  return (
    <div className={s.wrap}>
      <div className={s.dial} onMouseLeave={() => setActive(null)} data-lit={lit ?? undefined}>
        <svg className={s.svg} viewBox="0 0 100 100" aria-hidden focusable="false">
          <defs>
            <radialGradient id="ank-dial-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(243,207,99,0.28)" />
              <stop offset="60%" stopColor="rgba(243,207,99,0.04)" />
              <stop offset="100%" stopColor="rgba(243,207,99,0)" />
            </radialGradient>
            <linearGradient id="ank-dial-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff1b8" />
              <stop offset="45%" stopColor="#f0c95a" />
              <stop offset="100%" stopColor="#a97a22" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="49" fill="url(#ank-dial-glow)" />
          <g className={s.ticks}>
            {TICKS.map((k, i) => (
              <line key={i} x1={k.x1} y1={k.y1} x2={k.x2} y2={k.y2} stroke="rgba(236,196,97,0.5)" strokeWidth={k.long ? 0.35 : 0.18} />
            ))}
          </g>
          <circle cx="50" cy="50" r="48.6" fill="none" stroke="rgba(236,196,97,0.35)" strokeWidth="0.2" />
          <circle cx="50" cy="50" r={R} fill="none" stroke="rgba(236,196,97,0.22)" strokeWidth="0.25" strokeDasharray="0.6 1.2" />
          <polygon points={STAR} fill="none" stroke="rgba(236,196,97,0.18)" strokeWidth="0.22" />
          <circle cx="50" cy="50" r="22" fill="rgba(3,20,12,0.55)" stroke="url(#ank-dial-gold)" strokeWidth="0.35" />
          <circle cx="50" cy="50" r="20.4" fill="none" stroke="rgba(236,196,97,0.25)" strokeWidth="0.15" />
          {NUMBERS.map((n) => {
            const p = pos(n, R - 6.5);
            const q = pos(n, 22.4);
            return <line key={n} className={s.spoke} data-on={lit === n || undefined} x1={q.x} y1={q.y} x2={p.x} y2={p.y} />;
          })}
        </svg>

        <ul className={s.nodes} aria-label="The nine numbers and their grahas">
          {NUMBERS.map((n) => {
            const p = pos(n);
            const pl = planetOf(n);
            const m = PERSONAL_MEANING[n];
            return (
              <li key={n} className={s.nodeItem} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                <button
                  type="button"
                  className={s.node}
                  data-on={lit === n || undefined}
                  aria-pressed={active === n}
                  aria-label={`${n} — ${grahaLabel(n)}: ${m.title}`}
                  onMouseEnter={() => engage(n)}
                  onFocus={() => engage(n)}
                  onClick={() => {
                    engage(n);
                    sakhi.mood("attentive", 1400);
                  }}
                  data-sakhi={`${n} belongs to ${grahaLabel(n, " — ")}. ${m.essence} ${m.title}: strengths and watch-outs, never good or bad.`}
                >
                  <span className={s.nodeNum}>{n}</span>
                  <span className={s.nodePlanet}>{pl.graha}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className={s.center} aria-live={touched ? "polite" : "off"}>
          {lit && meaning && planet ? (
            <div key={lit} className={s.centerIn}>
              <span className={`${s.centerDeva} sanskrit`} aria-hidden>
                {DEVANAGARI_DIGIT[lit]}
              </span>
              <span className={s.centerGraha}>
                {grahaLabel(lit)}
              </span>
              <span className={s.centerTitle}>{meaning.title}</span>
            </div>
          ) : (
            <div className={s.centerIn}>
              <span className={`${s.centerDeva} sanskrit`} aria-hidden>
                अंक
              </span>
              <span className={s.centerGraha}>Nine numbers</span>
              <span className={s.centerTitle}>nine grahas</span>
            </div>
          )}
        </div>
      </div>

      <p className={s.caption}>
        {lit && meaning ? (
          <>
            <strong>{lit}</strong> — {meaning.essence}{" "}
            <a href={`#home-${lit}`} className={s.captionLink}>
              House number {lit} →
            </a>
          </>
        ) : (
          <>Hover, focus or tap a number to light its graha.</>
        )}
      </p>
    </div>
  );
}
