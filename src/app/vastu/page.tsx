import type { Metadata } from "next";
import Link from "next/link";
import { VASTU_RULES_VERSION } from "@/lib/vastu/engine";
import SakhiNote from "@/components/ui/SakhiNote";
import HeroCompass from "@/components/vastu/HeroCompass";
import StudioLaunch from "@/components/vastu/StudioLaunch";
import VastuStudio from "@/components/vastu/VastuStudio";
import ZoneMandala from "@/components/vastu/ZoneMandala";
import ReportOffer from "@/components/vastu/ReportOffer";
import AskChips from "@/components/vastu/AskChips";
import s from "./vastu.module.css";

const TITLE = "VASTU — Free Floor Plan Vastu Check (Beta) · Directions, Zones & Brahmasthan";
const DESCRIPTION =
  "Upload a JPG or PNG floor plan, confirm North, the boundary and your rooms, and see a free Vastu preview: Brahmasthan, the 16-direction wheel, the 3×3 mandala and findings with clear, practical remedies. Processed in your browser. Beta.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Vastu floor plan check",
    "Vastu Shastra",
    "free Vastu analysis",
    "Brahmasthan",
    "kitchen Vastu",
    "main entrance Vastu",
    "pooja room direction",
    "toilet Vastu",
    "Vastu for apartments",
    "Vastu Purusha mandala",
  ],
  alternates: { canonical: "/vastu" },
  openGraph: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION, url: "/vastu", type: "website" },
  twitter: { title: `${TITLE} · Prem Marg`, description: DESCRIPTION },
};

const PROCESS = [
  {
    n: "01",
    title: "Upload",
    text: "Upload a floor plan — JPG or PNG for the free preview; PDF/JPG/PNG for the paid report.",
    sakhi: "A clean export, a scan or a straight phone photo of the drawing all work. The preview never leaves your browser.",
  },
  {
    n: "02",
    title: "Detect",
    text: "The system suggests a likely boundary to start from — a suggestion only, never a conclusion.",
    sakhi: "Detection only gives you a starting point. Nothing is assumed until you confirm it.",
  },
  {
    n: "03",
    title: "Confirm",
    text: "You confirm North direction, the exterior boundary, the main entrance and room labels.",
    sakhi: "This is the heart of honest Vastu: findings are only as true as North, the boundary and the labels — so you confirm each one.",
  },
  {
    n: "04",
    title: "Measure",
    text: "The engine calculates the geometric centre — the Brahmasthan — and overlays the directional grid.",
    sakhi: "The Brahmasthan is the true area-centroid of the shape you confirmed, not a guess by eye.",
  },
  {
    n: "05",
    title: "Analyse",
    text: "Entrance, kitchen, bedrooms, toilets, pooja area, stairs, storage, balconies, water elements and cuts — where the data supports it.",
    sakhi: "Each confirmed element is read against one frozen, versioned traditional table — the same plan always gives the same findings.",
  },
  {
    n: "06",
    title: "Explain",
    text: "Every finding stores its rule, severity, confidence and evidence location on the plan.",
    sakhi: "If a finding can't point to a pin or a corner on your plan, it doesn't appear.",
  },
] as const;

const LADDER = [
  { n: 1, name: "Behaviour & use", eg: "Keep the North-East light and clutter-free; keep a toilet door closed.", cost: "Free · today", sakhi: "Most guidance begins here — a habit costs nothing and can start tonight." },
  { n: 2, name: "Furniture & layout", eg: "Move the bed to the room's south-west; turn the desk to face east.", cost: "An afternoon", sakhi: "Moving furniture inside a room is often enough to honour the tradition." },
  { n: 3, name: "Colour, material & traditional remedy", eg: "Favour the zone's traditional palette; a lamp or plant to complete a corner.", cost: "Small", sakhi: "Colour and material are gentle, reversible steps. No fear, no expensive objects." },
  { n: 4, name: "Renovation", eg: "Re-planning a use or completing a missing corner.", cost: "Only if you wish", sakhi: "Renovation is the last step, never the first — and structural changes always need a qualified architect or engineer." },
];

export default function VastuPage() {
  return (
    <>
      {/* ───────────── Hero ───────────── */}
      <section className={`page-hero ${s.hero}`} aria-labelledby="vastu-title">
        <div className={s.blueprint} aria-hidden />
        <span className={`sanskrit ${s.watermark}`} aria-hidden>
          वास्तु
        </span>
        <div className={`container ${s.heroGrid}`}>
          <div className={s.heroText}>
            <p className="eyebrow">
              VASTU · Spatial intelligence <span className="badge badge--beta">Beta</span>
            </p>
            <h1 id="vastu-title" className={s.heroTitle}>
              Read your home <em>by its directions.</em>
            </h1>
            <p className="lead">
              Floor-plan analysis, directions, zones, room placement and practical corrections. Upload a plan, confirm North, the boundary and your rooms — and see your Brahmasthan, the
              sixteen directions and every finding explained.
            </p>
            <StudioLaunch />
            <ul className={s.heroTrust}>
              <li data-sakhi="Your plan is read by this page in your own browser. Nothing is uploaded for the free preview.">Processed in your browser</li>
              <li data-sakhi="Nothing is concluded until you confirm North, the boundary, the entrance and each room.">You confirm every input</li>
              <li data-sakhi="Remedies begin with habit and layout. Renovation is always last — and needs an architect or engineer.">No fear, no renovation first</li>
            </ul>
          </div>
          <HeroCompass />
        </div>
      </section>

      {/* ───────────── The studio ───────────── */}
      <section className={`section section--tight ${s.studioSection}`} id="studio" aria-labelledby="studio-title">
        <div className="container">
          <div className={s.studioHead}>
            <div>
              <p className="eyebrow">The VASTU studio · free preview</p>
              <h2 id="studio-title" className={s.h2}>
                Your plan on the <em>drafting table</em>
              </h2>
            </div>
            <p className={s.studioLead}>
              Five honest steps. Your floor plan is processed only in your browser for this preview — nothing is uploaded. PDFs are accepted for the paid report.
            </p>
          </div>
          <VastuStudio />
          <p className={s.studioFine}>
            Traditional guidance, labelled Beta. Rules {VASTU_RULES_VERSION}. Results depend on the North, boundary and labels you confirm.
          </p>
        </div>
      </section>

      {/* ───────────── How VASTU works ───────────── */}
      <section className="section section--marble" aria-labelledby="how-title">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">How VASTU works</p>
            <h2 id="how-title" className={s.h2}>
              From a drawing to <em>guidance you can trust</em>
            </h2>
            <p className="lead">Calculation first, interpretation second — and you confirm the facts in between.</p>
          </div>
          <ol className={s.path}>
            {PROCESS.map((p, i) => (
              <li key={p.n} className={s.pathStep} data-reveal style={{ ["--reveal-delay" as string]: `${i * 80}ms` }} data-sakhi={p.sakhi}>
                <span className={s.pathNum}>{p.n}</span>
                <div>
                  <h3 className={s.pathTitle}>{p.title}</h3>
                  <p className={s.pathText}>{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className={s.pathOutput} data-reveal>
            <span className="inscription">Output</span> Annotated plan, strengths, concerns, priority fixes, room-by-room guidance and an idealised layout where feasible.
          </p>
        </div>
      </section>

      {/* ───────────── Zone mandala ───────────── */}
      <section className="section section--forest" aria-labelledby="zones-title">
        <div className="container">
          <div className="section-head">
            <p className="eyebrow">The Vastu Purusha mandala</p>
            <h2 id="zones-title" className={s.h2}>
              Nine zones, nine <em>presiding energies</em>
            </h2>
            <p className="lead">
              Each direction carries a deity, an element and a traditional palette. Tap a zone — the studio reads your rooms against exactly this table.
            </p>
          </div>
          <ZoneMandala />
        </div>
      </section>

      {/* ───────────── Remedy hierarchy ───────────── */}
      <section className="section" aria-labelledby="remedy-title">
        <div className="container">
          <div className={s.remedyGrid}>
            <div>
              <p className="eyebrow">The remedy hierarchy</p>
              <h2 id="remedy-title" className={s.h2}>
                Simplest step <em>first</em>
              </h2>
              <p className="lead">Behaviour and use, then furniture and layout, then colour, material and traditional remedy — and renovation only last, only if you wish.</p>
              <p className={`note ${s.structural}`}>Structural suggestions always require review by a qualified architect or engineer.</p>
            </div>
            <ol className={s.ladder}>
              {LADDER.map((l) => (
                <li key={l.n} className={`${s.rung} ${l.n === 4 ? s.rungLast : ""}`} style={{ ["--n" as string]: l.n }} data-reveal data-sakhi={l.sakhi}>
                  <span className={s.rungN}>{l.n}</span>
                  <div className={s.rungBody}>
                    <h3 className={s.rungName}>{l.name}</h3>
                    <p className={s.rungEg}>{l.eg}</p>
                  </div>
                  <span className={s.rungCost}>{l.cost}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────────── Ask Sakhi ───────────── */}
      <section className="section section--tight section--marble" aria-labelledby="ask-title">
        <div className="container container--narrow">
          <h2 id="ask-title" className="visually-hidden">
            Ask Sakhi about Vastu
          </h2>
          <SakhiNote ask="Where should the pooja room be in Vastu?" askLabel="Ask about the pooja space">
            Not sure where something belongs? Ask me about any room — I&apos;ll share the traditional placement, why it is favoured, and the simplest way to honour it where you live now.
          </SakhiNote>
          <AskChips />
        </div>
      </section>

      {/* ───────────── The report ───────────── */}
      <section className="section" aria-labelledby="report-title" id="report">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">Go deeper</p>
            <h2 id="report-title" className={s.h2}>
              The full <em>annotated report</em>
            </h2>
            <p className="lead">The preview shows what your confirmed plan says. The report turns it into a considered document you can keep, share and act on.</p>
          </div>
          <ReportOffer />
        </div>
      </section>

      {/* ───────────── Disclaimer ───────────── */}
      <section className={`section section--tight ${s.disclaimerSection}`} aria-labelledby="disclaimer-title">
        <div className="container container--narrow">
          <h2 id="disclaimer-title" className={s.disclaimerTitle}>
            A note on traditional guidance
          </h2>
          <p className={s.disclaimer}>
            VASTU is traditional spatial guidance, offered in a devotional and cultural spirit — not a scientific, engineering, legal or financial assessment. It is labelled Beta while North,
            boundary and room confirmation and our geometry checks mature. Findings depend entirely on the plan, North direction, boundary and labels you confirm. You retain full agency
            over your home: nothing here is a prediction, and nothing requires you to buy anything. Structural changes always require a qualified architect or engineer. See our{" "}
            <Link href="/legal/disclaimer">traditional-practice disclaimer</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
