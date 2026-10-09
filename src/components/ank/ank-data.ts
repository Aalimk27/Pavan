import { ANK_PLANET, ANK_PLANET_EN, HOME_MEANING, PERSONAL_MEANING, type AnkMeaning, type AnkResult } from "@/lib/ank";

/** Devanagari numerals — purely typographic, used as ornament beside the Latin digit. */
export const DEVANAGARI_DIGIT: Record<number, string> = {
  1: "१",
  2: "२",
  3: "३",
  4: "४",
  5: "५",
  6: "६",
  7: "७",
  8: "८",
  9: "९",
};

export const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

export type CalcKind = "mulank" | "bhagya" | "home";

export const CALC_LABEL: Record<CalcKind, { name: string; source: string; short: string }> = {
  mulank: { name: "Mulank", source: "Day of birth", short: "Mulank" },
  bhagya: { name: "Bhagya Ank", source: "Full date of birth", short: "Bhagya" },
  home: { name: "Home Number", source: "Your door number", short: "Home" },
};

export function planetOf(n: number): { graha: string; en: string } {
  const graha = ANK_PLANET[n];
  return { graha, en: ANK_PLANET_EN[graha] };
}

export function meaningFor(kind: CalcKind, root: number): AnkMeaning {
  return kind === "home" ? HOME_MEANING[root] : PERSONAL_MEANING[root];
}

/** Each step of the reduction: the digits summed and the total they make. */
export function reductionSteps(r: AnkResult): { digits: number[]; total: number }[] {
  const steps = [{ digits: r.digits, total: r.chain[0] }];
  for (let i = 1; i < r.chain.length; i++) {
    steps.push({ digits: String(r.chain[i - 1]).split("").map(Number), total: r.chain[i] });
  }
  return steps;
}

/** "6 + 0 + 7 = 13 → 1 + 3 = 4" */
export function reductionText(r: AnkResult): string {
  return reductionSteps(r)
    .map((s) => `${s.digits.join(" + ")} = ${s.total}`)
    .join(" → ");
}

/** "Guru · Jupiter", or just "Rahu" when the English name is the same. */
export function grahaLabel(n: number, sep = " · "): string {
  const p = planetOf(n);
  return p.graha === p.en ? p.graha : `${p.graha}${sep}${p.en}`;
}

export const lc = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);
