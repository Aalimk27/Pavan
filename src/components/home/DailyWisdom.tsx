import Link from "next/link";
import type { GitaVerse, Katha } from "@/lib/content/types";
import DeepMala from "@/components/ui/DeepMala";
import styles from "./home.module.css";

export default function DailyWisdom({ verse, katha }: { verse: GitaVerse; katha: Katha }) {
  return (
    <section className={`section section--forest ${styles.daily}`} data-tour="daily">
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow eyebrow--center">Daily wisdom · free, every day</p>
          <h2>Today, one verse and one story.</h2>
          <p className="lead">The same verse and story are read across the world today. Read slowly, then light your lamp.</p>
        </div>

        <div className={styles.dailyGrid}>
          <article className={styles.verse} data-reveal>
            <p className={styles.dailyKicker}>
              GITA · {verse.chapter}.{verse.verse} · {verse.chapterName}
            </p>
            <p className={`sanskrit ${styles.verseSkt}`}>{verse.sanskrit}</p>
            <p className={styles.verseIast}>{verse.transliteration}</p>
            <p className={styles.verseMeaning}>{verse.meaning}</p>
            <p className={styles.verseAction}>
              <span>One action for today</span>
              {verse.action}
            </p>
            <Link className="link-arrow" href="/gita">
              Reflect on today's verse
            </Link>
          </article>

          <article className={styles.katha} data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
            <p className={styles.dailyKicker}>
              KATHA · {katha.tradition} · {katha.readingMinutes} min
            </p>
            <h3 className={styles.kathaTitle}>{katha.title}</h3>
            <p className={styles.kathaSummary}>{katha.summary}</p>
            <p className={styles.kathaFirst}>{katha.story[0]}</p>
            <Link className="link-arrow" href={`/katha/${katha.slug}`}>
              Read today's story
            </Link>
          </article>
        </div>

        <div className={styles.lamps} data-reveal>
          <DeepMala tone="dark" />
        </div>
      </div>
    </section>
  );
}
