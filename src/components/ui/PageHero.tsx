import type { ReactNode } from "react";
import "./ui.css";

/**
 * Dark hero for inner pages. Every page opens on the forest field so the
 * header (ivory over dark) reads consistently. A large Devanagari watermark
 * gives each door its own identity.
 */
export default function PageHero({
  eyebrow,
  title,
  lead,
  watermark,
  badge,
  children,
  align = "left",
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  watermark?: string;
  badge?: ReactNode;
  children?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <section className={`page-hero page-hero--${align}`}>
      {watermark && (
        <span className="page-hero__watermark sanskrit" aria-hidden>
          {watermark}
        </span>
      )}
      <div className="page-hero__glow" aria-hidden />
      <div className="container page-hero__inner">
        <p className={`eyebrow${align === "center" ? " eyebrow--center" : ""}`}>
          {eyebrow}
          {badge}
        </p>
        <h1 className="page-hero__title">{title}</h1>
        {lead && <p className="lead">{lead}</p>}
        {children && <div className="page-hero__extra">{children}</div>}
      </div>
    </section>
  );
}
