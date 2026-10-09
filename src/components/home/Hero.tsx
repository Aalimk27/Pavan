"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CLARITY, SITE, type ClarityOption } from "@/lib/site";
import { GREETING, dayPhase, type DayPhase } from "@/lib/daily";
import { moonNow, tithiNow } from "@/lib/astro/engine";
import { track } from "@/lib/analytics";
import SakhiMark from "@/components/sakhi/SakhiMark";
import { pulse, useSakhi } from "@/components/sakhi/SakhiProvider";
import { sakhi } from "@/components/sakhi/bus";
import { HOME_TOUR } from "@/components/sakhi/presence";
import PranaField from "./PranaField";
import Sparks from "./Sparks";
import styles from "./home.module.css";

// Positions around Sakhi: four on each side, leaving her flame and lotus clear.
const ANGLES = [148, 172, 196, 220, 32, 8, -16, -40];

export default function Hero() {
  const { setHeroPresence, mood, setMood } = useSakhi();
  const ref = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<DayPhase | null>(null);
  const [sky, setSky] = useState<string | null>(null);
  const [chosen, setChosen] = useState<ClarityOption | null>(null);
  const [shown, setShown] = useState("");
  const [ask, setAsk] = useState("");

  useEffect(() => {
    setPhase(dayPhase());
    const m = moonNow();
    const t = tithiNow();
    setSky(`Right now the Moon moves through ${m.nakshatra.name} in ${m.rashi.name} · ${t.paksha} ${t.name}`);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setHeroPresence(e.isIntersecting && e.intersectionRatio > 0.2), { threshold: [0, 0.2, 0.5] });
    io.observe(el);
    return () => {
      io.disconnect();
      setHeroPresence(false);
    };
  }, [setHeroPresence]);

  // Sakhi speaks her routing line word by word.
  useEffect(() => {
    if (!chosen) return;
    const words = chosen.sakhi.split(" ");
    let i = 0;
    setShown("");
    setMood("speaking");
    const t = setInterval(() => {
      i++;
      setShown(words.slice(0, i).join(" "));
      pulse(0.9);
      if (i >= words.length) {
        clearInterval(t);
        setMood("joy", 1400);
      }
    }, 55);
    return () => clearInterval(t);
  }, [chosen, setMood]);

  const choose = (c: ClarityOption) => {
    setChosen(c);
    track("topic_selected", { topic: c.key, route: c.route });
  };

  const g = phase ? GREETING[phase] : null;
  const typing = chosen && shown.length < chosen.sakhi.length;

  return (
    <section ref={ref} className={styles.hero} data-phase={phase ?? "evening"}>
      <PranaField phase={phase ?? "evening"} />
      <div className={styles.heroInner}>
        <p className={`${styles.greeting} ${g ? styles.greetingIn : ""}`}>
          {g ? (
            <>
              <span className="sanskrit">{g.hi}</span> · {g.en}
            </>
          ) : (
            " "
          )}
        </p>
        <h1 className={styles.question}>
          What would you like <em>clarity</em> about today?
        </h1>

        <div className={styles.stage} data-tour="clarity">
          <div className={styles.sakhiWrap}>
            <Sparks />
            <span className={`sakhi-aura ${styles.aura}`} aria-hidden />
            <button type="button" className={styles.sakhiBtn} onClick={() => sakhi.open()} aria-label="Talk to Sakhi">
              <SakhiMark size="100%" mood={mood} barbs decorative />
            </button>
            <span className={styles.sakhiName}>SAKHI</span>
          </div>

          <ul className={styles.ring} aria-label="Choose what you'd like clarity about">
            {CLARITY.map((c, i) => (
              <li key={c.key} style={{ ["--a" as string]: `${ANGLES[i]}deg`, ["--i" as string]: i }}>
                <button
                  type="button"
                  className={`${styles.chip} ${chosen?.key === c.key ? styles.chipOn : ""} ${chosen && chosen.key !== c.key ? styles.chipDim : ""}`}
                  onClick={() => choose(c)}
                  aria-pressed={chosen?.key === c.key}
                >
                  <span className={styles.chipGlyph} aria-hidden>
                    {c.glyph}
                  </span>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.answer} aria-live="polite">
          {chosen ? (
            <div className={styles.bubble}>
              <p className={styles.bubbleText}>
                {shown}
                {typing && <span className="sk-caret" />}
              </p>
              <div className={`${styles.bubbleActions} ${typing ? styles.hiddenActions : ""}`}>
                <Link href={chosen.href} className="btn">
                  {chosen.cta}
                </Link>
                <button type="button" className="btn btn--ghost" onClick={() => sakhi.open(`I'd like clarity about ${chosen.label.toLowerCase()}`)}>
                  Talk it through with Sakhi
                </button>
                <button type="button" className={styles.reset} onClick={() => setChosen(null)}>
                  Choose again
                </button>
              </div>
            </div>
          ) : (
            <form
              className={styles.askBar}
              onSubmit={(e) => {
                e.preventDefault();
                sakhi.open(ask.trim() || undefined);
                setAsk("");
              }}
            >
              <input value={ask} onChange={(e) => setAsk(e.target.value)} placeholder="Or ask Sakhi anything…" aria-label="Ask Sakhi anything" />
              <button type="submit" className="btn">
                Ask
              </button>
            </form>
          )}
        </div>

        <div className={styles.heroFoot}>
          <span className={styles.sky}>{sky ?? " "}</span>
          <button type="button" className={styles.tour} onClick={() => sakhi.guide(HOME_TOUR)}>
            ✦ Let Sakhi show you around
          </button>
        </div>
      </div>
      <span className="visually-hidden">{SITE.promise}</span>
    </section>
  );
}
