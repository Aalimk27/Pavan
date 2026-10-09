/**
 * Product catalogue (blueprint §6, §7, §8, §14).
 * `price: null` means the founder has not yet frozen the price — the UI shows
 * "Launch pricing soon" rather than inventing a number.
 */

export type ProductId =
  | "drishti-core"
  | "drishti-deep"
  | "drishti-signature"
  | "vastu-report"
  | "drishti-x-vastu"
  | "ank-convergence";

export interface Product {
  id: ProductId;
  pillar: "drishti" | "vastu" | "ank";
  name: string;
  price: number | null;
  currency: "USD";
  summary: string;
  includes: string[];
  highlight?: boolean;
  beta?: boolean;
}

export const PRODUCTS: Record<ProductId, Product> = {
  "drishti-core": {
    id: "drishti-core",
    pillar: "drishti",
    name: "DRISHTI Core",
    price: 200,
    currency: "USD",
    summary: "Your complete personal reading in 13 premium infographics.",
    includes: [
      "13 premium individual infographics",
      "Deterministic Vedic calculations",
      "Written summary",
      "Human consultation script",
      "Sakhi explains your report, any time",
    ],
  },
  "drishti-deep": {
    id: "drishti-deep",
    pillar: "drishti",
    name: "DRISHTI Deep",
    price: 250,
    currency: "USD",
    summary: "Core, plus your next twelve months and your own questions answered.",
    includes: ["Everything in Core", "12-month timing map", "3 of your own questions", "One deep-dive module of your choice"],
    highlight: true,
  },
  "drishti-signature": {
    id: "drishti-signature",
    pillar: "drishti",
    name: "DRISHTI Signature",
    price: 350,
    currency: "USD",
    summary: "The fullest picture — three years of timing and every life area.",
    includes: [
      "Everything in Core",
      "12-month calendar",
      "Approx. 3-year timing",
      "Career, relationships, wealth, foreign/relocation, property and family/education modules",
      "Up to 5 of your own questions",
    ],
  },
  "vastu-report": {
    id: "vastu-report",
    pillar: "vastu",
    name: "VASTU Annotated Report",
    price: null,
    currency: "USD",
    summary: "Your floor plan, analysed and annotated — strengths, concerns and priority fixes.",
    includes: [
      "Annotated plan with Brahmasthan and directional grid",
      "Strengths, concerns and priority fixes",
      "Room-by-room guidance",
      "Remedy hierarchy: behaviour → layout → colour/material → renovation",
      "Idealised layout where feasible",
    ],
    beta: true,
  },
  "drishti-x-vastu": {
    id: "drishti-x-vastu",
    pillar: "vastu",
    name: "DRISHTI × VASTU",
    price: null,
    currency: "USD",
    summary: "Your resident profile compared with your home's Vastu — two evidence streams, kept separate and transparent.",
    includes: ["DRISHTI resident profile", "VASTU home analysis", "Alignment notes with evidence from each"],
    beta: true,
  },
  "ank-convergence": {
    id: "ank-convergence",
    pillar: "ank",
    name: "ANK Convergence",
    price: null,
    currency: "USD",
    summary: "Home Number + Mulank + Bhagya Ank — how your numbers meet.",
    includes: ["Compound and root for every number", "Strengths and watch-outs together", "Practical home and routine suggestions", "No name-changing or artificial corrections"],
  },
};

export const DRISHTI_TIERS: Product[] = [PRODUCTS["drishti-core"], PRODUCTS["drishti-deep"], PRODUCTS["drishti-signature"]];

export const DRISHTI_SLIDES = [
  "Cover",
  "Chart Snapshot",
  "D1 / Rashi Technical Foundation",
  "Personality Architecture",
  "Career, Purpose & Authority",
  "Wealth, Assets & Financial Behaviour",
  "Relationships, Marriage & D9",
  "Dasha & Life Timing",
  "Mulank",
  "Bhagya Ank",
  "Astrology × Numerology Convergence",
  "Ishdevta, Remedies & Dharmic Alignment",
  "Final Life Synthesis",
] as const;

export interface Membership {
  id: "copper" | "gold" | "platinum";
  name: string;
  metal: string;
  scope: string[];
  price: number | null;
}

export const MEMBERSHIPS: Membership[] = [
  {
    id: "copper",
    name: "COPPER",
    metal: "linear-gradient(135deg,#f6c7a1,#c47a48 45%,#7d4426)",
    scope: ["Daily Gita & Katha", "Saved profile", "All calculators", "Limited Sakhi access", "Member pricing"],
    price: null,
  },
  {
    id: "gold",
    name: "GOLD",
    metal: "linear-gradient(135deg,#fff1b8,#f0c95a 40%,#a97a22)",
    scope: [
      "Everything in Copper",
      "Personalised monthly guidance",
      "Timing updates",
      "Deeper Sakhi access",
      "Annual DRISHTI refresh",
      "Stronger discounts",
    ],
    price: null,
  },
  {
    id: "platinum",
    name: "PLATINUM",
    metal: "linear-gradient(135deg,#ffffff,#d8dde3 40%,#8c96a0)",
    scope: [
      "Everything in Gold",
      "Family profiles",
      "Multiple homes & Vastu records",
      "Premium timing",
      "Priority reports",
      "Preferential RadheyShyam Realtor access",
    ],
    price: null,
  },
];

export function formatPrice(p: Product): string {
  return p.price == null ? "Launch pricing soon" : `$${p.price}`;
}
