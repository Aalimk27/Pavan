"use client";

import { useEffect, useRef, useState } from "react";
import { useSakhi } from "./SakhiProvider";
import SakhiMark from "./SakhiMark";
import SakhiCards from "./SakhiCards";
import { canListen, listen } from "./voice";

const STATUS: Record<string, string> = {
  idle: "Here with you · always",
  attentive: "Listening closely",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking",
  joy: "Delighted",
  resting: "Resting · tap to wake",
};

function Typewriter({ text, onDone }: { text: string; onDone: () => void }) {
  const words = text.split(/(\s+)/);
  const [n, setN] = useState(0);
  const done = useRef(false);
  useEffect(() => {
    if (n >= words.length) {
      if (!done.current) {
        done.current = true;
        onDone();
      }
      return;
    }
    const t = setTimeout(() => setN((x) => x + 2), 38);
    return () => clearTimeout(t);
  }, [n, onDone, words.length]);
  return (
    <span className={n < words.length ? "sk-caret" : undefined}>
      {words.slice(0, n).join("")}
    </span>
  );
}

export default function SakhiPanel() {
  const s = useSakhi();
  const [draft, setDraft] = useState("");
  const [listening, setListening] = useState(false);
  const [typedIds, setTypedIds] = useState<Set<string>>(new Set());
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const stopListenRef = useRef<() => void>(() => {});
  const [micSupported, setMicSupported] = useState(false);

  useEffect(() => setMicSupported(canListen()), []);

  useEffect(() => {
    if (s.open) setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 450);
  }, [s.open]);

  useEffect(() => {
    const el = logRef.current;
    if (!el) return;
    const id = requestAnimationFrame(() => (el.scrollTop = el.scrollHeight));
    return () => cancelAnimationFrame(id);
  });

  const submit = (text: string) => {
    if (!text.trim()) return;
    s.send(text);
    setDraft("");
  };

  const toggleMic = () => {
    if (listening) {
      stopListenRef.current();
      setListening(false);
      s.setMood("idle");
      return;
    }
    setListening(true);
    s.setMood("listening");
    stopListenRef.current = listen({
      onInterim: (t) => setDraft(t),
      onFinal: (t) => {
        setDraft("");
        s.send(t);
      },
      onEnd: () => {
        setListening(false);
      },
      onError: () => {
        setListening(false);
        s.setMood("idle");
      },
    });
  };

  const last = s.messages[s.messages.length - 1];
  const mood = listening ? "listening" : s.busy ? "thinking" : s.mood;

  return (
    <aside className={`sakhi-panel${s.open ? " is-open" : ""}`} aria-label="Conversation with Sakhi" aria-hidden={!s.open} inert={!s.open || undefined}>
      <header className="sakhi-panel__head">
        <div className="sakhi-panel__avatar">
          <span className="sakhi-aura" aria-hidden />
          <SakhiMark size={74} mood={mood} barbs decorative />
        </div>
        <div>
          <p className="sakhi-panel__name">Sakhi</p>
          <div className="sakhi-panel__status">
            <i aria-hidden /> {STATUS[mood]}
          </div>
        </div>
        <div className="sakhi-panel__tools">
          <button type="button" className="sk-icon-btn" aria-pressed={s.voice} onClick={() => s.setVoice(!s.voice)} title={s.voice ? "Voice on" : "Voice off"} aria-label="Sakhi's voice">
            {s.voice ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M17 9l5 6M22 9l-5 6" /></svg>
            )}
          </button>
          <button type="button" className="sk-icon-btn" aria-pressed={s.whispers} onClick={() => s.setWhispers(!s.whispers)} title={s.whispers ? "Whispers on" : "Whispers off"} aria-label="Sakhi's whispers while you browse">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.6L12 15l-1.8-4.4L5.5 9l4.7-1.4z" /><path d="M19 15l.8 2 2 .8-2 .8L19 20.5l-.8-1.9-2-.8 2-.8z" /></svg>
          </button>
          <button type="button" className="sk-icon-btn" onClick={s.closePanel} aria-label="Close conversation">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
      </header>

      <div className="sakhi-panel__log" ref={logRef} aria-live="polite">
        {s.messages.map((m) => {
          const typing = m.id === s.typingId && !typedIds.has(m.id);
          return (
            <div key={m.id}>
              <div className={`sk-msg sk-msg--${m.from}`}>
                <div className="sk-msg__body">
                  <div className="sk-bubble">
                    {typing ? <Typewriter text={m.text} onDone={() => setTypedIds((x) => new Set(x).add(m.id))} /> : m.text}
                  </div>
                  {!typing && m.cards && m.cards.length > 0 && <SakhiCards cards={m.cards} />}
                </div>
              </div>
              {!typing && m === last && m.from === "sakhi" && m.chips && (
                <div className="sk-chips">
                  {m.chips.map((c) => (
                    <button type="button" key={c} className="sk-chip" onClick={() => submit(c)}>
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        {s.busy && (
          <div className="sk-msg sk-msg--sakhi">
            <div className="sk-bubble sk-typing" aria-label="Sakhi is thinking">
              <span />
              <span />
              <span />
            </div>
          </div>
        )}
      </div>

      <form
        className="sakhi-panel__composer"
        onSubmit={(e) => {
          e.preventDefault();
          submit(draft);
        }}
      >
        <input
          ref={inputRef}
          className="sakhi-panel__input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={listening ? "Listening…" : "Ask Sakhi anything…"}
          aria-label="Message Sakhi"
          maxLength={600}
        />
        {micSupported && (
          <button type="button" className={`sk-round sk-round--mic${listening ? " is-live" : ""}`} onClick={toggleMic} aria-label={listening ? "Stop listening" : "Speak to Sakhi"} aria-pressed={listening}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="9" y="3" width="6" height="12" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></svg>
          </button>
        )}
        <button type="submit" className="sk-round sk-round--send" aria-label="Send">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </button>
      </form>
      <div className="sakhi-panel__foot">Sakhi is an AI companion, not a guru. Guidance is traditional and never replaces medical, legal or financial advice.</div>
    </aside>
  );
}
