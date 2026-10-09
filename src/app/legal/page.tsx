import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import s from "@/components/about/legal.module.css";

export const metadata: Metadata = {
  title: "Trust & legal",
  description: "Prem Marg’s privacy policy, terms of service and traditional-practice disclaimer — first drafts, in plain language, for legal review before launch.",
  alternates: { canonical: "/legal" },
};

const DOCS = [
  { href: "/legal/privacy", title: "Privacy policy", sk: "गोपनीयता", line: "Birth details, floor plans, Sakhi, emails and payments — what we keep, why, and for how long." },
  { href: "/legal/terms", title: "Terms of service", sk: "नियम", line: "What we offer, what we ask of you, and what we promise in return." },
  { href: "/legal/disclaimer", title: "Traditional-practice disclaimer", sk: "विवेक", line: "Interpretation, not prediction. Guidance, not prescription. Never instead of professional care." },
];

export default function LegalIndex() {
  return (
    <>
      <PageHero eyebrow="Trust" title={<>Honesty, <em>written down</em>.</>} lead="Three documents that hold us to our word. All are first drafts, marked for legal review before launch." watermark="सत्य" />
      <section className="section section--tight">
        <div className="container">
          <ul className={s.hub}>
            {DOCS.map((d) => (
              <li key={d.href}>
                <Link href={d.href} className={`card card--gilded ${s.hubCard}`}>
                  <span className={`${s.hubSk} sanskrit`} aria-hidden>
                    {d.sk}
                  </span>
                  <span className={s.hubTitle}>{d.title}</span>
                  <span className={s.hubLine}>{d.line}</span>
                  <span className="badge">Draft — for legal review</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
