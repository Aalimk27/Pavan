import type { Metadata } from "next";
import Link from "next/link";
import { GITA } from "@/lib/content/gita";
import { gurukulBySlug } from "@/lib/content/gurukul";
import type { GurukulTopic } from "@/lib/content/types";
import { pickDaily } from "@/lib/daily";
import PageHero from "@/components/ui/PageHero";
import SakhiNote from "@/components/ui/SakhiNote";
import DeepMala from "@/components/ui/DeepMala";
import VerseFolio from "@/components/wisdom/VerseFolio";
import ReflectionNotes from "@/components/wisdom/ReflectionNotes";
import TodayAction from "@/components/wisdom/TodayAction";
import TopicCard from "@/components/wisdom/TopicCard";
import GitaArchive from "@/components/wisdom/GitaArchive";
import WisdomSubscribe from "@/components/wisdom/WisdomSubscribe";
import styles from "@/components/wisdom/wisdom.module.css";

// The verse of the day rolls over with the (UTC) day.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Bhagavad Gita — One Verse a Day",
  description:
    "One Bhagavad Gita verse daily: Sanskrit, transliteration, meaning, a deeper lesson for modern life, a reflection and one action for today. Free, with an optional morning email.",
  alternates: { canonical: "/gita" },
  openGraph: {
    title: "Bhagavad Gita — One Verse a Day · Prem Marg",
    description: "Sanskrit, transliteration, meaning, deeper lesson, reflection and one action for today.",
    url: "/gita",
  },
};

export default function GitaPage() {
  const today = new Date();
  const verse = pickDaily(GITA, today, 0);
  const themes = verse.themes.map(gurukulBySlug).filter((t): t is GurukulTopic => Boolean(t));
  const dateLabel = today.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <>
      <PageHero
        eyebrow="Gita · one verse daily · free"
        title={
          <>
            One verse a day, <em>read slowly.</em>
          </>
        }
        lead="Sanskrit, transliteration, meaning, deeper lesson, reflection and one action for today. The same verse is read across the world on the same day."
        watermark="गीता"
      >
        <div className="row">
          <a href="#today" className="btn">
            Today&rsquo;s verse · {verse.id}
          </a>
          <a href="#archive" className="btn btn--ghost">
            All {GITA.length} verses
          </a>
        </div>
      </PageHero>

      <section className={`section section--tight ${styles.folioSection}`} id="today" aria-label="Today's verse">
        <div className={`container ${styles.folioWrap}`}>
          <p className={styles.dateline}>
            <span>{dateLabel}</span>
            <span aria-hidden>·</span>
            <span>Verse of the day</span>
          </p>
          <VerseFolio verse={verse} />
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="practice-head">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">Reflect · act · light</p>
            <h2 id="practice-head">Let the verse meet your day.</h2>
          </div>
          <div className={styles.practiceGrid}>
            <div className={`card ${styles.reflectCard}`} data-reveal>
              <p className={styles.label}>Reflection</p>
              <ReflectionNotes storageKey={`gita:${verse.id}`} question={verse.reflection} />
            </div>
            <div className={`card card--forest ${styles.actCard}`} data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
              <TodayAction kind="gita" id={verse.id} action={verse.action} />
              <div className={styles.lampBox} id="lamp">
                <p className={styles.lampHead}>Then light today&rsquo;s lamp</p>
                <DeepMala tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {themes.length > 0 && (
        <section className="section section--marble" aria-labelledby="deeper-head">
          <div className="container">
            <div className={styles.bridgeHead}>
              <div>
                <p className="eyebrow">Go deeper in Gurukul</p>
                <h2 id="deeper-head">This verse is a doorway to practice.</h2>
                <p className="lead">
                  A verse read once can inspire; a verse practised for seven days begins to change you. These Gurukul topics carry today&rsquo;s teaching into
                  your week.
                </p>
              </div>
              <SakhiNote ask={`Help me apply Bhagavad Gita ${verse.id} to my life today.`} askLabel="Ask me about this verse">
                Read it once for the meaning, once for yourself. If a word stops you, that word is today&rsquo;s teacher. I&rsquo;m happy to talk it
                through.
              </SakhiNote>
            </div>
            <div className="grid grid--3">
              {themes.map((t) => (
                <TopicCard key={t.slug} topic={t} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" id="archive" aria-labelledby="archive-head">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The archive</p>
            <h2 id="archive-head">
              {GITA.length} verses, <span className="accent">chapter by chapter.</span>
            </h2>
            <p className="lead">Each verse has its own page with the Sanskrit, meaning, lesson, reflection and the Katha and Gurukul topics it belongs to.</p>
          </div>
          <GitaArchive current={verse.id} />
        </div>
      </section>

      <section className="section section--tight section--marble" aria-label="Morning email">
        <div className="container container--narrow">
          <WisdomSubscribe
            list="gita"
            title="The verse, each morning"
            text="One verse in your inbox at sunrise — Sanskrit, meaning and one action. Optional, free and easy to stop."
          />
          <p className={`small muted ${styles.care}`}>
            The Gita is offered here as devotional and practical wisdom. It is not a substitute for medical or mental-health care — if you are struggling,
            please also reach out to a qualified professional. <Link href="/gurukul">Explore Gurukul</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
