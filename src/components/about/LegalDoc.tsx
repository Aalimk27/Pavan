import type { ReactNode } from "react";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import SakhiNote from "@/components/ui/SakhiNote";
import s from "./legal.module.css";

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
  /** Optional whisper when a reader lingers on the section heading. */
  sakhi?: string;
}

const DOCS = [
  { href: "/legal/privacy", label: "Privacy policy" },
  { href: "/legal/terms", label: "Terms of service" },
  { href: "/legal/disclaimer", label: "Traditional-practice disclaimer" },
] as const;

export const DRAFT_DATE = "9 October 2026";

/** Shared layout for the legal drafts: hero, draft banner, sticky contents, numbered sections. */
export default function LegalDoc({
  current,
  eyebrow,
  title,
  lead,
  watermark,
  summary,
  sections,
  sakhiAsk,
  sakhiText,
}: {
  current: (typeof DOCS)[number]["href"];
  eyebrow: string;
  title: ReactNode;
  lead: string;
  watermark: string;
  summary: ReactNode;
  sections: LegalSection[];
  sakhiAsk: string;
  sakhiText: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} watermark={watermark} badge={<span className="badge">Draft</span>} />

      <section className={`section ${s.wrap}`}>
        <div className="container">
          <div className={s.draft} role="note" data-sakhi="This is a first draft. A qualified lawyer will review it before Prem Marg launches.">
            <span className={s.draftSeal} aria-hidden>
              ✦
            </span>
            <div>
              <p className={s.draftTitle}>Draft — for legal review before launch</p>
              <p className={s.draftText}>
                This is a working first draft prepared on {DRAFT_DATE}. It describes how Prem Marg is designed to work and will be reviewed by a qualified
                lawyer before public launch. Items in [square brackets] are still to be confirmed.
              </p>
            </div>
          </div>

          <div className={s.layout}>
            <aside className={s.aside}>
              <details className={s.tocMobile}>
                <summary>
                  Contents <span>{sections.length} sections</span>
                </summary>
                <ol>
                  {sections.map((sec, i) => (
                    <li key={sec.id}>
                      <a href={`#${sec.id}`}>
                        <span className={s.tocNum}>{i + 1}</span>
                        {sec.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </details>
              <nav className={s.toc} aria-label="Contents">
                <p className={s.tocHead}>Contents</p>
                <ol>
                  {sections.map((sec, i) => (
                    <li key={sec.id}>
                      <a href={`#${sec.id}`}>
                        <span className={s.tocNum}>{i + 1}</span>
                        {sec.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <nav className={s.docs} aria-label="Legal documents">
                {DOCS.map((d) => (
                  <Link key={d.href} href={d.href} aria-current={d.href === current ? "page" : undefined}>
                    {d.label}
                  </Link>
                ))}
              </nav>
            </aside>

            <article className={s.article}>
              <div className={s.summary}>{summary}</div>
              {sections.map((sec, i) => (
                <section key={sec.id} id={sec.id} className={s.sec} aria-labelledby={`${sec.id}-h`}>
                  <h2 id={`${sec.id}-h`} className={s.secTitle} data-sakhi={sec.sakhi}>
                    <span className={s.secNum} aria-hidden>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {sec.title}
                  </h2>
                  <div className={s.secBody}>{sec.body}</div>
                </section>
              ))}
              <div className={s.foot}>
                <SakhiNote ask={sakhiAsk} askLabel="Ask Sakhi">
                  {sakhiText}
                </SakhiNote>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
