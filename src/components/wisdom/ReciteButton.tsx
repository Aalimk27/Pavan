"use client";

import { useEffect, useState } from "react";
import { canSpeak, speakSanskrit, stopSpeaking } from "@/components/sakhi/voice";
import { sakhi } from "@/components/sakhi/bus";
import styles from "./wisdom.module.css";

/** Recite the verse aloud with the device's Hindi/Sanskrit voice, when one exists. */
export default function ReciteButton({ text, label = "Recite" }: { text: string; label?: string }) {
  const [able, setAble] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    setAble(canSpeak());
    return () => stopSpeaking();
  }, []);

  if (!able) return null;

  const toggle = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      sakhi.mood("idle");
      return;
    }
    setSpeaking(true);
    sakhi.mood("listening", 20000);
    speakSanskrit(text, () => {
      setSpeaking(false);
      sakhi.mood("joy", 1800);
    });
  };

  return (
    <button
      type="button"
      className={`${styles.recite} ${speaking ? styles.reciteOn : ""}`}
      onClick={toggle}
      aria-pressed={speaking}
      data-sakhi="Listen to the verse in Sanskrit. Let the sound arrive before the meaning."
    >
      <span className={styles.reciteWave} aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      {speaking ? "Stop reciting" : label}
    </button>
  );
}
