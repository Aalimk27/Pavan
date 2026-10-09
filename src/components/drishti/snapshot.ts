/**
 * Runs a DRISHTI snapshot from form values. Pure: every fact comes from the
 * deterministic engines (@/lib/astro/*); nothing here invents a position or a date.
 */

import { computeSnapshot, formatDegrees, type Graha, type Snapshot } from "@/lib/astro/engine";
import { localToUtc } from "@/lib/astro/time";
import type { SnapshotCardData } from "@/lib/sakhi/types";
import type { Place } from "./CityCombobox";
import { fmtDate } from "./wheel";

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export interface SnapshotParams {
  name: string;
  year: number;
  month: number;
  day: number;
  /** null when the birth time is unknown */
  time: { hour: number; minute: number } | null;
  place: Place;
}

/** What could change within the birth day when the time is unknown. */
export interface DayRange {
  rashi: [string, string] | null;
  nakshatra: [string, string] | null;
  maha: [Graha, Graha] | null;
  mahaEnd: [Date, Date] | null;
}

export interface SnapshotRun {
  id: number;
  params: SnapshotParams;
  timeKnown: boolean;
  utc: Date;
  offsetMinutes: number;
  snap: Snapshot;
  computedAt: Date;
  range: DayRange | null;
}

export function runSnapshot(params: SnapshotParams, now: Date = new Date()): SnapshotRun {
  const { year, month, day, place } = params;
  const timeKnown = !!params.time;
  const hour = params.time?.hour ?? 12;
  const minute = params.time?.minute ?? 0;
  const { utc, offsetMinutes } = localToUtc({ year, month, day, hour, minute }, place.tz);
  const snap = computeSnapshot({ utc, latitude: place.lat, longitude: place.lon, timeKnown }, now);

  let range: DayRange | null = null;
  if (!timeKnown) {
    const at = (h: number, m: number) =>
      computeSnapshot({ utc: localToUtc({ year, month, day, hour: h, minute: m }, place.tz).utc, latitude: place.lat, longitude: place.lon, timeKnown: false }, now);
    const a = at(0, 0);
    const b = at(23, 59);
    const sameMaha = a.dasha.mahadasha.lord === b.dasha.mahadasha.lord;
    const ends = [a.dasha.mahadasha.end, b.dasha.mahadasha.end].sort((x, y) => x.getTime() - y.getTime());
    range = {
      rashi: a.moon.rashi.index !== b.moon.rashi.index ? [a.moon.rashi.name, b.moon.rashi.name] : null,
      nakshatra: a.moon.nakshatra.index !== b.moon.nakshatra.index ? [a.moon.nakshatra.name, b.moon.nakshatra.name] : null,
      maha: sameMaha ? null : [a.dasha.mahadasha.lord, b.dasha.mahadasha.lord],
      mahaEnd: sameMaha ? [ends[0], ends[1]] : null,
    };
  }

  return { id: now.getTime(), params, timeKnown, utc, offsetMinutes, snap, computedAt: now, range };
}

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const isoDate = (p: SnapshotParams) => `${p.year}-${pad2(p.month)}-${pad2(p.day)}`;
export const hhmm = (p: SnapshotParams) => (p.time ? `${pad2(p.time.hour)}:${pad2(p.time.minute)}` : null);

export function dateLabel(p: SnapshotParams): string {
  return `${p.day} ${MONTHS[p.month - 1]} ${p.year}`;
}

/** The same card Sakhi shows in conversation — so she can talk about this exact snapshot. */
export function toCardData(run: SnapshotRun): SnapshotCardData {
  const { snap: s, params: p } = run;
  return {
    name: p.name || undefined,
    dateLabel: `${dateLabel(p)}${p.time ? `, ${hhmm(p)}` : " (time unknown)"}`,
    place: p.place.label,
    lagna: s.lagna ? { rashi: s.lagna.rashi.name, english: s.lagna.rashi.english, degree: formatDegrees(s.lagna.degreeInRashi) } : undefined,
    moon: { rashi: s.moon.rashi.name, english: s.moon.rashi.english, degree: formatDegrees(s.moon.degreeInRashi) },
    sun: { rashi: s.sun.rashi.name, english: s.sun.rashi.english },
    nakshatra: { name: s.moon.nakshatra.name, pada: s.moon.pada, deity: s.moon.nakshatra.deity, lord: s.moon.nakshatra.lord },
    mahadasha: { lord: s.dasha.mahadasha.lord, until: fmtDate(s.dasha.mahadasha.end) },
    antardasha: { lord: s.dasha.antardasha.lord, until: fmtDate(s.dasha.antardasha.end) },
    confidence: s.confidence,
    timeKnown: run.timeKnown,
  };
}
