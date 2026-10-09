"use client";

import { useEffect, useRef, useState } from "react";
import SakhiMark from "@/components/sakhi/SakhiMark";
import { pulse, useSakhi } from "@/components/sakhi/SakhiProvider";
import type { Mood } from "@/lib/sakhi/types";
import s from "./sakhi.module.css";

const MOODS: ReadonlyArray<{ mood: Mood; label: string; sanskrit: string; line: string }> = [
  { mood: "idle", label: "Present", sanskrit: "सहज", line: "At ease and awake. Her eye follows you as you move." },
  { mood: "listening", label: "Listening", sanskrit: "श्रवण", line: "Rings of attention ripple outward while you speak or type." },
  { mood: "thinking", label: "Thinking", sanskrit: "मनन", line: "A slow orbit of light while she finds the clearest way to say it." },
  { mood: "speaking", label: "Speaking", sanskrit: "वाणी", line: "Her light rises and falls with every word she says." },
  { mood: "joy", label: "Joy", sanskrit: "आनन्द", line: "The lotus opens — a lamp lit, a verse read, a step taken." },
  { mood: "resting", label: "Resting", sanskrit: "विश्राम", line: "When the page is quiet, so is she. Move, and she wakes." },
];

/** The giant living mark for /sakhi, with a mood selector that drives every Sakhi on the page. */
export default function SakhiStage() {
  const { mood, setMood, setHeroPresence } = useSakhi();
  const [chosen, setChosen] = useState<Mood>("idle");
  const stageRef = useRef<HTMLDivElement>(null);

  // While the giant Sakhi is on screen, the floating orb steps back — one Sakhi at a time.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHeroPresence(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => {
      io.disconnect();
      setHeroPresence(false);
    };
  }, [setHeroPresence]);

  // "Speaking" without a voice: give her light a soft cadence of words.
  useEffect(() => {
    if (mood !== "speaking") return;
    let t: ReturnType<typeof setTimeout>;
    const word = () => {
      pulse(0.45 + Math.random() * 0.5);
      t = setTimeout(word, 140 + Math.random() * 220);
    };
    word();
    return () => clearTimeout(t);
  }, [mood]);

  // When the mood times out, the selector returns to "Present".
  useEffect(() => {
    if (mood === "idle") setChosen("idle");
  }, [mood]);

  const choose = (m: Mood) => {
    setChosen(m);
    setMood(m, m === "idle" ? undefined : 5000);
  };

  const active = MOODS.find((m) => m.mood === chosen) ?? MOODS[0];

  return (
    <div className={s.stage}>
      <div ref={stageRef} className={s.stageMark} data-mood={mood}>
        <span className={s.aura} aria-hidden />
        <span className={`${s.ring} ${s.ring1}`} aria-hidden />
        <span className={`${s.ring} ${s.ring2}`} aria-hidden />
        <span className={`${s.ring} ${s.ring3}`} aria-hidden />
        <div className={s.markWrap}>
          <SakhiMark size="100%" mood={mood} barbs title="Sakhi, the living companion of Prem Marg" />
        </div>
      </div>

      <div className={s.moods}>
        <p className={s.moodsLabel} id="mood-label">
          Try her moods
        </p>
        <div className={s.moodChips} role="group" aria-labelledby="mood-label">
          {MOODS.map((m) => (
            <button
              key={m.mood}
              type="button"
              aria-pressed={chosen === m.mood}
              className={s.moodChip}
              onClick={() => choose(m.mood)}
            >
              <span className={`${s.moodSk} sanskrit`} aria-hidden>
                {m.sanskrit}
              </span>
              {m.label}
            </button>
          ))}
        </div>
        <p className={s.moodLine} aria-live="polite" key={active.mood}>
          {active.line}
        </p>
      </div>
    </div>
  );
}
