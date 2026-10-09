"use client";

/**
 * Sakhi's command bus — any page or component can talk to her:
 *
 *   import { sakhi } from "@/components/sakhi/bus";
 *   sakhi.whisper("That's your Bhagya Ank.", { selector: "#bhagya" });
 *   sakhi.open("What is my Mulank if I was born on 29 May 1992?");
 *   sakhi.say("Your snapshot is ready.", { cards: [...] });
 *   sakhi.celebrate();
 *   sakhi.guide([{ selector: "#snapshot", text: "Start here." }]);
 *
 * Elements can also carry `data-sakhi="…"`: hover or focus for a moment and Sakhi
 * glances at them and whispers the line.
 */

import type { GuideStep, Mood, SakhiCard, SakhiCommand } from "@/lib/sakhi/types";

export const SAKHI_EVENT = "sakhi:command";

function send(cmd: SakhiCommand) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<SakhiCommand>(SAKHI_EVENT, { detail: cmd }));
}

export const sakhi = {
  open: (message?: string) => send({ type: "open", message }),
  close: () => send({ type: "close" }),
  say: (text: string, opts: { cards?: SakhiCard[]; chips?: string[]; open?: boolean } = {}) => send({ type: "say", text, ...opts }),
  whisper: (text: string, opts: { selector?: string; cta?: { label: string; message?: string; href?: string }; ms?: number } = {}) =>
    send({ type: "whisper", text, ...opts }),
  mood: (mood: Mood, ms?: number) => send({ type: "mood", mood, ms }),
  guide: (steps: GuideStep[]) => send({ type: "guide", steps }),
  celebrate: (text?: string) => send({ type: "celebrate", text }),
};
