"use client";

import { useEffect, useId, useRef, useState } from "react";
import { BINDU, CORE, EYE_CENTER, FLAME, FLAME_INNER_SCALE, IRIS, PETALS, RING, barbs, gradients } from "@/components/sakhi/geometry";
import { sakhi } from "@/components/sakhi/bus";
import s from "./sakhi.module.css";

type PartKey = "jyoti" | "pankh" | "drishti" | "prem" | "bindu" | "kamala";

interface Part {
  key: PartKey;
  n: number;
  name: string;
  sanskrit: string;
  role: string;
  text: string;
  whisper: string;
  /** Anchor on the mark, in the mark's own 240×240 space. */
  anchor: { x: number; y: number };
  side: "left" | "right";
  /** Marker position on the compact (phone) drawing, if different from the anchor. */
  marker?: { x: number; y: number };
  /** Label line height in the 1000×600 drawing. */
  ly: number;
}

const PARTS: readonly Part[] = [
  {
    key: "jyoti",
    n: 1,
    name: "Jyoti",
    sanskrit: "ज्योति",
    role: "The flame",
    text: "The light of awareness — always on, never glaring. Her whole outline is a diya’s flame: she is here to help you see.",
    whisper: "Jyoti — the flame. It’s the light of awareness. I’m here to help you see, not to dazzle you.",
    anchor: { x: 120, y: 16 },
    side: "left",
    ly: 75,
  },
  {
    key: "pankh",
    n: 2,
    name: "Pankh",
    sanskrit: "पंख",
    role: "The feather barbs",
    text: "Fine golden strokes radiate from the eye like the barbs of a peacock feather — many threads of attention, all returning to the centre.",
    whisper: "These are my feather barbs — little threads of attention, and every one of them leads back to you.",
    anchor: { x: 158, y: 83 },
    side: "right",
    ly: 140,
  },
  {
    key: "drishti",
    n: 3,
    name: "Drishti",
    sanskrit: "दृष्टि",
    role: "The peacock-feather eye",
    text: "Shri Krishna’s mor-pankh. A gold ring around a peacock-blue iris — the eye that sees clearly, and without fear.",
    whisper: "Drishti — the eye of Shri Krishna’s mor-pankh. Seeing clearly, without fear. That is the whole of my job.",
    anchor: { x: 79, y: 148 },
    side: "left",
    ly: 330,
  },
  {
    key: "bindu",
    n: 4,
    name: "Bindu",
    sanskrit: "बिन्दु",
    role: "The gold point",
    text: "The point of focus. It follows you as you move — her attention is on you, not on selling to you.",
    whisper: "The Bindu is my point of focus. Move your pointer — it follows you.",
    anchor: { x: 128, y: 143 },
    marker: { x: 137, y: 132 },
    side: "right",
    ly: 330,
  },
  {
    key: "prem",
    n: 5,
    name: "Prem",
    sanskrit: "प्रेम",
    role: "The heart-shaped core",
    text: "Real peacock eyespots have heart-shaped centres. At the centre of her seeing is love — the Prem of Prem Marg.",
    whisper: "Real peacock eyespots have heart-shaped centres. So at the very centre of my eye, there is Prem — love.",
    anchor: { x: 133, y: 160 },
    marker: { x: 106, y: 160 },
    side: "right",
    ly: 500,
  },
  {
    key: "kamala",
    n: 6,
    name: "Kamala",
    sanskrit: "कमल",
    role: "The lotus seat",
    text: "Purity amid the world. The lotus grows from the mud and is not stained by it — guidance that stays grounded in real life.",
    whisper: "I sit on a lotus — Kamala. It grows from the mud and stays clean. Wisdom should live in real life, not above it.",
    anchor: { x: 64, y: 207 },
    side: "left",
    ly: 530,
  },
];

const BARBS = barbs();
const W = 1000;
const H = 600;
const SCALE = 2.2;
const OX = W / 2 - 120 * SCALE;
const OY = 40;
const toSvg = (p: { x: number; y: number }) => ({ x: OX + p.x * SCALE, y: OY + p.y * SCALE });

function leader(p: Part): string {
  const a = toSvg(p.anchor);
  const start = p.side === "left" ? 212 : 788;
  const elbow = p.side === "left" ? Math.min(300, a.x - 30) : Math.max(700, a.x + 30);
  if (Math.abs(a.y - p.ly) < 1) return `M${start} ${p.ly}H${a.x.toFixed(1)}`;
  return `M${start} ${p.ly}H${elbow}L${a.x.toFixed(1)} ${a.y.toFixed(1)}`;
}

/** The mark drawn part-by-part so each part can be lifted and lit. */
function MarkParts({ uid, active, onEnter, onLeave }: { uid: string; active: PartKey | null; onEnter: (k: PartKey) => void; onLeave: () => void }) {
  const id = (n: string) => `${uid}-${n}`;
  const inner = `translate(${EYE_CENTER.x} 150) scale(${FLAME_INNER_SCALE}) translate(-${EYE_CENTER.x} -150)`;
  const cls = (k: PartKey) => `${s.part} ${active === k ? s.partLit : active ? s.partDim : ""}`;
  const handlers = (k: PartKey) => ({ onPointerEnter: () => onEnter(k), onPointerLeave: onLeave });
  return (
    <>
      <defs>
        {gradients("color").map((g) =>
          g.kind === "linear" ? (
            <linearGradient key={g.id} id={id(g.id)} {...g.attrs}>
              {g.stops.map(([o, c]) => (
                <stop key={o} offset={o} stopColor={c} />
              ))}
            </linearGradient>
          ) : (
            <radialGradient key={g.id} id={id(g.id)} {...g.attrs}>
              {g.stops.map(([o, c]) => (
                <stop key={o} offset={o} stopColor={c} />
              ))}
            </radialGradient>
          ),
        )}
        <clipPath id={id("clip")}>
          <path d={FLAME} transform={inner} />
        </clipPath>
        <filter id={id("glow")} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feColorMatrix in="b" values="0 0 0 0 0.95  0 0 0 0 0.8  0 0 0 0 0.35  0 0 0 1 0" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g className={cls("jyoti")} {...handlers("jyoti")} filter={active === "jyoti" ? `url(#${id("glow")})` : undefined}>
        <path d={FLAME} fill={`url(#${id("gold")})`} />
        <path d={FLAME} fill={`url(#${id("forest")})`} transform={inner} />
      </g>
      <g className={cls("pankh")} {...handlers("pankh")}>
        <g stroke={`url(#${id("gold")})`} strokeWidth={active === "pankh" ? 1.6 : 0.9} strokeLinecap="round" fill="none" opacity={active === "pankh" ? 0.95 : 0.5} clipPath={`url(#${id("clip")})`}>
          {BARBS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
      <g className={cls("drishti")} {...handlers("drishti")}>
        <ellipse cx={EYE_CENTER.x} cy={EYE_CENTER.y} rx={RING.rx} ry={RING.ry} fill={`url(#${id("goldsoft")})`} />
        <ellipse cx={EYE_CENTER.x} cy={EYE_CENTER.y} rx={IRIS.rx} ry={IRIS.ry} fill={`url(#${id("teal")})`} />
        <ellipse cx="105" cy="126" rx="9" ry="5" fill="#FFFFFF" opacity=".22" transform="rotate(-35 105 126)" />
      </g>
      <g className={cls("prem")} {...handlers("prem")}>
        <path d={CORE} fill={`url(#${id("sapphire")})`} stroke="#C9952F" strokeWidth="1.6" />
      </g>
      <g className={cls("bindu")} {...handlers("bindu")} filter={active === "bindu" ? `url(#${id("glow")})` : undefined}>
        <circle cx={BINDU.x} cy={BINDU.y} r={BINDU.r} fill={`url(#${id("bindu")})`} />
        <circle cx={BINDU.x - 2.4} cy={BINDU.y - 2.6} r="2.1" fill="#FFFBEA" />
      </g>
      <g className={cls("kamala")} {...handlers("kamala")} stroke="#0B3B27" strokeWidth="1.8" strokeLinejoin="round">
        {PETALS.map((pt, i) => (
          <path key={i} d={pt.d} fill={`url(#${id(pt.fill === "soft" ? "goldsoft" : "gold")})`} />
        ))}
      </g>
    </>
  );
}

export default function SakhiAnatomy() {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const [active, setActive] = useState<PartKey | null>(null);
  const [touched, setTouched] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Until someone interacts, slowly walk through the parts — the drawing explains itself.
  useEffect(() => {
    if (touched) return;
    const el = rootRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = -1;
    let timer: ReturnType<typeof setInterval> | undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !timer) {
        timer = setInterval(() => {
          i = (i + 1) % PARTS.length;
          setActive(PARTS[i].key);
        }, 2600);
      } else if (!e.isIntersecting && timer) {
        clearInterval(timer);
        timer = undefined;
        setActive(null);
      }
    }, { threshold: 0.4 });
    io.observe(el);
    return () => {
      io.disconnect();
      if (timer) clearInterval(timer);
    };
  }, [touched]);

  const enter = (k: PartKey) => {
    setTouched(true);
    setActive(k);
  };
  const leave = () => setActive(null);
  const pick = (p: Part) => {
    setTouched(true);
    setActive(p.key);
    sakhi.mood("attentive", 1800);
    sakhi.whisper(p.whisper, { ms: 6000 });
  };

  const label = (p: Part, mobile = false) => (
    <button
      key={p.key}
      type="button"
      className={`${s.anLabel} ${mobile ? s.anLabelList : p.side === "left" ? s.anLeft : s.anRight} ${active === p.key ? s.anLabelOn : ""}`}
      style={mobile ? undefined : { top: `${(p.ly / H) * 100}%` }}
      onPointerEnter={() => enter(p.key)}
      onPointerLeave={leave}
      onFocus={() => enter(p.key)}
      onBlur={leave}
      onClick={() => pick(p)}
      aria-pressed={active === p.key}
    >
      <span className={s.anHead}>
        <span className={s.anNum} aria-hidden>
          {p.n}
        </span>
        <span className={s.anName}>{p.name}</span>
        <span className={`${s.anSk} sanskrit`} lang="sa">
          {p.sanskrit}
        </span>
      </span>
      <span className={s.anRole}>{p.role}</span>
      <span className={s.anText}>{p.text}</span>
    </button>
  );

  return (
    <div ref={rootRef} className={s.anatomy} data-active={active ?? undefined}>
      {/* Wide drawing with leader lines */}
      <div className={s.anWide}>
        <svg viewBox={`0 0 ${W} ${H}`} className={s.anSvg} role="img" aria-label="The Sakhi mark, annotated: Jyoti, Pankh, Drishti, Bindu, Prem and Kamala">
          <g className={s.anLines} aria-hidden>
            {PARTS.map((p) => {
              const a = toSvg(p.anchor);
              return (
                <g key={p.key} className={active === p.key ? s.anLineOn : active ? s.anLineDim : undefined}>
                  <path d={leader(p)} className={s.anLineHalo} />
                  <path d={leader(p)} className={s.anLine} />
                  <circle cx={a.x} cy={a.y} r="5" className={s.anDot} />
                </g>
              );
            })}
          </g>
          <g transform={`translate(${OX} ${OY}) scale(${SCALE})`}>
            <MarkParts uid={`${uid}w`} active={active} onEnter={enter} onLeave={leave} />
          </g>
          <g aria-hidden>
            {PARTS.map((p) => {
              const a = toSvg(p.anchor);
              return <circle key={p.key} cx={a.x} cy={a.y} r="3" className={s.anDotCore} />;
            })}
          </g>
        </svg>
        {PARTS.map((p) => label(p))}
      </div>

      {/* Compact drawing with numbered markers + list (phones) */}
      <div className={s.anCompact}>
        <svg viewBox="-12 -6 264 250" className={s.anSvgCompact} role="img" aria-label="The Sakhi mark with numbered parts">
          <MarkParts uid={`${uid}c`} active={active} onEnter={enter} onLeave={leave} />
          {PARTS.map((p) => (
            <g key={p.key} className={`${s.anMarker} ${active === p.key ? s.anMarkerOn : ""}`} aria-hidden>
              <circle cx={(p.marker ?? p.anchor).x} cy={(p.marker ?? p.anchor).y} r="8.5" />
              <text x={(p.marker ?? p.anchor).x} y={(p.marker ?? p.anchor).y + 3.6} textAnchor="middle">
                {p.n}
              </text>
            </g>
          ))}
        </svg>
        <div className={s.anList}>{PARTS.map((p) => label(p, true))}</div>
      </div>
    </div>
  );
}
