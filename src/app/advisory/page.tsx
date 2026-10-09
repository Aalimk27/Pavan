import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SakhiNote from "@/components/ui/SakhiNote";
import AdvisoryForm from "@/components/account/AdvisoryForm";
import { SITE } from "@/lib/site";
import s from "./advisory.module.css";

const TITLE = "Private Advisory with RadheyShyam Realtor";
const DESCRIPTION =
  "Private, human advisory from RadheyShyam Realtor for property selection, high-value home decisions and personal consultation — Vastu-aware, without fear. Request a private conversation.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["property advisory", "Vastu property selection", "RadheyShyam Realtor", "buy a home Vastu", "private consultation", "real estate advisory India"],
  alternates: { canonical: "/advisory" },
  openGraph: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION, url: "/advisory", type: "website" },
  twitter: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION },
};

const FOR = [
  {
    glyph: "गृह",
    title: "Property selection",
    text: "Buying, renting or choosing between homes — with the layout, the location and your family's needs weighed together.",
    sakhi: "When a home is on the table, a human eye on the plan and the place is worth having.",
  },
  {
    glyph: "निर्णय",
    title: "High-value decisions",
    text: "When the decision is large and lasting — a family home, an investment, a move abroad — and you want a calm second view.",
    sakhi: "Large decisions deserve calm. A second view helps you choose with a steady mind, not a hurried one.",
  },
  {
    glyph: "संवाद",
    title: "Human consultation",
    text: "When you would rather speak with a person than read a page — about your report, your home or your next step.",
    sakhi: "Sometimes you simply want to talk it through with a person. That's what this is for.",
  },
];

const STEPS = [
  { n: "१", title: "Share your situation", text: "Tell us what you are deciding, in your own words. A few sentences are enough." },
  { n: "२", title: "A person reads it", text: "Your request goes privately to the RadheyShyam Realtor team — not to an automated queue." },
  { n: "३", title: "A private conversation", text: "They reply by email to arrange a conversation at a time that suits you." },
];

export default function AdvisoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Private Advisory"
        watermark="परामर्श"
        title={
          <>
            When the decision is <em>large</em>, talk to a person.
          </>
        }
        lead={`Private advisory with ${SITE.founderBrand} — for choosing a property, weighing a high-value decision, or simply speaking with someone who understands both homes and dharma.`}
      >
        <div className="row">
          <a className="btn btn--lg" href="#request">
            Request a private conversation
          </a>
          <a className="btn btn--ghost btn--lg" href={SITE.founderUrl} target="_blank" rel="noopener">
            Visit RadheyShyam Realtor ↗
          </a>
        </div>
      </PageHero>

      {/* ─────────── Who it is for ─────────── */}
      <section className="section section--tight" aria-labelledby="for-title">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Who it is for</p>
            <h2 id="for-title">Three moments when a human helps</h2>
          </header>
          <div className={s.forGrid}>
            {FOR.map((f, i) => (
              <article key={f.title} className={`card arch ${s.forCard}`} data-sakhi={f.sakhi} data-reveal style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}>
                <span className={`sanskrit ${s.forGlyph}`} lang="hi" aria-hidden>
                  {f.glyph}
                </span>
                <h3>{f.title}</h3>
                <p className="muted">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────── How it works ─────────── */}
      <section className={`section section--forest ${s.how}`} aria-labelledby="how-title">
        <div className="container">
          <header className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">How it works</p>
            <h2 id="how-title">Three quiet steps</h2>
          </header>
          <ol className={s.steps}>
            {STEPS.map((st) => (
              <li key={st.n} className={s.step} data-reveal>
                <span className={s.stepNum} aria-hidden>
                  {st.n}
                </span>
                <h3>{st.title}</h3>
                <p>{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────── Request ─────────── */}
      <section className="section" id="request" aria-labelledby="request-title">
        <div className={`container ${s.requestGrid}`}>
          <div className={s.formCol}>
            <p className="eyebrow">Request</p>
            <h2 id="request-title">Tell us what you are deciding</h2>
            <p className="lead">Everything you share is read only by the advisory team and used only to reply to you.</p>
            <div className={`card card--gilded ${s.formCard}`}>
              <AdvisoryForm />
            </div>
          </div>

          <aside className={s.aside} aria-label="About RadheyShyam Realtor">
            <div className={s.logoCard} data-sakhi="RadheyShyam Realtor is the founding brand behind Prem Marg — homes, chosen with care.">
              <Image src="/brand/radheyshyam-realtor.png" alt="RadheyShyam Realtor" width={1566} height={495} sizes="(max-width: 900px) 80vw, 360px" className={s.logo} />
            </div>
            <p className={s.asideText}>
              Prem Marg is founded by <strong>{SITE.founderBrand}</strong>. Private Advisory connects what you learn here — about yourself and your space — with real, human help on real homes.
            </p>
            <a className="link-arrow" href={SITE.founderUrl} target="_blank" rel="noopener">
              radheyshyamrealtor.com
            </a>

            <div className={s.privacy}>
              <h3 className={s.privacyTitle}>Your privacy</h3>
              <ul>
                <li>Your request goes only to the advisory team. It is never published or shared for marketing.</li>
                <li>Contacting you about this request is separate from marketing — you are not added to any list.</li>
                <li>Traditional guidance is not legal, financial or structural advice; for those, the team will point you to the right professional.</li>
              </ul>
              <p className="small muted">
                Already have a report or a saved home? Mention it — your saved data stays in <Link href="/my">My Prem Marg</Link> on your device until you choose to share it.
              </p>
            </div>

            <SakhiNote ask="Should I request Private Advisory for my property decision?" askLabel="Ask Sakhi first">
              Not sure you need a person yet? Tell me what you&rsquo;re weighing. If a free Vastu preview or your DRISHTI snapshot can help first, I&rsquo;ll show you — and if a human is better, I&rsquo;ll say so.
            </SakhiNote>
          </aside>
        </div>
      </section>
    </>
  );
}
