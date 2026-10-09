import type { Metadata } from "next";
import { KATHAS } from "@/lib/content/katha";
import { pickDaily } from "@/lib/daily";
import PageHero from "@/components/ui/PageHero";
import SakhiNote from "@/components/ui/SakhiNote";
import DeepMala from "@/components/ui/DeepMala";
import StoryBook from "@/components/wisdom/StoryBook";
import KathaLibrary from "@/components/wisdom/KathaLibrary";
import WisdomSubscribe from "@/components/wisdom/WisdomSubscribe";
import styles from "@/components/wisdom/wisdom.module.css";

// Today's story rolls over with the (UTC) day.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Katha — One Sacred Story a Day",
  description:
    "One story daily from the Upanishads, Ramayana, Mahabharata, Puranas, saints and bhaktas — retold simply, with a lesson, a reflection and one action for modern life.",
  alternates: { canonical: "/katha" },
  openGraph: {
    title: "Katha — One Sacred Story a Day · Prem Marg",
    description: "Stories from the Upanishads, Ramayana, Mahabharata, Puranas, saints and bhaktas.",
    url: "/katha",
  },
};

export default function KathaPage() {
  const today = pickDaily(KATHAS, new Date(), 3);
  const lite = KATHAS.map(({ slug, title, tradition, summary, readingMinutes }) => ({ slug, title, tradition, summary, readingMinutes }));

  return (
    <>
      <PageHero
        eyebrow="Katha · one story daily · free"
        title={
          <>
            Old stories, <em>for the life you live now.</em>
          </>
        }
        lead="One story daily from the Upanishads, Ramayana, Mahabharata, Puranas, saints and bhaktas — told simply, each ending with a lesson, a reflection and one action for today."
        watermark="कथा"
      >
        <div className="row">
          <a href="#today" className="btn">
            Today&rsquo;s story
          </a>
          <a href="#library" className="btn btn--ghost">
            The library · {KATHAS.length} stories
          </a>
        </div>
      </PageHero>

      <section className="section section--tight" id="today" aria-label="Today's story">
        <div className="container">
          <StoryBook katha={today} />
        </div>
      </section>

      <section className="section section--tight" aria-label="Sakhi and today's lamp">
        <div className={`container ${styles.kathaBand}`}>
          <SakhiNote ask="Which Katha would help me most right now?" askLabel="Ask me for a story">
            Not sure where to begin? Tell me what&rsquo;s on your mind — fear, a hard decision, a friendship — and I&rsquo;ll find you a story that has walked
            that road before.
          </SakhiNote>
          <div className={styles.lampInline}>
            <p className={styles.lampHeadDark}>After reading, light today&rsquo;s lamp</p>
            <DeepMala tone="light" />
          </div>
        </div>
      </section>

      <section className="section section--marble" id="library" aria-labelledby="library-head">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The library</p>
            <h2 id="library-head">
              Five traditions, <span className="accent">one thread of dharma.</span>
            </h2>
            <p className="lead">Each story says honestly where it comes from — the original text, or the later and folk traditions that carried it to us.</p>
          </div>
          <KathaLibrary kathas={lite} todaySlug={today.slug} />
        </div>
      </section>

      <section className="section section--tight" aria-label="Morning email">
        <div className="container container--narrow">
          <WisdomSubscribe
            list="katha"
            title="A story, each morning"
            text="One short Katha in your inbox each day, with its lesson and one action. Optional, free and easy to stop."
          />
        </div>
      </section>
    </>
  );
}
