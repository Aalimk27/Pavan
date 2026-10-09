import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { KATHAS, kathaBySlug } from "@/lib/content/katha";
import { gitaById } from "@/lib/content/gita";
import { gurukulBySlug } from "@/lib/content/gurukul";
import PageHero from "@/components/ui/PageHero";
import SakhiNote from "@/components/ui/SakhiNote";
import DeepMala from "@/components/ui/DeepMala";
import ReadingProgress from "@/components/wisdom/ReadingProgress";
import MarkRead from "@/components/wisdom/MarkRead";
import ReflectionNotes from "@/components/wisdom/ReflectionNotes";
import TodayAction from "@/components/wisdom/TodayAction";
import TopicCard from "@/components/wisdom/TopicCard";
import GitaInline from "@/components/wisdom/GitaInline";
import { LotusRule } from "@/components/wisdom/Ornament";
import { TRADITION } from "@/components/wisdom/meta";
import styles from "@/components/wisdom/wisdom.module.css";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return KATHAS.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const k = kathaBySlug(slug);
  if (!k) return {};
  const description = `${k.summary} A ${k.readingMinutes}-minute story from the ${k.tradition} tradition, with its lesson for modern life.`;
  return {
    title: `${k.title} — Katha`,
    description,
    alternates: { canonical: `/katha/${k.slug}` },
    openGraph: { title: `${k.title} · Prem Marg Katha`, description, url: `/katha/${k.slug}`, type: "article" },
  };
}

export default async function KathaStoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const katha = kathaBySlug(slug);
  if (!katha) notFound();

  const t = TRADITION[katha.tradition];
  const topic = gurukulBySlug(katha.gurukul);
  const verse = katha.gita ? gitaById(katha.gita) : undefined;
  const idx = KATHAS.findIndex((k) => k.slug === katha.slug);
  const next = KATHAS[(idx + 1) % KATHAS.length];

  return (
    <>
      <ReadingProgress target="#story" finishedSelector="#katha-lesson" />
      <MarkRead kind="katha" id={katha.slug} />

      <PageHero eyebrow={`Katha · ${katha.tradition}`} title={katha.title} lead={katha.summary} watermark={t.skt}>
        <p className={styles.heroMeta}>
          <span>{katha.readingMinutes} minute read</span>
          <span aria-hidden>✦</span>
          <span>{katha.source}</span>
        </p>
      </PageHero>

      <section className={`section section--tight ${styles.storySection}`} style={{ ["--accent" as string]: t.accent }}>
        <article id="story" className={`container container--narrow ${styles.story}`} aria-label={katha.title}>
          {katha.story.map((p, i) => (
            <p key={i} className={i === 0 ? styles.dropcap : undefined}>
              {p}
            </p>
          ))}
          <LotusRule className={styles.rule} />
          <p className={styles.storyEnd} lang="sa">
            <span className="sanskrit">॥ इति ॥</span>
          </p>
        </article>
      </section>

      <section className="section section--tight section--marble" id="katha-lesson" aria-labelledby="lesson-head">
        <div className="container">
          <div className={`card card--gilded ${styles.lessonCard}`} data-reveal>
            <h2 id="lesson-head" className="eyebrow">
              The lesson
            </h2>
            <p className={styles.lessonText}>{katha.lesson}</p>
          </div>
          <div className={styles.practiceGrid}>
            <div className={`card ${styles.reflectCard}`} data-reveal>
              <p className={styles.label}>Reflection</p>
              <ReflectionNotes storageKey={`katha:${katha.slug}`} question={katha.reflection} />
            </div>
            <div className={`card card--forest ${styles.actCard}`} data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
              <TodayAction kind="katha" id={katha.slug} action={katha.action} />
              <div className={styles.lampBox} id="lamp">
                <p className={styles.lampHead}>Light today&rsquo;s lamp</p>
                <DeepMala tone="dark" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="carry-head">
        <div className="container">
          <div className={styles.bridgeHead}>
            <div>
              <p className="eyebrow">Carry the story forward</p>
              <h2 id="carry-head">From a story to a practice.</h2>
            </div>
            <SakhiNote ask={`What is the lesson of the story "${katha.title}" for my life right now?`} askLabel="Talk it through with me">
              Stories stay with us when we act on them. If this one touched something, the Gurukul practice beside it is a gentle next step.
            </SakhiNote>
          </div>
          <div className={styles.carryGrid}>
            {topic && <TopicCard topic={topic} kicker="Practise this story · 7 days" />}
            {verse && <GitaInline verse={verse} />}
          </div>
          <nav className={styles.pager} aria-label="More stories">
            <Link href="/katha#library" className={styles.pagerLink}>
              <span>← The library</span>
              <strong>All {KATHAS.length} stories</strong>
            </Link>
            <Link href={`/katha/${next.slug}`} className={`${styles.pagerLink} ${styles.pagerNext}`} rel="next">
              <span>Next story →</span>
              <strong>{next.title}</strong>
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
