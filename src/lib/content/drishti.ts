import type { Graha } from "@/lib/astro/engine";

/**
 * DRISHTI snapshot interpretation library.
 * Tone rules (blueprint §3): guidance without fear, the person retains agency,
 * interpretation — not absolute control over life.
 */

export const RASHI_NATURE: Record<string, { mind: string; gift: string }> = {
  Mesha: { mind: "a mind that wants to begin, lead and act now", gift: "courage to take the first step" },
  Vrishabha: { mind: "a mind that seeks steadiness, beauty and things that last", gift: "patience that turns effort into value" },
  Mithuna: { mind: "a curious mind that thinks by connecting and conversing", gift: "learning quickly and explaining well" },
  Karka: { mind: "a caring mind that feels deeply and protects its people", gift: "emotional intelligence and nurture" },
  Simha: { mind: "a warm, generous mind that wants to shine and uplift", gift: "dignity, leadership and heart" },
  Kanya: { mind: "a precise mind that improves, organises and serves", gift: "craft, analysis and quiet usefulness" },
  Tula: { mind: "a balancing mind that seeks fairness and harmony", gift: "diplomacy and an eye for proportion" },
  Vrishchika: { mind: "an intense mind that goes deep and transforms", gift: "resilience and penetrating insight" },
  Dhanu: { mind: "an idealistic mind drawn to meaning, travel and truth", gift: "faith, optimism and teaching" },
  Makara: { mind: "a disciplined mind that builds patiently towards goals", gift: "responsibility and long-term achievement" },
  Kumbha: { mind: "an original mind that thinks for the many", gift: "vision, fairness and community" },
  Meena: { mind: "a compassionate, imaginative mind open to the unseen", gift: "devotion, intuition and kindness" },
};

export const LAGNA_NOTE: Record<string, string> = {
  Mesha: "You meet life head-on — energetic, direct and quick to act.",
  Vrishabha: "You meet life calmly — grounded, sensual and dependable.",
  Mithuna: "You meet life with curiosity — talkative, adaptable and bright.",
  Karka: "You meet life protectively — warm, intuitive and family-minded.",
  Simha: "You meet life with presence — confident, generous and noticed.",
  Kanya: "You meet life carefully — observant, helpful and exact.",
  Tula: "You meet life gracefully — pleasant, fair and relationship-oriented.",
  Vrishchika: "You meet life intensely — private, determined and perceptive.",
  Dhanu: "You meet life openly — frank, adventurous and principled.",
  Makara: "You meet life seriously — composed, practical and ambitious.",
  Kumbha: "You meet life independently — inventive, humane and unconventional.",
  Meena: "You meet life softly — gentle, imaginative and spiritually inclined.",
};

export const NAKSHATRA_ESSENCE: Record<string, string> = {
  Ashwini: "swift healing and new beginnings — the energy of the divine physicians",
  Bharani: "carrying and nurturing life — the strength to bear responsibility",
  Krittika: "the purifying flame — sharp clarity and honest standards",
  Rohini: "growth, beauty and fertility — the Moon's most beloved home",
  Mrigashira: "the gentle search — curiosity that seeks what is true",
  Ardra: "renewal after the storm — the power to clear and refresh",
  Punarvasu: "return of the light — optimism, forgiveness and a fresh start",
  Pushya: "nourishment — the most auspicious star for growth and care",
  Ashlesha: "deep perception — the wisdom to understand what is hidden",
  Magha: "honouring lineage — dignity, tradition and leadership",
  "Purva Phalguni": "rest and joy — creativity, affection and celebration",
  "Uttara Phalguni": "the helping hand — loyalty, contracts and generosity",
  Hasta: "skill in the hand — craft, humour and practical intelligence",
  Chitra: "the brilliant jewel — design, beauty and making things well",
  Swati: "the independent wind — flexibility, trade and self-direction",
  Vishakha: "the determined goal — focus that achieves over time",
  Anuradha: "devoted friendship — loyalty, cooperation and success abroad",
  Jyeshtha: "the protective elder — responsibility and inner strength",
  Mula: "the root — seeking the essence beneath every question",
  "Purva Ashadha": "invincible conviction — renewal, persuasion and purpose",
  "Uttara Ashadha": "lasting victory — integrity that wins steadily",
  Shravana: "the listener — learning, wisdom and connection",
  Dhanishta: "rhythm and abundance — music, generosity and teamwork",
  Shatabhisha: "a hundred healers — research, solitude and remedy",
  "Purva Bhadrapada": "the inner fire — idealism, intensity and transformation",
  "Uttara Bhadrapada": "the deep waters — patience, wisdom and calm strength",
  Revati: "the nourisher of journeys — kindness, protection and completion",
};

/** Life-period themes — what a dasha period invites you to cultivate. */
export const DASHA_THEME: Record<Graha, { theme: string; cultivate: string }> = {
  Sun: { theme: "purpose, authority and self-respect", cultivate: "Rise early, lead with integrity and honour your father-figures." },
  Moon: { theme: "emotions, home, nourishment and public connection", cultivate: "Protect your peace, keep a gentle routine and care for your mother-figures." },
  Mars: { theme: "energy, courage, property and decisive action", cultivate: "Exercise daily and turn heat into disciplined effort." },
  Rahu: { theme: "ambition, innovation, foreign connections and the unconventional", cultivate: "Pursue big goals with clean means; ground yourself in routine." },
  Jupiter: { theme: "wisdom, growth, teachers, children and good counsel", cultivate: "Study, teach and give generously — expansion follows sincerity." },
  Saturn: { theme: "discipline, service, endurance and lasting structures", cultivate: "Work patiently, serve others and keep commitments — Shani rewards honesty." },
  Mercury: { theme: "learning, communication, business and skill", cultivate: "Sharpen a skill, write, trade and keep accounts clean." },
  Ketu: { theme: "detachment, insight, spirituality and letting go", cultivate: "Simplify, meditate and release what no longer serves you." },
  Venus: { theme: "love, beauty, comfort, art and relationships", cultivate: "Create beauty, honour relationships and enjoy with moderation." },
};
