import Link from "next/link";
import { PILLARS, type Pillar } from "@/lib/site";
import styles from "./home.module.css";

const WHISPER: Record<string, string> = {
  drishti: "DRISHTI means vision. Your chart, read with care — and your current life period, calculated live.",
  vastu: "VASTU means dwelling. Your floor plan, its centre and its zones — gentle, practical guidance. Still in Beta.",
  ank: "ANK means number. Your Mulank, Bhagya Ank and home number — a mirror, never a verdict.",
  katha: "KATHA — one sacred story a day, with a lesson you can use before evening.",
  gita: "GITA — one verse a day, with its meaning, a reflection and one small action.",
  gurukul: "GURUKUL — seven-day practices for anger, fear, money, relationships and more.",
};

function Door({ p, i }: { p: Pillar; i: number }) {
  return (
    <Link href={p.href} className={styles.door} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} data-sakhi={WHISPER[p.key]}>
      <span className={styles.doorFrame}>
        <span className={styles.doorLight} aria-hidden />
        <span className={`${styles.leaf} ${styles.leafL}`} aria-hidden />
        <span className={`${styles.leaf} ${styles.leafR}`} aria-hidden />
        <span className={`sanskrit ${styles.doorDev}`}>{p.devanagari}</span>
      </span>
      <span className={styles.doorBody}>
        <span className={styles.doorKind}>{p.kind}</span>
        <span className={styles.doorName}>
          {p.name}
          {p.beta && <span className="badge badge--beta">Beta</span>}
        </span>
        <span className={styles.doorMeaning}>“{p.meaning}”</span>
        <span className={styles.doorLine}>{p.line}</span>
        <span className={styles.doorFree}>{p.free}</span>
      </span>
    </Link>
  );
}

export default function Doors() {
  const understand = PILLARS.slice(0, 3);
  const live = PILLARS.slice(3);
  return (
    <section className={`section section--marble ${styles.doors}`}>
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow eyebrow--center">Six doors · one path</p>
          <h2>
            Three doors to <em className="accent">understand</em>. Three to <em className="accent">live it</em>, every day.
          </h2>
        </div>
        <p className={styles.doorGroup}>Understand yourself, your space and your numbers</p>
        <div className={styles.doorRow} data-tour="pillars">
          {understand.map((p, i) => (
            <Door key={p.key} p={p} i={i} />
          ))}
        </div>
        <p className={styles.doorGroup}>Live it daily</p>
        <div className={styles.doorRow}>
          {live.map((p, i) => (
            <Door key={p.key} p={p} i={i + 3} />
          ))}
        </div>
      </div>
    </section>
  );
}
