import Link from "next/link";
import type { Katha } from "@/lib/content/types";
import { TRADITION } from "./meta";
import styles from "./wisdom.module.css";

export type KathaLite = Pick<Katha, "slug" | "title" | "tradition" | "summary" | "readingMinutes">;

/** A story tile from the library. */
export default function KathaCard({ katha, read = false, today = false }: { katha: KathaLite; read?: boolean; today?: boolean }) {
  const t = TRADITION[katha.tradition];
  return (
    <Link
      href={`/katha/${katha.slug}`}
      className={styles.kcard}
      style={{ ["--accent" as string]: t.accent }}
      data-sakhi={katha.summary}
    >
      <span className={`sanskrit ${styles.kcardSkt}`} aria-hidden>
        {t.skt}
      </span>
      <span className={styles.kcardMeta}>
        {katha.tradition} · {katha.readingMinutes} min
        {today && <span className={styles.kcardFlag}>Today</span>}
        {read && !today && <span className={styles.kcardRead}>✓ Read</span>}
      </span>
      <span className={styles.kcardTitle}>{katha.title}</span>
      <span className={styles.kcardSummary}>{katha.summary}</span>
      <span className={styles.kcardGo} aria-hidden>
        Read →
      </span>
    </Link>
  );
}
