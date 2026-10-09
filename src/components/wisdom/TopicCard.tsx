import Link from "next/link";
import type { GurukulTopic } from "@/lib/content/types";
import styles from "./wisdom.module.css";

/** A Gurukul topic tile — the bridge from daily wisdom into practice. */
export default function TopicCard({ topic, kicker = "Gurukul · 7-day practice" }: { topic: GurukulTopic; kicker?: string }) {
  return (
    <Link href={`/gurukul/${topic.slug}`} className={styles.topic} data-sakhi={topic.overview.split(". ")[0] + "."}>
      <span className={`sanskrit ${styles.topicSkt}`} aria-hidden>
        {topic.sanskrit}
      </span>
      <span className={styles.topicKicker}>{kicker}</span>
      <span className={styles.topicTitle}>
        {topic.title} <span className={styles.topicRoman}>{topic.sanskritRoman}</span>
      </span>
      <span className={styles.topicTag}>{topic.tagline}</span>
      <span className="link-arrow">Begin the practice</span>
    </Link>
  );
}
