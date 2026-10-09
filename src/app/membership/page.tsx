import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SakhiNote from "@/components/ui/SakhiNote";
import MetalCard, { JoinButton } from "@/components/account/MetalCard";
import SubscribeForm from "@/components/account/SubscribeForm";
import plan from "@/components/account/membership.module.css";
import { MEMBERSHIPS, type Membership } from "@/lib/products";
import s from "./membership.module.css";

const TITLE = "Membership — Copper, Gold & Platinum";
const DESCRIPTION =
  "Prem Marg membership: COPPER, GOLD and PLATINUM plans for daily Gita and Katha, saved profiles, timing updates, family profiles and Vastu records. Founding prices are set after real usage — join the founding list.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: ["Prem Marg membership", "Vedic astrology membership", "daily Gita", "daily Katha", "Vastu records", "dharmic guidance subscription"],
  alternates: { canonical: "/membership" },
  openGraph: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION, url: "/membership", type: "website" },
  twitter: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION },
};

const PRICE_PENDING = "Founding price announced at launch";

const TIER_META: Record<Membership["id"], { sanskrit: string; roman: string; line: string; sakhi: string }> = {
  copper: {
    sanskrit: "नित्य",
    roman: "Nitya · daily",
    line: "The daily practice — wisdom, calculators and your saved profile.",
    sakhi: "Copper is the everyday vessel — the lota that carries water to the tulsi each morning. A daily practice, kept simply.",
  },
  gold: {
    sanskrit: "साधना",
    roman: "Sādhanā · practice",
    line: "Personal guidance through the year — monthly, timely, deeper.",
    sakhi: "Gold is for walking the year with guidance — monthly notes, timing updates and an annual DRISHTI refresh.",
  },
  platinum: {
    sanskrit: "कुटुम्ब",
    roman: "Kuṭumba · household",
    line: "For the whole household — family, homes, priority and advisory.",
    sakhi: "Platinum holds the whole household — family profiles, several homes and preferential access to RadheyShyam Realtor.",
  },
};

/** Comparison rows are derived from the plan scopes themselves — nothing is added by hand. */
function comparisonRows() {
  const rows: { feature: string; from: number }[] = [];
  MEMBERSHIPS.forEach((m, i) => {
    m.scope.filter((f) => !f.startsWith("Everything in")).forEach((feature) => rows.push({ feature, from: i }));
  });
  return rows;
}

const FAQ = [
  {
    q: "Why is there no price yet?",
    a: "Our pricing rule is simple: final subscription prices are set only after real usage, AI cost, retention and support data are measured. We would rather publish a fair price late than a guessed price early.",
  },
  {
    q: "Will any plan be unlimited?",
    a: "Not at launch. Unlimited plans tend to hide their real cost in slower service or quiet limits later. Every plan will say clearly what it includes.",
  },
  {
    q: "Is the daily wisdom free without a membership?",
    a: "Yes. The daily Gita verse, the daily Katha, Gurukul paths and the free calculators stay open to everyone. Membership adds personal guidance, saved records and member pricing on top.",
  },
  {
    q: "Does joining the founding list commit me to anything?",
    a: "No. It only means we email you when founding prices are announced. No payment, no account and no obligation — and you can unsubscribe at any time.",
  },
  {
    q: "Is membership a substitute for medical, legal or financial advice?",
    a: "No. Prem Marg offers traditional, devotional and reflective guidance. It never replaces medical, mental-health, legal, financial or structural professional advice.",
  },
];

export default function MembershipPage() {
  const rows = comparisonRows();
  return (
    <>
      <PageHero
        eyebrow="Membership"
        watermark="सदस्यता"
        title={
          <>
            Walk the path, <em>every day</em>.
          </>
        }
        lead="Three ways to keep Prem Marg close — from a daily practice to guidance for your whole household. Copper, Gold and Platinum, each with a clear scope and no fine print."
      >
        <div className="row">
          <a className="btn btn--lg" href="#plans">
            See the three plans
          </a>
          <a className="btn btn--ghost btn--lg" href="#founding-list">
            Join the founding list
          </a>
        </div>
      </PageHero>

      {/* ─────────── Plans ─────────── */}
      <section className="section section--tight" id="plans" aria-labelledby="plans-title">
        <div className="container">
          <header className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">Three metals · one path</p>
            <h2 id="plans-title">Choose how close you’d like to walk</h2>
            <p className="lead">Each plan builds on the one before it. Prices are announced at launch, once they can be set honestly.</p>
          </header>

          <div className={plan.plans}>
            {MEMBERSHIPS.map((m, i) => {
              const meta = TIER_META[m.id];
              return (
                <MetalCard key={m.id} metal={m.metal} tier={m.name} featured={m.id === "gold"} sakhiLine={meta.sakhi}>
                  <div className={plan.plate} data-reveal style={{ "--reveal-delay": `${i * 120}ms` } as CSSProperties}>
                    <span className={plan.plateSheen} aria-hidden />
                    <span className={plan.plateRivets} aria-hidden />
                    <span className={`sanskrit ${plan.plateSanskrit}`} lang="sa">
                      {meta.sanskrit}
                    </span>
                    <h3 className={plan.plateName}>{m.name}</h3>
                    <span className={plan.plateRoman}>{meta.roman}</span>
                    {m.id === "gold" && <span className={plan.plateFlag}>A guided year</span>}
                  </div>
                  <div className={plan.body}>
                    <p className={plan.line}>{meta.line}</p>
                    <p className={plan.price} data-sakhi="Final prices are set after we measure real usage and cost — so the number you see at launch is a fair one.">
                      {m.price == null ? PRICE_PENDING : `$${m.price}`}
                    </p>
                    <ul className={plan.scope} aria-label={`${m.name} includes`}>
                      {m.scope.map((f) => (
                        <li key={f} className={f.startsWith("Everything in") ? plan.scopeInherit : undefined}>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <JoinButton tier={m.name}>Join the {m.name.charAt(0) + m.name.slice(1).toLowerCase()} founding list</JoinButton>
                  </div>
                </MetalCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─────────── Pricing rule ─────────── */}
      <section className={`section section--forest ${s.rule}`} aria-labelledby="rule-title">
        <div className={`container container--narrow ${s.ruleInner}`}>
          <p className="eyebrow eyebrow--center">Our pricing rule</p>
          <h2 id="rule-title" className={s.ruleTitle}>
            A fair price, <em>measured</em> — never guessed.
          </h2>
          <div className={s.ruleGrid}>
            <div className={s.ruleItem} data-sakhi="We measure first, then price. It keeps every plan honest — for you and for us.">
              <span className={s.ruleNum} aria-hidden>
                १
              </span>
              <h3>Set after real data</h3>
              <p>Final subscription prices are set after real AI cost, usage, retention and support data are measured.</p>
            </div>
            <div className={s.ruleItem} data-sakhi="No unlimited plans at launch — so no hidden limits later. What a plan says is what it gives.">
              <span className={s.ruleNum} aria-hidden>
                २
              </span>
              <h3>No unlimited plans at launch</h3>
              <p>Every plan states what it includes. No “unlimited” promises that quietly shrink later.</p>
            </div>
            <div className={s.ruleItem} data-sakhi="The founding list hears first — before prices are public.">
              <span className={s.ruleNum} aria-hidden>
                ३
              </span>
              <h3>Founding members hear first</h3>
              <p>Join the founding list and you will hear the launch prices before they are announced anywhere else.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── Comparison ─────────── */}
      <section className="section" aria-labelledby="compare-title">
        <div className="container">
          <header className="section-head">
            <p className="eyebrow">Side by side</p>
            <h2 id="compare-title">What each plan holds</h2>
          </header>
          <div className={s.tableWrap} role="region" aria-labelledby="compare-title" tabIndex={0}>
            <table className={s.table}>
              <caption className="visually-hidden">Membership plan comparison: Copper, Gold and Platinum</caption>
              <thead>
                <tr>
                  <th scope="col">Included</th>
                  {MEMBERSHIPS.map((m) => (
                    <th scope="col" key={m.id}>
                      <span className={s.thMetal} style={{ background: m.metal }} aria-hidden />
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.feature}>
                    <th scope="row">{r.feature}</th>
                    {MEMBERSHIPS.map((m, i) => (
                      <td key={m.id}>
                        {i >= r.from ? (
                          <span className={s.yes} role="img" aria-label="Included">
                            ✦
                          </span>
                        ) : (
                          <span className={s.no} role="img" aria-label="Not included">
                            –
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
                <tr className={s.priceRow}>
                  <th scope="row">Price</th>
                  {MEMBERSHIPS.map((m) => (
                    <td key={m.id}>{m.price == null ? "At launch" : `$${m.price}`}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="hint">Daily Gita, Daily Katha, Gurukul paths and the free calculators remain open to everyone, member or not.</p>
        </div>
      </section>

      {/* ─────────── Founding list + FAQ ─────────── */}
      <section className="section section--marble" aria-labelledby="founding-title">
        <div className={`container ${s.split}`}>
          <div className={s.founding}>
            <p className="eyebrow">Founding list</p>
            <h2 id="founding-title">Be first to hear the founding prices</h2>
            <p className="lead">No payment, no account, no obligation — just one email when Copper, Gold and Platinum open.</p>
            <div className={`card card--gilded ${s.formCard}`}>
              <SubscribeForm
                id="founding-list"
                lists={["membership"]}
                cta="Join the founding list"
                consentText="Yes, email me when membership opens, with the founding prices. I can unsubscribe at any time."
                successText="You're on the founding list. When Copper, Gold and Platinum open, you'll hear first."
              />
            </div>
            <SakhiNote ask="Which membership would suit me — Copper, Gold or Platinum?" askLabel="Ask Sakhi which plan fits">
              Not sure which metal is yours? Tell me how you use Prem Marg — daily verses, a family, a new home — and I&rsquo;ll suggest a plan. You never need one to read the daily wisdom.
            </SakhiNote>
          </div>

          <div className={s.faq}>
            <p className="eyebrow">Questions</p>
            <h2 className={s.faqTitle}>Gently answered</h2>
            {FAQ.map((f) => (
              <details key={f.q} className={s.faqItem}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
            <p className={`small muted ${s.faqMore}`}>
              Already saving profiles and homes? See them in <Link href="/my">My Prem Marg</Link>.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
