/**
 * Natural-language slot extraction for Sakhi (blueprint §10: "collects missing data and validates format").
 * Pure functions — no imports — so they are unit-tested directly.
 */

export interface YMD {
  year: number;
  month: number;
  day: number;
  /** True when DD/MM vs MM/DD could not be decided and DD/MM was assumed. */
  assumedDayFirst?: boolean;
}

export interface HM {
  hour: number;
  minute: number;
}

const MONTHS: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5, jun: 6, june: 6,
  jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

function valid(y: number, m: number, d: number): boolean {
  if (y < 1800 || y > 2200 || m < 1 || m > 12 || d < 1) return false;
  return d <= new Date(Date.UTC(y, m, 0)).getUTCDate();
}

export function parseDate(text: string): YMD | null {
  const t = text.toLowerCase().replace(/(\d)(st|nd|rd|th)\b/g, "$1");

  // ISO 1990-03-14
  let m = t.match(/\b(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})\b/);
  if (m) {
    const [y, mo, d] = [+m[1], +m[2], +m[3]];
    return valid(y, mo, d) ? { year: y, month: mo, day: d } : null;
  }

  // 14 March 1990 / 14 mar, 1990
  m = t.match(/\b(\d{1,2})\s*(?:of\s+)?([a-z]{3,9})\.?,?\s*(\d{4})\b/);
  if (m && MONTHS[m[2]]) {
    const [d, mo, y] = [+m[1], MONTHS[m[2]], +m[3]];
    return valid(y, mo, d) ? { year: y, month: mo, day: d } : null;
  }

  // March 14, 1990
  m = t.match(/\b([a-z]{3,9})\.?\s+(\d{1,2}),?\s*(\d{4})\b/);
  if (m && MONTHS[m[1]]) {
    const [mo, d, y] = [MONTHS[m[1]], +m[2], +m[3]];
    return valid(y, mo, d) ? { year: y, month: mo, day: d } : null;
  }

  // 14/03/1990, 14-03-1990, 14.03.1990
  m = t.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\b/);
  if (m) {
    const a = +m[1];
    const b = +m[2];
    const y = +m[3];
    if (a > 12 && valid(y, b, a)) return { year: y, month: b, day: a };
    if (b > 12 && valid(y, a, b)) return { year: y, month: a, day: b };
    if (valid(y, b, a)) return { year: y, month: b, day: a, assumedDayFirst: a !== b };
  }
  return null;
}

/** Day-of-month only, e.g. "I was born on the 29th" → 29 */
export function parseDayOnly(text: string): number | null {
  const m = text.toLowerCase().match(/\b(?:on\s+the\s+|on\s+|born\s+(?:on\s+)?(?:the\s+)?)(\d{1,2})(?:st|nd|rd|th)?\b/);
  if (!m) return null;
  const d = +m[1];
  return d >= 1 && d <= 31 ? d : null;
}

export function parseTime(text: string): HM | null {
  const t = text.toLowerCase();
  if (/\bnoon\b/.test(t)) return { hour: 12, minute: 0 };
  if (/\bmidnight\b/.test(t)) return { hour: 0, minute: 0 };
  // 10:30 pm / 10.30pm / 7 am
  let m = t.match(/\b(\d{1,2})(?:[:.](\d{2}))?\s*(a\.?m\.?|p\.?m\.?)\b/);
  if (m) {
    let h = +m[1];
    const min = m[2] ? +m[2] : 0;
    const pm = m[3].startsWith("p");
    if (h < 1 || h > 12 || min > 59) return null;
    if (h === 12) h = 0;
    return { hour: pm ? h + 12 : h, minute: min };
  }
  // 22:15 (24-hour)
  m = t.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b(?![-/.]\d)/);
  if (m) return { hour: +m[1], minute: +m[2] };
  return null;
}

export function saysTimeUnknown(text: string): boolean {
  return /\b(don'?t|do not|dont|not)\s+(know|sure|remember)\b|\bunknown\b|\bno idea\b|\bnot known\b|\bskip\b/i.test(text);
}

/** "house number 607", "flat B-1204", "my home is 12b" → "607" / "B-1204" / "12b" */
export function parseHomeNumber(text: string): string | null {
  const m = text.match(
    /\b(?:house|home|flat|apartment|apt|door|plot|villa|unit|address)\s*(?:no\.?|number|num|#)?\s*(?:is\s+|=\s*|:\s*)?([A-Za-z]{0,2}[-/ ]?\d{1,5}[A-Za-z]?)\b/i,
  );
  return m ? m[1].trim() : null;
}

/** "gita 2.47", "BG 2:47", "chapter 2 verse 47" → "2.47" */
export function parseVerseRef(text: string): string | null {
  let m = text.match(/\b(?:gita|bg|verse|shloka|sloka)\s*(\d{1,2})[.:](\d{1,2})\b/i);
  if (m) return `${+m[1]}.${+m[2]}`;
  m = text.match(/\bchapter\s*(\d{1,2})\D{1,12}verse\s*(\d{1,2})\b/i);
  if (m) return `${+m[1]}.${+m[2]}`;
  return null;
}
