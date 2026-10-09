"use client";

import { useEffect, useRef, useState } from "react";
import { sakhi } from "@/components/sakhi/bus";
import styles from "./wisdom.module.css";

/** A thin gold line at the top of the window that fills as the story is read. */
export default function ReadingProgress({ target, finishedSelector }: { target: string; finishedSelector?: string }) {
  const [p, setP] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = document.querySelector(target);
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight * 0.55;
      const v = Math.min(1, Math.max(0, (window.innerHeight * 0.45 - r.top) / Math.max(1, total)));
      setP(v);
      if (v >= 0.99 && !done.current) {
        done.current = true;
        sakhi.whisper("You read the whole story. Sit with it for a breath — then see what it asks of you today.", {
          selector: finishedSelector,
          ms: 7000,
        });
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [target, finishedSelector]);

  return (
    <div
      className={styles.progress}
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(p * 100)}
    >
      <span style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}
