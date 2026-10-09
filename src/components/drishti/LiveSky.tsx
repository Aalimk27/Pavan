"use client";

import { useEffect, useMemo, useState } from "react";
import { formatDegrees } from "@/lib/astro/engine";
import { NAKSHATRA_ESSENCE } from "@/lib/content/drishti";
import { sakhi } from "@/components/sakhi/bus";
import RashiChakra from "./RashiChakra";
import { illumination, skyAt } from "./wheel";
import styles from "./live.module.css";

/**
 * The hero's living sky: the Moon's real sidereal position, recalculated every minute
 * in the visitor's browser by the same engine that computes their snapshot.
 */
export default function LiveSky() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const sky = useMemo(() => (now ? skyAt(now) : null), [now]);
  const lit = sky ? Math.round(illumination(sky.elongation) * 100) : null;
  const time = now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";

  return (
    <div className={styles.live}>
      <div className={styles.wheel}>
        <div className={styles.halo} aria-hidden />
        <RashiChakra
          id="sky"
          rotating
          label="Rashi Chakra — the twelve rashis and twenty-seven nakshatras, with the Moon at its live sidereal position. Use the arrow keys to explore each ring."
          moon={sky?.moon}
          sun={sky?.sun}
          hub={
            sky
              ? {
                  kicker: "The Moon · now",
                  title: sky.moon.nakshatra.name,
                  lines: [`${sky.moon.rashi.name} ${formatDegrees(sky.moon.degreeInRashi)} · pada ${sky.moon.pada}`, `${sky.tithi.paksha} ${sky.tithi.name}`],
                }
              : { kicker: "Rashi Chakra", title: "Reading the sky…", lines: [] }
          }
        />
      </div>

      <div className={styles.readout} aria-live="polite">
        <button
          type="button"
          className={styles.line}
          disabled={!sky}
          data-sakhi={sky ? `${sky.moon.nakshatra.name} carries ${NAKSHATRA_ESSENCE[sky.moon.nakshatra.name]}.` : undefined}
          onClick={() => sky && sakhi.open("Where is the Moon right now?")}
        >
          <span className={styles.pulse} aria-hidden />
          {sky ? (
            <span>
              Right now the Moon moves through <strong>{sky.moon.nakshatra.name}</strong>, <strong>{sky.moon.rashi.name}</strong>
            </span>
          ) : (
            <span>Calculating the Moon&rsquo;s position…</span>
          )}
        </button>
        <p className={styles.meta}>
          {sky ? (
            <>
              Live · {time} · {lit}% lit · {sky.tithi.paksha} {sky.tithi.name} · recalculated every minute in your browser
            </>
          ) : (
            <>Live sky · sidereal · Lahiri</>
          )}
        </p>
      </div>
    </div>
  );
}
