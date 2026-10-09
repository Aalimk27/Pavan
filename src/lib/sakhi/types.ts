import type { PillarKey } from "@/lib/site";
import type { RoomType } from "@/lib/vastu/engine";

export type Mood = "idle" | "attentive" | "listening" | "thinking" | "speaking" | "joy" | "resting";

export interface AnkCardItem {
  label: string;
  source: string;
  compound: number;
  root: number;
  chain: number[];
  title: string;
  essence: string;
}

export interface SnapshotCardData {
  name?: string;
  dateLabel: string;
  place: string;
  lagna?: { rashi: string; english: string; degree: string };
  moon: { rashi: string; english: string; degree: string };
  sun: { rashi: string; english: string };
  nakshatra: { name: string; pada: number; deity: string; lord: string };
  mahadasha: { lord: string; until: string };
  antardasha: { lord: string; until: string };
  confidence: "high" | "check-time";
  timeKnown: boolean;
}

export type SakhiCard =
  | { kind: "ank"; items: AnkCardItem[]; note?: string }
  | { kind: "snapshot"; data: SnapshotCardData }
  | { kind: "verse"; id: string }
  | { kind: "katha"; slug: string }
  | { kind: "gurukul"; slug: string }
  | { kind: "route"; pillar: PillarKey; title: string; text: string; href: string; cta: string }
  | { kind: "vastu-rule"; room: RoomType }
  | { kind: "sky" }
  | { kind: "products" }
  | { kind: "advisory" }
  | { kind: "care" }
  | { kind: "links"; links: { label: string; href: string }[] };

export interface ChatMessage {
  id: string;
  from: "sakhi" | "you";
  text: string;
  cards?: SakhiCard[];
  chips?: string[];
  ts: number;
}

export interface PendingSnapshot {
  intent: "snapshot";
  date?: { year: number; month: number; day: number };
  time?: { hour: number; minute: number } | null; // null = unknown
  place?: { name: string; lat: number; lon: number; tz: string };
  name?: string;
}

export interface BrainContext {
  path: string;
  pending: PendingSnapshot | null;
  now: Date;
}

export interface BrainReply {
  text: string;
  cards?: SakhiCard[];
  chips?: string[];
  navigate?: string;
  pending?: PendingSnapshot | null;
  mood?: Mood;
  /** When true the local brain had no confident answer — try the LLM layer. */
  deferToModel?: boolean;
  /** Settings changes requested in conversation */
  settings?: { voice?: boolean; whispers?: boolean };
  tour?: boolean;
  /** Birth details from a freshly computed snapshot, so "save" can store them. */
  profile?: {
    name: string;
    date: string;
    time: string | null;
    place: string;
    lat: number;
    lon: number;
    tz: string;
    summary: { lagna?: string; moon: string; nakshatra: string; mahadasha: string };
  };
  saveProfile?: boolean;
}

export interface GuideStep {
  selector: string;
  text: string;
}

export type SakhiCommand =
  | { type: "open"; message?: string }
  | { type: "close" }
  | { type: "say"; text: string; cards?: SakhiCard[]; chips?: string[]; open?: boolean }
  | { type: "whisper"; text: string; selector?: string; cta?: { label: string; message?: string; href?: string }; ms?: number }
  | { type: "mood"; mood: Mood; ms?: number }
  | { type: "guide"; steps: GuideStep[] }
  | { type: "celebrate"; text?: string };
