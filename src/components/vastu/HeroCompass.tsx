import { DIR16, ZONE_INFO } from "@/lib/vastu/engine";
import s from "./sections.module.css";

/**
 * The hero motif: a drafting-table compass laid over blueprint paper — the
 * 16-direction wheel, the 3 × 3 Vastu Purusha mandala and the Brahmasthan bindu.
 * Pure SVG + CSS; the needle swings and settles on North.
 */
const C = 260;
const R = 220;

const pt = (r: number, deg: number) => {
  const t = (deg * Math.PI) / 180;
  return { x: C + r * Math.sin(t), y: C - r * Math.cos(t) };
};

const MANDALA = [
  ["NW", "N", "NE"],
  ["W", "C", "E"],
  ["SW", "S", "SE"],
] as const;

export default function HeroCompass() {
  const cell = 76;
  const g0 = C - cell * 1.5;
  return (
    <div className={s.compassWrap} aria-hidden>
      <div className={s.paperSheet}>
        <svg viewBox="0 0 520 520" className={s.compass}>
          <defs>
            <radialGradient id="hc-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#ecc461" stopOpacity="0.55" />
              <stop offset="1" stopColor="#ecc461" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="hc-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#fff1b8" />
              <stop offset="0.45" stopColor="#f0c95a" />
              <stop offset="1" stopColor="#a97a22" />
            </linearGradient>
          </defs>

          {/* mandala grid */}
          <g className={s.hcGrid}>
            {MANDALA.map((row, r) =>
              row.map((z, c) => (
                <g key={z}>
                  <rect x={g0 + c * cell} y={g0 + r * cell} width={cell} height={cell} className={z === "C" ? s.hcCentre : s.hcCell} />
                  <text x={g0 + c * cell + cell / 2} y={g0 + r * cell + cell / 2 + 4} textAnchor="middle" className={s.hcCellText}>
                    {z === "C" ? "ब्रह्म" : z}
                  </text>
                </g>
              )),
            )}
          </g>

          {/* 16 rays */}
          <g className={s.hcRays}>
            {DIR16.map((d, i) => {
              const p = pt(R - 26, i * 22.5);
              return <line key={d} x1={C} y1={C} x2={p.x} y2={p.y} className={i % 2 ? s.hcRay16 : s.hcRay8} />;
            })}
          </g>

          {/* rotating outer ring of ticks */}
          <g className={s.hcRing}>
            <circle cx={C} cy={C} r={R} className={s.hcRingLine} />
            <circle cx={C} cy={C} r={R - 18} className={s.hcRingThin} />
            {Array.from({ length: 72 }, (_, i) => {
              const a = i * 5;
              const long = a % 45 === 0;
              const p1 = pt(R, a);
              const p2 = pt(R - (long ? 18 : a % 15 === 0 ? 11 : 6), a);
              return <line key={a} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className={long ? s.hcTickLong : s.hcTick} />;
            })}
          </g>

          {/* direction letters */}
          {DIR16.map((d, i) => {
            const p = pt(R + 22, i * 22.5);
            return (
              <text key={d} x={p.x} y={p.y + 4} textAnchor="middle" className={d === "N" ? s.hcN : i % 2 ? s.hcLetterSoft : s.hcLetter}>
                {d}
              </text>
            );
          })}

          {/* needle */}
          <g className={s.hcNeedle}>
            <path d={`M ${C} ${C - 168} L ${C + 14} ${C} L ${C} ${C + 8} L ${C - 14} ${C} Z`} fill="url(#hc-gold)" stroke="#8a6420" strokeWidth="1" />
            <path d={`M ${C} ${C + 120} L ${C + 10} ${C} L ${C - 10} ${C} Z`} className={s.hcNeedleS} />
          </g>

          {/* Brahmasthan bindu */}
          <circle cx={C} cy={C} r={34} fill="url(#hc-glow)" className={s.hcGlow} />
          <circle cx={C} cy={C} r={8} className={s.hcCap} />
        </svg>
        <span className={s.paperCaption}>
          {ZONE_INFO.C.name} · {ZONE_INFO.C.deity}
        </span>
      </div>
    </div>
  );
}
