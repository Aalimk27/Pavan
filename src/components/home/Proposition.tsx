"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

const LINES = ["Understand yourself.", "Understand your space.", "Understand your numbers.", "Then use timeless wisdom to live better."];

/** The core proposition — each word lights as you scroll through it. */
export default function Proposition() {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);
  const words = LINES.flatMap((l, li) => l.split(" ").map((w, wi) => ({ w, li, key: `${li}-${wi}` })));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setLit(words.length);
      return;
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight;
        const progress = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.35)));
        setLit(Math.round(progress * words.length));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [words.length]);

  return (
    <section className={`section ${styles.prop}`}>
      <div className="container">
        <p className="eyebrow eyebrow--center" style={{ display: "flex", justifyContent: "center" }}>
          The path of love
        </p>
        <div ref={ref} className={styles.propText} aria-label={LINES.join(" ")}>
          {LINES.map((_, li) => (
            <span key={li} className={styles.propLine} aria-hidden>
              {words
                .map((x, i) => ({ ...x, i }))
                .filter((x) => x.li === li)
                .map((x) => (
                  <span key={x.key} className={`${styles.propWord} ${x.i < lit ? styles.propOn : ""}`}>
                    {x.w}{" "}
                  </span>
                ))}
            </span>
          ))}
        </div>
        <p className={`lead ${styles.propLead}`} data-reveal>
          Prem Marg is not an astrology website. It is a digital dharmic guidance platform: astrology, Vastu and numerology are doors in; Katha, Gita and Gurukul are the home you grow in; Sakhi
          walks with you, day and night; and RadheyShyam Realtor is the trusted human bridge when a decision deserves a person.
        </p>
      </div>
    </section>
  );
}
