import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GITA, gitaById } from "@/lib/content/gita";
import { KATHAS } from "@/lib/content/katha";
import { gurukulBySlug } from "@/lib/content/gurukul";
import type { GurukulTopic } from "@/lib/content/types";
import PageHero from "@/components/ui/PageHero";
import SakhiNote from "@/components/ui/SakhiNote";
import DeepMala from "@/components/ui/DeepMala";
import VerseFolio from "@/components/wisdom/VerseFolio";
import ReflectionNotes from "@/components/wisdom/ReflectionNotes";
import TodayAction from "@/components/wisdom/TodayAction";
import TopicCard from "@/components/wisdom/TopicCard";
import KathaCard from "@/components/wisdom/KathaCard";
import GitaArchive from "@/components/wisdom/GitaArchive";
import { toRoman, verseFromSegment, verseHref, verseSegment } from "@/components/wisdom/meta";
import styles from "@/components/wisdom/wisdom.module.css";

type Params = { verse: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return GITA.map((v) => ({ verse: verseSegment(v.id) }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { verse: seg } = await params;
  const v = gitaById(verseFromSegment(seg));
  if (!v) return {};
  const description = `Bhagavad Gita ${v.id} (${v.chapterName}) in Sanskrit with transliteration and meaning: ${v.meaning}`.slice(0, 158);
  return {
    title: `Bhagavad Gita ${v.id} — ${v.chapterName}`,
    description,
    alternates: { canonical: verseHref(v) },
    openGraph: { title: `Bhagavad Gita ${v.id} · Prem Marg`, description, url: verseHref(v), type: "article" },
  };
}

export default async function VersePage({ params }: { params: Promise<Params> }) {
  const { verse: seg } = await params;
  const verse = gitaById(verseFromSegment(seg));
  if (!verse) notFound();

  const idx = GITA.findIndex((v) => v.id === verse.id);
  const prev = GITA[idx - 1];
  const next = GITA[idx + 1];
  const topics = verse.themes.map(gurukulBySlug).filter((t): t is GurukulTopic => Boolean(t));
  const kathas = [
    ...KATHAS.filter((k) => k.gita === verse.id),
    ...KATHAS.filter((k) => k.gita !== verse.id && verse.themes.includes(k.gurukul)),
  ].slice(0, 3);

  return (
    <>
      <PageHero
        eyebrow={`Bhagavad Gita · Chapter ${toRoman(verse.chapter)}`}
        title={
          <>
            Verse <em>{verse.id}</em>
          </>
        }
        lead={verse.chapterName}
        watermark="गीता"
      >
        <Link href="/gita" className="link-arrow">
          Today&rsquo;s verse
        </Link>
      </PageHero>

      <section className={`section section--tight ${styles.folioSection}`}>
        <div className={`container ${styles.folioWrap}`}>
          <VerseFolio verse={verse} />
        </div>
      </section>

      <section className="section section--tight" aria-label="Reflection and action">
        <div className="container">
          <div className={styles.practiceGrid}>
            <div className={`card ${styles.reflectCard}`} data-reveal>
              <p className={styles.label}>Reflection</p>
              <ReflectionNotes storageKey={`gita:${verse.id}`} question={verse.reflection} />
            </div>
            <div className={`card card--forest ${styles.actCard}`} data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
              <TodayAction kind="gita" id={verse.id} action={verse.action} />
              <div className={styles.lampBox} id="lamp">
                <p className={styles.lampHead}>Light today&rsquo;s lamp</p>
                <DeepMala tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {(topics.length > 0 || kathas.length > 0) && (
        <section className="section section--marble" aria-labelledby="related-head">
          <div className="container">
            <div className={styles.bridgeHead}>
              <div>
                <p className="eyebrow">Where this verse leads</p>
                <h2 id="related-head">Practise it. Hear it in a story.</h2>
              </div>
              <SakhiNote ask={`What does Bhagavad Gita ${verse.id} teach, and how can I practise it this week?`} askLabel="Ask about this verse">
                A verse becomes yours when you live it for a week. Pick one practice below — I&rsquo;ll keep your progress on this device.
              </SakhiNote>
            </div>
            {topics.length > 0 && (
              <div className="grid grid--3">
                {topics.map((t) => (
                  <TopicCard key={t.slug} topic={t} />
                ))}
              </div>
            )}
            {kathas.length > 0 && (
              <>
                <h3 className={styles.subhead}>Stories that carry this teaching</h3>
                <div className={styles.library}>
                  {kathas.map((k) => (
                    <KathaCard key={k.slug} katha={k} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      <section className="section section--tight" aria-label="More verses">
        <div className="container">
          <nav className={styles.pager} aria-label="Previous and next verse">
            {prev ? (
              <Link href={verseHref(prev)} className={styles.pagerLink} rel="prev">
                <span>← Previous</span>
                <strong>Gita {prev.id}</strong>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link href={verseHref(next)} className={`${styles.pagerLink} ${styles.pagerNext}`} rel="next">
                <span>Next →</span>
                <strong>Gita {next.id}</strong>
              </Link>
            ) : (
              <span />
            )}
          </nav>
          <h2 className={styles.subhead}>All verses</h2>
          <GitaArchive current={verse.id} />
        </div>
      </section>
    </>
  );
}
