/**
 * DRISHTI deterministic snapshot engine.
 *
 * Architecture rule (blueprint §11): facts are generated deterministically.
 * No language model ever produces a position or a dasha date — they come from here.
 *
 * Algorithms: Jean Meeus, "Astronomical Algorithms" (2nd ed.)
 *   • Sun   — ch. 25 (low accuracy, ≈0.01°)
 *   • Moon  — ch. 47 (principal periodic terms, ≈0.01–0.03°)
 *   • Sidereal time, obliquity — ch. 12, 22
 * Zodiac: sidereal, Lahiri (Chitrapaksha) ayanamsa.
 * Dasha: Vimshottari, 365.25-day year.
 *
 * Snapshot conventions are frozen and versioned (CALC_VERSION) for reproducibility (§19).
 */

export const CALC_VERSION = "drishti-snapshot/1.0.0";

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;

export const norm360 = (x: number) => ((x % 360) + 360) % 360;
const sinD = (x: number) => Math.sin(x * D2R);
const cosD = (x: number) => Math.cos(x * D2R);
const tanD = (x: number) => Math.tan(x * D2R);

/* ────────────────────────────── Time ────────────────────────────── */

/** Julian Day (UT) from a JS Date (which is always UTC internally). */
export function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

export function dateFromJulianDay(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

/** ΔT = TT − UT in seconds (Espenak & Meeus polynomial fits). */
export function deltaT(year: number): number {
  if (year >= 2005 && year < 2050) {
    const t = year - 2000;
    return 62.92 + 0.32217 * t + 0.005589 * t * t;
  }
  if (year >= 1986 && year < 2005) {
    const t = year - 2000;
    return 63.86 + 0.3345 * t - 0.060374 * t ** 2 + 0.0017275 * t ** 3 + 0.000651814 * t ** 4 + 0.00002373599 * t ** 5;
  }
  if (year >= 1961 && year < 1986) {
    const t = year - 1975;
    return 45.45 + 1.067 * t - t ** 2 / 260 - t ** 3 / 718;
  }
  if (year >= 1941 && year < 1961) {
    const t = year - 1950;
    return 29.07 + 0.407 * t - t ** 2 / 233 + t ** 3 / 2547;
  }
  if (year >= 1920 && year < 1941) {
    const t = year - 1920;
    return 21.2 + 0.84493 * t - 0.0761 * t ** 2 + 0.0020936 * t ** 3;
  }
  if (year >= 1900 && year < 1920) {
    const t = year - 1900;
    return -2.79 + 1.494119 * t - 0.0598939 * t ** 2 + 0.0061966 * t ** 3 - 0.000197 * t ** 4;
  }
  if (year >= 2050 && year < 2150) {
    return -20 + 32 * ((year - 1820) / 100) ** 2 - 0.5628 * (2150 - year);
  }
  return 0;
}

const centuries = (jdTT: number) => (jdTT - 2451545.0) / 36525;

/* ────────────────────────────── Sun ────────────────────────────── */

/** Geometric tropical longitude of the Sun (mean equinox of date), degrees. */
export function sunLongitude(jdTT: number): number {
  const T = centuries(jdTT);
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sinD(M) +
    (0.019993 - 0.000101 * T) * sinD(2 * M) +
    0.000289 * sinD(3 * M);
  return norm360(L0 + C);
}

/* ────────────────────────────── Moon ────────────────────────────── */

// [D, M, M', F, Σl coefficient ×1e-6°] — Meeus Table 47.A (longitude terms)
const MOON_TERMS: ReadonlyArray<readonly [number, number, number, number, number]> = [
  [0, 0, 1, 0, 6288774],
  [2, 0, -1, 0, 1274027],
  [2, 0, 0, 0, 658314],
  [0, 0, 2, 0, 213618],
  [0, 1, 0, 0, -185116],
  [0, 0, 0, 2, -114332],
  [2, 0, -2, 0, 58793],
  [2, -1, -1, 0, 57066],
  [2, 0, 1, 0, 53322],
  [2, -1, 0, 0, 45758],
  [0, 1, -1, 0, -40923],
  [1, 0, 0, 0, -34720],
  [0, 1, 1, 0, -30383],
  [2, 0, 0, -2, 15327],
  [0, 0, 1, 2, -12528],
  [0, 0, 1, -2, 10980],
  [4, 0, -1, 0, 10675],
  [0, 0, 3, 0, 10034],
  [4, 0, -2, 0, 8548],
  [2, 1, -1, 0, -7888],
  [2, 1, 0, 0, -6766],
  [1, 0, -1, 0, -5163],
  [1, 1, 0, 0, 4987],
  [2, -1, 1, 0, 4036],
  [2, 0, 2, 0, 3994],
  [4, 0, 0, 0, 3861],
  [2, 0, -3, 0, 3665],
  [0, 1, -2, 0, -2689],
  [2, 0, -1, 2, -2602],
  [2, -1, -2, 0, 2390],
  [1, 0, 1, 0, -2348],
  [2, -2, 0, 0, 2236],
  [0, 1, 2, 0, -2120],
  [0, 2, 0, 0, -2069],
  [2, -2, -1, 0, 2048],
  [2, 0, 1, -2, -1773],
  [2, 0, 0, 2, -1595],
  [4, -1, -1, 0, 1215],
  [0, 0, 2, 2, -1110],
  [3, 0, -1, 0, -892],
  [2, 1, 1, 0, -810],
  [4, -1, -2, 0, 759],
  [0, 2, -1, 0, -713],
  [2, 2, -1, 0, -700],
  [2, 1, -2, 0, 691],
  [2, -1, 0, -2, 596],
  [4, 0, 1, 0, 549],
  [0, 0, 4, 0, 537],
  [4, -1, 0, 0, 521],
  [1, 0, -2, 0, -487],
  [2, 1, 0, -2, -399],
  [0, 0, 2, -2, -381],
  [1, 1, 1, 0, 351],
  [3, 0, -2, 0, -340],
  [4, 0, -3, 0, 330],
  [2, -1, 2, 0, 327],
  [0, 2, 1, 0, -323],
  [1, 1, -1, 0, 299],
  [2, 0, 3, 0, 294],
];

/** Geometric tropical longitude of the Moon (mean equinox of date), degrees. */
export function moonLongitude(jdTT: number): number {
  const T = centuries(jdTT);
  const Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T ** 2 + T ** 3 / 538841 - T ** 4 / 65194000;
  const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T ** 2 + T ** 3 / 545868 - T ** 4 / 113065000;
  const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T ** 2 + T ** 3 / 24490000;
  const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T ** 2 + T ** 3 / 69699 - T ** 4 / 14712000;
  const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T ** 2 - T ** 3 / 3526000 + T ** 4 / 863310000;
  const A1 = 119.75 + 131.849 * T;
  const A2 = 53.09 + 479264.29 * T;
  const E = 1 - 0.002516 * T - 0.0000074 * T * T;

  let sl = 0;
  for (const [d, m, mp, f, coeff] of MOON_TERMS) {
    let c = coeff;
    if (Math.abs(m) === 1) c *= E;
    else if (Math.abs(m) === 2) c *= E * E;
    sl += c * sinD(d * D + m * M + mp * Mp + f * F);
  }
  sl += 3958 * sinD(A1) + 1962 * sinD(Lp - F) + 318 * sinD(A2);
  return norm360(Lp + sl / 1e6);
}

/* ─────────────────────── Ayanamsa & sidereal time ─────────────────────── */

/** Lahiri ayanamsa (mean), degrees. 23.85709° at J2000 + general precession. */
export function lahiriAyanamsa(jdTT: number): number {
  const T = centuries(jdTT);
  return 23.85709 + 1.396971278 * T + 0.0003086 * T * T;
}

/** Mean obliquity of the ecliptic, degrees. */
export function obliquity(jdTT: number): number {
  const T = centuries(jdTT);
  return 23.4392911 - 0.0130042 * T - 1.64e-7 * T * T + 5.04e-7 * T ** 3;
}

/** Greenwich mean sidereal time in degrees (input: JD in UT). */
export function gmst(jdUT: number): number {
  const T = (jdUT - 2451545.0) / 36525;
  return norm360(280.46061837 + 360.98564736629 * (jdUT - 2451545.0) + 0.000387933 * T * T - T ** 3 / 38710000);
}

/**
 * Tropical ascendant (degrees). latitude north +, longitude east +.
 * λ_asc = atan2( cos θ, −(sin θ·cos ε + tan φ·sin ε) ), θ = local sidereal time.
 */
export function ascendant(jdUT: number, latitude: number, longitude: number): number {
  const jdTT = jdUT + deltaT(dateFromJulianDay(jdUT).getUTCFullYear()) / 86400;
  const theta = norm360(gmst(jdUT) + longitude);
  const eps = obliquity(jdTT);
  const y = cosD(theta);
  const x = -(sinD(theta) * cosD(eps) + tanD(latitude) * sinD(eps));
  return norm360(Math.atan2(y, x) * R2D);
}

/* ────────────────────────── Rashi & Nakshatra ────────────────────────── */

export interface Rashi {
  index: number; // 0–11
  name: string;
  english: string;
  lord: Graha;
  element: "Fire" | "Earth" | "Air" | "Water";
}

export type Graha = "Sun" | "Moon" | "Mars" | "Mercury" | "Jupiter" | "Venus" | "Saturn" | "Rahu" | "Ketu";

export const GRAHA_SANSKRIT: Record<Graha, string> = {
  Sun: "Surya",
  Moon: "Chandra",
  Mars: "Mangal",
  Mercury: "Budh",
  Jupiter: "Guru",
  Venus: "Shukra",
  Saturn: "Shani",
  Rahu: "Rahu",
  Ketu: "Ketu",
};

export const RASHIS: readonly Rashi[] = [
  { index: 0, name: "Mesha", english: "Aries", lord: "Mars", element: "Fire" },
  { index: 1, name: "Vrishabha", english: "Taurus", lord: "Venus", element: "Earth" },
  { index: 2, name: "Mithuna", english: "Gemini", lord: "Mercury", element: "Air" },
  { index: 3, name: "Karka", english: "Cancer", lord: "Moon", element: "Water" },
  { index: 4, name: "Simha", english: "Leo", lord: "Sun", element: "Fire" },
  { index: 5, name: "Kanya", english: "Virgo", lord: "Mercury", element: "Earth" },
  { index: 6, name: "Tula", english: "Libra", lord: "Venus", element: "Air" },
  { index: 7, name: "Vrishchika", english: "Scorpio", lord: "Mars", element: "Water" },
  { index: 8, name: "Dhanu", english: "Sagittarius", lord: "Jupiter", element: "Fire" },
  { index: 9, name: "Makara", english: "Capricorn", lord: "Saturn", element: "Earth" },
  { index: 10, name: "Kumbha", english: "Aquarius", lord: "Saturn", element: "Air" },
  { index: 11, name: "Meena", english: "Pisces", lord: "Jupiter", element: "Water" },
];

export interface Nakshatra {
  index: number; // 0–26
  name: string;
  deity: string;
  lord: Graha;
}

export const DASHA_ORDER: readonly Graha[] = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];
export const DASHA_YEARS: Record<Graha, number> = {
  Ketu: 7,
  Venus: 20,
  Sun: 6,
  Moon: 10,
  Mars: 7,
  Rahu: 18,
  Jupiter: 16,
  Saturn: 19,
  Mercury: 17,
};

const NAK_NAMES: ReadonlyArray<readonly [string, string]> = [
  ["Ashwini", "Ashwini Kumaras"],
  ["Bharani", "Yama"],
  ["Krittika", "Agni"],
  ["Rohini", "Prajapati"],
  ["Mrigashira", "Soma"],
  ["Ardra", "Rudra"],
  ["Punarvasu", "Aditi"],
  ["Pushya", "Brihaspati"],
  ["Ashlesha", "Nagas"],
  ["Magha", "Pitris"],
  ["Purva Phalguni", "Bhaga"],
  ["Uttara Phalguni", "Aryaman"],
  ["Hasta", "Savitar"],
  ["Chitra", "Vishvakarma"],
  ["Swati", "Vayu"],
  ["Vishakha", "Indra-Agni"],
  ["Anuradha", "Mitra"],
  ["Jyeshtha", "Indra"],
  ["Mula", "Nirriti"],
  ["Purva Ashadha", "Apas"],
  ["Uttara Ashadha", "Vishvedevas"],
  ["Shravana", "Vishnu"],
  ["Dhanishta", "Vasus"],
  ["Shatabhisha", "Varuna"],
  ["Purva Bhadrapada", "Aja Ekapada"],
  ["Uttara Bhadrapada", "Ahir Budhnya"],
  ["Revati", "Pushan"],
];

export const NAKSHATRAS: readonly Nakshatra[] = NAK_NAMES.map(([name, deity], index) => ({
  index,
  name,
  deity,
  lord: DASHA_ORDER[index % 9],
}));

const NAK_SPAN = 360 / 27; // 13°20′

export interface ZodiacPoint {
  longitude: number; // sidereal 0–360
  rashi: Rashi;
  degreeInRashi: number;
  nakshatra: Nakshatra;
  pada: number; // 1–4
  /** Distance to the nearest rashi/nakshatra boundary, degrees — drives the confidence flag. */
  boundaryMargin: number;
}

export function zodiacPoint(siderealLongitude: number): ZodiacPoint {
  const lon = norm360(siderealLongitude);
  const ri = Math.floor(lon / 30);
  const ni = Math.floor(lon / NAK_SPAN);
  const inNak = lon - ni * NAK_SPAN;
  const pada = Math.floor(inNak / (NAK_SPAN / 4)) + 1;
  const deg = lon - ri * 30;
  const boundaryMargin = Math.min(deg, 30 - deg, inNak, NAK_SPAN - inNak);
  return { longitude: lon, rashi: RASHIS[ri], degreeInRashi: deg, nakshatra: NAKSHATRAS[ni], pada, boundaryMargin };
}

export function formatDegrees(deg: number): string {
  const d = Math.floor(deg);
  const m = Math.floor((deg - d) * 60);
  return `${d}°${String(m).padStart(2, "0")}′`;
}

/* ─────────────────────────── Vimshottari Dasha ─────────────────────────── */

export const DASHA_YEAR_DAYS = 365.25;

export interface DashaPeriod {
  lord: Graha;
  start: Date;
  end: Date;
}

export interface DashaState {
  mahadasha: DashaPeriod;
  antardasha: DashaPeriod;
  nextMahadasha: DashaPeriod;
  /** Balance of the first mahadasha at birth, in years. */
  birthBalanceYears: number;
  birthLord: Graha;
  timeline: DashaPeriod[];
}

const addYears = (d: Date, years: number) => new Date(d.getTime() + years * DASHA_YEAR_DAYS * 86400000);

export function vimshottari(birth: Date, moonSidereal: number, at: Date = new Date()): DashaState {
  const lon = norm360(moonSidereal);
  const ni = Math.floor(lon / NAK_SPAN);
  const fraction = (lon - ni * NAK_SPAN) / NAK_SPAN;
  const startIdx = ni % 9;
  const birthLord = DASHA_ORDER[startIdx];
  const birthBalanceYears = (1 - fraction) * DASHA_YEARS[birthLord];

  // The first mahadasha notionally began before birth.
  const firstStart = addYears(birth, -fraction * DASHA_YEARS[birthLord]);
  const timeline: DashaPeriod[] = [];
  let cursor = firstStart;
  for (let i = 0; i < 18; i++) {
    const lord = DASHA_ORDER[(startIdx + i) % 9];
    const end = addYears(cursor, DASHA_YEARS[lord]);
    timeline.push({ lord, start: cursor, end });
    cursor = end;
  }

  const t = at.getTime();
  const mIdx = Math.max(0, timeline.findIndex((p) => p.start.getTime() <= t && t < p.end.getTime()));
  const maha = timeline[mIdx];
  const nextMaha = timeline[mIdx + 1];

  // Antardashas begin with the mahadasha lord and follow the same order.
  const mahaYears = DASHA_YEARS[maha.lord];
  const lordIdx = DASHA_ORDER.indexOf(maha.lord);
  let aCursor = maha.start;
  let antar: DashaPeriod = { lord: maha.lord, start: maha.start, end: maha.end };
  for (let i = 0; i < 9; i++) {
    const lord = DASHA_ORDER[(lordIdx + i) % 9];
    const end = addYears(aCursor, (mahaYears * DASHA_YEARS[lord]) / 120);
    if (aCursor.getTime() <= t && t < end.getTime()) {
      antar = { lord, start: aCursor, end };
      break;
    }
    aCursor = end;
  }

  return { mahadasha: maha, antardasha: antar, nextMahadasha: nextMaha, birthBalanceYears, birthLord, timeline };
}

/* ─────────────────────────────── Snapshot ─────────────────────────────── */

export interface SnapshotInput {
  /** Birth instant in UTC. */
  utc: Date;
  latitude: number;
  longitude: number;
  /** True when birth time is known to the minute; otherwise Lagna is withheld. */
  timeKnown: boolean;
}

export interface Snapshot {
  version: string;
  ayanamsa: number;
  moon: ZodiacPoint;
  sun: ZodiacPoint;
  lagna: ZodiacPoint | null;
  dasha: DashaState;
  /** "high" when every reported point sits ≥0.25° from a boundary. */
  confidence: "high" | "check-time";
}

export function computeSnapshot(input: SnapshotInput, now: Date = new Date()): Snapshot {
  const jdUT = julianDay(input.utc);
  const jdTT = jdUT + deltaT(input.utc.getUTCFullYear()) / 86400;
  const ay = lahiriAyanamsa(jdTT);
  const moon = zodiacPoint(moonLongitude(jdTT) - ay);
  const sun = zodiacPoint(sunLongitude(jdTT) - ay);
  const lagna = input.timeKnown ? zodiacPoint(ascendant(jdUT, input.latitude, input.longitude) - ay) : null;
  const dasha = vimshottari(input.utc, moon.longitude, now);
  const tight = [moon, sun, ...(lagna ? [lagna] : [])].some((p) => p.boundaryMargin < 0.25);
  return { version: CALC_VERSION, ayanamsa: ay, moon, sun, lagna, dasha, confidence: tight ? "check-time" : "high" };
}

/** Where is the Moon right now (sidereal)? Used for Sakhi's live sky. */
export function moonNow(now: Date = new Date()): ZodiacPoint {
  const jdUT = julianDay(now);
  const jdTT = jdUT + deltaT(now.getUTCFullYear()) / 86400;
  return zodiacPoint(moonLongitude(jdTT) - lahiriAyanamsa(jdTT));
}

/** Tithi (lunar day 1–30) — the angular distance of Moon from Sun. */
export function tithiNow(now: Date = new Date()): { index: number; paksha: "Shukla" | "Krishna"; name: string } {
  const jdUT = julianDay(now);
  const jdTT = jdUT + deltaT(now.getUTCFullYear()) / 86400;
  const diff = norm360(moonLongitude(jdTT) - sunLongitude(jdTT));
  const index = Math.floor(diff / 12) + 1; // 1–30
  const names = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami",
    "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
  ];
  const paksha = index <= 15 ? "Shukla" : "Krishna";
  const n = index <= 15 ? index : index - 15;
  const name = n === 15 ? (paksha === "Shukla" ? "Purnima" : "Amavasya") : names[n - 1];
  return { index, paksha, name };
}
