import Link from "next/link";
import { GITA, GITA_CHAPTERS } from "@/lib/content/gita";
import { toDevanagari, verseHref } from "./meta";
import styles from "./wisdom.module.css";

/** All verses, grouped by chapter, as a table of contents. */
export default function GitaArchive({ current }: { current?: string }) {
  const chapters = Object.keys(GITA_CHAPTERS)
    .map(Number)
    .sort((a, b) => a - b)
    .map((c) => ({ c, name: GITA_CHAPTERS[c], verses: GITA.filter((v) => v.chapter === c).sort((a, b) => a.verse - b.verse) }))
    .filter((g) => g.verses.length);

  return (
    <ol className={styles.archive}>
      {chapters.map((g) => (
        <li key={g.c} className={styles.chapter}>
          <span className={`sanskrit ${styles.chapNum}`} aria-hidden>
            {toDevanagari(g.c)}
          </span>
          <div className={styles.chapBody}>
            <h3 className={styles.chapName}>
              <span className={styles.chapLabel}>Chapter {g.c}</span>
              {g.name}
            </h3>
            <ul className={styles.verseChips} aria-label={`Verses from chapter ${g.c}`}>
              {g.verses.map((v) => (
                <li key={v.id}>
                  <Link
                    href={verseHref(v)}
                    className={`${styles.verseChip} ${v.id === current ? styles.verseChipOn : ""}`}
                    aria-current={v.id === current ? "page" : undefined}
                    data-sakhi={v.reflection}
                  >
                    {v.id}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  );
}
