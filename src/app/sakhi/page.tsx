import type { Metadata } from "next";
import Link from "next/link";
import SakhiStage from "@/components/about/SakhiStage";
import SakhiAnatomy from "@/components/about/SakhiAnatomy";
import TalkToSakhi from "@/components/about/TalkToSakhi";
import BrandKit from "@/components/about/BrandKit";
import SakhiMark from "@/components/sakhi/SakhiMark";
import s from "@/components/about/sakhi.module.css";

const TITLE = "Meet Sakhi — your 24/7 AI companion";
const DESCRIPTION =
  "Sakhi is Prem Marg’s living AI companion: she welcomes you, routes you to the right tool, explains reports and products without pressure — and never pretends to be a guru. Meet her, learn the meaning of her mark, and download the brand kit.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Sakhi", "AI companion", "Prem Marg", "dharmic guidance", "peacock feather", "mor pankh", "brand kit"],
  alternates: { canonical: "/sakhi" },
  openGraph: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION, url: "/sakhi", type: "website" },
  twitter: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION },
};

const DEVA = ["१", "२", "३", "४", "५", "६", "७", "८", "९"];

/** Blueprint §10 — what Sakhi does. */
const DOES: ReadonlyArray<{ title: string; text: string; sakhi: string }> = [
  {
    title: "Welcomes you",
    text: "Greets you and asks one simple question: what would you like clarity about today?",
    sakhi: "Every conversation starts the same way — I ask what you need clarity about. Then I listen.",
  },
  {
    title: "Routes you",
    text: "Finds the right door — DRISHTI, VASTU, ANK, a free calculator or today’s wisdom — or a combination.",
    sakhi: "Career, home, numbers or a restless mind — I’ll take you to the right door, often a free one first.",
  },
  {
    title: "Collects what’s missing",
    text: "Asks for birth details, questions or floor-plan confirmations, and checks the format before anything is calculated.",
    sakhi: "If a birth time or a North arrow is missing, I’ll ask — gently — before anything is calculated.",
  },
  {
    title: "Explains without pressure",
    text: "Describes products and pricing plainly. Where a price is not yet set, she says so.",
    sakhi: "I explain what each report contains and what it costs. No countdowns, no pressure.",
  },
  {
    title: "Confirms your order",
    text: "Tells you where your payment and order stand, and what happens next.",
    sakhi: "Once checkout opens, I’ll be able to tell you exactly where your order is.",
  },
  {
    title: "Delivers & explains reports",
    text: "Brings your report to you and walks you through it, section by section, in plain language.",
    sakhi: "When your report is ready, I can walk you through it — slowly, one section at a time.",
  },
  {
    title: "Uses verified data only",
    text: "For factual astrology or Vastu questions she relies only on your verified details and your report’s calculated facts.",
    sakhi: "For anything factual about your chart or home, I only use your verified details and the calculated facts. Never guesses.",
  },
  {
    title: "Suggests one next step",
    text: "Offers a single relevant next step based on what you were exploring — never a stack of upsells.",
    sakhi: "One relevant next step — that’s my rule. Never a pile of offers.",
  },
  {
    title: "Connects you to a human",
    text: "For high-value property decisions or personal advisory, she escalates to RadheyShyam Realtor.",
    sakhi: "Some decisions deserve a human. For property and private advisory, I’ll connect you with RadheyShyam Realtor.",
  },
];

const NEVER: ReadonlyArray<{ title: string; text: string; sakhi: string }> = [
  {
    title: "Never a guru",
    text: "She never impersonates a human spiritual authority. She is an AI companion — a sakhi, a friend on the path — and says so.",
    sakhi: "I am not a guru, and I will never pretend to be one. I’m an AI companion — a friend on the path.",
  },
  {
    title: "Never fear",
    text: "No doom, no panic, no dosha fear, no manipulative remedies. Guidance without fear — always.",
    sakhi: "You will never hear doom from me. Guidance without fear — that is Prem Marg’s first vow.",
  },
  {
    title: "Never invents facts",
    text: "Facts are generated deterministically. Planet positions, numbers and Vastu geometry come from calculation engines; Sakhi only interprets what has been calculated.",
    sakhi: "I don’t make up facts. Chart positions, numbers and floor-plan geometry are calculated by engines — I only explain them.",
  },
  {
    title: "Never another person’s data",
    text: "She cannot see or share another customer’s private details, reports or floor plans.",
    sakhi: "Your details are yours. I can’t see anyone else’s — and no one else can see yours through me.",
  },
  {
    title: "Never a substitute for care",
    text: "Not a doctor, therapist, lawyer, financial adviser or structural engineer. When you need one of them, she says so plainly.",
    sakhi: "If something touches your health, safety, money or the law, please speak to a qualified professional. I’ll say so too.",
  },
  {
    title: "Never pressure",
    text: "No countdown timers, no lucky-number sales, no gemstone prescriptions. You always retain agency.",
    sakhi: "You are always free to choose. I’ll never push a gemstone, a name change or a lucky number on you.",
  },
];

export default function SakhiPage() {
  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className={s.hero} aria-labelledby="sakhi-title">
        <span className={`${s.heroWatermark} sanskrit`} aria-hidden>
          सखी
        </span>
        <div className={`container ${s.heroGrid}`}>
          <div className={s.heroText}>
            <p className="eyebrow">Meet Sakhi · सखी</p>
            <h1 id="sakhi-title" className={s.heroTitle}>
              A friend on the path, <em>awake</em> at every hour.
            </h1>
            <p className="lead">
              <span className={`sanskrit ${s.inlineSk}`} lang="sa">
                सखी
              </span>{" "}
              means a close companion — the friend who walks beside you. Sakhi is Prem Marg’s 24/7 AI companion: she welcomes you, asks what you need
              clarity about, and guides you to the right tool, verse or story. Kind, precise, and always honest that she is an AI.
            </p>
            <TalkToSakhi />
          </div>
          <SakhiStage />
        </div>
      </section>

      {/* ───────────── Anatomy ───────────── */}
      <section className="section" aria-labelledby="anatomy-title">
        <div className="container">
          <header className="section-head section-head--center" data-reveal>
            <p className="eyebrow eyebrow--center">Anatomy of a living mark</p>
            <h2 id="anatomy-title">Every line carries a meaning</h2>
            <p className="lead">
              A diya’s flame, a peacock feather’s eye, a heart, a point of gold and a lotus. Hover, tap or tab through the six parts — and notice that
              she is watching you back.
            </p>
          </header>
          <div data-reveal>
            <SakhiAnatomy />
          </div>
        </div>
      </section>

      {/* ───────────── What she does ───────────── */}
      <section className="section section--marble" aria-labelledby="does-title">
        <div className="container">
          <header className="section-head" data-reveal>
            <p className="eyebrow">What Sakhi does</p>
            <h2 id="does-title">
              Concierge, interpreter, <em className="accent">companion</em>
            </h2>
            <p className="lead">She makes Prem Marg available at any hour — so a question at 2 a.m. still meets a calm, useful answer.</p>
          </header>
          <ol className={s.does}>
            {DOES.map((d, i) => (
              <li key={d.title} className={s.doesItem} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }} data-sakhi={d.sakhi}>
                <span className={`${s.doesNum} sanskrit`} aria-hidden>
                  {DEVA[i]}
                </span>
                <h3 className={s.doesTitle}>{d.title}</h3>
                <p className={s.doesText}>{d.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ───────────── What she never does ───────────── */}
      <section className="section section--forest" aria-labelledby="never-title">
        <div className="container">
          <div className={s.neverHead} data-reveal>
            <div>
              <p className="eyebrow">What Sakhi never does</p>
              <h2 id="never-title">Six lines she will not cross</h2>
            </div>
            <p className={s.neverStamp}>
              <span className="inscription">Facts are generated deterministically.</span>
              <span>Sakhi interprets. She never calculates, and never invents.</span>
            </p>
          </div>
          <ul className={s.never}>
            {NEVER.map((n, i) => (
              <li key={n.title} className={s.neverItem} data-reveal style={{ ["--reveal-delay" as string]: `${(i % 3) * 80}ms` }} data-sakhi={n.sakhi}>
                <span className={s.neverGlyph} aria-hidden>
                  ✕
                </span>
                <h3 className={s.neverTitle}>{n.title}</h3>
                <p className={s.neverText}>{n.text}</p>
              </li>
            ))}
          </ul>
          <p className={`${s.aiNote} small`} data-reveal>
            Sakhi is an AI. Her words can be imperfect — when something matters, check it against your report, or{" "}
            <Link href="/advisory">ask for a human</Link>. Read how we handle your data in our <Link href="/legal/privacy">privacy policy</Link>.
          </p>
        </div>
      </section>

      {/* ───────────── Talk to her ───────────── */}
      <section className="section" aria-labelledby="talk-title">
        <div className={`container ${s.callGrid}`}>
          <div className={s.callMark} aria-hidden>
            <SakhiMark size="100%" barbs decorative />
          </div>
          <div data-reveal>
            <p className="eyebrow">Call her anytime</p>
            <h2 id="talk-title">She is one keystroke away</h2>
            <p className="lead">
              On every page, her light waits in the corner. Ask about your Mulank, today’s verse, a room in your home or what a report contains. Linger on
              anything meaningful on this site and she will glance at it — and whisper what it means.
            </p>
            <TalkToSakhi tone="light" />
            <div className={s.voiceNote}>
              <h3 className={s.voiceTitle}>About her voice</h3>
              <p>
                If you switch her voice on, Sakhi speaks using your own browser’s speech engine; Sanskrit verses use a Hindi or Sanskrit voice where your
                device has one. If you speak to her, your browser turns your words into text — some browsers use their provider’s online service for
                this — and only that text reaches Sakhi. Prem Marg does not record audio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────── Brand kit ───────────── */}
      <section id="brand-kit" className="section section--marble" aria-labelledby="kit-title">
        <div className="container">
          <header className="section-head" data-reveal>
            <p className="eyebrow">Brand kit</p>
            <h2 id="kit-title">The mark, ready to use</h2>
            <p className="lead">
              Every file below is drawn from the same geometry as the living Sakhi on this page. Download what you need — and please use it with the same
              care she was made with.
            </p>
          </header>
          <BrandKit />
          <p className={`${s.kitFoot} small muted`}>
            The Sakhi mark and the PREM MARG name are brand assets of Prem Marg by RadheyShyam Realtor. For press or partnership use, please{" "}
            <Link href="/advisory">get in touch</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
