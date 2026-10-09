/**
 * Rashi Chakra geometry + live-sky helpers for DRISHTI.
 * Every position here is produced by the deterministic engine (@/lib/astro/engine);
 * this file only turns longitudes into drawing coordinates.
 */

import {
  deltaT,
  julianDay,
  lahiriAyanamsa,
  moonNow,
  norm360,
  sunLongitude,
  tithiNow,
  vimshottari,
  zodiacPoint,
  type DashaPeriod,
  type Graha,
  type ZodiacPoint,
} from "@/lib/astro/engine";

/** Wheel centre in SVG user units. The viewBox is -60 -60 1120 1120. */
export const C = 500;
export const VIEWBOX = "-60 -60 1120 1120";

export const R = {
  orbit: 516, // the Moon travels outside the wheel
  tickOut: 484,
  out: 470, // outer edge of the rashi band
  rashiIn: 380, // rashi band → nakshatra band
  nakIn: 312,
  beads: 290, // 108 padas
  sunOrbit: 256,
  hub: 222,
} as const;

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Longitude → point. 0° Mesha sits at the top; the zodiac runs counter-clockwise. */
export function polar(r: number, lon: number) {
  const a = ((-90 - lon) * Math.PI) / 180;
  return { x: r2(C + r * Math.cos(a)), y: r2(C + r * Math.sin(a)) };
}

/** Annular sector from lon0 to lon1 (lon1 > lon0, span < 180°). */
export function sector(r0: number, r1: number, lon0: number, lon1: number): string {
  const a = polar(r1, lon0);
  const b = polar(r1, lon1);
  const c = polar(r0, lon1);
  const d = polar(r0, lon0);
  return `M${a.x} ${a.y}A${r1} ${r1} 0 0 0 ${b.x} ${b.y}L${c.x} ${c.y}A${r0} ${r0} 0 0 1 ${d.x} ${d.y}Z`;
}

/** Rotation (degrees) that keeps a label tangent to the ring, flipped in the lower half for legibility. */
export function tangentRotation(lon: number): number {
  const l = norm360(lon);
  const rot = -l;
  return l > 90 && l < 270 ? rot + 180 : rot;
}

export const RASHI_DEVANAGARI = ["मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या", "तुला", "वृश्चिक", "धनु", "मकर", "कुम्भ", "मीन"] as const;

export const NAK_SPAN = 360 / 27;

/** A nakshatra's span in exact arc-minutes (13°20′ = 800′), formatted against its rashi. */
export function nakshatraSpan(index: number): string {
  const fmt = (min: number, end: boolean) => {
    let r = Math.floor(min / 1800);
    if (end && min % 1800 === 0) r -= 1;
    const within = min - r * 1800;
    const d = Math.floor(within / 60);
    const m = within % 60;
    return { r, text: `${d}°${String(m).padStart(2, "0")}′` };
  };
  const s = fmt(index * 800, false);
  const e = fmt((index + 1) * 800, true);
  return `${s.text} ${RASHI_NAMES[s.r]} – ${e.text} ${RASHI_NAMES[e.r]}`;
}

const RASHI_NAMES = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];

/**
 * Lit part of a Moon disc of radius `rad`, centred on 0,0, with the bright limb on +x.
 * Elongation (Moon − Sun) sets the phase: 0° new, 180° full.
 */
export function moonLitPath(rad: number, elongation: number): string {
  const k = Math.cos((elongation * Math.PI) / 180);
  const rx = r2(Math.abs(rad * k));
  const sweep = k > 0 ? 0 : 1;
  return `M0 ${-rad}A${rad} ${rad} 0 0 1 0 ${rad}A${rx} ${rad} 0 0 ${sweep} 0 ${-rad}Z`;
}

/** Illuminated fraction of the Moon, 0–1. */
export const illumination = (elongation: number) => (1 - Math.cos((elongation * Math.PI) / 180)) / 2;

/** Sidereal Sun at an instant — straight from the engine's Meeus + Lahiri functions. */
export function sunSidereal(at: Date): ZodiacPoint {
  const jdUT = julianDay(at);
  const jdTT = jdUT + deltaT(at.getUTCFullYear()) / 86400;
  return zodiacPoint(sunLongitude(jdTT) - lahiriAyanamsa(jdTT));
}

export interface LiveSky {
  at: Date;
  moon: ZodiacPoint;
  sun: ZodiacPoint;
  tithi: ReturnType<typeof tithiNow>;
  elongation: number;
}

export function skyAt(at: Date): LiveSky {
  const moon = moonNow(at);
  const sun = sunSidereal(at);
  return { at, moon, sun, tithi: tithiNow(at), elongation: norm360(moon.longitude - sun.longitude) };
}

/** Traditional graha colours, tuned to the Prem Marg palette. */
export const GRAHA_TONE: Record<Graha, string> = {
  Sun: "#e8833a",
  Moon: "#e9dec4",
  Mars: "#c4553b",
  Mercury: "#2f9a6a",
  Jupiter: "#ecc461",
  Venus: "#e7a1ad",
  Saturn: "#3f5fbf",
  Rahu: "#0e7c86",
  Ketu: "#9a86b0",
};

/** All nine antardashas of a mahadasha — each one read from the engine itself. */
export function antardashasOf(birth: Date, moonLongitude: number, maha: DashaPeriod): DashaPeriod[] {
  const out: DashaPeriod[] = [];
  let t = maha.start.getTime() + 1000;
  for (let i = 0; i < 9 && t < maha.end.getTime(); i++) {
    const st = vimshottari(birth, moonLongitude, new Date(t));
    if (st.mahadasha.lord !== maha.lord) break;
    const a = st.antardasha;
    if (out.length && a.start.getTime() <= out[out.length - 1].start.getTime()) break;
    out.push(a);
    t = a.end.getTime() + 1000;
  }
  return out;
}

export const fmtDate = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
export const fmtYear = (d: Date) => String(d.getFullYear());

export const YEAR_MS = 365.25 * 86400000;
