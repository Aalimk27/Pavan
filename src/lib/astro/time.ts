/**
 * Converts a local wall-clock birth time in an IANA zone to a UTC instant,
 * honouring historical offsets and daylight saving (e.g. India's +6:30 war time, 1942–45).
 */

function partsInZone(utcMs: number, timeZone: string) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const get = (parts: Intl.DateTimeFormatPart[], t: string) => Number(parts.find((p) => p.type === t)?.value);
  const parts = fmt.formatToParts(new Date(utcMs));
  return Date.UTC(get(parts, "year"), get(parts, "month") - 1, get(parts, "day"), get(parts, "hour"), get(parts, "minute"), get(parts, "second"));
}

/** Offset of the zone from UTC at a given instant, in minutes. */
export function zoneOffsetMinutes(timeZone: string, utcMs: number): number {
  return Math.round((partsInZone(utcMs, timeZone) - utcMs) / 60000);
}

export function localToUtc(
  local: { year: number; month: number; day: number; hour: number; minute: number },
  timeZone: string,
): { utc: Date; offsetMinutes: number } {
  const wall = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute);
  let offset = zoneOffsetMinutes(timeZone, wall);
  // Two refinement passes settle DST transitions.
  for (let i = 0; i < 2; i++) {
    const next = zoneOffsetMinutes(timeZone, wall - offset * 60000);
    if (next === offset) break;
    offset = next;
  }
  return { utc: new Date(wall - offset * 60000), offsetMinutes: offset };
}

export function formatOffset(minutes: number): string {
  const sign = minutes >= 0 ? "+" : "−";
  const m = Math.abs(minutes);
  return `UTC${sign}${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}
