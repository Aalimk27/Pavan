import Link from "next/link";
import type { Katha } from "@/lib/content/types";
import { Corner, LotusRule } from "./Ornament";
import { TRADITION } from "./meta";
import styles from "./wisdom.module.css";

/** Today's story as an open, illuminated storybook. */
export default function StoryBook({ katha }: { katha: Katha }) {
  const t = TRADITION[katha.tradition];
  return (
    <article className={styles.book} style={{ ["--accent" as string]: t.accent }} aria-labelledby="today-katha">
      <Corner className={`${styles.corner} ${styles.cTL}`} />
      <Corner className={`${styles.corner} ${styles.cTR}`} />
      <Corner className={`${styles.corner} ${styles.cBL}`} />
      <Corner className={`${styles.corner} ${styles.cBR}`} />
      <div className={styles.pageL}>
        <div className={styles.emblem} aria-hidden>
          <span className="sanskrit">{t.skt}</span>
        </div>
        <p className={styles.bookKicker}>Today&rsquo;s Katha · {katha.tradition}</p>
        <h2 id="today-katha" className={styles.bookTitle}>
          {katha.title}
        </h2>
        <p className={styles.bookSummary}>{katha.summary}</p>
        <LotusRule className={styles.ruleSmall} />
        <p className={styles.bookSource} data-sakhi="Every story names honestly where it comes from — the original text, or a later or folk retelling.">
          {katha.source}
        </p>
        <p className={styles.bookMeta}>{katha.readingMinutes} minute read</p>
        <Link href={`/katha/${katha.slug}`} className="btn btn--forest">
          Read today&rsquo;s story
        </Link>
      </div>
      <div className={styles.pageR}>
        <p className={styles.dropcap}>{katha.story[0]}</p>
        {katha.story[1] && <p className={styles.fadePara}>{katha.story[1]}</p>}
        <Link href={`/katha/${katha.slug}`} className="link-arrow" tabIndex={-1} aria-hidden>
          Continue reading
        </Link>
      </div>
    </article>
  );
}
