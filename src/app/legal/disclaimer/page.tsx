import type { Metadata } from "next";
import Link from "next/link";
import LegalDoc, { type LegalSection } from "@/components/about/LegalDoc";
import s from "@/components/about/legal.module.css";
import { CALC_VERSION } from "@/lib/astro/engine";
import { VASTU_RULES_VERSION } from "@/lib/vastu/engine";
import { SITE } from "@/lib/site";

const TITLE = "Traditional-practice disclaimer (draft)";
const DESCRIPTION =
  "Jyotish, Vastu and numerology on Prem Marg are traditional systems of interpretation — guidance for reflection, not scientific prediction, and never a substitute for medical, mental-health, legal, financial or structural advice. Draft for legal review.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/legal/disclaimer" },
  openGraph: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION, url: "/legal/disclaimer", type: "article" },
  twitter: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION },
};

const sections: LegalSection[] = [
  {
    id: "traditional",
    title: "Traditional systems, not science",
    sakhi: "Jyotish, Vastu and Ank are traditions of interpretation. We never present them as science.",
    body: (
      <>
        <p>
          DRISHTI (Vedic astrology, or Jyotish), VASTU and ANK (numerology) are traditional systems of interpretation that have been practised for
          centuries. Prem Marg presents them as guidance for reflection and self-understanding. They are not scientific claims, they are not predictions of
          fixed outcomes, and they do not have absolute control over your life.
        </p>
      </>
    ),
  },
  {
    id: "facts",
    title: "Calculation and interpretation are different things",
    sakhi: "Facts are generated deterministically. Interpretation is guidance — and it is labelled as such.",
    body: (
      <>
        <p>
          <strong>Facts are generated deterministically.</strong> Planet positions, nakshatras, life periods, numbers and floor-plan geometry are produced by
          calculation engines with frozen, versioned conventions — never by an AI model. The same inputs always produce the same facts.
        </p>
        <ul>
          <li>
            DRISHTI: sidereal zodiac, Lahiri (Chitrapaksha) ayanamsa, Vimshottari dasha — version <code>{CALC_VERSION}</code>.
          </li>
          <li>
            VASTU (Beta): directions, zones and the Brahmasthan from the plan you confirm — rules version <code>{VASTU_RULES_VERSION}</code>.
          </li>
          <li>ANK: Mulank, Bhagya Ank and home-number reductions by fixed arithmetic.</li>
        </ul>
        <p>
          <strong>Interpretation</strong> — what those facts may mean for you — is guidance from tradition, written carefully, and checked for consistency.
          Other traditions and practitioners may use different conventions and reach different readings.
        </p>
        <p>
          Accuracy of inputs matters: an uncertain birth time can change your Lagna, and a floor plan with the wrong North or boundary changes every Vastu
          zone. Where the result depends on uncertain inputs, we tell you.
        </p>
      </>
    ),
  },
  {
    id: "agency",
    title: "You retain agency",
    body: (
      <p>
        Traditional systems offer interpretation, not control. Your choices, effort, character and circumstances shape your life. Please use our guidance as
        one input among many — alongside your own judgement, the counsel of people you trust, and qualified professionals where needed.
      </p>
    ),
  },
  {
    id: "not-advice",
    title: "Not professional advice",
    sakhi: "For health, law, money or a building’s safety, please speak to a qualified professional. That matters more than any chart.",
    body: (
      <>
        <p>Nothing on Prem Marg — including reports, Sakhi’s replies, Gita and Katha lessons, or Gurukul practices — is:</p>
        <ul>
          <li>
            <strong>medical or mental-health advice</strong>, diagnosis or treatment;
          </li>
          <li>
            <strong>legal advice</strong>, including on property title or contracts;
          </li>
          <li>
            <strong>financial or investment advice</strong>;
          </li>
          <li>
            <strong>structural, architectural or engineering advice</strong> — Vastu suggestions never replace a qualified survey or building professional.
          </li>
        </ul>
        <div className={s.callout}>
          <p>
            <strong>The Gita and spiritual practice are never a substitute for medical or mental-health care.</strong> If you are unwell, please see a
            doctor. If you are in crisis or thinking about harming yourself, please contact your local emergency number or a crisis line where you live,
            right now.
          </p>
        </div>
      </>
    ),
  },
  {
    id: "devotional",
    title: "Devotional recommendations",
    body: (
      <p>
        As part of its devotional lifestyle philosophy, Prem Marg may recommend Radha Naam Jap, sattvic food, abstaining from meat and alcohol, clean speech,
        prayer and discipline. These are devotional recommendations from our tradition, offered with love and clearly labelled — not scientific or medical
        claims, and never a condition of any service. Please consider any dietary change in light of your own health and medical advice.
      </p>
    ),
  },
  {
    id: "never",
    title: "What we will never do",
    body: (
      <ul>
        <li>Use doom, panic, dosha fear or manipulative remedy selling.</li>
        <li>Prescribe gemstones casually.</li>
        <li>Tell you to change your name for numerological reasons.</li>
        <li>Sell “lucky numbers” or play on fear.</li>
        <li>Promise outcomes, guarantee results, or claim accuracy we cannot show.</li>
      </ul>
    ),
  },
  {
    id: "vastu-beta",
    title: "VASTU is in Beta",
    body: (
      <p>
        VASTU remains Beta until North, boundary and room confirmation and geometry quality checks are reliable. Treat its findings as a careful first reading,
        confirm every input, and never make structural changes on the strength of a Vastu suggestion alone.
      </p>
    ),
  },
  {
    id: "sakhi",
    title: "Sakhi is an AI",
    body: (
      <p>
        Sakhi is an AI companion, not a human spiritual authority, guru, astrologer or counsellor. She explains calculated facts and Prem Marg’s guidance, but
        her words can be imperfect. For a human voice on property or high-value decisions, you can request <Link href="/advisory">private advisory</Link>{" "}
        with {SITE.founderBrand}.
      </p>
    ),
  },
  {
    id: "responsibility",
    title: "Your responsibility",
    body: (
      <p>
        By using Prem Marg you accept that decisions you make remain your own. To the extent the law allows, Prem Marg is not responsible for outcomes of
        decisions taken in reliance on traditional guidance. See our <Link href="/legal/terms">terms</Link> for details.
      </p>
    ),
  },
];

export default function DisclaimerPage() {
  return (
    <LegalDoc
      current="/legal/disclaimer"
      eyebrow="Trust · Traditional-practice disclaimer"
      title={
        <>
          Guidance <em>without fear</em> — and without false promises.
        </>
      }
      lead="What Jyotish, Vastu and numerology are on Prem Marg, what they are not, and how we keep calculation and interpretation honest."
      watermark="विवेक"
      summary={
        <>
          <h2>In one breath</h2>
          <p>
            Prem Marg turns traditional systems into guidance for reflection. Facts are calculated deterministically; interpretation is guidance, not
            prediction. You retain agency. Nothing here replaces medical, mental-health, legal, financial or structural professional advice — and devotional
            recommendations are devotional, not scientific.
          </p>
        </>
      }
      sections={sections}
      sakhiAsk="What does the traditional-practice disclaimer mean for me?"
      sakhiText="This page is our honesty, written down. If any part of it worries you, ask me — I’ll explain it gently."
    />
  );
}
