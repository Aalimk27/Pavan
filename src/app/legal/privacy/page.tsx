import type { Metadata } from "next";
import Link from "next/link";
import LegalDoc, { type LegalSection } from "@/components/about/LegalDoc";
import s from "@/components/about/legal.module.css";
import { CALC_VERSION } from "@/lib/astro/engine";
import { VASTU_RULES_VERSION } from "@/lib/vastu/engine";
import { SITE } from "@/lib/site";

const TITLE = "Privacy policy (draft)";
const DESCRIPTION =
  "How Prem Marg handles birth details, floor plans, Sakhi conversations, emails and payments: store only what is needed, private storage and signed links, separate marketing consent, clear retention and deletion. Draft for legal review.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/legal/privacy" },
  openGraph: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION, url: "/legal/privacy", type: "article" },
  twitter: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION },
};

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <>
        <p>
          {SITE.name} (“Prem Marg”, “we”, “us”) operates {SITE.domain}, a global dharmic guidance platform by {SITE.founderBrand}. For the purposes of
          data-protection law, the controller of your personal data is <strong>[legal entity name, registered address and registration number — to be
          confirmed]</strong>.
        </p>
        <p>
          You can reach us about privacy at <strong>[privacy contact email — to be confirmed]</strong>, or through the{" "}
          <Link href="/advisory">contact form</Link> (choose “Other”).
        </p>
      </>
    ),
  },
  {
    id: "principles",
    title: "Our principles",
    sakhi: "Birth details and floor plans are sensitive. We only keep what the service needs.",
    body: (
      <>
        <p>Birth data and floor plans are sensitive personal content. We designed Prem Marg around a few simple rules:</p>
        <ul>
          <li>
            <strong>Store only what the service needs</strong>, for as long as it needs it.
          </li>
          <li>
            <strong>Private storage and signed links.</strong> Reports and floor plans are never published at public URLs.
          </li>
          <li>
            <strong>Marketing is separate.</strong> Service messages about your order are not marketing; marketing needs its own, explicit consent.
          </li>
          <li>
            <strong>No public use without permission.</strong> We never publish or showcase your report, chart or floor plan without your explicit
            permission.
          </li>
          <li>
            <strong>Reproducible and auditable.</strong> Every report records the calculation, rule and report versions used to create it.
          </li>
          <li>
            <strong>We do not sell personal data.</strong>
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "local-first",
    title: "Local-first: what stays on your device today",
    sakhi: "Right now, the profiles and homes you save live only in your own browser. You can clear them any time.",
    body: (
      <>
        <p>
          Today, the free tools — the DRISHTI snapshot, the ANK calculators and the VASTU studio (Beta) — calculate in your browser. What you save in{" "}
          <Link href="/my">My Prem Marg</Link> is kept in your browser’s local storage on your device, not on our servers. This includes:
        </p>
        <ul>
          <li>saved birth profiles (name or label, date, time and place of birth, and a short snapshot summary);</li>
          <li>saved homes (a label, the home number and its root, and a count of Vastu findings — not the floor-plan image);</li>
          <li>your Daily Wisdom history, lamps lit and Gurukul practice days;</li>
          <li>your Sakhi preferences (voice and whispers on or off).</li>
        </ul>
        <p>
          Floor-plan images you open in the VASTU studio are processed in your browser and are not uploaded by the free preview. You can export a copy, or
          erase all of it at any time, from My Prem Marg (“Delete everything”) or by clearing your browser’s site data. Because it lives on your device, we cannot
          recover it for you if it is cleared.
        </p>
      </>
    ),
  },
  {
    id: "collect",
    title: "What we collect, and why",
    body: (
      <>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">What</th>
                <th scope="col">Why</th>
                <th scope="col">Basis [to be confirmed]</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Messages you send to Sakhi</td>
                <td>To reply to you and guide you to the right tool</td>
                <td>Providing the service; legitimate interests</td>
              </tr>
              <tr>
                <td>Email address and chosen lists (Daily Gita, Daily Katha, early access, membership)</td>
                <td>To send only what you chose</td>
                <td>Consent — withdraw any time</td>
              </tr>
              <tr>
                <td>Private advisory requests (name, email, optional phone and country, topic, message)</td>
                <td>To pass your request to {SITE.founderBrand} and reply</td>
                <td>Consent; steps before a contract</td>
              </tr>
              <tr>
                <td>Orders (when checkout opens): product, email, payment status, receipts</td>
                <td>To deliver what you bought, keep accounts and handle refunds</td>
                <td>Contract; legal obligation</td>
              </tr>
              <tr>
                <td>Report inputs (when paid reports open): birth details, questions, floor plans and your confirmations of North, boundary and rooms</td>
                <td>To calculate and write your report</td>
                <td>Contract; explicit consent for sensitive content</td>
              </tr>
              <tr>
                <td>Usage events (e.g. a calculator started, a checkout begun) and basic device data</td>
                <td>To understand what helps and fix what doesn’t</td>
                <td>Consent where required; legitimate interests</td>
              </tr>
              <tr>
                <td>IP address (briefly)</td>
                <td>Rate-limiting and abuse prevention</td>
                <td>Legitimate interests</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          We do not ask for, and ask you not to share, health records, government ID numbers or payment-card details in Sakhi or in any form.
        </p>
      </>
    ),
  },
  {
    id: "sakhi",
    title: "Sakhi is an AI",
    sakhi: "I am an AI. I explain facts — I never make them up. Please don’t share anything with me you wouldn’t want processed.",
    body: (
      <>
        <p>
          Sakhi is an AI companion, not a person. Many replies come from Sakhi’s built-in guide on our own servers. For open questions, the most recent
          part of your conversation (up to the last 12 messages, each trimmed to 1,200 characters) may be sent to an AI model provider{" "}
          <strong>[provider and region — e.g. OpenAI — to be confirmed]</strong> to draft a reply. We configure providers not to use this data to train
          their models where that option exists <strong>[to be confirmed per provider]</strong>.
        </p>
        <p>
          Facts are generated deterministically: chart positions, numbers and Vastu geometry come from our calculation engines, never from the AI model.
          Sakhi can only use your own verified data, and cannot access another customer’s private data.
        </p>
        <h3>Voice</h3>
        <p>
          If you turn on Sakhi’s voice, speech is produced by your browser. If you speak to Sakhi, your browser converts speech to text — some browsers do
          this using their provider’s online service — and only the text reaches us. Prem Marg does not record or store audio.
        </p>
      </>
    ),
  },
  {
    id: "storage",
    title: "Storage, security and signed links",
    body: (
      <>
        <p>When accounts and paid reports open:</p>
        <ul>
          <li>Reports and floor plans are kept in private object storage, encrypted at rest, and reached only through short-lived signed links.</li>
          <li>There are no public report URLs. A link that has expired simply stops working; you can request a fresh one from your account.</li>
          <li>All traffic to {SITE.domain} is encrypted in transit (HTTPS).</li>
          <li>Access by our team is limited to what is needed to deliver, support and quality-check your order, and is logged.</li>
        </ul>
        <p>No system is perfectly secure. If we learn of a breach affecting your data, we will tell you and the relevant authority as the law requires.</p>
      </>
    ),
  },
  {
    id: "versions",
    title: "Reproducibility: calculation, rule and report versions",
    sakhi: "Every report remembers exactly which version of the engines made it — so it can always be checked.",
    body: (
      <>
        <p>
          To make every report reproducible and auditable, we record the version of the calculation engine, the rule set and the report template used.
          The versions in use today are:
        </p>
        <ul>
          <li>
            DRISHTI calculation: <code>{CALC_VERSION}</code>
          </li>
          <li>
            VASTU rules (Beta): <code>{VASTU_RULES_VERSION}</code>
          </li>
        </ul>
        <p>These version labels contain no personal data.</p>
      </>
    ),
  },
  {
    id: "sharing",
    title: "Who we share data with",
    body: (
      <>
        <p>We use a small number of service providers (“processors”) who act on our instructions under contract:</p>
        <ul>
          <li>
            <strong>Payments — Stripe.</strong> Card details go directly to Stripe; we never see or store your full card number. Stripe acts as an
            independent controller for some fraud-prevention and legal purposes.
          </li>
          <li>
            <strong>Email — a transactional email provider</strong> <strong>[e.g. Resend — to be confirmed]</strong> for receipts, report-ready notices,
            login links and the lists you join.
          </li>
          <li>
            <strong>Hosting, database and storage</strong> <strong>[e.g. Vercel and Supabase — to be confirmed]</strong>.
          </li>
          <li>
            <strong>AI model provider</strong> for Sakhi’s open replies, as described above.
          </li>
          <li>
            <strong>Analytics — Google Analytics 4 via Google Tag Manager</strong>, when enabled, and subject to consent where the law requires it.
          </li>
          <li>
            <strong>{SITE.founderBrand}</strong> — only when you send a private advisory request, and only what you sent.
          </li>
        </ul>
        <p>We may also disclose data where the law requires it, or to protect the rights and safety of our users and others. We do not sell personal data.</p>
      </>
    ),
  },
  {
    id: "marketing",
    title: "Marketing and service messages",
    body: (
      <>
        <p>
          <strong>Service messages</strong> — receipts, missing-information requests, “your report is ready”, login links and billing notices — are part
          of delivering what you asked for.
        </p>
        <p>
          <strong>Marketing</strong> — including Daily Gita, Daily Katha and offers — is only sent if you tick a separate consent box, which is never
          ticked for you. Every marketing email includes a way to unsubscribe, and you control frequency and lists. Daily Wisdom stays useful content, not
          disguised sales.
        </p>
      </>
    ),
  },
  {
    id: "public",
    title: "No public use without permission",
    body: (
      <p>
        We will never publish, showcase or use your report, chart, numbers, floor plan or story in marketing, testimonials or examples without your
        explicit, written permission — which you can withdraw. We do not invent testimonials.
      </p>
    ),
  },
  {
    id: "retention",
    title: "Retention and deletion",
    sakhi: "Delete means delete. You can ask us to remove your data at any time.",
    body: (
      <>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead>
              <tr>
                <th scope="col">Data</th>
                <th scope="col">Kept for [periods to be confirmed]</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Saved items in My Prem Marg (on your device)</td>
                <td>Until you clear them</td>
              </tr>
              <tr>
                <td>Sakhi conversations on our servers</td>
                <td>Not stored beyond the request, except short-lived operational logs [≤ 30 days]</td>
              </tr>
              <tr>
                <td>Floor plans uploaded for a paid report</td>
                <td>[90 days] after delivery, then deleted unless you save the home to your account</td>
              </tr>
              <tr>
                <td>Reports and their inputs</td>
                <td>While your account is open, or until you delete them</td>
              </tr>
              <tr>
                <td>Order and payment records</td>
                <td>As long as tax and accounting law requires [e.g. 7–8 years]</td>
              </tr>
              <tr>
                <td>Email list membership</td>
                <td>Until you unsubscribe; a suppression record is kept so we don’t email you again</td>
              </tr>
              <tr>
                <td>Advisory requests</td>
                <td>[24 months] after the last contact</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>You can ask us to delete your account and data at any time. We will confirm when it is done, keeping only what the law requires.</p>
      </>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>Depending on where you live (for example under the GDPR, UK GDPR, India’s DPDP Act or US state laws), you may have the right to:</p>
        <ul>
          <li>access the personal data we hold about you, and receive a copy;</li>
          <li>correct it, or have it deleted;</li>
          <li>restrict or object to certain uses, including all marketing;</li>
          <li>withdraw consent at any time, without affecting earlier processing;</li>
          <li>move your data to another service (portability);</li>
          <li>complain to your data-protection authority or grievance officer [India grievance officer details — to be confirmed].</li>
        </ul>
        <p>We will respond within the time the applicable law sets, and never charge you for a reasonable request.</p>
      </>
    ),
  },
  {
    id: "transfers",
    title: "International transfers",
    body: (
      <p>
        Prem Marg serves people worldwide, and our providers may process data in countries other than yours. Where required, we use recognised safeguards
        such as standard contractual clauses <strong>[to be confirmed per provider]</strong>.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    body: (
      <p>
        Prem Marg is intended for adults. Paid services require you to be 18 or older (or the age of majority where you live). A parent or guardian may
        create a profile for a child as part of a family plan, and is responsible for that choice.
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies and similar storage",
    body: (
      <p>
        We use your browser’s local and session storage for the features described above (saved items, preferences, and so Sakhi doesn’t repeat her
        welcome). Analytics cookies are set only when analytics is enabled and, where the law requires, only after you agree. Stripe sets its own cookies
        on its checkout pages for security and fraud prevention.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes and contact",
    body: (
      <p>
        If we change this policy in a way that matters, we will update the date and, where appropriate, tell you before the change takes effect. Questions
        or requests: <strong>[privacy contact email — to be confirmed]</strong>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalDoc
      current="/legal/privacy"
      eyebrow="Trust · Privacy"
      title={
        <>
          Your details are <em>yours</em>.
        </>
      }
      lead="How Prem Marg handles birth details, floor plans, Sakhi conversations, emails and payments — in plain language."
      watermark="गोपनीयता"
      summary={
        <>
          <h2>The short version</h2>
          <ul>
            <li>Today, what you save in My Prem Marg stays in your own browser.</li>
            <li>We store only what the service needs, in private storage, behind signed links — never public URLs.</li>
            <li>Marketing needs a separate tick you give yourself. Service messages are not marketing.</li>
            <li>Sakhi is an AI. Facts come from deterministic engines, not from her.</li>
            <li>Payments are handled by Stripe. We never see your card number.</li>
            <li>We never sell your data, and never publish your report or floor plan without permission.</li>
          </ul>
        </>
      }
      sections={sections}
      sakhiAsk="How does Prem Marg handle my birth details?"
      sakhiText="If anything here is unclear, ask me — I’ll explain it plainly. And if you ever want your data gone, just say so."
    />
  );
}
