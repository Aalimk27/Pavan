import type { Metadata } from "next";
import Link from "next/link";
import { CALC_VERSION } from "@/lib/astro/engine";
import { PRODUCTS, formatPrice } from "@/lib/products";
import SakhiNote from "@/components/ui/SakhiNote";
import LiveSky from "@/components/drishti/LiveSky";
import SnapshotStudio from "@/components/drishti/SnapshotStudio";
import SlideDeck from "@/components/drishti/SlideDeck";
import Tiers from "@/components/drishti/Tiers";
import s from "./drishti.module.css";

const TITLE = "DRISHTI — Free Vedic Birth Chart Snapshot & Personal Readings";
const DESCRIPTION =
  "Calculate your free Vedic snapshot — Lagna, Moon rashi, Nakshatra and your current Mahadasha — from real astronomy (sidereal, Lahiri). Then go deeper with DRISHTI Core, Deep or Signature. Guidance without fear.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Vedic birth chart", "free kundli", "Nakshatra calculator", "Moon sign", "Lagna", "Mahadasha", "Vimshottari dasha", "sidereal astrology", "Lahiri ayanamsa", "DRISHTI"],
  alternates: { canonical: "/drishti" },
  openGraph: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION, url: "/drishti", type: "website" },
  twitter: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION },
};

const PIPELINE = [
  {
    n: "01",
    name: "Calculate",
    who: "Deterministic engines",
    text: "Deterministic chart, number and geometry engines produce the facts — positions, degrees and dasha dates.",
    sakhi: "Calculation comes first and comes from code, not opinion: the same birth details always give the same chart.",
  },
  {
    n: "02",
    name: "Interpret",
    who: "Specialist agents",
    text: "Specialist agents turn verified facts into Prem Marg guidance. They consume the calculations — they never invent positions or dates.",
    sakhi: "Interpretation is written from structured evidence. If a fact isn't in the calculation, it can't appear in your reading.",
  },
  {
    n: "03",
    name: "QA",
    who: "Quality agent",
    text: "Automated consistency and confidence checks for contradictions, unsupported claims, missing data and tone.",
    sakhi: "Every reading is checked for contradictions, unsupported claims and tone before anyone sees it — including fear-based language.",
  },
  {
    n: "04",
    name: "Render",
    who: "Report templates",
    text: "An elegant branded report generated from structured fields — the same 13-slide standard, every time.",
    sakhi: "Templates render the approved content into your 13 slides. Design never changes the facts underneath.",
  },
];

const COMMITMENTS = [
  { title: "Guidance without fear", text: "Never doom, panic, dosha fear or manipulative remedy selling." },
  { title: "You retain agency", text: "Traditional systems offer interpretation, not absolute control over your life." },
  { title: "No gimmicks", text: "No casual gemstone prescriptions, no name-changing numerology and no fear-based lucky-number sales." },
  { title: "Devotional, not scientific", text: "Devotional suggestions are labelled as such — and never a substitute for medical or mental-health care." },
];

const FAQ = [
  {
    q: "Why does DRISHTI need my birth time?",
    a: "Your Lagna (ascendant) moves through all twelve rashis in a single day, so it needs an exact time. Without one, we withhold the Lagna and say so plainly. Your Moon, Nakshatra and Sun are still calculated — though dasha dates become approximate, and the snapshot tells you by how much.",
  },
  {
    q: "Is this Vedic (sidereal) or Western astrology?",
    a: "Vedic. DRISHTI uses the sidereal zodiac with the Lahiri ayanamsa. Sidereal positions sit roughly 24° behind Western (tropical) ones, so your Vedic Sun or Moon sign may differ from the one you know.",
  },
  {
    q: "Where do the positions come from?",
    a: "From published astronomical algorithms (Jean Meeus, Astronomical Algorithms), regression-tested against Swiss Ephemeris. No language model ever produces a position or a date — models only help interpret facts the engines have already calculated.",
  },
  {
    q: "Will you sell me gemstones or remedies?",
    a: "No. DRISHTI never prescribes gemstones casually and never uses fear to sell remedies. Suggestions are practical and devotional — discipline, service, prayer — and are always labelled as devotional, not scientific.",
  },
  {
    q: "Is my birth data stored?",
    a: "The free snapshot is calculated in your browser. Nothing leaves your device unless you choose to save it to My Prem Marg — which, until accounts launch, also lives only on this device.",
  },
  {
    q: "Can DRISHTI replace professional advice?",
    a: "No. DRISHTI is traditional guidance. It is not medical, mental-health, legal or financial advice, and it never replaces a qualified professional.",
  },
];

export default function DrishtiPage() {
  const dxv = PRODUCTS["drishti-x-vastu"];
  return (
    <>
      {/* ───────────── Hero: the sky, live ───────────── */}
      <section className={`page-hero ${s.hero}`} aria-labelledby="drishti-title">
        <div className={s.stars} aria-hidden />
        <span className={`${s.watermark} sanskrit`} aria-hidden>
          दृष्टि
        </span>
        <div className={`container ${s.heroGrid}`}>
          <div className={s.heroText}>
            <p className="eyebrow">DRISHTI · Personal intelligence</p>
            <h1 id="drishti-title" className={s.heroTitle}>
              Your sky, <em>read with care.</em>
            </h1>
            <p className="lead">
              Your Vedic chart, timing, career, wealth, relationships, dharma and remedies — read with care. Begin with a free snapshot calculated from real astronomy, then go as deep as you wish.
            </p>
            <div className={s.heroCtas}>
              <a href="#snapshot" className="btn btn--lg">
                Calculate my free snapshot
              </a>
              <a href="#tiers" className="btn btn--ghost btn--lg">
                See the readings
              </a>
            </div>
            <ul className={s.heroFacts}>
              <li data-sakhi="Vedic astrology measures the zodiac against the fixed stars. We use the Lahiri ayanamsa — the standard in India.">Sidereal · Lahiri</li>
              <li data-sakhi="The snapshot is yours to keep — no account, no card, no email needed.">Free · no sign-up</li>
              <li data-sakhi="No doom, no dosha fear, no remedy selling. That's a promise, not a slogan.">Guidance without fear</li>
            </ul>
          </div>
          <div className={s.heroSky}>
            <LiveSky />
          </div>
        </div>
      </section>

      {/* ───────────── Free snapshot ───────────── */}
      <section id="snapshot" className={`section ${s.snapshot}`} aria-labelledby="snapshot-title">
        <div className="container">
          <SnapshotStudio
            intro={
              <>
                <p className="eyebrow">Free snapshot</p>
                <h2 id="snapshot-title" className={s.h2}>
                  Begin with <em className="accent">your own sky.</em>
                </h2>
                <p className="lead">A genuinely useful first look — before anything is asked of you. Calculated, never guessed.</p>
                <ul className={s.includes}>
                  <li data-sakhi="Lagna, the rising sign, shapes how you meet the world. It needs your exact birth time.">
                    <span>Lagna</span> your rising sign, with an exact birth time
                  </li>
                  <li data-sakhi="The Moon's rashi describes the mind — in Vedic tradition it matters as much as the Sun.">
                    <span>Moon &amp; Sun</span> rashi and degree, sidereal
                  </li>
                  <li data-sakhi="Your Janma Nakshatra is the lunar mansion the Moon occupied at birth — 27 in all, each with a deity and a lord.">
                    <span>Nakshatra</span> pada, deity and lord
                  </li>
                  <li data-sakhi="Vimshottari dasha divides life into nine planetary chapters. You'll see exactly where you are now.">
                    <span>Life timeline</span> your Mahadasha and Antardasha, with dates
                  </li>
                  <li data-sakhi="Mulank and Bhagya Ank come from the same date — strengths and watch-outs, never verdicts.">
                    <span>Numbers</span> Mulank and Bhagya Ank
                  </li>
                </ul>
                <SakhiNote ask="I'd like my free DRISHTI snapshot" askLabel="Or do it with me in chat">
                  Don&rsquo;t know your exact birth time? That&rsquo;s alright — I&rsquo;ll calculate everything that doesn&rsquo;t depend on it, and tell you plainly what I&rsquo;ve left out.
                </SakhiNote>
              </>
            }
          />
        </div>
      </section>

      {/* ───────────── Architecture & the no-fear commitment ───────────── */}
      <section className={`section section--night ${s.arch}`} aria-labelledby="arch-title">
        <div className={s.archGlow} aria-hidden />
        <div className="container">
          <div className="section-head section-head--center" data-reveal>
            <p className="eyebrow eyebrow--center">How DRISHTI works</p>
            <h2 id="arch-title" className={s.h2}>
              Facts are calculated. <em>Interpretation is careful.</em>
            </h2>
            <p className="lead">The same discipline runs through every reading, from your free snapshot to Signature.</p>
          </div>

          <ol className={s.pipeline}>
            {PIPELINE.map((p, i) => (
              <li key={p.name} className={s.step} data-sakhi={p.sakhi} data-reveal style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}>
                <span className={s.stepNode} aria-hidden>
                  <span>{p.n}</span>
                </span>
                <p className={s.stepWho}>{p.who}</p>
                <h3 className={s.stepName}>{p.name}</h3>
                <p className={s.stepText}>{p.text}</p>
              </li>
            ))}
          </ol>

          <figure className={s.rule} data-reveal>
            <p className={s.ruleKicker}>Architecture rule</p>
            <blockquote>
              <p>
                Facts are generated deterministically. Agents interpret. Templates render. No language or image model may fabricate chart positions, dasha dates, house geometry or payment state.
              </p>
            </blockquote>
            <figcaption>
              Every reading records its calculation version — today, <code>{CALC_VERSION}</code> — so any result can be reproduced.
            </figcaption>
          </figure>

          <div className={s.commitHead} data-reveal>
            <span className="divider" aria-hidden>
              <span />
            </span>
            <h3>Our no-fear commitment</h3>
          </div>
          <ul className={s.commitments}>
            {COMMITMENTS.map((c, i) => (
              <li key={c.title} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}>
                <h4>{c.title}</h4>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ───────────── The 13-slide standard ───────────── */}
      <section className={`section section--marble ${s.slides}`} aria-labelledby="slides-title">
        <div className="container">
          <div className="section-head section-head--center" data-reveal>
            <p className="eyebrow eyebrow--center">The DRISHTI standard</p>
            <h2 id="slides-title" className={s.h2}>
              Thirteen slides. <em className="accent">One whole picture.</em>
            </h2>
            <p className="lead">
              Every DRISHTI reading follows the same 13-slide standard — premium individual infographics built from your verified calculations. Choose a slide to see what it covers.
            </p>
          </div>
          <SlideDeck />
        </div>
      </section>

      {/* ───────────── Tiers ───────────── */}
      <section id="tiers" className={`section ${s.tiers}`} aria-labelledby="tiers-title">
        <div className="container">
          <div className="section-head section-head--center" data-reveal>
            <p className="eyebrow eyebrow--center">The readings</p>
            <h2 id="tiers-title" className={s.h2}>
              Go as deep <em className="accent">as you wish.</em>
            </h2>
            <p className="lead">Three readings, one standard of care. Each is built on the same deterministic calculations as your free snapshot — and Sakhi stays with you to explain it.</p>
          </div>
          <Tiers />
        </div>
      </section>

      {/* ───────────── DRISHTI × VASTU ───────────── */}
      <section className={`section section--forest ${s.dxv}`} aria-labelledby="dxv-title">
        <div className={`container ${s.dxvGrid}`}>
          <div className={s.dxvArt} aria-hidden>
            <span className={s.dxvWheel} />
            <span className={s.dxvGrid9}>
              {Array.from({ length: 9 }, (_, i) => (
                <i key={i} />
              ))}
            </span>
            <span className={s.dxvTimes}>×</span>
          </div>
          <div data-reveal>
            <p className="eyebrow">
              Premium connection <span className="badge badge--beta">Beta</span>
            </p>
            <h2 id="dxv-title" className={s.h2}>
              DRISHTI <span className={s.times}>×</span> VASTU
            </h2>
            <p className="lead">
              DRISHTI × VASTU compares the resident profile with the traditional Vastu analysis of the actual home while keeping both evidence streams separate and transparent.
            </p>
            <div className={s.streams}>
              <div data-sakhi="Your DRISHTI profile — the resident's chart, calculated deterministically.">
                <span>Stream one</span>
                The resident · DRISHTI
              </div>
              <div data-sakhi="Your home's Vastu analysis — geometry from your confirmed floor plan. VASTU is in Beta.">
                <span>Stream two</span>
                The home · VASTU
              </div>
            </div>
            <p className={s.dxvPrice}>{formatPrice(dxv)} · structural suggestions always require an architect or engineer.</p>
            <Link href="/vastu" className="link-arrow">
              Explore VASTU (Beta)
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── FAQ + closing ───────────── */}
      <section className={`section ${s.faq}`} aria-labelledby="faq-title">
        <div className="container container--narrow">
          <div className="section-head" data-reveal>
            <p className="eyebrow">Plainly answered</p>
            <h2 id="faq-title" className={s.h2}>
              Questions, <em className="accent">honestly.</em>
            </h2>
          </div>
          <div className={s.faqList}>
            {FAQ.map((f) => (
              <details key={f.q} className={s.faqItem}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>

          <div className={s.closing} data-reveal>
            <SakhiNote ask="What is DRISHTI Core?" askLabel="Ask me about the readings">
              I&rsquo;ll never ask you to fear your chart. Whatever it shows, it&rsquo;s a map for living well — and the choices are always yours.
            </SakhiNote>
            <a href="#snapshot" className="btn btn--lg">
              Calculate my free snapshot
            </a>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        }}
      />
    </>
  );
}
