/**
 * ANK — Number Intelligence Engine (blueprint §8).
 *
 * Deterministic. Compound and root are both preserved:
 *   607 → 6+0+7 = 13 → 1+3 = 4   ⇒  Compound 13 / Root 4
 *
 * Compound = the digit-sum of the input (one pass).
 * Root     = the compound reduced until a single digit 1–9.
 */

export type AnkPlanet =
  | "Surya"
  | "Chandra"
  | "Guru"
  | "Rahu"
  | "Budh"
  | "Shukra"
  | "Ketu"
  | "Shani"
  | "Mangal";

export interface AnkResult {
  /** Digits that were used, in order. */
  digits: number[];
  /** First digit-sum (may equal root when it is already a single digit). */
  compound: number;
  /** Final single digit 1–9. */
  root: number;
  /** Full reduction chain for transparent display, e.g. [13, 4]. */
  chain: number[];
}

export const ANK_PLANET: Record<number, AnkPlanet> = {
  1: "Surya",
  2: "Chandra",
  3: "Guru",
  4: "Rahu",
  5: "Budh",
  6: "Shukra",
  7: "Ketu",
  8: "Shani",
  9: "Mangal",
};

export const ANK_PLANET_EN: Record<AnkPlanet, string> = {
  Surya: "Sun",
  Chandra: "Moon",
  Guru: "Jupiter",
  Rahu: "Rahu",
  Budh: "Mercury",
  Shukra: "Venus",
  Ketu: "Ketu",
  Shani: "Saturn",
  Mangal: "Mars",
};

export function digitSum(n: number): number {
  let s = 0;
  for (const ch of String(Math.abs(Math.trunc(n)))) s += Number(ch);
  return s;
}

export function reduceDigits(digits: number[]): AnkResult {
  if (digits.length === 0) throw new Error("No digits to reduce");
  const compound = digits.reduce((a, b) => a + b, 0);
  if (compound === 0) throw new Error("A number made only of zeros has no root");
  const chain = [compound];
  let current = compound;
  while (current > 9) {
    current = digitSum(current);
    chain.push(current);
  }
  return { digits, compound, root: current, chain };
}

/** Mulank — from the day of birth (1–31). */
export function mulank(day: number): AnkResult {
  if (!Number.isInteger(day) || day < 1 || day > 31) throw new Error("Day must be between 1 and 31");
  return reduceDigits(String(day).split("").map(Number));
}

/** Bhagya Ank — from the full date of birth (day + month + year digits). */
export function bhagyaAnk(year: number, month: number, day: number): AnkResult {
  if (!isValidDate(year, month, day)) throw new Error("Please enter a real calendar date");
  const s = `${day}${month}${year}`;
  return reduceDigits(s.split("").map(Number));
}

/**
 * Home Number — uses the digits present in the address number.
 * Letters and prefixes (e.g. "B-", "A") are not counted in this method.
 */
export function homeNumber(input: string): AnkResult & { ignored: string } {
  const digits = (input.match(/\d/g) ?? []).map(Number);
  const ignored = input.replace(/[\d\s]/g, "");
  if (digits.length === 0) throw new Error("Please include the digits of your home number");
  return { ...reduceDigits(digits), ignored };
}

export function isValidDate(y: number, m: number, d: number): boolean {
  if (![y, m, d].every(Number.isInteger)) return false;
  if (y < 1800 || y > 2200 || m < 1 || m > 12 || d < 1) return false;
  const dim = new Date(Date.UTC(y, m, 0)).getUTCDate();
  return d <= dim;
}

export function describeChain(r: AnkResult): string {
  const sum = r.digits.join("+");
  if (r.chain.length === 1) return `${sum} = ${r.root}`;
  return `${sum} = ${r.chain.join(" → ")}`;
}

/* ───────────────────────── Interpretation (non-fear) ───────────────────────── */

export interface AnkMeaning {
  title: string;
  essence: string;
  strengths: string[];
  watchOuts: string[];
  practice: string;
}

/** Personal number meanings — strengths and watch-outs, never "good" or "bad". */
export const PERSONAL_MEANING: Record<number, AnkMeaning> = {
  1: {
    title: "The Initiator",
    essence: "Surya's number — clarity, self-direction and the courage to begin.",
    strengths: ["Natural initiative", "Independent thinking", "Steady sense of purpose"],
    watchOuts: ["Doing everything alone", "Pride that resists advice"],
    practice: "Offer water to the rising sun and begin one important task before noon.",
  },
  2: {
    title: "The Harmoniser",
    essence: "Chandra's number — sensitivity, imagination and emotional intelligence.",
    strengths: ["Empathy and tact", "Creative imagination", "Brings people together"],
    watchOuts: ["Moods that follow the crowd", "Over-thinking before acting"],
    practice: "Keep a short evening reflection — three lines on what you felt and why.",
  },
  3: {
    title: "The Teacher",
    essence: "Guru's number — wisdom, expansion and the joy of guiding others.",
    strengths: ["Learning and teaching", "Optimism", "Ethical compass"],
    watchOuts: ["Advising before listening", "Scattering energy across too much"],
    practice: "Learn one thing deeply this week and explain it simply to someone.",
  },
  4: {
    title: "The Reformer",
    essence: "Rahu's number — originality, systems-thinking and unconventional paths.",
    strengths: ["Innovative ideas", "Works hard behind the scenes", "Sees what others miss"],
    watchOuts: ["Restlessness with routine", "Sudden decisions"],
    practice: "Before any big decision, sleep on it one night and write the reasons down.",
  },
  5: {
    title: "The Communicator",
    essence: "Budh's number — intellect, adaptability and quick learning.",
    strengths: ["Communication and trade", "Adaptability", "Curiosity"],
    watchOuts: ["Starting more than you finish", "Nervous energy"],
    practice: "Choose one unfinished task each day and complete it before starting another.",
  },
  6: {
    title: "The Nurturer",
    essence: "Shukra's number — beauty, harmony, comfort and loving care.",
    strengths: ["Creates beautiful spaces", "Loyal in relationships", "Artistic sense"],
    watchOuts: ["Indulgence", "Avoiding hard conversations to keep peace"],
    practice: "Bring order and beauty to one small space — a desk, a corner, a shelf.",
  },
  7: {
    title: "The Seeker",
    essence: "Ketu's number — introspection, intuition and spiritual depth.",
    strengths: ["Deep insight", "Research and analysis", "Detachment in crisis"],
    watchOuts: ["Withdrawing from people", "Doubt that delays action"],
    practice: "Ten minutes of silence daily — Radha Naam Jap or simple breath awareness.",
  },
  8: {
    title: "The Builder",
    essence: "Shani's number — discipline, patience and lasting achievement.",
    strengths: ["Endurance", "Responsibility", "Builds slowly and solidly"],
    watchOuts: ["Carrying burdens silently", "Seriousness that hides joy"],
    practice: "Serve someone who cannot repay you — Shani honours quiet, honest work.",
  },
  9: {
    title: "The Protector",
    essence: "Mangal's number — energy, courage and devotion to a cause.",
    strengths: ["Courage", "Protects others", "Finishes with determination"],
    watchOuts: ["Quick temper", "Pushing when patience would serve better"],
    practice: "Move your body every morning — channel strength before the day asks for it.",
  },
};

/** Home number meanings — the atmosphere a home tends to support. */
export const HOME_MEANING: Record<number, AnkMeaning> = {
  1: {
    title: "Home of New Beginnings",
    essence: "Supports independence, ambition and fresh starts.",
    strengths: ["Founders and first homes", "Self-employment", "Clear personal goals"],
    watchOuts: ["Members living parallel lives", "Too little shared time"],
    practice: "Keep the entrance bright and open; share one meal together daily.",
  },
  2: {
    title: "Home of Togetherness",
    essence: "Supports partnership, gentleness and emotional closeness.",
    strengths: ["Couples and caregivers", "Peaceful routines", "Hospitality"],
    watchOuts: ["Sensitivity to clutter and noise", "Unspoken feelings"],
    practice: "Keep water clean and flowing; speak gently at night.",
  },
  3: {
    title: "Home of Learning",
    essence: "Supports study, teaching, celebration and growth.",
    strengths: ["Students and teachers", "Gatherings", "Optimism"],
    watchOuts: ["Over-commitment", "Expenses on celebration"],
    practice: "Create a clean study corner and a small shelf of good books.",
  },
  4: {
    title: "Home of Structure",
    essence: "Supports hard work, discipline and practical projects.",
    strengths: ["Long projects", "Technical work", "Saving and planning"],
    watchOuts: ["Restless energy", "Feeling boxed in"],
    practice: "Hold a weekly home-order routine; keep plants that bring softness.",
  },
  5: {
    title: "Home of Movement",
    essence: "Supports communication, travel, trade and social life.",
    strengths: ["Business owners", "Writers and speakers", "Lively households"],
    watchOuts: ["Difficulty settling", "Scattered routines"],
    practice: "Anchor the day with fixed wake and meal times.",
  },
  6: {
    title: "Home of Harmony",
    essence: "Supports family warmth, beauty, comfort and hospitality.",
    strengths: ["Families", "Artists", "Entertaining guests"],
    watchOuts: ["Indulgence", "Avoiding necessary discipline"],
    practice: "Fresh flowers or a tidy, fragrant entrance invite Shukra's grace.",
  },
  7: {
    title: "Home of Reflection",
    essence: "Supports study, spiritual practice, research and quiet.",
    strengths: ["Seekers and scholars", "Healing and rest", "Meditation"],
    watchOuts: ["Isolation", "Too little social warmth"],
    practice: "Keep a daily lamp and invite friends regularly.",
  },
  8: {
    title: "Home of Endurance",
    essence: "Supports steady wealth-building, responsibility and patience.",
    strengths: ["Long-term investment", "Serious careers", "Elders and stability"],
    watchOuts: ["Heaviness or overwork", "Too little play"],
    practice: "Let in natural light; keep the home free of broken or unused things.",
  },
  9: {
    title: "Home of Energy",
    essence: "Supports action, courage, fitness and service.",
    strengths: ["Active families", "Protectors and healers", "Service work"],
    watchOuts: ["Arguments when tired", "Impatience"],
    practice: "Keep a calm, cool bedroom; resolve disagreements before sleeping.",
  },
};
