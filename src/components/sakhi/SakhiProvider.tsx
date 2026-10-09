"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { respond, starterChips } from "@/lib/sakhi/brain";
import type { BrainReply, ChatMessage, GuideStep, Mood, PendingSnapshot, SakhiCard, SakhiCommand } from "@/lib/sakhi/types";
import { GREETING, dayPhase } from "@/lib/daily";
import { SITE } from "@/lib/site";
import { track } from "@/lib/analytics";
import { getState, saveProfile, setSakhiPrefs, usePremMarg } from "@/lib/store";
import { SAKHI_EVENT } from "./bus";
import SakhiMark, { setLookTarget } from "./SakhiMark";
import SakhiPanel from "./SakhiPanel";
import { HOME_TOUR, whisperFor } from "./presence";
import { canSpeak, speak, stopSpeaking } from "./voice";
import "./sakhi.css";

/* ───────────────────────────── Context ───────────────────────────── */

interface Whisper {
  id: number;
  text: string;
  cta?: { label: string; message?: string; href?: string };
}

interface SakhiApi {
  mood: Mood;
  open: boolean;
  messages: ChatMessage[];
  busy: boolean;
  typingId: string | null;
  voice: boolean;
  whispers: boolean;
  openPanel: (message?: string) => void;
  closePanel: () => void;
  send: (text: string) => void;
  setVoice: (on: boolean) => void;
  setWhispers: (on: boolean) => void;
  setMood: (m: Mood, ms?: number) => void;
  whisper: (text: string, opts?: { selector?: string; cta?: Whisper["cta"]; ms?: number }) => void;
  guide: (steps: GuideStep[]) => void;
  celebrate: (text?: string) => void;
  /** The homepage hero hosts Sakhi in person; while it's on screen the orb steps back. */
  setHeroPresence: (visible: boolean) => void;
  heroPresent: boolean;
}

const Ctx = createContext<SakhiApi | null>(null);

export function useSakhi(): SakhiApi {
  const c = useContext(Ctx);
  if (!c) throw new Error("useSakhi must be used inside <SakhiProvider>");
  return c;
}

const mid = () => Math.random().toString(36).slice(2, 10);

/* ───────────────────────────── Amplitude (her light moves with her words) ───────────────────────────── */

let ampRaf = 0;
let amp = 0;
export function pulse(strength = 1) {
  amp = Math.min(1, Math.max(amp, strength));
  if (ampRaf) return;
  const step = () => {
    amp *= 0.86;
    document.documentElement.style.setProperty("--sk-amp", amp.toFixed(3));
    if (amp > 0.01) ampRaf = requestAnimationFrame(step);
    else {
      ampRaf = 0;
      document.documentElement.style.setProperty("--sk-amp", "0");
    }
  };
  ampRaf = requestAnimationFrame(step);
}

/* ───────────────────────────── Provider ───────────────────────────── */

export default function SakhiProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || "/";
  const prefs = usePremMarg((s) => s.sakhi);

  const [open, setOpen] = useState(false);
  const [mood, setMoodState] = useState<Mood>("idle");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [typingId, setTypingId] = useState<string | null>(null);
  const [whisperState, setWhisperState] = useState<Whisper | null>(null);
  const [whisperLeaving, setWhisperLeaving] = useState(false);
  const [heroPresent, setHeroPresent] = useState(false);
  const [guideState, setGuideState] = useState<{ steps: GuideStep[]; index: number } | null>(null);
  const [spot, setSpot] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [cardPos, setCardPos] = useState<{ top: number; left: number } | null>(null);
  const [orbOffset, setOrbOffset] = useState<{ x: number; y: number } | null>(null);
  const [sparks, setSparks] = useState<number[]>([]);

  const pendingRef = useRef<PendingSnapshot | null>(null);
  const lastProfileRef = useRef<BrainReply["profile"]>(undefined);
  const moodTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const whisperTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const greetedRef = useRef(false);
  const messagesRef = useRef<ChatMessage[]>([]);
  messagesRef.current = messages;

  const voice = prefs.voice;
  const whispers = prefs.whispers;

  /* ── mood ── */
  const setMood = useCallback((m: Mood, ms?: number) => {
    if (moodTimer.current) clearTimeout(moodTimer.current);
    setMoodState(m);
    if (ms) moodTimer.current = setTimeout(() => setMoodState("idle"), ms);
  }, []);

  /* ── whispers ── */
  const dismissWhisper = useCallback(() => {
    setWhisperLeaving(true);
    setTimeout(() => {
      setWhisperState(null);
      setWhisperLeaving(false);
      setLookTarget(null);
    }, 280);
  }, []);

  const whisper = useCallback<SakhiApi["whisper"]>(
    (text, opts = {}) => {
      if (whisperTimer.current) clearTimeout(whisperTimer.current);
      setWhisperLeaving(false);
      setWhisperState({ id: Date.now(), text, cta: opts.cta });
      if (opts.selector) {
        const el = document.querySelector(opts.selector);
        if (el) {
          const r = el.getBoundingClientRect();
          setLookTarget({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        }
      }
      setMood("attentive", 1600);
      const words = text.split(/\s+/).length;
      let i = 0;
      const tick = setInterval(() => {
        pulse(0.55);
        if (++i >= Math.min(words, 18)) clearInterval(tick);
      }, 90);
      whisperTimer.current = setTimeout(dismissWhisper, opts.ms ?? 5200 + text.length * 38);
    },
    [dismissWhisper, setMood],
  );

  /* ── conversation ── */
  const pushSakhi = useCallback(
    (text: string, cards?: SakhiCard[], chips?: string[]) => {
      const id = mid();
      setMessages((m) => [...m, { id, from: "sakhi", text, cards, chips, ts: Date.now() }]);
      setTypingId(id);
      setMood("speaking");
      if (voice && canSpeak()) {
        speak(text, {
          onWord: () => pulse(1),
          onEnd: () => setMood("idle"),
        });
      } else {
        const words = text.split(/\s+/).length;
        let i = 0;
        const tick = setInterval(() => {
          pulse(0.8);
          if (++i >= words) {
            clearInterval(tick);
            setMood("idle");
          }
        }, 70);
      }
    },
    [setMood, voice],
  );

  const greet = useCallback(() => {
    if (greetedRef.current) return;
    greetedRef.current = true;
    const g = GREETING[dayPhase()];
    pushSakhi(`${g.en} — ${g.hi}. I'm Sakhi, your companion on Prem Marg. ${g.note} ${SITE.openingQuestion}`, undefined, starterChips());
  }, [pushSakhi]);

  const runGuideRef = useRef<(steps: GuideStep[]) => void>(() => {});

  const applyReply = useCallback(
    (reply: BrainReply) => {
      if ("pending" in reply) pendingRef.current = reply.pending ?? null;
      if (reply.profile) lastProfileRef.current = reply.profile;
      if (reply.saveProfile) {
        const p = lastProfileRef.current;
        if (p) saveProfile(p);
        else {
          pushSakhi("There's nothing to save yet — shall we calculate your snapshot first?", undefined, ["My free DRISHTI snapshot"]);
          return;
        }
      }
      if (reply.settings) setSakhiPrefs(reply.settings);
      if (reply.settings?.voice === false) stopSpeaking();
      pushSakhi(reply.text, reply.cards, reply.chips);
      if (reply.mood === "joy") setTimeout(() => setMood("joy", 1800), 400);
      if (reply.navigate && reply.navigate !== pathname) {
        const href = reply.navigate;
        setTimeout(() => router.push(href), 900);
      }
      if (reply.tour) {
        setTimeout(() => {
          setOpen(false);
          setTimeout(() => runGuideRef.current(HOME_TOUR), reply.navigate ? 1400 : 500);
        }, 1100);
      }
    },
    [pathname, pushSakhi, router, setMood],
  );

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim();
      if (!text) return;
      stopSpeaking();
      setMessages((m) => [...m, { id: mid(), from: "you", text, ts: Date.now() }]);
      track("sakhi_message", { path: pathname });
      setBusy(true);
      setMood("thinking");
      const reply = respond(text, { path: pathname, pending: pendingRef.current, now: new Date() });
      await new Promise((r) => setTimeout(r, 420 + Math.min(700, text.length * 9)));

      if (reply.deferToModel) {
        try {
          const history = [...messagesRef.current, { from: "you" as const, text }]
            .slice(-10)
            .map((m) => ({ role: m.from === "you" ? "user" : "assistant", content: m.text }));
          const res = await fetch("/api/sakhi", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: history, path: pathname }),
          });
          if (res.ok) {
            const data = (await res.json()) as { reply?: string | null };
            if (data.reply) {
              setBusy(false);
              applyReply({ text: data.reply, chips: starterChips().slice(0, 3) });
              return;
            }
          }
        } catch {
          /* offline — fall back to the local reply */
        }
      }
      setBusy(false);
      applyReply(reply);
    },
    [applyReply, pathname, setMood],
  );

  const openPanel = useCallback(
    (message?: string) => {
      setOpen(true);
      track("sakhi_opened", { path: pathname });
      if (whisperState) dismissWhisper();
      if (!greetedRef.current && !message) greet();
      else greetedRef.current = true;
      if (message) setTimeout(() => send(message), 350);
    },
    [dismissWhisper, greet, pathname, send, whisperState],
  );

  const closePanel = useCallback(() => {
    setOpen(false);
    stopSpeaking();
  }, []);

  /* ── celebration ── */
  const celebrate = useCallback(
    (text?: string) => {
      setMood("joy", 2000);
      setSparks(Array.from({ length: 14 }, (_, i) => Date.now() + i));
      setTimeout(() => setSparks([]), 1300);
      if (text) whisper(text);
    },
    [setMood, whisper],
  );

  /* ── guided spotlight tour; the orb flies beside each stop ── */
  const placeGuide = useCallback((steps: GuideStep[], index: number) => {
    const step = steps[index];
    const el = step ? (document.querySelector(step.selector) as HTMLElement | null) : null;
    if (!el) {
      setGuideState(null);
      setSpot(null);
      setOrbOffset(null);
      return;
    }
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => {
      const r = el.getBoundingClientRect();
      const pad = 12;
      const top = Math.max(8, r.top - pad);
      const height = Math.min(window.innerHeight - 16, r.height + pad * 2);
      setSpot({ top, left: r.left - pad, width: r.width + pad * 2, height });
      const cardW = Math.min(340, window.innerWidth - 32);
      const below = top + height + 16;
      const cardTop = below + 170 < window.innerHeight ? below : Math.max(16, top - 190);
      const cardLeft = Math.min(Math.max(16, r.left + r.width / 2 - cardW / 2), window.innerWidth - cardW - 16);
      setCardPos({ top: cardTop, left: cardLeft });
      // Fly the orb to sit just beside the card.
      const orbSize = window.innerWidth < 640 ? 64 : 76;
      const homeX = window.innerWidth - 18 - orbSize / 2;
      const homeY = window.innerHeight - 18 - orbSize / 2;
      const targetX = Math.min(window.innerWidth - orbSize / 2 - 8, cardLeft + cardW + orbSize / 2 + 6);
      const targetY = cardTop + 30;
      setOrbOffset({ x: targetX - homeX, y: targetY - homeY });
      setLookTarget({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
      setMood("speaking", 1600);
      const words = steps[index].text.split(/\s+/).length;
      let i = 0;
      const tick = setInterval(() => {
        pulse(0.8);
        if (++i >= words) clearInterval(tick);
      }, 80);
      if (voice) speak(steps[index].text, { onWord: () => pulse(1) });
    }, 650);
  }, [setMood, voice]);

  const guide = useCallback(
    (steps: GuideStep[]) => {
      if (!steps.length) return;
      setOpen(false);
      setWhisperState(null);
      setGuideState({ steps, index: 0 });
      placeGuide(steps, 0);
    },
    [placeGuide],
  );
  runGuideRef.current = guide;

  const endGuide = useCallback(() => {
    setGuideState(null);
    setSpot(null);
    setCardPos(null);
    setOrbOffset(null);
    setLookTarget(null);
    stopSpeaking();
  }, []);

  const nextGuide = useCallback(() => {
    if (!guideState) return;
    const n = guideState.index + 1;
    if (n >= guideState.steps.length) {
      endGuide();
      celebrate();
      return;
    }
    setGuideState({ ...guideState, index: n });
    placeGuide(guideState.steps, n);
  }, [celebrate, endGuide, guideState, placeGuide]);

  /* ── command bus ── */
  useEffect(() => {
    const onCmd = (e: Event) => {
      const cmd = (e as CustomEvent<SakhiCommand>).detail;
      switch (cmd.type) {
        case "open":
          openPanel(cmd.message);
          break;
        case "close":
          closePanel();
          break;
        case "say":
          greetedRef.current = true;
          if (cmd.open !== false) setOpen(true);
          pushSakhi(cmd.text, cmd.cards, cmd.chips);
          break;
        case "whisper":
          if (getState().sakhi.whispers || cmd.cta) whisper(cmd.text, cmd);
          break;
        case "mood":
          setMood(cmd.mood, cmd.ms);
          break;
        case "guide":
          guide(cmd.steps);
          break;
        case "celebrate":
          celebrate(cmd.text);
          break;
      }
    };
    window.addEventListener(SAKHI_EVENT, onCmd);
    return () => window.removeEventListener(SAKHI_EVENT, onCmd);
  }, [celebrate, closePanel, guide, openPanel, pushSakhi, setMood, whisper]);

  /* ── data-sakhi: linger on something and she glances at it and whispers ── */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    let current: Element | null = null;
    const onOver = (e: Event) => {
      const el = (e.target as Element | null)?.closest?.("[data-sakhi]");
      if (!el || el === current) return;
      current = el;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (!getState().sakhi.whispers) return;
        const r = el.getBoundingClientRect();
        setLookTarget({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
        whisper(el.getAttribute("data-sakhi") || "");
      }, 1100);
    };
    const onOut = (e: Event) => {
      if (!current) return;
      const rel = (e as FocusEvent | PointerEvent).relatedTarget as Node | null;
      if (rel && current.contains(rel)) return;
      const el = (e.target as Element | null)?.closest?.("[data-sakhi]");
      if (el === current) {
        current = null;
        if (timer) clearTimeout(timer);
      }
    };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    document.addEventListener("focusin", onOver);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", onOver);
      document.removeEventListener("focusout", onOut);
      if (timer) clearTimeout(timer);
    };
  }, [whisper]);

  /* ── arrival whispers (once per page per visit) ── */
  useEffect(() => {
    if (pathname === "/") return;
    const w = whisperFor(pathname);
    if (!w) return;
    const key = `sakhi:seen:${pathname}`;
    try {
      if (sessionStorage.getItem(key)) return;
    } catch {
      /* ignore */
    }
    const t = setTimeout(() => {
      if (!getState().sakhi.whispers) return;
      try {
        sessionStorage.setItem(key, "1");
      } catch {
        /* ignore */
      }
      whisper(w.text, { cta: w.cta });
    }, 2600);
    return () => clearTimeout(t);
  }, [pathname, whisper]);

  /* ── resting when you're away, waking when you return ── */
  useEffect(() => {
    let idle: ReturnType<typeof setTimeout>;
    let resting = false;
    const wake = () => {
      if (resting) {
        resting = false;
        setMoodState((m) => (m === "resting" ? "idle" : m));
      }
      clearTimeout(idle);
      idle = setTimeout(() => {
        resting = true;
        setMoodState((m) => (m === "idle" ? "resting" : m));
      }, 70000);
    };
    wake();
    const evs = ["pointermove", "keydown", "scroll", "touchstart"] as const;
    evs.forEach((ev) => window.addEventListener(ev, wake, { passive: true }));
    return () => {
      clearTimeout(idle);
      evs.forEach((ev) => window.removeEventListener(ev, wake));
    };
  }, []);

  /* ── keyboard: "/" calls Sakhi, Esc releases ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || (e.target as HTMLElement)?.isContentEditable;
      if (e.key === "/" && !typing && !open) {
        e.preventDefault();
        openPanel();
      } else if (e.key === "Escape") {
        if (guideState) endGuide();
        else if (open) closePanel();
      } else if (guideState && (e.key === "ArrowRight" || e.key === "Enter") && !typing) {
        nextGuide();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closePanel, endGuide, guideState, nextGuide, open, openPanel]);

  useEffect(() => {
    if (!guideState) return;
    const onResize = () => placeGuide(guideState.steps, guideState.index);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [guideState, placeGuide]);

  const api = useMemo<SakhiApi>(
    () => ({
      mood,
      open,
      messages,
      busy,
      typingId,
      voice,
      whispers,
      openPanel,
      closePanel,
      send,
      setVoice: (on) => {
        setSakhiPrefs({ voice: on });
        if (!on) stopSpeaking();
        track("sakhi_voice", { on });
      },
      setWhispers: (on) => setSakhiPrefs({ whispers: on }),
      setMood,
      whisper,
      guide,
      celebrate,
      setHeroPresence: setHeroPresent,
      heroPresent,
    }),
    [busy, celebrate, closePanel, guide, heroPresent, messages, mood, open, openPanel, send, setMood, typingId, voice, whisper, whispers],
  );

  const orbHidden = heroPresent && !guideState;

  return (
    <Ctx.Provider value={api}>
      {children}

      {/* Floating presence */}
      <div
        className={`sakhi-orb${orbHidden ? " is-hidden" : ""}${open ? " is-panel-open" : ""}${orbOffset ? " is-flying" : ""}`}
        style={orbOffset && !orbHidden ? { transform: `translate(${orbOffset.x}px, ${orbOffset.y}px)` } : undefined}
      >
        <span className="sakhi-orb__tag">ASK SAKHI · /</span>
        <button type="button" className="sakhi-orb__btn" onClick={() => (guideState ? nextGuide() : openPanel())} aria-label="Talk to Sakhi, your Prem Marg companion">
          <span className="sakhi-aura" aria-hidden />
          <SakhiMark size={68} mood={mood} barbs={false} decorative />
        </button>
        {sparks.map((s, i) => {
          const a = (i / sparks.length) * Math.PI * 2;
          return (
            <span
              key={s}
              className="sakhi-spark"
              style={{ ["--dx" as string]: `${Math.cos(a) * (50 + (i % 3) * 18)}px`, ["--dy" as string]: `${Math.sin(a) * (50 + (i % 3) * 18)}px` }}
            />
          );
        })}
      </div>

      {/* Whisper */}
      {whisperState && !open && !guideState && (
        <div
          key={whisperState.id}
          className={`sakhi-whisper${whisperLeaving ? " is-leaving" : ""}`}
          role="status"
          aria-live="polite"
          onPointerEnter={() => whisperTimer.current && clearTimeout(whisperTimer.current)}
          onPointerLeave={() => (whisperTimer.current = setTimeout(dismissWhisper, 2500))}
          style={orbHidden ? { bottom: 24 } : undefined}
        >
          <div className="sakhi-whisper__who">✦ SAKHI</div>
          <p className="sakhi-whisper__text">{whisperState.text}</p>
          {whisperState.cta && (
            <div className="sakhi-whisper__actions">
              <button
                type="button"
                className="btn btn--sm"
                onClick={() => {
                  const cta = whisperState.cta!;
                  dismissWhisper();
                  if (cta.href) router.push(cta.href);
                  else openPanel(cta.message);
                }}
              >
                {whisperState.cta.label}
              </button>
              <button type="button" className="btn btn--sm btn--ghost" onClick={dismissWhisper}>
                Later
              </button>
            </div>
          )}
          <button type="button" className="sakhi-whisper__close" onClick={dismissWhisper} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      {/* Guided tour */}
      {guideState && (
        <>
          <div className="sakhi-guide-catcher" onClick={endGuide} aria-hidden />
          {spot && <div className="sakhi-spotlight" style={spot} aria-hidden />}
          {cardPos && (
            <div className="sakhi-guide-card" style={cardPos} role="dialog" aria-label="Sakhi's guided tour">
              <div className="sakhi-guide-card__step">
                Sakhi · {guideState.index + 1} of {guideState.steps.length}
              </div>
              <p style={{ margin: "8px 0 12px" }}>{guideState.steps[guideState.index].text}</p>
              <div className="row">
                <button type="button" className="btn btn--sm" onClick={nextGuide}>
                  {guideState.index + 1 === guideState.steps.length ? "Finish" : "Next"}
                </button>
                <button type="button" className="btn btn--sm btn--ghost" onClick={endGuide}>
                  End tour
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <div className={`sakhi-scrim${open ? " is-open" : ""}`} onClick={closePanel} aria-hidden />
      <SakhiPanel />
    </Ctx.Provider>
  );
}
