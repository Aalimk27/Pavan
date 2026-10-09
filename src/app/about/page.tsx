import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SakhiNote from "@/components/ui/SakhiNote";
import SakhiMark from "@/components/sakhi/SakhiMark";
import JourneyPath from "@/components/about/JourneyPath";
import { PILLARS, SITE } from "@/lib/site";
import s from "@/components/about/about.module.css";

const TITLE = "Philosophy — guidance without fear";
const DESCRIPTION =
  "Prem Marg is not an astrology website. It is a global dharmic guidance platform: DRISHTI, VASTU and ANK help you understand yourself, your space and your numbers; KATHA, GITA and GURUKUL help you live better — guided by Sakhi, without fear.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Prem Marg philosophy", "dharmic guidance", "guidance without fear", "traditional practice disclosure", "Prem Marg Seva", "RadheyShyam Realtor"],
  alternates: { canonical: "/about" },
  openGraph: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION, url: "/about", type: "website" },
  twitter: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION },
};

const DEVA = ["१", "२", "३", "४", "५", "६", "७", "८"];

/** Blueprint §2 — definitions, verbatim. */
const ARCH_DEF: Record<string, string> = {
  drishti: "Personal intelligence: Vedic chart, timing, career, wealth, relationships, dharma and remedies.",
  vastu: "Spatial intelligence: floor-plan analysis, directions, zones, room placement and practical corrections.",
  ank: "Number intelligence: Mulank, Bhagya Ank, home number and cross-comparison.",
  katha: "Daily sacred stories translated into practical lessons for modern life.",
  gita: "One Bhagavad Gita verse each day, explained simply and practically.",
  gurukul: "Structured life education built from Gita, Katha and practical dharmic living.",
};

/** Blueprint §3 — the non-negotiables, kept as vows. */
const VOWS: ReadonlyArray<{ title: string; text: string; sakhi: string }> = [
  {
    title: "Guidance without fear",
    text: "Never use doom, panic, dosha fear or manipulative remedy selling.",
    sakhi: "This is the first vow. If anything on Prem Marg ever makes you afraid, we have failed — please tell us.",
  },
  {
    title: "You retain agency",
    text: "Traditional systems offer interpretation, not absolute control over life.",
    sakhi: "A chart describes tendencies and timing. What you do with them is always yours to choose.",
  },
  {
    title: "Turn the mind toward the good",
    text: "Encourage positive mental direction, self-control, gratitude, service and responsibility.",
    sakhi: "Every reading should leave you a little more steady, grateful and responsible — not more anxious.",
  },
  {
    title: "A devotional way of life",
    text: "Prem Marg may recommend Radha Naam Jap, sattvic food, abstaining from meat and alcohol, clean speech, prayer and discipline as its devotional lifestyle philosophy.",
    sakhi: "These are devotional recommendations from our tradition — offered with love, never as a condition.",
  },
  {
    title: "Devotion is not science",
    text: "Clearly distinguish devotional recommendations from scientific claims.",
    sakhi: "When something is devotional, we say so. We never dress faith up as science.",
  },
  {
    title: "Never instead of care",
    text: "Never position Gita or spiritual practice as a substitute for medical or mental-health care.",
    sakhi: "The Gita can steady the heart. It is never a replacement for a doctor or a counsellor.",
  },
  {
    title: "No fear-selling",
    text: "No casual gemstone prescriptions, no name-changing numerology and no fear-based lucky-number sales.",
    sakhi: "You will not be sold a gemstone, a new spelling of your name or a lucky number here.",
  },
  {
    title: "Discipline in the work",
    text: "No laziness. Follow the frozen workflow. Be concise. Be precise. Do not drift.",
    sakhi: "This vow is for us, the team: be concise, be precise, and do not drift.",
  },
];

/** Blueprint §1 bullets. */
const BUILDING = [
  "International in presentation; Indian and dharmic in philosophical roots.",
  "Positive, practical and explicitly non-fear-based.",
  "Automated from payment to report delivery, follow-up and relevant cross-sell.",
  "Designed for repeat engagement, not one-off report sales.",
  "Built to generate qualified property-advisory leads for RadheyShyam Realtor.",
  "Long-term ambition: evolve into a global digital Gurukul and impact platform.",
];

const SEVA: ReadonlyArray<{ name: string; sanskrit: string; text: string }> = [
  { name: "Goshalas", sanskrit: "गौशाला", text: "Care for cows in shelters that look after them for life." },
  { name: "Feeding programmes", sanskrit: "अन्नदान", text: "Food for those who need it — the oldest seva of all." },
  { name: "Education", sanskrit: "विद्या", text: "Support for learning, especially where it is hardest to reach." },
  { name: "Animal welfare", sanskrit: "जीवदया", text: "Compassion for every living being, not only the ones near us." },
  { name: "Dharmic learning", sanskrit: "धर्म शिक्षा", text: "Keeping the teachings alive — texts, teachers and students." },
];

const pillar = (k: string) => PILLARS.find((p) => p.key === k)!;

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Philosophy · प्रेम मार्ग"
        title={
          <>
            Prem Marg is <em>not</em> an astrology website.
          </>
        }
        lead="It is a digital dharmic guidance platform. Astrology, Vastu and numerology are entry tools; Katha, Gita and Gurukul create an ongoing relationship; Sakhi makes the experience available 24/7; RadheyShyam Realtor becomes the trusted human bridge when you need property or private advisory."
        watermark="प्रेम"
      >
        <nav className={s.heroNav} aria-label="On this page">
          <a href="#north-star">North Star</a>
          <a href="#architecture">The architecture</a>
          <a href="#vows">Our vows</a>
          <a href="#journey">The journey</a>
          <a href="#seva">Seva</a>
          <a href="#founder">Founder’s note</a>
        </nav>
      </PageHero>

      {/* ───────────── North Star & proposition ───────────── */}
      <section id="north-star" className="section" aria-labelledby="ns-title">
        <div className="container">
          <div className={s.nsGrid}>
            <div data-reveal>
              <p className="eyebrow">The North Star</p>
              <h2 id="ns-title" className={s.nsQuote}>
                Help people understand themselves, understand their homes, improve their choices and live with greater{" "}
                <em className="accent">discipline, compassion and clarity</em> — without fear-based selling.
              </h2>
            </div>
            <aside className={s.nameCard} data-reveal data-sakhi="Prem means love; Marg means path. Prem Marg — the path of love.">
              <p className={`${s.nameSk} sanskrit`} lang="sa">
                प्रेम <span>·</span> मार्ग
              </p>
              <p className={s.nameGloss}>
                <span>
                  <strong>Prem</strong> — love
                </span>
                <span>
                  <strong>Marg</strong> — the path
                </span>
              </p>
              <p className={s.nameLine}>The path of love. Our public promise: {SITE.promise}.</p>
            </aside>
          </div>

          <div className={s.prop} data-reveal>
            <p className={`${s.propLabel} inscription`}>Core proposition</p>
            <ol className={s.propSteps}>
              <li data-sakhi="Start with yourself — DRISHTI reads your Vedic chart and the life period you are in.">
                <span className={s.propVerb}>Understand yourself.</span>
                <Link href="/drishti" className={s.propDoor}>
                  DRISHTI <span className="sanskrit">{pillar("drishti").devanagari}</span>
                </Link>
              </li>
              <li data-sakhi="Then your space — VASTU reads your floor plan, zone by zone. It is still in Beta.">
                <span className={s.propVerb}>Understand your space.</span>
                <Link href="/vastu" className={s.propDoor}>
                  VASTU <span className="sanskrit">{pillar("vastu").devanagari}</span> <span className="badge badge--beta">Beta</span>
                </Link>
              </li>
              <li data-sakhi="Then your numbers — Mulank, Bhagya Ank and your home number. Mirrors, never verdicts.">
                <span className={s.propVerb}>Understand your numbers.</span>
                <Link href="/ank" className={s.propDoor}>
                  ANK <span className="sanskrit">{pillar("ank").devanagari}</span>
                </Link>
              </li>
              <li data-sakhi="And then live it — a verse, a story and a practice, every day.">
                <span className={s.propVerb}>Then use timeless wisdom to live better.</span>
                <span className={s.propDoors}>
                  <Link href="/katha" className={s.propDoor}>
                    KATHA
                  </Link>
                  <Link href="/gita" className={s.propDoor}>
                    GITA
                  </Link>
                  <Link href="/gurukul" className={s.propDoor}>
                    GURUKUL
                  </Link>
                </span>
              </li>
            </ol>
          </div>

          <div className={s.building} data-reveal>
            <h3 className={s.buildingTitle}>What we are building</h3>
            <ul className={s.buildingList}>
              {BUILDING.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────── Brand architecture ───────────── */}
      <section id="architecture" className="section section--marble" aria-labelledby="arch-title">
        <div className="container">
          <header className="section-head section-head--center" data-reveal>
            <p className="eyebrow eyebrow--center">Brand architecture</p>
            <h2 id="arch-title">One path, six doors, one companion</h2>
            <p className="lead">Each part has a single job. Together they make a relationship, not a transaction.</p>
          </header>

          <div className={s.arch}>
            <div className={s.archCrown} data-reveal data-sakhi="PREM MARG is the umbrella — the path of love. Its promise: A Better Way to Live.">
              <p className={`${s.archCrownName} inscription`}>PREM MARG</p>
              <p className={s.archCrownDef}>Umbrella brand and global platform. Meaning: the path of love. Public promise: A Better Way to Live.</p>
            </div>

            <div className={s.archGroups}>
              {[
                { label: "Entry tools — understand", keys: ["drishti", "vastu", "ank"] },
                { label: "Ongoing relationship — live better", keys: ["katha", "gita", "gurukul"] },
              ].map((g) => (
                <div key={g.label} className={s.archGroup}>
                  <p className={s.archGroupLabel}>{g.label}</p>
                  <ul className={s.archDoors}>
                    {g.keys.map((k, i) => {
                      const p = pillar(k);
                      return (
                        <li key={k} data-reveal style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}>
                          <Link href={p.href} className={`${s.archDoor} arch`} data-sakhi={`${p.name} — ${p.meaning}. ${ARCH_DEF[k]}`}>
                            <span className={`${s.archSk} sanskrit`} lang="sa">
                              {p.devanagari}
                            </span>
                            <span className={s.archName}>
                              {p.name}
                              {p.beta && <span className="badge badge--beta">Beta</span>}
                            </span>
                            <span className={s.archMeaning}>{p.meaning}</span>
                            <span className={s.archDef}>{ARCH_DEF[k]}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>

            <div className={s.archBase}>
              <Link href="/sakhi" className={`${s.archWide} ${s.archSakhi}`} data-reveal data-sakhi="That’s me — the thread through every door. A companion, never a guru.">
                <SakhiMark size={64} barbs={false} decorative />
                <span>
                  <span className={`${s.archName} inscription`}>SAKHI</span>
                  <span className={s.archDef}>24/7 AI companion, concierge, interpreter and cross-sell guide. Never presented as a guru.</span>
                </span>
              </Link>
              <a
                href={SITE.founderUrl}
                className={s.archWide}
                target="_blank"
                rel="noopener"
                data-reveal
                data-sakhi="RadheyShyam Realtor is the human bridge — for property and the decisions that deserve a person."
              >
                <span className={s.archHouse} aria-hidden>
                  ⌂
                </span>
                <span>
                  <span className={`${s.archName} inscription`}>RADHEYSHYAM REALTOR</span>
                  <span className={s.archDef}>Founder/authority brand and human advisory bridge for property and high-value decisions.</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Vows ───────────── */}
      <section id="vows" className="section section--forest" aria-labelledby="vows-title">
        <div className="container">
          <header className="section-head" data-reveal>
            <p className="eyebrow">Philosophy &amp; non-negotiables</p>
            <h2 id="vows-title">
              Eight vows, <em className={s.goldEm}>kept in public</em>
            </h2>
            <p className="lead">A sankalpa is a vow made with intention. These are ours — written here so you can hold us to them.</p>
          </header>
          <ol className={s.vows}>
            {VOWS.map((v, i) => (
              <li key={v.title} className={s.vow} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 4) * 70}ms` }} data-sakhi={v.sakhi}>
                <span className={`${s.vowNum} sanskrit`} aria-hidden>
                  {DEVA[i]}
                </span>
                <h3 className={s.vowTitle}>{v.title}</h3>
                <p className={s.vowText}>{v.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────── Traditional-practice disclosure ───────────── */}
      <section className="section section--tight" aria-labelledby="disclosure-title">
        <div className="container container--narrow">
          <div className={s.disclosure} data-reveal>
            <p className="eyebrow">Traditional-practice disclosure</p>
            <h2 id="disclosure-title" className={s.disclosureTitle}>
              Interpretation, not prediction. Guidance, not prescription.
            </h2>
            <p>
              Jyotish (Vedic astrology), Vastu and Ank (numerology) are traditional systems of interpretation. On Prem Marg, every position, number and
              direction is <strong>calculated deterministically</strong> by versioned engines, and then interpreted as guidance for reflection. They are
              not scientific claims, and they do not control your life — you do.
            </p>
            <p>
              Nothing here is medical, mental-health, legal, financial or structural professional advice. Devotional recommendations are offered as our
              devotional lifestyle philosophy, and are always labelled as such.
            </p>
            <Link href="/legal/disclaimer" className="link-arrow">
              Read the full traditional-practice disclaimer
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── Journey ───────────── */}
      <section id="journey" className="section section--marble" aria-labelledby="journey-title">
        <div className="container">
          <header className="section-head section-head--center" data-reveal>
            <p className="eyebrow eyebrow--center">The journey</p>
            <h2 id="journey-title">Fourteen steps, from first question to lasting practice</h2>
            <p className="lead">
              Engines calculate. Specialists interpret. Quality checks verify. Sakhi explains. And when a decision deserves a human, a human is there.
            </p>
          </header>
          <JourneyPath />
        </div>
      </section>

      {/* ───────────── Seva ───────────── */}
      <section id="seva" className="section" aria-labelledby="seva-title">
        <div className="container">
          <div className={s.sevaGrid}>
            <header data-reveal>
              <p className="eyebrow">PREM MARG SEVA · सेवा</p>
              <h2 id="seva-title">Giving, with the receipts open</h2>
              <p className="lead">
                Long-term, Prem Marg will fund a transparent giving programme from its own revenue. We will publish what is funded — recipient, amount and
                date — and we will avoid vague impact claims.
              </p>
            </header>
            <div className={s.ledger} data-reveal data-sakhi="Nothing has been funded yet, so the ledger is honestly empty. When it isn’t, you’ll see every line here.">
              <p className={`${s.ledgerHead} inscription`}>Seva ledger</p>
              <div className={s.ledgerRow}>
                <span>Recipient</span>
                <span>Area</span>
                <span>Amount</span>
                <span>Date</span>
              </div>
              <p className={s.ledgerEmpty}>
                No seva has been funded yet — the programme is still being defined. The first entry will appear here, in full, when it is made.
              </p>
            </div>
          </div>
          <ul className={s.seva}>
            {SEVA.map((a, i) => (
              <li key={a.name} className={s.sevaItem} data-reveal style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}>
                <span className={`${s.sevaSk} sanskrit`} lang="sa">
                  {a.sanskrit}
                </span>
                <h3 className={s.sevaName}>{a.name}</h3>
                <p className={s.sevaText}>{a.text}</p>
              </li>
            ))}
          </ul>
          <p className={`${s.sevaFoot} small muted`}>Areas under consideration, from the founding blueprint. None is a commitment until it is published in the ledger.</p>
        </div>
      </section>

      {/* ───────────── Frozen definition ───────────── */}
      <section className={`section section--night ${s.frozen}`} aria-labelledby="frozen-title">
        <div className="container container--narrow">
          <div className={s.plaque} data-reveal data-sakhi="This is our frozen definition. We don’t drift from it.">
            <SakhiMark size={72} barbs={false} decorative />
            <p className="eyebrow eyebrow--center">Frozen definition</p>
            <h2 id="frozen-title" className={`${s.plaqueName} inscription`}>
              PREM MARG
            </h2>
            <p className={s.plaqueDef}>{SITE.definition}</p>
            <div className="divider" aria-hidden>
              <span />
            </div>
            <p className={`${s.plaquePillars} inscription`}>DRISHTI • VASTU • ANK • KATHA • GITA • GURUKUL</p>
            <p className={s.plaqueBy}>
              Guided by <strong>SAKHI</strong> • by {SITE.founderBrand}
            </p>
            <p className={`${s.plaqueDomain} inscription`}>{SITE.domain}</p>
          </div>
        </div>
      </section>

      {/* ───────────── Founder's note ───────────── */}
      <section id="founder" className="section" aria-labelledby="founder-title">
        <div className="container">
          <div className={s.founder}>
            <div className={s.founderBrand} data-reveal>
              <Image src="/brand/radheyshyam-realtor.png" alt="RadheyShyam Realtor" width={1566} height={495} className={s.founderLogo} sizes="(max-width: 900px) 80vw, 420px" />
              <p className="small muted">
                Founder and human advisory bridge for property and high-value decisions.
              </p>
              <div className="row">
                <Link href="/advisory" className="btn btn--forest btn--sm">
                  Request private advisory
                </Link>
                <a href={SITE.founderUrl} className="link-arrow" target="_blank" rel="noopener">
                  radheyshyamrealtor.com
                </a>
              </div>
            </div>
            <article className={s.letter} data-reveal>
              <p className="eyebrow">Founder’s note</p>
              <h2 id="founder-title" className={s.letterTitle}>
                A note from RadheyShyam Realtor
              </h2>
              <p className={s.letterStatus}>
                <span className="badge">In review</span> Reserved for the founder’s own words
              </p>
              <div className={s.letterLines} aria-hidden>
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <p className={s.letterText}>
                This page will carry the founder’s story in his own voice — why Prem Marg exists, and the promise behind it. We have deliberately left it
                unwritten rather than write it for him.
              </p>
              <p className={`${s.letterSign} sanskrit`} lang="sa">
                राधे राधे
              </p>
            </article>
          </div>
          <div className={s.closingNote}>
            <SakhiNote ask="What does guidance without fear mean at Prem Marg?" askLabel="Ask me what it means">
              Guidance without fear is not a slogan for us — it is the first vow. If anything here ever feels like pressure, tell me, and I will tell the
              team.
            </SakhiNote>
          </div>
        </div>
      </section>
    </>
  );
}
