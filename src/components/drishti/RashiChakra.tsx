"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { GRAHA_SANSKRIT, NAKSHATRAS, RASHIS, norm360, type ZodiacPoint } from "@/lib/astro/engine";
import { NAKSHATRA_ESSENCE, RASHI_NATURE } from "@/lib/content/drishti";
import { C, NAK_SPAN, R, RASHI_DEVANAGARI, VIEWBOX, moonLitPath, nakshatraSpan, polar, sector, tangentRotation } from "./wheel";
import styles from "./chakra.module.css";

export interface HubContent {
  kicker: string;
  title: string;
  deva?: string;
  lines: ReactNode[];
}

/* ───────── Static geometry, computed once ───────── */

const RASHI_SEGS = RASHIS.map((r) => {
  const mid = r.index * 30 + 15;
  const nature = RASHI_NATURE[r.name];
  return {
    r,
    d: sector(R.rashiIn, R.out, r.index * 30, r.index * 30 + 30),
    deva: polar(436, mid),
    latin: polar(400, mid),
    rot: tangentRotation(mid),
    sakhi: `${r.name} (${r.english}) — ${nature.mind}. Its gift: ${nature.gift}.`,
  };
});

const NAK_SEGS = NAKSHATRAS.map((n) => {
  const mid = n.index * NAK_SPAN + NAK_SPAN / 2;
  return {
    n,
    d: sector(R.nakIn, R.rashiIn, n.index * NAK_SPAN, (n.index + 1) * NAK_SPAN),
    num: polar(348, mid),
    rot: tangentRotation(mid),
    span: nakshatraSpan(n.index),
    sakhi: `${n.name} — ${NAKSHATRA_ESSENCE[n.name]}. Its deity is ${n.deity}; its lord, ${n.lord}.`,
  };
});

const TICKS = Array.from({ length: 360 }, (_, i) => {
  const len = i % 30 === 0 ? 24 : i % 5 === 0 ? 14 : 7;
  return { a: polar(R.out, i), b: polar(R.out + len, i), major: i % 5 === 0 };
});

const PADA_TICKS = Array.from({ length: 108 }, (_, i) => ({ a: polar(R.nakIn, i * (NAK_SPAN / 4)), b: polar(R.nakIn + (i % 4 === 0 ? 0 : 9), i * (NAK_SPAN / 4)), edge: i % 4 === 0 }));
const BEADS = Array.from({ length: 108 }, (_, i) => polar(R.beads, i * (NAK_SPAN / 4) + NAK_SPAN / 8));
const PETALS = Array.from({ length: 12 }, (_, i) => i * 30 + 15);

type Focus = { ring: "rashi" | "nak"; i: number } | null;

export interface ChakraProps {
  /** Unique prefix for SVG ids. */
  id: string;
  label: string;
  moon?: ZodiacPoint | null;
  sun?: ZodiacPoint | null;
  lagna?: ZodiacPoint | null;
  rotating?: boolean;
  /** Hub content when nothing is hovered. */
  hub: HubContent | null;
  className?: string;
}

export default function RashiChakra({ id, label, moon, sun, lagna, rotating = false, hub, className = "" }: ChakraProps) {
  const [focus, setFocus] = useState<Focus>(null);
  const rashiRefs = useRef<(SVGPathElement | null)[]>([]);
  const nakRefs = useRef<(SVGPathElement | null)[]>([]);

  const moonRashi = moon?.rashi.index ?? -1;
  const moonNak = moon?.nakshatra.index ?? -1;
  const lagnaRashi = lagna?.rashi.index ?? -1;
  const moonPada = moon ? moon.nakshatra.index * 4 + (moon.pada - 1) : -1;
  const rashiTab = moonRashi >= 0 ? moonRashi : 0;
  const nakTab = moonNak >= 0 ? moonNak : 0;

  const onRingKey = (ring: "rashi" | "nak") => (e: KeyboardEvent<SVGGElement>) => {
    const refs = ring === "rashi" ? rashiRefs.current : nakRefs.current;
    const n = refs.length;
    const cur = refs.findIndex((el) => el === document.activeElement);
    if (cur < 0) return;
    let next = cur;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (cur + 1) % n;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (cur - 1 + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    refs[next]?.focus();
  };

  // Hub: what the visitor is looking at, or the default reading.
  let shown: HubContent | null = hub;
  if (focus?.ring === "rashi") {
    const r = RASHIS[focus.i];
    shown = {
      kicker: `Rashi ${focus.i + 1} of 12`,
      title: r.name,
      deva: RASHI_DEVANAGARI[focus.i],
      lines: [`${r.english} · ${r.element}`, `Lord · ${r.lord}${GRAHA_SANSKRIT[r.lord] !== r.lord ? ` (${GRAHA_SANSKRIT[r.lord]})` : ""}`],
    };
  } else if (focus?.ring === "nak") {
    const n = NAKSHATRAS[focus.i];
    shown = {
      kicker: `Nakshatra ${focus.i + 1} of 27`,
      title: n.name,
      lines: [`Deity · ${n.deity}`, `Lord · ${n.lord}`, NAK_SEGS[focus.i].span],
    };
  }

  // Moon & Sun markers
  const moonPt = moon ? polar(R.orbit, moon.longitude) : null;
  const sunPt = sun ? polar(R.sunOrbit, sun.longitude) : null;
  const elong = moon && sun ? norm360(moon.longitude - sun.longitude) : 180;
  let moonRot = 0;
  if (moonPt && sun) {
    const toward = polar(R.orbit, sun.longitude);
    moonRot = (Math.atan2(toward.y - moonPt.y, toward.x - moonPt.x) * 180) / Math.PI;
  }
  const lagnaTip = lagna ? polar(R.out + 4, lagna.longitude) : null;
  const lagnaL = lagna ? polar(R.out + 40, lagna.longitude - 3.2) : null;
  const lagnaR = lagna ? polar(R.out + 40, lagna.longitude + 3.2) : null;
  const lagnaLabel = lagna ? polar(R.orbit + 18, lagna.longitude) : null;

  return (
    <div className={`${styles.wrap} ${rotating ? styles.isRotating : ""} ${className}`}>
      <svg className={styles.svg} viewBox={VIEWBOX} role="group" aria-label={label}>
        <defs>
          <radialGradient id={`${id}-moonglow`}>
            <stop offset="0" stopColor="#fff6d8" stopOpacity="0.95" />
            <stop offset="0.35" stopColor="#f4d98b" stopOpacity="0.45" />
            <stop offset="1" stopColor="#f4d98b" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-sunglow`}>
            <stop offset="0" stopColor="#ffd28a" stopOpacity="0.9" />
            <stop offset="1" stopColor="#e8833a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${id}-field`}>
            <stop offset="0.55" stopColor="#0b3b27" stopOpacity="0" />
            <stop offset="1" stopColor="#ecc461" stopOpacity="0.07" />
          </radialGradient>
          <linearGradient id={`${id}-ray`} gradientUnits="userSpaceOnUse" x1={C} y1={C} x2={moonPt?.x ?? C} y2={moonPt?.y ?? C}>
            <stop offset="0.35" stopColor="#f4d98b" stopOpacity="0" />
            <stop offset="1" stopColor="#f4d98b" stopOpacity="0.85" />
          </linearGradient>
        </defs>

        {/* field */}
        <circle cx={C} cy={C} r={R.out} fill={`url(#${id}-field)`} />
        <circle cx={C} cy={C} r={R.tickOut + 10} className={styles.hair} />
        <circle cx={C} cy={C} r={R.out} className={styles.hairStrong} />

        {/* degree ticks */}
        <g className={styles.ticks} aria-hidden>
          {TICKS.map((t, i) => (
            <line key={i} x1={t.a.x} y1={t.a.y} x2={t.b.x} y2={t.b.y} className={t.major ? styles.tickMajor : undefined} />
          ))}
        </g>

        {/* rashi ring */}
        <g role="list" aria-label="The twelve rashis" onKeyDown={onRingKey("rashi")}>
          {RASHI_SEGS.map((s, i) => (
            <path
              key={s.r.name}
              ref={(el) => {
                rashiRefs.current[i] = el;
              }}
              d={s.d}
              role="listitem"
              aria-label={`${s.r.name}, ${s.r.english} — ${s.r.element} sign ruled by ${s.r.lord}${i === moonRashi ? ". The Moon is here." : ""}`}
              tabIndex={i === rashiTab ? 0 : -1}
              data-sakhi={s.sakhi}
              className={`${styles.seg} ${styles.rashi} ${i % 2 ? styles.alt : ""} ${i === moonRashi ? styles.isMoon : ""} ${i === lagnaRashi ? styles.isLagna : ""} ${
                focus?.ring === "rashi" && focus.i === i ? styles.isFocus : ""
              }`}
              onPointerEnter={() => setFocus({ ring: "rashi", i })}
              onPointerLeave={() => setFocus(null)}
              onFocus={() => setFocus({ ring: "rashi", i })}
              onBlur={() => setFocus(null)}
            />
          ))}
        </g>
        <g className={styles.rashiText} aria-hidden>
          {RASHI_SEGS.map((s, i) => (
            <g key={s.r.name} className={i === moonRashi || (focus?.ring === "rashi" && focus.i === i) ? styles.textLit : undefined}>
              <text x={s.deva.x} y={s.deva.y} transform={`rotate(${s.rot} ${s.deva.x} ${s.deva.y})`} className={styles.deva}>
                {RASHI_DEVANAGARI[i]}
              </text>
              <text x={s.latin.x} y={s.latin.y} transform={`rotate(${s.rot} ${s.latin.x} ${s.latin.y})`} className={styles.latin}>
                {s.r.name.toUpperCase()}
              </text>
            </g>
          ))}
        </g>

        {/* nakshatra ring */}
        <g role="list" aria-label="The twenty-seven nakshatras" onKeyDown={onRingKey("nak")}>
          {NAK_SEGS.map((s, i) => (
            <path
              key={s.n.name}
              ref={(el) => {
                nakRefs.current[i] = el;
              }}
              d={s.d}
              role="listitem"
              aria-label={`${s.n.name}, nakshatra ${i + 1} — deity ${s.n.deity}, lord ${s.n.lord}${i === moonNak ? ". The Moon is here." : ""}`}
              tabIndex={i === nakTab ? 0 : -1}
              data-sakhi={s.sakhi}
              className={`${styles.seg} ${styles.nak} ${i === moonNak ? styles.isMoonNak : ""} ${focus?.ring === "nak" && focus.i === i ? styles.isFocus : ""}`}
              onPointerEnter={() => setFocus({ ring: "nak", i })}
              onPointerLeave={() => setFocus(null)}
              onFocus={() => setFocus({ ring: "nak", i })}
              onBlur={() => setFocus(null)}
            />
          ))}
        </g>
        <g aria-hidden>
          {PADA_TICKS.map((t, i) => (t.edge ? null : <line key={i} x1={t.a.x} y1={t.a.y} x2={t.b.x} y2={t.b.y} className={styles.pada} />))}
          {NAK_SEGS.map((s, i) => (
            <text
              key={s.n.name}
              x={s.num.x}
              y={s.num.y}
              transform={`rotate(${s.rot} ${s.num.x} ${s.num.y})`}
              className={`${styles.num} ${i === moonNak || (focus?.ring === "nak" && focus.i === i) ? styles.textLit : ""}`}
            >
              {i + 1}
            </text>
          ))}
        </g>

        {/* inner sanctum: 108 beads, one per pada; lotus petals */}
        <g aria-hidden>
          <circle cx={C} cy={C} r={R.nakIn} className={styles.hairStrong} />
          {BEADS.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={i === moonPada ? 6 : i % 4 === 0 ? 2.6 : 1.8} className={i === moonPada ? styles.beadLit : styles.bead} />
          ))}
          {PETALS.map((lon) => {
            const tip = polar(R.beads - 22, lon);
            const l = polar(R.hub + 8, lon - 11);
            const r = polar(R.hub + 8, lon + 11);
            const cl = polar(R.beads - 40, lon - 9);
            const cr = polar(R.beads - 40, lon + 9);
            return <path key={lon} d={`M${l.x} ${l.y}Q${cl.x} ${cl.y} ${tip.x} ${tip.y}Q${cr.x} ${cr.y} ${r.x} ${r.y}`} className={styles.petal} />;
          })}
          <circle cx={C} cy={C} r={R.hub} className={styles.hubRing} />
          <circle cx={C} cy={C} r={R.hub - 10} className={styles.hair} />
        </g>

        {/* Lagna — the rising sign */}
        {lagna && lagnaTip && lagnaL && lagnaR && lagnaLabel && (
          <g className={styles.lagna} aria-hidden>
            <line x1={C} y1={C} x2={lagnaTip.x} y2={lagnaTip.y} className={styles.lagnaRay} />
            <path d={`M${lagnaTip.x} ${lagnaTip.y}L${lagnaL.x} ${lagnaL.y}L${lagnaR.x} ${lagnaR.y}Z`} />
            <text x={lagnaLabel.x} y={lagnaLabel.y} transform={`rotate(${tangentRotation(lagna.longitude)} ${lagnaLabel.x} ${lagnaLabel.y})`} className={styles.lagnaText}>
              LAGNA
            </text>
          </g>
        )}

        {/* Sun on its inner orbit */}
        {sunPt && (
          <g transform={`translate(${sunPt.x} ${sunPt.y})`} className={styles.sun} aria-hidden>
            <circle r="34" fill={`url(#${id}-sunglow)`} />
            {Array.from({ length: 8 }, (_, i) => (
              <line key={i} x1="0" y1="-15" x2="0" y2="-21" transform={`rotate(${i * 45})`} />
            ))}
            <circle r="10" className={styles.sunDisc} />
          </g>
        )}

        {/* The Moon — real position, real phase */}
        {moon && moonPt && (
          <g aria-hidden>
            <line x1={C} y1={C} x2={moonPt.x} y2={moonPt.y} stroke={`url(#${id}-ray)`} strokeWidth="1.6" />
            <g transform={`translate(${moonPt.x} ${moonPt.y})`}>
              <circle r="44" fill={`url(#${id}-moonglow)`} className={styles.moonGlow} />
              <g transform={`rotate(${moonRot.toFixed(2)})`}>
                <circle r="17" className={styles.moonDark} />
                <path d={moonLitPath(17, elong)} className={styles.moonLit} />
              </g>
              <circle r="17" className={styles.moonRim} />
            </g>
          </g>
        )}
      </svg>

      {shown && (
        <div className={styles.hub} aria-hidden>
          <div className={styles.hubKicker}>{shown.kicker}</div>
          {shown.deva && <div className={`${styles.hubDeva} sanskrit`}>{shown.deva}</div>}
          <div className={styles.hubTitle}>{shown.title}</div>
          {shown.lines.map((l, i) => (
            <div key={i} className={styles.hubLine}>
              {l}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
