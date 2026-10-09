"use client";

import { useEffect, useId, useRef } from "react";
import type { Mood } from "@/lib/sakhi/types";
import { BINDU, CORE, EYE_CENTER, FLAME, FLAME_INNER_SCALE, IRIS, PETALS, RING, VIEWBOX, barbs, gradients } from "./geometry";

/* ───────────── Shared gaze field: one pointer listener for every Sakhi on the page ───────────── */

type Pt = { x: number; y: number };
let pointer: Pt | null = null;
let pointerAt = 0;
let lookTarget: Pt | null = null;
let gazeListeners = 0;

function onPointer(e: PointerEvent) {
  pointer = { x: e.clientX, y: e.clientY };
  pointerAt = performance.now();
}

/** Ask every Sakhi on the page to look at a point (viewport coords), or null to release. */
export function setLookTarget(pt: Pt | null) {
  lookTarget = pt;
}

const BARBS = barbs();

export interface SakhiMarkProps {
  size?: number | string;
  mood?: Mood;
  /** Follow the pointer (default), look at a fixed viewport point, or stay centred. */
  gaze?: "pointer" | "center";
  barbs?: boolean;
  className?: string;
  title?: string;
  decorative?: boolean;
}

export default function SakhiMark({
  size = 64,
  mood = "idle",
  gaze = "pointer",
  barbs: withBarbs,
  className = "",
  title = "Sakhi",
  decorative = false,
}: SakhiMarkProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const gazeRef = useRef<SVGGElement>(null);
  const irisRef = useRef<SVGGElement>(null);
  const showBarbs = withBarbs ?? (typeof size === "number" ? size >= 88 : true);

  // Gaze + idle wander, animated only while visible.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || gaze === "center") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (gazeListeners++ === 0) window.addEventListener("pointermove", onPointer, { passive: true });

    let raf = 0;
    let visible = true;
    let cx = 0;
    let cy = 0;
    let wander: Pt = { x: 0, y: 0 };
    let nextWander = performance.now() + 2500;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(svg);

    function tick(now: number) {
      raf = 0;
      if (!visible || !svg) return;
      const r = svg.getBoundingClientRect();
      const ox = r.left + r.width / 2;
      const oy = r.top + r.height * (EYE_CENTER.y / 240);
      let tx = 0;
      let ty = 0;
      const target = lookTarget ?? (pointer && now - pointerAt < 4000 ? pointer : null);
      if (target) {
        const dx = target.x - ox;
        const dy = target.y - oy;
        const d = Math.hypot(dx, dy) || 1;
        const reach = Math.min(1, d / 260);
        tx = (dx / d) * 9 * reach;
        ty = (dy / d) * 10 * reach;
      } else if (!reduce) {
        if (now > nextWander) {
          wander = Math.random() < 0.35 ? { x: 0, y: 0 } : { x: (Math.random() - 0.5) * 12, y: (Math.random() - 0.5) * 9 };
          nextWander = now + 1800 + Math.random() * 3200;
        }
        tx = wander.x;
        ty = wander.y;
      }
      const k = reduce ? 1 : 0.085;
      cx += (tx - cx) * k;
      cy += (ty - cy) * k;
      gazeRef.current?.setAttribute("transform", `translate(${cx.toFixed(2)} ${cy.toFixed(2)})`);
      irisRef.current?.setAttribute("transform", `translate(${(cx * 0.35).toFixed(2)} ${(cy * 0.35).toFixed(2)})`);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      if (--gazeListeners === 0) window.removeEventListener("pointermove", onPointer);
    };
  }, [gaze]);

  // Natural blinking — irregular, sometimes twice.
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    let t: ReturnType<typeof setTimeout>;
    const blink = () => {
      svg.classList.add("is-blink");
      setTimeout(() => svg.classList.remove("is-blink"), 150);
    };
    const schedule = () => {
      t = setTimeout(() => {
        blink();
        if (Math.random() < 0.18) setTimeout(blink, 320);
        schedule();
      }, 2400 + Math.random() * 4200);
    };
    schedule();
    return () => clearTimeout(t);
  }, []);

  const p = (id: string) => `${uid}-${id}`;
  const inner = `translate(${EYE_CENTER.x} 150) scale(${FLAME_INNER_SCALE}) translate(-${EYE_CENTER.x} -150)`;

  return (
    <svg
      ref={svgRef}
      viewBox={VIEWBOX}
      width={size}
      height={size}
      className={`sakhi-mark mood-${mood} ${className}`}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
    >
      <defs>
        {gradients("color").map((g) =>
          g.kind === "linear" ? (
            <linearGradient key={g.id} id={p(g.id)} {...g.attrs}>
              {g.stops.map(([o, c]) => (
                <stop key={o} offset={o} stopColor={c} />
              ))}
            </linearGradient>
          ) : (
            <radialGradient key={g.id} id={p(g.id)} {...g.attrs}>
              {g.stops.map(([o, c]) => (
                <stop key={o} offset={o} stopColor={c} />
              ))}
            </radialGradient>
          ),
        )}
        <clipPath id={p("clip")}>
          <path d={FLAME} transform={inner} />
        </clipPath>
      </defs>

      <g className="sk-body">
        {/* Jyoti */}
        <path className="sk-flame" d={FLAME} fill={`url(#${p("gold")})`} />
        <path d={FLAME} fill={`url(#${p("forest")})`} transform={inner} />
        {showBarbs && (
          <g className="sk-barbs" stroke={`url(#${p("gold")})`} strokeWidth=".9" strokeLinecap="round" fill="none" clipPath={`url(#${p("clip")})`}>
            {BARBS.map((d) => (
              <path key={d} d={d} />
            ))}
          </g>
        )}

        {/* Thinking orbit */}
        <ellipse className="sk-orbit" cx={EYE_CENTER.x} cy={EYE_CENTER.y} rx={RING.rx + 9} ry={RING.ry + 9} fill="none" stroke="#F3CF63" strokeWidth="1.6" strokeDasharray="2 9" strokeLinecap="round" />

        {/* Listening ripples */}
        <g className="sk-ripples" fill="none" stroke="#F3CF63" strokeWidth="1.4">
          <ellipse cx={EYE_CENTER.x} cy={EYE_CENTER.y} rx={RING.rx} ry={RING.ry} />
          <ellipse cx={EYE_CENTER.x} cy={EYE_CENTER.y} rx={RING.rx} ry={RING.ry} />
          <ellipse cx={EYE_CENTER.x} cy={EYE_CENTER.y} rx={RING.rx} ry={RING.ry} />
        </g>

        {/* Drishti — the eye */}
        <g ref={irisRef}>
          <g className="sk-blink">
            <g className="sk-iris">
              <ellipse cx={EYE_CENTER.x} cy={EYE_CENTER.y} rx={RING.rx} ry={RING.ry} fill={`url(#${p("goldsoft")})`} />
              <ellipse cx={EYE_CENTER.x} cy={EYE_CENTER.y} rx={IRIS.rx} ry={IRIS.ry} fill={`url(#${p("teal")})`} />
              <g ref={gazeRef}>
                <path d={CORE} fill={`url(#${p("sapphire")})`} stroke="#C9952F" strokeWidth="1.6" />
                <circle className="sk-bindu" cx={BINDU.x} cy={BINDU.y} r={BINDU.r} fill={`url(#${p("bindu")})`} />
                <circle cx={BINDU.x - 2.4} cy={BINDU.y - 2.6} r="2.1" fill="#FFFBEA" />
              </g>
              <ellipse cx="105" cy="126" rx="9" ry="5" fill="#FFFFFF" opacity=".22" transform="rotate(-35 105 126)" />
            </g>
          </g>
        </g>

        {/* Kamala — the lotus seat */}
        <g stroke="#0B3B27" strokeWidth="1.8" strokeLinejoin="round">
          {PETALS.map((pt, i) => (
            <path key={i} className={`sk-petal sk-petal-${i}`} d={pt.d} fill={`url(#${p(pt.fill === "soft" ? "goldsoft" : "gold")})`} />
          ))}
        </g>
      </g>
    </svg>
  );
}
