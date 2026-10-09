"use client";

/**
 * Sakhi's voice — Web Speech API.
 * Speaking emits a pulse on every word boundary so her light "moves with her words".
 * Listening streams interim transcripts so the person sees themselves being heard.
 */

let cachedVoice: SpeechSynthesisVoice | null | undefined;

const PREFERRED = [
  /en-IN.*(female|neerja|veena|heera|swara|aditi|kajal)/i,
  /(neerja|veena|heera|aditi|kajal|swara)/i,
  /en-IN/i,
  /(samantha|karen|moira|tessa|serena|fiona|victoria|google uk english female|libby|sonia|aria|jenny|natasha)/i,
  /en-GB/i,
  /en-/i,
];

function pickVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice !== undefined) return cachedVoice;
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return (cachedVoice = null);
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null; // not loaded yet; try again next time
  for (const re of PREFERRED) {
    const v = voices.find((x) => re.test(`${x.lang} ${x.name}`));
    if (v) return (cachedVoice = v);
  }
  return (cachedVoice = voices[0] ?? null);
}

export function canSpeak(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Strip emoji and symbols that synthesisers read awkwardly. */
function speakable(text: string): string {
  return text
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}✦✧◈◐❀☀⌂ॐ🪔🙏✨]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function speak(text: string, handlers: { onWord?: () => void; onEnd?: () => void } = {}): () => void {
  if (!canSpeak()) {
    handlers.onEnd?.();
    return () => {};
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(speakable(text));
  const v = pickVoice();
  if (v) {
    u.voice = v;
    u.lang = v.lang;
  } else {
    u.lang = "en-IN";
  }
  u.rate = 0.98;
  u.pitch = 1.08;
  u.onboundary = (e) => {
    if (e.name === "word" || e.name === undefined) handlers.onWord?.();
  };
  u.onend = () => handlers.onEnd?.();
  u.onerror = () => handlers.onEnd?.();
  synth.speak(u);
  return () => synth.cancel();
}

/** Speak Sanskrit with a Hindi voice when available (for Gita verses). */
export function speakSanskrit(text: string, onEnd?: () => void): () => void {
  if (!canSpeak()) return () => {};
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/[।॥०-९\d-]/g, " "));
  const hi = synth.getVoices().find((v) => /hi-IN|sa-IN|mr-IN/i.test(v.lang));
  if (hi) u.voice = hi;
  u.lang = hi?.lang ?? "hi-IN";
  u.rate = 0.82;
  u.onend = () => onEnd?.();
  u.onerror = () => onEnd?.();
  synth.speak(u);
  return () => synth.cancel();
}

export function stopSpeaking() {
  if (canSpeak()) window.speechSynthesis.cancel();
}

/* ───────────────────────────── Listening ───────────────────────────── */

interface RecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

export function canListen(): boolean {
  if (typeof window === "undefined") return false;
  const w = window as unknown as Record<string, unknown>;
  return !!(w.SpeechRecognition || w.webkitSpeechRecognition);
}

export function listen(handlers: {
  onInterim?: (text: string) => void;
  onFinal: (text: string) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}): () => void {
  const w = window as unknown as Record<string, new () => RecognitionLike>;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) {
    handlers.onError?.("unsupported");
    return () => {};
  }
  const rec = new Ctor();
  rec.lang = navigator.language?.startsWith("hi") ? "hi-IN" : "en-IN";
  rec.interimResults = true;
  rec.continuous = false;
  let finalText = "";
  rec.onresult = (e) => {
    let interim = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) finalText += r[0].transcript;
      else interim += r[0].transcript;
    }
    if (interim) handlers.onInterim?.(finalText + interim);
  };
  rec.onerror = (e) => handlers.onError?.(e.error);
  rec.onend = () => {
    if (finalText.trim()) handlers.onFinal(finalText.trim());
    handlers.onEnd?.();
  };
  try {
    rec.start();
  } catch {
    handlers.onError?.("start-failed");
  }
  return () => rec.abort();
}
