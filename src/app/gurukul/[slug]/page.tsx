import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GURUKUL, gurukulBySlug } from "@/lib/content/gurukul";
import { gitaById } from "@/lib/content/gita";
import { kathaBySlug } from "@/lib/content/katha";
import type { GitaVerse, Katha } from "@/lib/content/types";
import PageHero from "@/components/ui/PageHero";
import SakhiNote from "@/components/ui/SakhiNote";
import PracticeTracker from "@/components/wisdom/PracticeTracker";
import ReflectionNotes from "@/components/wisdom/ReflectionNotes";
import GitaInline from "@/components/wisdom/GitaInline";
import KathaCard from "@/components/wisdom/KathaCard";
import { toRoman } from "@/components/wisdom/meta";
import styles from "@/components/wisdom/wisdom.module.css";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return GURUKUL.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const t = gurukulBySlug(slug);
  if (!t) return {};
  const description = `${t.tagline} ${t.overview}`.slice(0, 158);
  return {
    title: `${t.title} (${t.sanskritRoman}) — Gurukul`,
    description,
    alternates: { canonical: `/gurukul/${t.slug}` },
    openGraph: { title: `${t.title} · Prem Marg Gurukul`, description, url: `/gurukul/${t.slug}`, type: "article" },
  };
}

export default async function GurukulTopicPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const topic = gurukulBySlug(slug);
  if (!topic) notFound();

  const idx = GURUKUL.findIndex((t) => t.slug === topic.slug);
  const prev = GURUKUL[(idx - 1 + GURUKUL.length) % GURUKUL.length];
  const next = GURUKUL[(idx + 1) % GURUKUL.length];
  const verses = topic.gita.map(gitaById).filter((v): v is GitaVerse => Boolean(v));
  const kathas = topic.katha.map(kathaBySlug).filter((k): k is Katha => Boolean(k));

  return (
    <>
      <PageHero
        eyebrow={`Gurukul · ${idx + 1} of ${GURUKUL.length}`}
        title={
          <>
            {topic.title} <em>· {topic.sanskritRoman}</em>
          </>
        }
        lead={topic.tagline}
        watermark={topic.sanskrit}
      >
        <p className={styles.heroMeta}>
          <span>3 lessons</span>
          <span aria-hidden>✦</span>
          <span>7-day practice</span>
          <span aria-hidden>✦</span>
          <span>{topic.reflection.length} reflections</span>
        </p>
      </PageHero>

      <section className="section section--tight" aria-labelledby="overview-head">
        <div className={`container ${styles.overviewGrid}`}>
          <div>
            <div className={styles.term} data-sakhi={`${topic.sanskritRoman} is the Sanskrit word for ${topic.title.toLowerCase()}.`}>
              <span className="sanskrit" lang="sa">
                {topic.sanskrit}
              </span>
              <span className={styles.termRoman}>{topic.sanskritRoman}</span>
            </div>
          </div>
          <div>
            <p className="eyebrow">Overview</p>
            <h2 id="overview-head" className="visually-hidden">
              Overview
            </h2>
            <p className={styles.overview}>{topic.overview}</p>
            <SakhiNote ask={`Help me work on ${topic.title.toLowerCase()} using the Gurukul practice.`} askLabel="Talk it through with me">
              Go at your own pace. Read one lesson today, then try Day 1 — I&rsquo;ll celebrate every day you keep.
            </SakhiNote>
          </div>
        </div>
      </section>

      <section className="section section--tight section--marble" aria-labelledby="lessons-head">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">Three lessons</p>
            <h2 id="lessons-head">Understand it first.</h2>
          </div>
          <div className={styles.lessons}>
            {topic.lessons.map((l, i) => (
              <article key={l.title} className={styles.lesson} data-reveal style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
                <span className={styles.lessonNum} aria-hidden>
                  {toRoman(i + 1)}
                </span>
                <h3>{l.title}</h3>
                {l.body.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--forest" id="practice" aria-labelledby="practice-head">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The seven-day practice</p>
            <h2 id="practice-head">Then live it, one day at a time.</h2>
            <p className="lead">Each step takes about fifteen minutes or less. Tick a day when you&rsquo;ve kept it — progress stays on this device. Miss a day? Simply continue.</p>
          </div>
          <PracticeTracker slug={topic.slug} title={topic.title} practice={topic.practice} />
        </div>
      </section>

      <section className="section section--tight" aria-labelledby="reflect-head">
        <div className="container container--narrow">
          <div className="section-head">
            <p className="eyebrow">Reflection</p>
            <h2 id="reflect-head">Questions to sit with.</h2>
            <p className="lead">Write as much or as little as you like. Your notes are private and stay only in this browser.</p>
          </div>
          <ol className={styles.questions}>
            {topic.reflection.map((q, i) => (
              <li key={i}>
                <ReflectionNotes storageKey={`gurukul:${topic.slug}:${i + 1}`} question={q} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {verses.length > 0 && (
        <section className="section section--tight section--marble" aria-labelledby="verses-head">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">From the Gita</p>
              <h2 id="verses-head">The verses behind this practice.</h2>
            </div>
            <div className="grid grid--2">
              {verses.map((v) => (
                <GitaInline key={v.id} verse={v} />
              ))}
            </div>
          </div>
        </section>
      )}

      {kathas.length > 0 && (
        <section className="section section--tight" aria-labelledby="stories-head">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow">Katha</p>
              <h2 id="stories-head">{kathas.length > 1 ? "Stories that walked this road." : "A story that walked this road."}</h2>
            </div>
            <div className={styles.library}>
              {kathas.map((k) => (
                <KathaCard key={k.slug} katha={k} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section section--tight" aria-label="More topics">
        <div className="container">
          <nav className={styles.pager} aria-label="Other Gurukul topics">
            <Link href={`/gurukul/${prev.slug}`} className={styles.pagerLink} rel="prev">
              <span>← Previous topic</span>
              <strong>
                {prev.title} · <span className="sanskrit">{prev.sanskrit}</span>
              </strong>
            </Link>
            <Link href="/gurukul#marg" className={`${styles.pagerLink} ${styles.pagerMid}`}>
              <span>The Marg</span>
              <strong>All {GURUKUL.length} topics</strong>
            </Link>
            <Link href={`/gurukul/${next.slug}`} className={`${styles.pagerLink} ${styles.pagerNext}`} rel="next">
              <span>Next topic →</span>
              <strong>
                {next.title} · <span className="sanskrit">{next.sanskrit}</span>
              </strong>
            </Link>
          </nav>
          <p className={`small muted ${styles.care}`}>
            Gurukul offers devotional and practical learning, not medical or psychological treatment. If you are struggling, please reach out to a qualified
            professional too.
          </p>
        </div>
      </section>
    </>
  );
}
