import type { GitaVerse, KathaTradition } from "@/lib/content/types";

/** Visual identity of each Katha tradition (accent colour + Devanagari name). */
export const TRADITION: Record<KathaTradition, { skt: string; accent: string; note: string }> = {
  Upanishad: { skt: "उपनिषद्", accent: "#0e7c86", note: "The Upanishads: dialogues on the Self, taught at the feet of a teacher." },
  Ramayana: { skt: "रामायण", accent: "#c4692a", note: "The Ramayana: Rama's journey of duty, devotion and return." },
  Mahabharata: { skt: "महाभारत", accent: "#1b3a9a", note: "The Mahabharata: the great epic of dharma under pressure, which holds the Gita." },
  Purana: { skt: "पुराण", accent: "#8a6420", note: "The Puranas: stories of the Divine and devotees, told for every age." },
  "Saints & Bhaktas": { skt: "भक्त", accent: "#b0566a", note: "Saints and bhaktas: lives of devotion lived among ordinary people." },
};

export const TRADITION_ORDER: KathaTradition[] = ["Upanishad", "Ramayana", "Mahabharata", "Purana", "Saints & Bhaktas"];

/** "2.47" → "2-47" (URL segment) and back. */
export const verseSegment = (id: string) => id.replace(".", "-");
export const verseFromSegment = (seg: string) => seg.replace("-", ".");
export const verseHref = (v: Pick<GitaVerse, "id">) => `/gita/${verseSegment(v.id)}`;

const DEV = "०१२३४५६७८९";
export const toDevanagari = (n: number | string) => String(n).replace(/\d/g, (d) => DEV[Number(d)]);

const ROMAN: [number, string][] = [
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];
export function toRoman(n: number): string {
  let out = "";
  for (const [v, s] of ROMAN) while (n >= v) (out += s), (n -= v);
  return out;
}

/** Split a Devanagari verse into lines, separating the closing ॥x-y॥ marker. */
export function verseLines(sanskrit: string): { text: string; marker?: string }[] {
  return sanskrit.split("\n").map((line) => {
    const m = line.match(/^(.*?)\s*(॥[^॥]*॥)\s*$/);
    if (m) return { text: m[1].replace(/\s*।\s*$/, " ।"), marker: m[2] };
    return { text: line };
  });
}
