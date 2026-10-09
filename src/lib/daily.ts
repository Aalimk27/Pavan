/**
 * Daily Wisdom rotation. The "Prem Marg day" is the UTC calendar date, so the
 * whole world reads the same verse and story on the same date.
 */

export function dayNumber(date: Date = new Date()): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86400000);
}

export function dayKey(date: Date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

/** Deterministic daily pick. `salt` lets two lists rotate independently. */
export function pickDaily<T>(items: readonly T[], date: Date = new Date(), salt = 0): T {
  if (items.length === 0) throw new Error("pickDaily: empty list");
  const n = dayNumber(date) + salt;
  return items[((n % items.length) + items.length) % items.length];
}

export type DayPhase = "brahma" | "morning" | "afternoon" | "evening" | "night";

export function dayPhase(date: Date = new Date()): DayPhase {
  const h = date.getHours();
  if (h >= 4 && h < 6) return "brahma";
  if (h >= 6 && h < 12) return "morning";
  if (h >= 12 && h < 17) return "afternoon";
  if (h >= 17 && h < 21) return "evening";
  return "night";
}

export const GREETING: Record<DayPhase, { en: string; hi: string; note: string }> = {
  brahma: { en: "Good morning", hi: "शुभ प्रभात", note: "You're awake in Brahma Muhurta — the stillest hours of the day." },
  morning: { en: "Good morning", hi: "शुभ प्रभात", note: "A fresh day. Let's begin it with clarity." },
  afternoon: { en: "Good afternoon", hi: "नमस्ते", note: "A good moment to pause and breathe." },
  evening: { en: "Good evening", hi: "शुभ संध्या", note: "The lamps are being lit. A gentle time to reflect." },
  night: { en: "Good night", hi: "शुभ रात्रि", note: "Quiet hours. I'm here, whenever you need me." },
};
