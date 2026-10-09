"use client";

import { useEffect, useId, useRef, useState } from "react";
import styles from "./wisdom.module.css";

/**
 * A private journal line for one verse or story. Saved only in this browser
 * (localStorage) — never sent anywhere.
 */
export default function ReflectionNotes({ storageKey, question }: { storageKey: string; question: string }) {
  const id = useId();
  const key = `premmarg:notes:${storageKey}`;
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "unavailable">("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem(key);
      if (v) {
        setText(v);
        setStatus("saved");
      }
    } catch {
      setStatus("unavailable");
    }
    return () => window.clearTimeout(timer.current);
  }, [key]);

  const onChange = (v: string) => {
    setText(v);
    setStatus("saving");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        if (v.trim()) window.localStorage.setItem(key, v);
        else window.localStorage.removeItem(key);
        setStatus("saved");
      } catch {
        setStatus("unavailable");
      }
    }, 500);
  };

  return (
    <div className={styles.notes}>
      <label htmlFor={id} className={styles.notesQuestion}>
        {question}
      </label>
      <textarea
        id={id}
        className={`textarea ${styles.notesArea}`}
        value={text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write a line or two, just for you…"
        rows={4}
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`} className={styles.notesHint} aria-live="polite">
        <span className={styles.lock} aria-hidden>
          ◈
        </span>
        {status === "saving"
          ? "Saving…"
          : status === "saved" && text.trim()
            ? "Saved privately in this browser."
            : status === "unavailable"
              ? "Your browser isn't allowing storage here — notes won't be kept."
              : "Private: kept only in this browser, never sent to us."}
      </p>
    </div>
  );
}
