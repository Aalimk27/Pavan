/** Shared content schema for KATHA • GITA • GURUKUL (blueprint §9). */

export type GurukulSlug =
  | "anger"
  | "ego"
  | "comparison"
  | "desire"
  | "duty"
  | "fear"
  | "money"
  | "relationships"
  | "discipline"
  | "service"
  | "gratitude"
  | "leadership"
  | "success-and-failure";

export interface GitaVerse {
  /** "chapter.verse", e.g. "2.47" */
  id: string;
  chapter: number;
  verse: number;
  /** e.g. "Sankhya Yoga" */
  chapterName: string;
  /** Devanagari, half-verses separated by "\n" */
  sanskrit: string;
  /** IAST transliteration, lines separated by "\n" */
  transliteration: string;
  /** Faithful plain-English meaning of the verse */
  meaning: string;
  /** Deeper practical lesson for modern life, 2–4 sentences */
  lesson: string;
  /** One reflection question */
  reflection: string;
  /** One concrete action for today */
  action: string;
  themes: GurukulSlug[];
}

export type KathaTradition = "Upanishad" | "Ramayana" | "Mahabharata" | "Purana" | "Saints & Bhaktas";

export interface Katha {
  slug: string;
  title: string;
  /** Precise source, e.g. "Katha Upanishad, ch. 1" or "Ramayana tradition (regional retellings)" */
  source: string;
  tradition: KathaTradition;
  readingMinutes: number;
  /** One-line hook */
  summary: string;
  /** The story, as paragraphs */
  story: string[];
  /** Practical lesson for modern life */
  lesson: string;
  reflection: string;
  action: string;
  gurukul: GurukulSlug;
  /** Related Gita verse id */
  gita?: string;
}

export interface GurukulLesson {
  title: string;
  body: string[];
}

export interface GurukulTopic {
  slug: GurukulSlug;
  title: string;
  /** Devanagari term, e.g. "क्रोध" */
  sanskrit: string;
  /** Romanised term, e.g. "Krodha" */
  sanskritRoman: string;
  tagline: string;
  overview: string;
  lessons: GurukulLesson[];
  /** Seven-day practice, one line per day */
  practice: string[];
  reflection: string[];
  gita: string[];
  katha: string[];
}
