"use client";

import { useEffect, useState } from "react";
import { pulse, useSakhi } from "@/components/sakhi/SakhiProvider";
import { canSpeak, speak, stopSpeaking } from "@/components/sakhi/voice";
import s from "./sakhi.module.css";

/** Talk-to-her CTA: open the panel, the "/" shortcut, and an honest voice switch. */
export default function TalkToSakhi({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const { openPanel, voice, setVoice, setMood } = useSakhi();
  const [speechOk, setSpeechOk] = useState(false);
  useEffect(() => setSpeechOk(canSpeak()), []);

  const toggleVoice = () => {
    const on = !voice;
    setVoice(on);
    if (on && canSpeak()) {
      setMood("speaking");
      speak("Namaste. I'll speak my replies aloud now. You can turn this off at any time.", {
        onWord: () => pulse(1),
        onEnd: () => setMood("idle"),
      });
    } else {
      stopSpeaking();
    }
  };

  return (
    <div className={`${s.talk} ${tone === "light" ? s.talkLight : ""}`}>
      <div className="row">
        <button type="button" className="btn btn--lg" onClick={() => openPanel("Namaste Sakhi — what can you help me with?")}>
          Talk to Sakhi
        </button>
        {speechOk && (
          <button type="button" className={`btn btn--ghost ${s.voiceBtn}`} onClick={toggleVoice} aria-pressed={voice}>
            <span className={s.voiceDot} aria-hidden data-on={voice || undefined} />
            {voice ? "Her voice is on" : "Hear her voice"}
          </button>
        )}
      </div>
      <p className={s.hint}>
        Press <kbd className={s.kbd}>/</kbd> on any page to call her · <kbd className={s.kbd}>Esc</kbd> to let her rest
      </p>
    </div>
  );
}
