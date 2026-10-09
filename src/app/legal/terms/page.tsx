import type { Metadata } from "next";
import Link from "next/link";
import LegalDoc, { type LegalSection } from "@/components/about/LegalDoc";
import s from "@/components/about/legal.module.css";
import { SITE } from "@/lib/site";

const TITLE = "Terms of service (draft)";
const DESCRIPTION =
  "The terms for using Prem Marg — free tools, daily wisdom, Sakhi, paid DRISHTI, VASTU (Beta) and ANK reports, memberships and private advisory. Plain language, no fear. Draft for legal review.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/legal/terms" },
  openGraph: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION, url: "/legal/terms", type: "article" },
  twitter: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION },
};

const sections: LegalSection[] = [
  {
    id: "agreement",
    title: "These terms",
    body: (
      <>
        <p>
          These terms apply when you use {SITE.domain} and its services (“Prem Marg”), operated by <strong>[legal entity name and address — to be
          confirmed]</strong> under the {SITE.founderBrand} brand. By using Prem Marg you agree to them. Please also read our{" "}
          <Link href="/legal/privacy">privacy policy</Link> and the <Link href="/legal/disclaimer">traditional-practice disclaimer</Link>, which form part
          of these terms.
        </p>
      </>
    ),
  },
  {
    id: "service",
    title: "What Prem Marg offers",
    body: (
      <>
        <ul>
          <li>
            <strong>Free tools</strong> — the DRISHTI snapshot, ANK calculators (Mulank, Bhagya Ank, home number) and the VASTU studio preview (Beta).
          </li>
          <li>
            <strong>Daily wisdom</strong> — KATHA, GITA and GURUKUL learning paths.
          </li>
          <li>
            <strong>Sakhi</strong> — an AI companion that guides, explains and routes you.
          </li>
          <li>
            <strong>Paid reports and memberships</strong> — when checkout opens, at the prices shown at the time of purchase.
          </li>
          <li>
            <strong>Private advisory</strong> — an introduction to {SITE.founderBrand} for property selection or human consultation.
          </li>
        </ul>
        <p>We may improve, change or retire features. VASTU remains Beta until North, boundary and room confirmation and geometry QA are reliable.</p>
      </>
    ),
  },
  {
    id: "nature",
    title: "The nature of our guidance",
    sakhi: "Our guidance is interpretation, not prediction. You always keep your own judgement.",
    body: (
      <div className={s.callout}>
        <p>
          Jyotish, Vastu and numerology are traditional systems of interpretation. Prem Marg offers guidance for reflection — not scientific prediction, and
          not medical, mental-health, legal, financial or structural professional advice. You remain responsible for your decisions. See the{" "}
          <Link href="/legal/disclaimer">traditional-practice disclaimer</Link>.
        </p>
      </div>
    ),
  },
  {
    id: "eligibility",
    title: "Who may use Prem Marg",
    body: (
      <p>
        You must be 18 or older (or the age of majority where you live) to buy anything or to request advisory. If you enter details about another person
        — a family member, for example — you confirm that you are allowed to, and that you will share any report about them with care.
      </p>
    ),
  },
  {
    id: "inputs",
    title: "Your details and their accuracy",
    body: (
      <>
        <p>
          Reports depend on what you give us. An inaccurate birth time, place or date, or a floor plan with the wrong North or boundary, will change the
          result. Before a paid report is calculated, we ask you to confirm these inputs; once confirmed and paid, inputs are frozen for that order.
        </p>
        <p>
          Today, saved profiles and homes live in your browser (see the <Link href="/legal/privacy#local-first">privacy policy</Link>). You are responsible
          for keeping your device secure.
        </p>
      </>
    ),
  },
  {
    id: "orders",
    title: "Orders, prices and payment",
    body: (
      <>
        <p>
          Prices are shown before you pay; where a price has not been set, we say “Launch pricing soon” and you cannot be charged. Payments are processed by{" "}
          <strong>Stripe</strong>; your card details go directly to Stripe. Applicable taxes are shown at checkout <strong>[tax handling — to be
          confirmed]</strong>.
        </p>
        <p>
          A successful payment creates your order automatically. If we need more information, your order moves to “Needs information” and Sakhi or an email
          will ask you for it. Retries never create duplicate charges or duplicate reports.
        </p>
      </>
    ),
  },
  {
    id: "delivery",
    title: "Delivery of reports",
    body: (
      <>
        <p>
          Reports are calculated by deterministic engines, interpreted, quality-checked and then delivered by email and to your account through a private,
          signed link. Report URLs are never public. We aim to deliver within the time stated on the product page; if a technical problem persists, we will
          pause delivery promises and tell you, rather than send something that is not right.
        </p>
      </>
    ),
  },
  {
    id: "refunds",
    title: "Refunds and cancellations",
    body: (
      <>
        <p>
          <strong>[Refund policy — to be finalised in legal review.]</strong> Our intention: if we cannot deliver your report, you receive a full refund; if
          a report contains a factual error in its calculated data, we correct it or refund you. Your statutory consumer rights are not affected.
        </p>
        <p>Refunds, cancellations and failed payments are handled through Stripe and reflected in your order automatically.</p>
      </>
    ),
  },
  {
    id: "membership",
    title: "Memberships",
    body: (
      <p>
        COPPER, GOLD and PLATINUM memberships renew automatically each billing period until you cancel. You can cancel at any time; your membership then
        runs until the end of the period already paid for. We will tell you before any price change takes effect, and you may cancel before it does.{" "}
        <strong>[Trial, proration and renewal-notice details — to be confirmed.]</strong>
      </p>
    ),
  },
  {
    id: "sakhi",
    title: "Using Sakhi",
    sakhi: "I’m an AI companion. I can be wrong — for anything important, check your report or ask for a human.",
    body: (
      <>
        <p>
          Sakhi is an AI, not a person and never a guru or spiritual authority. She uses only verified data for factual astrology and Vastu questions, but
          her words can still be imperfect. Do not rely on Sakhi for emergencies, medical, legal, financial or structural decisions.
        </p>
        <p>Please don’t try to make Sakhi produce harmful content, or to access anyone else’s information.</p>
      </>
    ),
  },
  {
    id: "use",
    title: "Acceptable use",
    body: (
      <ul>
        <li>Use Prem Marg lawfully and kindly, and only for personal, non-commercial purposes unless we agree otherwise.</li>
        <li>Do not scrape, copy at scale, reverse-engineer or overload the service, or attempt to bypass its security.</li>
        <li>Do not upload content you don’t have the right to share, or that is unlawful or harmful.</li>
        <li>Do not use our reports, verses or stories to frighten, pressure or exploit anyone.</li>
      </ul>
    ),
  },
  {
    id: "ip",
    title: "Intellectual property",
    body: (
      <>
        <p>
          The Prem Marg name, the Sakhi mark, our designs, explanations, translations, reports and software belong to us or our licensors. Sanskrit source
          texts such as the Bhagavad Gita are part of our shared heritage; our translations, reflections and lessons are our own work.
        </p>
        <p>
          You may share a short excerpt of a Daily Gita or Katha with a link back to Prem Marg. Brand files from the <Link href="/sakhi#brand-kit">brand
          kit</Link> may be used to refer to Prem Marg, following its guidelines.
        </p>
      </>
    ),
  },
  {
    id: "content",
    title: "Your content",
    body: (
      <p>
        You keep ownership of the details, questions and floor plans you provide. You give us permission to use them only to provide, support and quality-check
        your service. We will never use them publicly — in marketing, testimonials or examples — without your explicit permission.
      </p>
    ),
  },
  {
    id: "advisory",
    title: "Private advisory and property",
    body: (
      <p>
        When you request private advisory, your request is passed to {SITE.founderBrand}. Any property service or consultation is a separate engagement with
        its own terms, agreed directly with you. Prem Marg does not guarantee any property outcome, price or return, and Vastu guidance does not replace a
        structural survey, legal title check or financial advice.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Our responsibility to you",
    body: (
      <>
        <p>
          We provide Prem Marg with care and skill. Beyond that, and to the extent the law allows, the service is provided “as is”, and we are not liable for
          decisions you make based on traditional guidance, or for indirect or consequential loss. Our total liability for any paid service is limited to the
          amount you paid for it <strong>[cap — to be confirmed]</strong>.
        </p>
        <p>Nothing in these terms limits liability that cannot be limited by law, or your rights as a consumer.</p>
      </>
    ),
  },
  {
    id: "law",
    title: "Changes, governing law and contact",
    body: (
      <p>
        We may update these terms; if a change matters, we will tell you in advance. These terms are governed by <strong>[governing law and courts — to be
        confirmed]</strong>, without depriving you of protections under the law where you live. Questions: <strong>[contact email — to be confirmed]</strong>{" "}
        or the <Link href="/advisory">contact form</Link>.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalDoc
      current="/legal/terms"
      eyebrow="Trust · Terms"
      title={
        <>
          Clear terms, <em>kindly</em> kept.
        </>
      }
      lead="The agreement between you and Prem Marg — what we offer, what we ask of you, and what we promise in return."
      watermark="नियम"
      summary={
        <>
          <h2>The short version</h2>
          <ul>
            <li>Our guidance is traditional interpretation for reflection — never a substitute for professional advice.</li>
            <li>No price is shown until it is set; nothing is charged without your checkout.</li>
            <li>Payments are handled by Stripe; reports are delivered privately, never at public links.</li>
            <li>Sakhi is an AI companion — helpful, honest, and sometimes imperfect.</li>
            <li>Your details remain yours, and are never used publicly without your permission.</li>
          </ul>
        </>
      }
      sections={sections}
      sakhiAsk="Can you explain Prem Marg's terms simply?"
      sakhiText="Terms can feel heavy. If you’d like, I’ll walk you through the parts that matter to you."
    />
  );
}
