import Link from "next/link";
import type { GitaVerse } from "@/lib/content/types";
import { verseHref, verseLines } from "./meta";
import styles from "./wisdom.module.css";

/** A compact verse: Sanskrit + meaning, linking to its page. */
export default function GitaInline({ verse }: { verse: GitaVerse }) {
  return (
    <article className={styles.inline}>
      <p className={styles.inlineRef}>
        Gita {verse.id} · {verse.chapterName}
      </p>
      <p className={`sanskrit ${styles.inlineSkt}`} lang="sa">
        {verseLines(verse.sanskrit).map((l, i) => (
          <span key={i}>{l.text}</span>
        ))}
      </p>
      <p className={styles.inlineMeaning}>{verse.meaning}</p>
      <Link className="link-arrow" href={verseHref(verse)} aria-label={`Read Gita verse ${verse.id} in full`}>
        Read the verse
      </Link>
    </article>
  );
}
