import type { Metadata } from "next";
import Link from "next/link";
import { GURUKUL } from "@/lib/content/gurukul";
import PageHero from "@/components/ui/PageHero";
import SakhiNote from "@/components/ui/SakhiNote";
import MargPath from "@/components/wisdom/MargPath";
import styles from "@/components/wisdom/wisdom.module.css";

export const metadata: Metadata = {
  title: "Gurukul — Practical Learning for Character",
  description:
    "Structured, free life education from the Gita and sacred stories: anger, ego, comparison, desire, duty, fear, money, relationships, discipline, service, gratitude, leadership and handling success and failure — each a seven-day practice.",
  alternates: { canonical: "/gurukul" },
  openGraph: {
    title: "Gurukul — Practical Learning for Character · Prem Marg",
    description: "Thirteen topics, three short lessons and a seven-day practice each.",
    url: "/gurukul",
  },
};

const STEPS = [
  { n: "I", title: "Three short lessons", text: "Drawn from the Gita, the Upanishads and the lives of saints — read in a few minutes." },
  { n: "II", title: "A seven-day practice", text: "One small step a day, about fifteen minutes or less. Tick each day; your lamp grows brighter." },
  { n: "III", title: "Reflect, then go deeper", text: "Three journaling questions, with the verses and stories that hold the same teaching." },
];

export default function GurukulPage() {
  const topics = GURUKUL.map(({ slug, title, sanskrit, sanskritRoman, tagline }) => ({ slug, title, sanskrit, sanskritRoman, tagline }));
  return (
    <>
      <PageHero
        eyebrow="Gurukul · structured learning · free"
        title={
          <>
            From prediction <em>to practice.</em>
          </>
        }
        lead="Structured learning for the life you are actually living: anger, ego, comparison, desire, duty, fear, money, relationships, discipline, service, gratitude, leadership and handling success and failure."
        watermark="गुरुकुल"
      >
        <a href="#marg" className="btn">
          Walk the Marg
        </a>
      </PageHero>

      <section className="section section--tight" aria-labelledby="why-head">
        <div className={`container ${styles.whyGrid}`}>
          <div>
            <p className="eyebrow">The long-term shift</p>
            <h2 id="why-head">Astrology is one door. Gurukul is the path.</h2>
            <blockquote className={styles.quote} data-sakhi="This is the heart of Prem Marg: less fortune-telling, more becoming.">
              <p>
                Astrology is one door into Prem Marg. Gurukul is where the company evolves from prediction-seeking into practical learning and character
                development.
              </p>
              <cite>From the Prem Marg founding blueprint</cite>
            </blockquote>
          </div>
          <div className={styles.steps}>
            <ol>
              {STEPS.map((s) => (
                <li key={s.n}>
                  <span className={styles.stepNum}>{s.n}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <SakhiNote ask="Which Gurukul topic should I start with?" askLabel="Help me choose">
              Pick the one topic that feels true right now — not the one you think you should do. Seven small days can change a lot.
            </SakhiNote>
          </div>
        </div>
      </section>

      <section className={`section section--night ${styles.margSection}`} id="marg" aria-labelledby="marg-head">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">The Marg · मार्ग</p>
            <h2 id="marg-head">Thirteen lamps along one path.</h2>
            <p className="lead">Each lamp is a seven-day practice. It glows brighter with every day you keep — saved privately on this device.</p>
          </div>
          <MargPath topics={topics} />
        </div>
      </section>

      <section className="section section--tight" aria-label="Daily wisdom">
        <div className={`container ${styles.loop}`}>
          <p className="lead">
            Every Gurukul topic is linked to the daily <Link href="/gita">Gita verse</Link> and <Link href="/katha">Katha</Link> that carry the same teaching —
            read today&rsquo;s, then practise it here.
          </p>
          <p className={`small muted ${styles.care}`}>
            Gurukul is devotional and practical learning. It is never a substitute for medical or mental-health care; if you are struggling, please reach out to
            a qualified professional as well.
          </p>
        </div>
      </section>
    </>
  );
}
