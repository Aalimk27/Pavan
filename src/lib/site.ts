/** Site-wide configuration — brand, navigation, pillars and the clarity selector. */

export const SITE = {
  name: "PREM MARG",
  short: "Prem Marg",
  promise: "A Better Way to Live",
  definition:
    "A global dharmic guidance platform that turns timeless wisdom and traditional systems into clearer thinking, better choices and better action — without fear.",
  northStar:
    "Help people understand themselves, understand their homes, improve their choices and live with greater discipline, compassion and clarity — without fear-based selling.",
  proposition: "Understand yourself. Understand your space. Understand your numbers. Then use timeless wisdom to live better.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://premarga.com",
  domain: "premarga.com",
  founderBrand: "RadheyShyam Realtor",
  founderUrl: "https://radheyshyamrealtor.com",
  openingQuestion: "What would you like clarity about today?",
} as const;

export type PillarKey = "drishti" | "vastu" | "ank" | "katha" | "gita" | "gurukul";

export interface Pillar {
  key: PillarKey;
  name: string;
  devanagari: string;
  meaning: string;
  kind: string;
  href: string;
  line: string;
  free: string;
  beta?: boolean;
}

export const PILLARS: readonly Pillar[] = [
  {
    key: "drishti",
    name: "DRISHTI",
    devanagari: "दृष्टि",
    meaning: "vision",
    kind: "Personal intelligence",
    href: "/drishti",
    line: "Your Vedic chart, timing, career, wealth, relationships, dharma and remedies — read with care.",
    free: "Free snapshot: Lagna, Moon, Nakshatra and your current life period",
  },
  {
    key: "vastu",
    name: "VASTU",
    devanagari: "वास्तु",
    meaning: "dwelling",
    kind: "Spatial intelligence",
    href: "/vastu",
    line: "Upload your floor plan. Confirm North, boundary and rooms. Receive practical, room-by-room guidance.",
    free: "Free preview: Brahmasthan, zones and first findings",
    beta: true,
  },
  {
    key: "ank",
    name: "ANK",
    devanagari: "अंक",
    meaning: "number",
    kind: "Number intelligence",
    href: "/ank",
    line: "Mulank, Bhagya Ank and your home number — strengths and watch-outs, never verdicts.",
    free: "Free calculators: Mulank, Bhagya Ank, Home Number",
  },
  {
    key: "katha",
    name: "KATHA",
    devanagari: "कथा",
    meaning: "sacred story",
    kind: "Daily story",
    href: "/katha",
    line: "One sacred story each day, translated into a practical lesson for modern life.",
    free: "Free, every day",
  },
  {
    key: "gita",
    name: "GITA",
    devanagari: "गीता",
    meaning: "the song",
    kind: "Daily verse",
    href: "/gita",
    line: "One Bhagavad Gita verse each day — Sanskrit, meaning, reflection and one action for today.",
    free: "Free, every day",
  },
  {
    key: "gurukul",
    name: "GURUKUL",
    devanagari: "गुरुकुल",
    meaning: "the teacher's home",
    kind: "Life education",
    href: "/gurukul",
    line: "Structured learning on anger, ego, comparison, duty, desire, money, service, relationships and discipline.",
    free: "Open learning paths",
  },
];

export const NAV_PRIMARY = [
  { href: "/drishti", label: "Drishti" },
  { href: "/vastu", label: "Vastu", beta: true },
  { href: "/ank", label: "Ank" },
  { href: "/katha", label: "Katha" },
  { href: "/gita", label: "Gita" },
  { href: "/gurukul", label: "Gurukul" },
] as const;

export const NAV_SECONDARY = [
  { href: "/membership", label: "Membership" },
  { href: "/my", label: "My Prem Marg" },
  { href: "/advisory", label: "Private Advisory" },
  { href: "/sakhi", label: "Meet Sakhi" },
  { href: "/about", label: "Philosophy" },
] as const;

export type ClarityKey = "career" | "relationships" | "money" | "future" | "home" | "numbers" | "mind" | "spirit";

export interface ClarityOption {
  key: ClarityKey;
  label: string;
  glyph: string;
  route: PillarKey;
  href: string;
  /** What Sakhi says when this is chosen (blueprint §5: route → preview before payment). */
  sakhi: string;
  cta: string;
}

export const CLARITY: readonly ClarityOption[] = [
  {
    key: "career",
    label: "Career",
    glyph: "☀",
    route: "drishti",
    href: "/drishti#snapshot",
    sakhi: "Career clarity comes from knowing your nature and your timing. DRISHTI reads both. Let's begin with a free snapshot — your Lagna, Moon, Nakshatra and the life period you are in now.",
    cta: "Get my free snapshot",
  },
  {
    key: "relationships",
    label: "Relationships",
    glyph: "❀",
    route: "drishti",
    href: "/drishti#snapshot",
    sakhi: "Relationships begin with understanding your own heart. Your Moon and Nakshatra describe how you feel and connect. Shall we look at them together — free?",
    cta: "See my Moon & Nakshatra",
  },
  {
    key: "money",
    label: "Money",
    glyph: "◈",
    route: "drishti",
    href: "/drishti#snapshot",
    sakhi: "Wealth has a rhythm — habits, timing and the way you work. Start with your free snapshot; your current life period says a lot about where effort is best placed.",
    cta: "Start my free snapshot",
  },
  {
    key: "future",
    label: "Future",
    glyph: "✧",
    route: "drishti",
    href: "/drishti#snapshot",
    sakhi: "The future isn't fixed — you shape it. Vimshottari timing shows the theme of the season you are in, so you can act with it. Want to see your current period?",
    cta: "See my life period",
  },
  {
    key: "home",
    label: "Home",
    glyph: "⌂",
    route: "vastu",
    href: "/vastu",
    sakhi: "A home should support the people in it. Upload your floor plan, confirm North and your rooms, and I'll show you its centre, its zones and the first gentle findings.",
    cta: "Open the Vastu studio",
  },
  {
    key: "numbers",
    label: "Numbers",
    glyph: "९",
    route: "ank",
    href: "/ank",
    sakhi: "Numbers are a mirror, not a verdict. Your Mulank, Bhagya Ank and home number each tell a small story — all three calculators are free.",
    cta: "Calculate my numbers",
  },
  {
    key: "mind",
    label: "Mind",
    glyph: "◐",
    route: "gita",
    href: "/gita",
    sakhi: "When the mind is restless, the Gita is a steady friend. Today's verse comes with its meaning, a reflection and one small action. Shall I read it with you?",
    cta: "Read today's verse",
  },
  {
    key: "spirit",
    label: "Spiritual life",
    glyph: "ॐ",
    route: "gurukul",
    href: "/gurukul",
    sakhi: "Spiritual life is lived in small daily choices. Gurukul turns Gita and Katha into practice — seven days at a time. Where would you like to begin?",
    cta: "Enter Gurukul",
  },
];
