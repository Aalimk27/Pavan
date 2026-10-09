import type { Metadata } from "next";
import Link from "next/link";
import NotFoundSakhi from "@/components/about/NotFoundSakhi";
import { AskSakhiButton } from "@/components/ui/SakhiNote";
import s from "@/components/about/notfound.module.css";

export const metadata: Metadata = {
  title: "Path not found",
  description: "This path isn’t on the map yet. Let Sakhi guide you back to Prem Marg — DRISHTI, VASTU, ANK, KATHA, GITA and GURUKUL.",
  robots: { index: false },
};

const WAYS = [
  { href: "/", label: "Home", line: "What would you like clarity about today?", sk: "गृह" },
  { href: "/drishti", label: "DRISHTI", line: "Your free snapshot — Lagna, Moon, Nakshatra.", sk: "दृष्टि" },
  { href: "/gita", label: "Today’s Gita", line: "One verse, one reflection, one action.", sk: "गीता" },
  { href: "/katha", label: "Today’s Katha", line: "A sacred story for modern life.", sk: "कथा" },
  { href: "/ank", label: "ANK", line: "Mulank, Bhagya Ank and your home number.", sk: "अंक" },
  { href: "/gurukul", label: "GURUKUL", line: "Seven-day paths for daily life.", sk: "गुरुकुल" },
];

export default function NotFound() {
  return (
    <section className={s.wrap} aria-labelledby="nf-title">
      <span className={`${s.watermark} sanskrit`} aria-hidden>
        मार्ग
      </span>
      <div className={`container ${s.grid}`}>
        <NotFoundSakhi />
        <div className={s.text}>
          <p className="eyebrow">404 · Path not found</p>
          <h1 id="nf-title" className={s.title}>
            This path isn’t on <em>the map</em> yet.
          </h1>
          <p className="lead">
            The page you were looking for has moved, or was never here. Every path still leads somewhere good — choose one below, or ask Sakhi to guide
            you.
          </p>
          <div className="row">
            <Link href="/" className="btn">
              Return home
            </Link>
            <AskSakhiButton message="I followed a link that doesn't exist. Can you help me find what I was looking for?" className={`btn btn--ghost ${s.ghost}`}>
              Ask Sakhi the way
            </AskSakhiButton>
          </div>
        </div>
      </div>
      <div className="container">
        <ul className={s.ways}>
          {WAYS.map((w) => (
            <li key={w.href}>
              <Link href={w.href} className={s.way} data-sakhi={w.line}>
                <span className={`${s.waySk} sanskrit`} aria-hidden>
                  {w.sk}
                </span>
                <span className={s.wayLabel}>{w.label}</span>
                <span className={s.wayLine}>{w.line}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
