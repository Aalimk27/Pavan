import type { Metadata } from "next";
import Link from "next/link";
import { HOME_MEANING, homeNumber } from "@/lib/ank";
import SakhiNote from "@/components/ui/SakhiNote";
import NavagrahaDial from "@/components/ank/NavagrahaDial";
import AnkInstrument from "@/components/ank/AnkInstrument";
import { DEVANAGARI_DIGIT, NUMBERS, grahaLabel } from "@/components/ank/ank-data";
import s from "./ank.module.css";

const TITLE = "ANK — Free Mulank, Bhagya Ank & House Number Calculator";
const DESCRIPTION =
  "Calculate your Mulank, Bhagya Ank and house number for free — every step shown, compound and root both preserved. Strengths and watch-outs for numbers 1–9, never good-or-bad verdicts. No name-changing, no lucky-number sales.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Mulank calculator",
    "Bhagya Ank calculator",
    "house number numerology",
    "flat number numerology",
    "home number calculator",
    "root number",
    "compound number",
    "house number 1 to 9 meaning",
    "apartment number meaning",
    "Navagraha numbers",
  ],
  alternates: { canonical: "/ank" },
  openGraph: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION, url: "/ank", type: "website" },
  twitter: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION },
};

/** The worked example from the blueprint — computed by the engine, not typed by hand. */
const EXAMPLE = homeNumber("607");

const PRINCIPLES = [
  {
    title: "No name-changing numerology",
    text: "Your name was given with love. We will never tell you to change it to fix a number.",
    sakhi: "Your name carries your family's blessing. Prem Marg will never ask you to change it for a number.",
  },
  {
    title: "No spelling changes",
    text: "No extra letters, no doubled vowels, no re-spelt signatures sold as remedies.",
    sakhi: "Adding a letter to your name isn't a remedy. Character and conduct are.",
  },
  {
    title: "No phone-number gimmicks",
    text: "We don't sell ‘lucky’ mobile numbers, vehicle numbers or SIM cards.",
    sakhi: "A phone number is a phone number. We don't sell lucky ones — ever.",
  },
  {
    title: "No artificial corrections",
    text: "No stickers, plates or extra digits on your door to ‘correct’ a house number.",
    sakhi: "A home is changed by how it's lived in — light, order, kindness — not by a sticker beside the door.",
  },
  {
    title: "No fear-based lucky-number sales",
    text: "No number is unlucky. No number needs to be bought, worn or avoided.",
    sakhi: "Fear isn't guidance. Every number has strengths and watch-outs — that's all, and that's enough.",
  },
];

const FAQ = [
  {
    q: "How do I calculate my Mulank?",
    a: "Mulank comes from the day of the month you were born. Add its digits until one digit remains: born on the 29th, 2 + 9 = 11, and 1 + 1 = 2 — compound 11, root 2. The month and year are not used.",
  },
  {
    q: "How is Bhagya Ank different from Mulank?",
    a: "Bhagya Ank adds every digit of your full date of birth — day, month and year — and reduces the total to a single digit. Traditionally, Mulank speaks of how you meet the world and Bhagya Ank of the path you walk.",
  },
  {
    q: "How do I calculate a flat number like B-1204?",
    a: "Use the number on your own door and add only its digits: 1 + 2 + 0 + 4 = 7. Letters, block names and separators such as “B-” or “/” are set aside in this method — they mark the place, not the number.",
  },
  {
    q: "What is the difference between a compound and a root number?",
    a: "The compound is the first total of the digits; the root is that total reduced to a single digit from 1 to 9. For 607, 6 + 0 + 7 = 13 → 1 + 3 = 4: compound 13 / root 4. We always keep both.",
  },
  {
    q: "Is house number 4 or 8 unlucky?",
    a: "No. No number is good or bad. Each carries strengths and watch-outs — a home of 8, for example, supports patience and steady building, while asking you to let in light and play.",
  },
  {
    q: "Does my flat number decide whether an apartment is compatible with me?",
    a: "No. A number describes an atmosphere a home tends to support; it never decides for you. Compare it with your own numbers if you like — and for the home itself, the layout matters far more. That is what VASTU (Beta) looks at.",
  },
  {
    q: "Should I change my house number or my name?",
    a: "No. Prem Marg never recommends name changes, spelling changes, extra digits or ‘corrections’. Use the meanings as a mirror for daily practice — that is where change happens.",
  },
];

export default function AnkPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      {/* ───────────── Hero: the Navagraha dial ───────────── */}
      <section className={`page-hero ${s.hero}`} aria-labelledby="ank-title">
        <span className={`${s.watermark} sanskrit`} aria-hidden>
          अंक
        </span>
        <div className={`container ${s.heroGrid}`}>
          <div className={s.heroText}>
            <p className="eyebrow">
              ANK · Number intelligence <span className="badge badge--free">Free</span>
            </p>
            <h1 id="ank-title" className={s.heroTitle}>
              Nine numbers. <em>Never a verdict.</em>
            </h1>
            <p className="lead">
              Mulank, Bhagya Ank and your home number — calculated in the open, compound and root both kept, and explained as strengths and watch-outs. A mirror for daily practice, not a sentence passed on your life.
            </p>
            <div className={s.heroCtas}>
              <a href="#calculate" className="btn btn--lg">
                Calculate my numbers
              </a>
              <a href="#house-numbers" className="btn btn--ghost btn--lg">
                House numbers 1–9
              </a>
            </div>
            <ul className={s.heroFacts}>
              <li data-sakhi="All three calculators are free — no account, no email, and nothing leaves your browser.">Three free calculators</li>
              <li data-sakhi="We show every step: digits, compound, root. Nothing is hidden behind a number.">Every step shown</li>
              <li data-sakhi="No name changes, no lucky-number sales, no artificial corrections. That's a promise.">No gimmicks</li>
            </ul>
          </div>
          <div className={s.heroDial}>
            <NavagrahaDial />
          </div>
        </div>
      </section>

      {/* ───────────── Calculators + convergence ───────────── */}
      <AnkInstrument />

      {/* ───────────── Compound & root ───────────── */}
      <section className="section" aria-labelledby="method-title">
        <div className={`container ${s.method}`}>
          <div className={s.methodText}>
            <p className="eyebrow">The method, in the open</p>
            <h2 id="method-title">
              Compound and root — <em className="accent">we keep both.</em>
            </h2>
            <p className="lead">Most calculators show you a single digit and stop. We show the whole path, because the compound carries nuance the root alone can lose.</p>
            <ol className={s.methodSteps}>
              <li>
                <strong>Gather the digits.</strong> Only digits count. Letters and separators are set aside.
              </li>
              <li>
                <strong>Add them once.</strong> The first total is the <em>compound</em>.
              </li>
              <li>
                <strong>Reduce to one digit.</strong> Keep adding until 1–9 remains — the <em>root</em>, with its graha.
              </li>
            </ol>
          </div>
          <figure className={s.example} data-sakhi="This is the example from our founding blueprint: 607 gives compound 13 and root 4 — and we always display both.">
            <p className={s.exampleKicker}>Home number 607</p>
            <div className={s.exampleRow} aria-hidden>
              <span className={s.exDigit}>{EXAMPLE.digits[0]}</span>
              <span className={s.exOp}>+</span>
              <span className={s.exDigit}>{EXAMPLE.digits[1]}</span>
              <span className={s.exOp}>+</span>
              <span className={s.exDigit}>{EXAMPLE.digits[2]}</span>
              <span className={s.exOp}>=</span>
              <span className={s.exCompound}>{EXAMPLE.compound}</span>
            </div>
            <div className={s.exampleRow} aria-hidden>
              <span className={s.exArrow}>→</span>
              {String(EXAMPLE.compound)
                .split("")
                .map((d, i) => (
                  <span key={i} className={s.exPair}>
                    {i > 0 && <span className={s.exOp}>+</span>}
                    <span className={s.exDigit}>{d}</span>
                  </span>
                ))}
              <span className={s.exOp}>=</span>
              <span className={s.exRoot}>{EXAMPLE.root}</span>
            </div>
            <figcaption className={s.exCaption}>
              <span className="visually-hidden">6 + 0 + 7 = 13 → 1 + 3 = 4. </span>
              Compound <strong>{EXAMPLE.compound}</strong> / Root <strong>{EXAMPLE.root}</strong> · {grahaLabel(EXAMPLE.root)}
            </figcaption>
          </figure>
        </div>
        <div className={`container container--narrow ${s.noteWrap}`}>
          <SakhiNote ask="What do my Mulank and Bhagya Ank mean together?" askLabel="Ask Sakhi about your numbers">
            Numbers are a mirror, not a verdict. If a meaning feels true, let it suggest one small practice. If it doesn&apos;t, let it go — you retain agency, always.
          </SakhiNote>
        </div>
      </section>

      {/* ───────────── Principles ───────────── */}
      <section className="section section--marble" aria-labelledby="principles-title">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">Our number principles</p>
            <h2 id="principles-title">What we will never do with your numbers.</h2>
            <p className="lead">Guidance without fear is a Prem Marg non-negotiable. In numerology, it means five clear refusals.</p>
          </div>
          <ul className={s.principles}>
            {PRINCIPLES.map((p, i) => (
              <li key={p.title} className={s.principle} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} data-sakhi={p.sakhi}>
                <span className={s.principleMark} aria-hidden>
                  <svg viewBox="0 0 24 24" width="22" height="22">
                    <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M5.6 18.4 18.4 5.6" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </span>
                <h3 className={s.principleTitle}>{p.title}</h3>
                <p className={s.principleText}>{p.text}</p>
              </li>
            ))}
          </ul>
          <p className={s.principleFoot}>
            Practices on this page are devotional and practical suggestions, not scientific claims — and never a substitute for medical, mental-health, legal or financial advice.
          </p>
        </div>
      </section>

      {/* ───────────── House numbers 1–9 (evergreen) ───────────── */}
      <section id="house-numbers" className="section" aria-labelledby="house-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">House numbers 1–9</p>
            <h2 id="house-title">
              What your house number <em className="accent">tends to support.</em>
            </h2>
            <p className="lead">
              Add the digits of your door number until one digit remains — or use the <a href="#calculate">free calculator</a>. Each root describes an atmosphere a home tends to support, with strengths, watch-outs and a simple practice.
            </p>
          </div>
          <nav className={s.jump} aria-label="Jump to a house number">
            {NUMBERS.map((n) => (
              <a key={n} href={`#home-${n}`} className={s.jumpLink}>
                {n}
              </a>
            ))}
          </nav>
          <div className={s.houses}>
            {NUMBERS.map((n) => {
              const m = HOME_MEANING[n];
              return (
                <article key={n} id={`home-${n}`} className={s.house} aria-labelledby={`home-${n}-title`} data-reveal>
                  <header className={s.houseHead}>
                    <span className={s.houseNum} data-sakhi={`House number ${n} belongs to ${grahaLabel(n, " — ")}. ${m.essence}`}>
                      {n}
                    </span>
                    <div>
                      <p className={s.houseGraha}>
                        {grahaLabel(n)}
                      </p>
                      <h3 id={`home-${n}-title`} className={s.houseTitle}>
                        House number {n} — {m.title}
                      </h3>
                    </div>
                    <span className={`${s.houseDeva} sanskrit`} aria-hidden>
                      {DEVANAGARI_DIGIT[n]}
                    </span>
                  </header>
                  <p className={s.houseEssence}>{m.essence}</p>
                  <dl className={s.houseDl}>
                    <div>
                      <dt>Strengths</dt>
                      <dd>{m.strengths.join(" · ")}</dd>
                    </div>
                    <div>
                      <dt>Watch-outs</dt>
                      <dd>{m.watchOuts.join(" · ")}</dd>
                    </div>
                    <div>
                      <dt>Practice</dt>
                      <dd className={s.housePractice}>{m.practice}</dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
          <p className={s.houseFoot}>No house number is good or bad. Layout, light and how a home is lived in matter far more than the digits on its door.</p>
        </div>
      </section>

      {/* ───────────── FAQ ───────────── */}
      <section className="section section--marble" aria-labelledby="faq-title">
        <div className="container container--narrow">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">Questions</p>
            <h2 id="faq-title">Mulank, Bhagya Ank & house numbers — answered.</h2>
          </div>
          <div className={s.faq}>
            {FAQ.map((f) => (
              <details key={f.q} className={s.faqItem}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      </section>

      {/* ───────────── Onward ───────────── */}
      <section className="section section--tight" aria-labelledby="onward-title">
        <div className={`container ${s.onward}`}>
          <div>
            <p className="eyebrow">Go further</p>
            <h2 id="onward-title" className={s.onwardTitle}>
              Numbers meet the sky in DRISHTI.
            </h2>
            <p className="muted">Every DRISHTI reading gives your Mulank and Bhagya Ank a slide of their own, followed by an Astrology × Numerology Convergence.</p>
          </div>
          <div className={s.onwardLinks}>
            <Link href="/drishti" className="link-arrow">
              Calculate your free DRISHTI snapshot
            </Link>
            <Link href="/vastu" className="link-arrow">
              Check your floor plan with VASTU (Beta)
            </Link>
            <Link href="/my" className="link-arrow">
              See what you&apos;ve saved in My Prem Marg
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
