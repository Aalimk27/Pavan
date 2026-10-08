import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  ascendant,
  computeSnapshot,
  julianDay,
  moonLongitude,
  sunLongitude,
  norm360,
  vimshottari,
  zodiacPoint,
  DASHA_YEARS,
} from "../src/lib/astro/engine.ts";

const angDiff = (a: number, b: number) => {
  const d = Math.abs(norm360(a) - norm360(b));
  return Math.min(d, 360 - d);
};

test("Moon longitude matches Meeus example 47.a (1992-04-12 0h TD)", () => {
  // Meeus: λ (geometric, mean equinox) = 133.162655°
  const lon = moonLongitude(2448724.5);
  assert.ok(angDiff(lon, 133.162655) < 0.005, `got ${lon}`);
});

test("Sun longitude matches Meeus example 25.a (1992-10-13 0h TD)", () => {
  // Meeus: true geometric longitude = 199.90988°
  const lon = sunLongitude(2448908.5);
  assert.ok(angDiff(lon, 199.90988) < 0.01, `got ${lon}`);
});

test("Ascendant formula agrees with a brute-force rising-point search", () => {
  // The ascendant is the ecliptic point on the eastern horizon (altitude 0, rising).
  const D = Math.PI / 180;
  const cases = [
    { jd: julianDay(new Date("1990-03-14T05:30:00Z")), lat: 28.61, lon: 77.21 },
    { jd: julianDay(new Date("2001-09-01T22:10:00Z")), lat: 51.5, lon: -0.13 },
    { jd: julianDay(new Date("1975-06-20T12:00:00Z")), lat: -33.87, lon: 151.21 },
  ];
  for (const c of cases) {
    const asc = ascendant(c.jd, c.lat, c.lon);
    const T = (c.jd - 2451545) / 36525;
    const eps = 23.4392911 - 0.0130042 * T;
    const theta0 = norm360(280.46061837 + 360.98564736629 * (c.jd - 2451545));
    const lst = norm360(theta0 + c.lon);
    const altOf = (lam: number) => {
      const ra = Math.atan2(Math.sin(lam * D) * Math.cos(eps * D), Math.cos(lam * D)) / D;
      const dec = Math.asin(Math.sin(eps * D) * Math.sin(lam * D)) / D;
      const H = norm360(lst - ra);
      const alt = Math.asin(Math.sin(c.lat * D) * Math.sin(dec * D) + Math.cos(c.lat * D) * Math.cos(dec * D) * Math.cos(H * D)) / D;
      return { alt, rising: H > 180 };
    };
    const p = altOf(asc);
    assert.ok(Math.abs(p.alt) < 0.05, `altitude at asc = ${p.alt}`);
    assert.ok(p.rising, "ascendant must be on the eastern (rising) side");
  }
});

const fixtures: Array<{ utc: string; place: string; lat: number; lon: number; moon: number; sun: number; asc: number }> =
  JSON.parse(readFileSync(new URL("./fixtures/swiss-ephemeris-lahiri.json", import.meta.url), "utf8"));

test(`Sidereal Moon/Sun/Lagna agree with Swiss Ephemeris (Lahiri) on ${fixtures.length} charts`, () => {
  let worstMoon = 0;
  let worstSun = 0;
  let worstAsc = 0;
  for (const f of fixtures) {
    const s = computeSnapshot({ utc: new Date(f.utc), latitude: f.lat, longitude: f.lon, timeKnown: true });
    worstMoon = Math.max(worstMoon, angDiff(s.moon.longitude, f.moon));
    worstSun = Math.max(worstSun, angDiff(s.sun.longitude, f.sun));
    worstAsc = Math.max(worstAsc, angDiff(s.lagna!.longitude, f.asc));
  }
  assert.ok(worstMoon < 0.05, `worst Moon error ${worstMoon.toFixed(4)}°`);
  assert.ok(worstSun < 0.02, `worst Sun error ${worstSun.toFixed(4)}°`);
  assert.ok(worstAsc < 0.1, `worst Lagna error ${worstAsc.toFixed(4)}°`);
});

test("Rashi / nakshatra / pada boundaries", () => {
  assert.equal(zodiacPoint(0).nakshatra.name, "Ashwini");
  assert.equal(zodiacPoint(0).pada, 1);
  assert.equal(zodiacPoint(13.34).nakshatra.name, "Bharani");
  assert.equal(zodiacPoint(359.99).nakshatra.name, "Revati");
  assert.equal(zodiacPoint(359.99).pada, 4);
  assert.equal(zodiacPoint(45).rashi.name, "Vrishabha");
  assert.equal(zodiacPoint(45).nakshatra.name, "Rohini");
});

test("Vimshottari: balance, order and 120-year cycle", () => {
  const birth = new Date("2000-01-01T00:00:00Z");
  // Moon at the very start of Ashwini → full Ketu (7y) balance.
  const a = vimshottari(birth, 0.0001, birth);
  assert.equal(a.birthLord, "Ketu");
  assert.ok(Math.abs(a.birthBalanceYears - 7) < 0.001);
  // Halfway through Rohini (Moon lord) → 5 of 10 years remaining.
  const b = vimshottari(birth, 40 + 13.3333 / 2, birth);
  assert.equal(b.birthLord, "Moon");
  assert.ok(Math.abs(b.birthBalanceYears - 5) < 0.01);
  // Nine consecutive periods sum to 120 years.
  const total = b.timeline.slice(0, 9).reduce((s, p) => s + (p.end.getTime() - p.start.getTime()), 0);
  assert.ok(Math.abs(total / (365.25 * 86400000) - 120) < 1e-6);
  assert.deepEqual(Object.values(DASHA_YEARS).reduce((x, y) => x + y, 0), 120);
  // Antardasha of the running mahadasha starts with its own lord.
  const c = vimshottari(birth, 0.0001, new Date(birth.getTime() + 86400000));
  assert.equal(c.antardasha.lord, "Ketu");
});
