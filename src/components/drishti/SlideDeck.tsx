"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { DRISHTI_SLIDES } from "@/lib/products";
import { sakhi } from "@/components/sakhi/bus";
import styles from "./deck.module.css";

/** What each slide of the 13-slide standard covers — described, never sampled with fake data. */
const ABOUT: string[] = [
  "Your name, birth details and the calculation version — the opening page of a reading made only for you.",
  "Lagna, Moon, Nakshatra and your current dasha on one page — the essentials at a glance.",
  "The full Rashi chart (D1): every graha's sign, house and degree — the technical foundation everything else rests on.",
  "How your Lagna, Moon and Sun combine — temperament, natural strengths and the patterns worth knowing.",
  "The houses and grahas of work and dharma — where your effort and authority grow most naturally.",
  "How you tend to earn, save and spend — read as tendencies to work with, never as a fixed fate.",
  "Partnership patterns read from the D1 and the Navamsa (D9) — with care, and without fear.",
  "Your Vimshottari periods mapped across time — what each chapter of life invites you to cultivate.",
  "Your birth-day number with compound and root preserved — strengths and watch-outs, never verdicts.",
  "Your full-date number — the direction your efforts tend to take across a lifetime.",
  "Where your chart and your numbers agree, and where they differ — both evidence streams shown separately.",
  "Devotional practice, discipline and seva suited to you — clearly labelled devotional. No gemstone prescriptions, no fear-based remedies.",
  "One page that brings it all together — your strengths, your timing and practical next steps.",
];

const SPIRAL = Array.from({ length: 140 }, (_, k) => {
  const t = (k / 139) * Math.PI * 6;
  const r = 2 + t * 2.15;
  return `${(50 + r * Math.cos(t)).toFixed(2)},${(50 + r * Math.sin(t)).toFixed(2)}`;
}).join(" ");

const ART = ["cover", "snapshot", "d1", "persona", "career", "wealth", "bond", "dasha", "mulank", "bhagya", "converge", "dharma", "synthesis"] as const;

function Art({ kind }: { kind: (typeof ART)[number] }) {
  switch (kind) {
    case "snapshot":
      return (
        <svg viewBox="0 0 100 100" className={styles.svgArt} aria-hidden>
          <rect x="8" y="8" width="84" height="84" />
          <path d="M8 8 92 92M92 8 8 92M50 8 92 50 50 92 8 50Z" />
          <circle cx="50" cy="29" r="3" className={styles.dot} />
        </svg>
      );
    case "bhagya":
      return (
        <svg viewBox="0 0 100 100" className={styles.svgArt} aria-hidden>
          <polyline points={SPIRAL} />
          <circle cx="50" cy="50" r="2.5" className={styles.dot} />
        </svg>
      );
    default:
      return (
        <div className={`${styles.art} ${styles[`art_${kind}`]}`} aria-hidden>
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </div>
      );
  }
}

export default function SlideDeck() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const fanRef = useRef<HTMLDivElement>(null);
  const n = DRISHTI_SLIDES.length;

  const go = (i: number, focus = false) => {
    const next = (i + n) % n;
    setActive(next);
    if (focus) tabs.current[next]?.focus();
    // On narrow screens the deck is a horizontal scroller — centre the chosen slide without moving the page.
    const fan = fanRef.current;
    const card = tabs.current[next];
    if (fan && card && fan.scrollWidth > fan.clientWidth) {
      fan.scrollTo({ left: card.offsetLeft - (fan.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
    }
    sakhi.mood("attentive", 900);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") go(active + 1, true);
    else if (e.key === "ArrowLeft") go(active - 1, true);
    else if (e.key === "Home") go(0, true);
    else if (e.key === "End") go(n - 1, true);
    else return;
    e.preventDefault();
  };

  return (
    <div className={styles.deck}>
      <div className={styles.fan} ref={fanRef} role="tablist" aria-label="The 13 DRISHTI slides" onKeyDown={onKey}>
        {DRISHTI_SLIDES.map((title, i) => {
          const o = i - (n - 1) / 2;
          const d = i - active;
          const style = { "--o": o, "--abs": Math.abs(o), "--d": Math.max(-1, Math.min(1, d)), "--z": 30 - Math.abs(d) } as CSSProperties;
          return (
            <button
              key={title}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`slide-tab-${i}`}
              aria-selected={i === active}
              aria-controls="slide-panel"
              tabIndex={i === active ? 0 : -1}
              className={`${styles.card} ${i === active ? styles.active : ""}`}
              style={style}
              data-sakhi={`Slide ${i + 1}, ${title}: ${ABOUT[i]}`}
              onClick={() => go(i)}
            >
              <span className={styles.cardInner}>
                <span className={styles.cardTop}>
                  <span className={styles.no}>{String(i + 1).padStart(2, "0")}</span>
                  <span className={styles.mark}>DRISHTI</span>
                </span>
                <span className={styles.canvas}>
                  <Art kind={ART[i]} />
                </span>
                <span className={styles.cardTitle}>{title}</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className={styles.panel} id="slide-panel" role="tabpanel" aria-labelledby={`slide-tab-${active}`}>
        <div className={styles.panelText} key={active}>
          <p className={styles.panelKicker}>
            Slide {String(active + 1).padStart(2, "0")} of {n}
          </p>
          <h3 className={styles.panelTitle}>{DRISHTI_SLIDES[active]}</h3>
          <p className={styles.panelBody}>{ABOUT[active]}</p>
        </div>
        <div className={styles.panelNav}>
          <button type="button" className={styles.navBtn} onClick={() => go(active - 1)} aria-label="Previous slide">
            ←
          </button>
          <div className={styles.dots} aria-hidden>
            {DRISHTI_SLIDES.map((t, i) => (
              <span key={t} className={i === active ? styles.dotOn : undefined} />
            ))}
          </div>
          <button type="button" className={styles.navBtn} onClick={() => go(active + 1)} aria-label="Next slide">
            →
          </button>
        </div>
      </div>
    </div>
  );
}
