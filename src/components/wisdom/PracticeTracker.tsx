"use client";

import { toggleGurukulDay, usePremMarg } from "@/lib/store";
import { sakhi } from "@/components/sakhi/bus";
import { track } from "@/lib/analytics";
import styles from "./practice.module.css";

const R = 54;

/** The seven-day practice with a progress ring. Progress is kept in this browser. */
export default function PracticeTracker({ slug, title, practice }: { slug: string; title: string; practice: string[] }) {
  const done = usePremMarg((s) => s.gurukul[slug]);
  const set = new Set(done ?? []);
  const count = practice.filter((_, i) => set.has(i + 1)).length;
  const total = practice.length;
  const next = practice.findIndex((_, i) => !set.has(i + 1)) + 1;

  const toggle = (day: number) => {
    const wasDone = set.has(day);
    toggleGurukulDay(slug, day);
    if (wasDone) return;
    const after = count + 1;
    track("wisdom_read", { kind: "gurukul", id: slug, day });
    if (after >= total) {
      sakhi.celebrate(`All ${total} days of ${title}. That is not a small thing — it is a new groove in the mind. Keep the one practice that helped most.`);
    } else {
      sakhi.celebrate(`Day ${day} kept. ${after} of ${total} — gently does it.`);
    }
  };

  return (
    <div className={styles.tracker}>
      <div className={styles.ringBox} data-sakhi="Your practice ring fills one day at a time. It lives only on this device — no streaks, no pressure.">
        <svg viewBox="0 0 128 128" className={styles.ring} aria-hidden focusable="false">
          <circle cx="64" cy="64" r={R} className={styles.track} />
          {Array.from({ length: total }, (_, i) => {
            const a = (i / total) * Math.PI * 2 - Math.PI / 2;
            return <circle key={i} cx={64 + R * Math.cos(a)} cy={64 + R * Math.sin(a)} r="3" className={set.has(i + 1) ? styles.tickOn : styles.tick} />;
          })}
          <circle cx="64" cy="64" r={R} className={styles.fill} transform="rotate(-90 64 64)" pathLength={1} style={{ strokeDashoffset: 1 - count / total }} />
        </svg>
        <div className={styles.ringText} role="status" aria-live="polite">
          <span className={styles.ringNum}>
            {count}
            <small>/{total}</small>
          </span>
          <span className={styles.ringLabel}>{count >= total ? "complete" : "days kept"}</span>
        </div>
      </div>

      <ol className={styles.days}>
        {practice.map((p, i) => {
          const day = i + 1;
          const on = set.has(day);
          return (
            <li key={day}>
              <button
                type="button"
                className={`${styles.day} ${on ? styles.dayOn : ""} ${day === next ? styles.dayNext : ""}`}
                aria-pressed={on}
                onClick={() => toggle(day)}
              >
                <span className={styles.check} aria-hidden>
                  {on ? "✓" : day}
                </span>
                <span className={styles.dayBody}>
                  <span className={styles.dayKicker}>
                    Day {day}
                    {day === next && !on && <em> · today&rsquo;s step</em>}
                  </span>
                  <span className={styles.dayText}>{p}</span>
                </span>
                <span className="visually-hidden">{on ? " — marked as done. Press to undo." : " — press to mark as done."}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
