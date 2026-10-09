import s from "./about.module.css";

type Actor = "You" | "Sakhi" | "Engines" | "Specialists" | "Automated" | "Human";

/** Blueprint §5 — the 100% automated customer journey, in its own words. */
const STEPS: ReadonlyArray<{ name: string; text: string; actor: Actor; sakhi: string }> = [
  { name: "Discover", text: "SEO, social, ads, Katha, Gita or free calculator.", actor: "You", sakhi: "Most people find us through a story, a verse or a free calculator. No hard sell at the door." },
  { name: "Choose clarity", text: "Career, relationship, money, future, home, numbers, mind or spiritual life.", actor: "You", sakhi: "You choose what you need clarity about. Everything starts from your question." },
  { name: "Route", text: "Sakhi identifies DRISHTI, VASTU, ANK or a combination.", actor: "Sakhi", sakhi: "This is where I help — I find the right door for your question." },
  { name: "Preview", text: "Give a genuinely useful free insight before asking for payment.", actor: "Automated", sakhi: "You always get something genuinely useful for free before anyone asks you to pay." },
  { name: "Pay", text: "Secure checkout; order state created automatically.", actor: "Automated", sakhi: "Payments go through a secure checkout. Your order is created the moment it succeeds." },
  { name: "Collect", text: "Birth details, questions, floor plan and confirmations as required.", actor: "Sakhi", sakhi: "If anything is missing, I ask for it — and check its format — before calculation begins." },
  { name: "Calculate", text: "Deterministic chart / number / geometry engines produce facts.", actor: "Engines", sakhi: "Facts are generated deterministically. The same inputs always give the same chart, numbers and geometry." },
  { name: "Interpret", text: "Specialist agents turn verified facts into Prem Marg guidance.", actor: "Specialists", sakhi: "Interpretation only ever starts from verified facts — never from guesses." },
  { name: "QA", text: "Automated consistency and confidence checks.", actor: "Automated", sakhi: "Before anything reaches you, it is checked for consistency and confidence." },
  { name: "Render", text: "Elegant branded report generated from structured fields.", actor: "Automated", sakhi: "Reports are built from structured fields — so every number in them traces back to a calculation." },
  { name: "Deliver", text: "Email + account dashboard + Sakhi explanation.", actor: "Sakhi", sakhi: "Your report arrives by email and in My Prem Marg — and I can walk you through it." },
  { name: "Cross-sell", text: "One relevant next step only.", actor: "Sakhi", sakhi: "One relevant next step. Only one. That is a promise." },
  { name: "Retain", text: "Daily Gita/Katha, membership and future reports.", actor: "Automated", sakhi: "The relationship continues with daily wisdom — useful content, not disguised sales." },
  { name: "Escalate", text: "High-intent property customer can request RadheyShyam Realtor advisory.", actor: "Human", sakhi: "For property and big decisions, a real person — RadheyShyam Realtor — is one request away." },
];

const PHASES = [
  { name: "Seek", sanskrit: "जिज्ञासा", from: 0, to: 4 },
  { name: "Commit", sanskrit: "संकल्प", from: 4, to: 6 },
  { name: "Create", sanskrit: "सृजन", from: 6, to: 10 },
  { name: "Care", sanskrit: "सेवा", from: 10, to: 14 },
];

export default function JourneyPath() {
  return (
    <div className={s.journey}>
      {PHASES.map((ph) => (
        <section key={ph.name} className={s.phase} aria-label={`${ph.name}: steps ${ph.from + 1} to ${ph.to}`}>
          <header className={s.phaseHead} data-reveal>
            <span className={`${s.phaseSk} sanskrit`} lang="sa">
              {ph.sanskrit}
            </span>
            <span className={s.phaseName}>{ph.name}</span>
          </header>
          <ol className={s.steps} start={ph.from + 1}>
            {STEPS.slice(ph.from, ph.to).map((st, i) => {
              const n = ph.from + i + 1;
              return (
                <li key={st.name} className={s.step} data-actor={st.actor} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }} data-sakhi={st.sakhi}>
                  <span className={s.stepNode} aria-hidden>
                    {n}
                  </span>
                  <div className={s.stepBody}>
                    <h3 className={s.stepName}>{st.name}</h3>
                    <p className={s.stepText}>{st.text}</p>
                    <span className={s.stepActor}>{st.actor}</span>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}
