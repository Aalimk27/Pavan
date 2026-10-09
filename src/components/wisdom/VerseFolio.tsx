import type { GitaVerse } from "@/lib/content/types";
import { Corner, LotusRule } from "./Ornament";
import ReciteButton from "./ReciteButton";
import { toRoman, verseLines } from "./meta";
import styles from "./wisdom.module.css";

/** The illuminated manuscript leaf: Sanskrit in a gilt frame, IAST, meaning and the deeper lesson. */
export default function VerseFolio({ verse, kicker = "Bhagavad Gita", id }: { verse: GitaVerse; kicker?: string; id?: string }) {
  const lines = verseLines(verse.sanskrit);
  return (
    <article className={styles.folio} id={id} aria-labelledby={`folio-${verse.id}`}>
      <Corner className={`${styles.corner} ${styles.cTL}`} />
      <Corner className={`${styles.corner} ${styles.cTR}`} />
      <Corner className={`${styles.corner} ${styles.cBL}`} />
      <Corner className={`${styles.corner} ${styles.cBR}`} />

      <header className={styles.folioHead}>
        <p className={styles.folioKicker}>{kicker}</p>
        <h2 id={`folio-${verse.id}`} className={styles.folioRef}>
          <span data-sakhi={`Chapter ${verse.chapter}, verse ${verse.verse}. Chapter ${verse.chapter} is called ${verse.chapterName}.`}>
            Chapter {toRoman(verse.chapter)} · Verse {verse.verse}
          </span>
        </h2>
        <p className={styles.folioChapter}>{verse.chapterName}</p>
      </header>

      <div className={styles.frame}>
        <div className={styles.frameInner}>
          <p
            className={`sanskrit ${styles.skt}`}
            lang="sa"
            data-sakhi="This is the verse as Krishna spoke it, in Sanskrit. Read it aloud even if you don't know the words — the sound carries its own calm."
          >
            {lines.map((l, i) => (
              <span key={i} className={styles.sktLine}>
                {l.text}
                {l.marker && <span className={styles.sktMarker}> {l.marker}</span>}
              </span>
            ))}
          </p>
        </div>
      </div>

      <div className={styles.reciteRow}>
        <ReciteButton text={verse.sanskrit} />
      </div>

      <p
        className={styles.iast}
        lang="sa-Latn"
        data-sakhi="The transliteration lets you pronounce the Sanskrit using Latin letters. Marks like ā and ṃ show long vowels and nasal sounds."
      >
        {verse.transliteration.split("\n").map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </p>

      <LotusRule className={styles.rule} />

      <div className={styles.folioBody}>
        <section>
          <h3 className={styles.label}>Meaning</h3>
          <p className={styles.meaning} data-sakhi="A faithful plain-English meaning — close to the Sanskrit, without decoration.">
            {verse.meaning}
          </p>
        </section>
        <section>
          <h3 className={styles.label}>The deeper lesson</h3>
          <p className={styles.deeper} data-sakhi="How this verse can live in an ordinary day — at work, at home, in your own mind.">
            {verse.lesson}
          </p>
        </section>
      </div>
    </article>
  );
}
