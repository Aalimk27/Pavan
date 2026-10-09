"use client";

import { useMemo, useState } from "react";
import type { KathaTradition } from "@/lib/content/types";
import { usePremMarg } from "@/lib/store";
import { track } from "@/lib/analytics";
import { sakhi } from "@/components/sakhi/bus";
import KathaCard, { type KathaLite } from "./KathaCard";
import { TRADITION, TRADITION_ORDER } from "./meta";
import styles from "./wisdom.module.css";

/** The library of all stories with a tradition filter. */
export default function KathaLibrary({ kathas, todaySlug }: { kathas: KathaLite[]; todaySlug: string }) {
  const [filter, setFilter] = useState<KathaTradition | "All">("All");
  const wisdom = usePremMarg((s) => s.wisdom);
  const read = useMemo(() => new Set(Object.values(wisdom).map((w) => w.katha).filter(Boolean) as string[]), [wisdom]);

  const counts = useMemo(() => {
    const c: Partial<Record<KathaTradition, number>> = {};
    kathas.forEach((k) => (c[k.tradition] = (c[k.tradition] ?? 0) + 1));
    return c;
  }, [kathas]);

  const shown = filter === "All" ? kathas : kathas.filter((k) => k.tradition === filter);

  const choose = (f: KathaTradition | "All") => {
    setFilter(f);
    track("topic_selected", { area: "katha", tradition: f });
    if (f !== "All") sakhi.whisper(TRADITION[f].note, { selector: "#katha-filters", ms: 4500 });
  };

  return (
    <div>
      <div id="katha-filters" className={styles.filters} role="group" aria-label="Filter stories by tradition">
        {(["All", ...TRADITION_ORDER] as const).map((f) => {
          const n = f === "All" ? kathas.length : (counts[f] ?? 0);
          if (!n) return null;
          const on = filter === f;
          return (
            <button
              key={f}
              type="button"
              className={`${styles.chip} ${on ? styles.chipOn : ""}`}
              aria-pressed={on}
              onClick={() => choose(f)}
              style={f === "All" ? undefined : { ["--accent" as string]: TRADITION[f].accent }}
            >
              {f !== "All" && (
                <span className={`sanskrit ${styles.chipSkt}`} aria-hidden>
                  {TRADITION[f].skt}
                </span>
              )}
              {f}
              <span className={styles.chipCount}>{n}</span>
            </button>
          );
        })}
      </div>
      <p className="visually-hidden" aria-live="polite">
        Showing {shown.length} {shown.length === 1 ? "story" : "stories"}
      </p>
      <div className={styles.library}>
        {shown.map((k, i) => (
          <div key={`${filter}-${k.slug}`} className={styles.libItem} style={{ ["--i" as string]: i }}>
            <KathaCard katha={k} read={read.has(k.slug)} today={k.slug === todaySlug} />
          </div>
        ))}
      </div>
    </div>
  );
}
