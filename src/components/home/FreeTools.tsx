"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { bhagyaAnk, homeNumber, mulank, PERSONAL_MEANING, HOME_MEANING, type AnkResult } from "@/lib/ank";
import { moonNow, tithiNow, formatDegrees, type ZodiacPoint } from "@/lib/astro/engine";
import { NAKSHATRA_ESSENCE } from "@/lib/content/drishti";
import { track } from "@/lib/analytics";
import { sakhi } from "@/components/sakhi/bus";
import styles from "./home.module.css";

function Coin({ n, label }: { n: number; label: string }) {
  return (
    <span className={styles.coin} aria-label={`${label} ${n}`}>
      <span className={styles.coinNum}>{n}</span>
      <span className={styles.coinLabel}>{label}</span>
    </span>
  );
}

export default function FreeTools() {
  const [dob, setDob] = useState("");
  const [nums, setNums] = useState<{ m: AnkResult; b: AnkResult } | null>(null);
  const [home, setHome] = useState("");
  const [homeRes, setHomeRes] = useState<AnkResult | null>(null);
  const [moon, setMoon] = useState<{ m: ZodiacPoint; t: ReturnType<typeof tithiNow> } | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const update = () => setMoon({ m: moonNow(), t: tithiNow() });
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, []);

  const begin = (tool: string) => {
    if (started) return;
    setStarted(true);
    track("calculator_started", { tool, where: "home" });
  };

  const calcBirth = (e: React.FormEvent) => {
    e.preventDefault();
    const [y, mo, d] = dob.split("-").map(Number);
    if (!y || !mo || !d) return;
    try {
      const m = mulank(d);
      const b = bhagyaAnk(y, mo, d);
      setNums({ m, b });
      sakhi.celebrate();
      sakhi.whisper(`Mulank ${m.root} — ${PERSONAL_MEANING[m.root].title}. Bhagya Ank ${b.root} — ${PERSONAL_MEANING[b.root].title}. A mirror, never a verdict.`, {
        cta: { label: "What does this mean?", href: "/ank" },
      });
    } catch {
      /* invalid date: the input prevents most of these */
    }
  };

  const calcHome = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = homeNumber(home);
      setHomeRes(r);
      sakhi.whisper(`Home number ${home}: Compound ${r.compound} / Root ${r.root} — ${HOME_MEANING[r.root].title}.`, { cta: { label: "See your home's Vastu", href: "/vastu" } });
    } catch {
      setHomeRes(null);
    }
  };

  return (
    <section className={`section ${styles.tools}`} data-tour="free-tools">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">Free, before anything else</p>
          <h2>
            A genuinely useful insight, <em className="accent">first</em>.
          </h2>
          <p className="lead">Real calculations — not teasers. Try them right here; Sakhi will explain anything you're curious about.</p>
        </div>

        <div className={styles.toolGrid}>
          <form className={`card card--gilded ${styles.tool}`} onSubmit={calcBirth} data-reveal>
            <span className="badge badge--free">ANK · Free</span>
            <h3>Your Mulank & Bhagya Ank</h3>
            <div className="field">
              <label htmlFor="home-dob">Date of birth</label>
              <input id="home-dob" className="input" type="date" required min="1900-01-01" max="2100-12-31" value={dob} onChange={(e) => (setDob(e.target.value), begin("mulank"))} />
            </div>
            <button className="btn" type="submit">
              Reveal my numbers
            </button>
            {nums && (
              <div className={styles.result}>
                <Coin n={nums.m.root} label="Mulank" />
                <Coin n={nums.b.root} label="Bhagya" />
                <p className="small" style={{ margin: 0 }}>
                  <strong>{PERSONAL_MEANING[nums.m.root].title}</strong> by nature, walking the path of <strong>{PERSONAL_MEANING[nums.b.root].title.replace("The ", "the ")}</strong>.{" "}
                  <span className="muted">Bhagya compound {nums.b.compound}.</span>
                </p>
              </div>
            )}
          </form>

          <form className={`card card--gilded ${styles.tool}`} onSubmit={calcHome} data-reveal style={{ ["--reveal-delay" as string]: "80ms" }}>
            <span className="badge badge--free">ANK · Free</span>
            <h3>Your home number</h3>
            <div className="field">
              <label htmlFor="home-num">House or flat number</label>
              <input id="home-num" className="input" placeholder="e.g. 607 or B-1204" value={home} onChange={(e) => (setHome(e.target.value), begin("home-number"))} required />
            </div>
            <button className="btn" type="submit">
              Read my home number
            </button>
            {homeRes && (
              <div className={styles.result}>
                <Coin n={homeRes.root} label="Root" />
                <p className="small" style={{ margin: 0 }}>
                  {homeRes.digits.join(" + ")} = {homeRes.chain.join(" → ")} · <strong>Compound {homeRes.compound} / Root {homeRes.root}</strong>
                  <br />
                  {HOME_MEANING[homeRes.root].title} — {HOME_MEANING[homeRes.root].essence}
                </p>
              </div>
            )}
          </form>

          <div className={`card card--forest ${styles.tool} ${styles.toolSky}`} data-reveal style={{ ["--reveal-delay" as string]: "160ms" }}>
            <span className="badge">DRISHTI · Live</span>
            <h3>The sky, right now</h3>
            {moon ? (
              <>
                <p className={styles.skyBig} data-sakhi={`The Moon is in ${moon.m.nakshatra.name} — ${NAKSHATRA_ESSENCE[moon.m.nakshatra.name]}. Calculated this minute.`}>
                  Moon in <strong>{moon.m.nakshatra.name}</strong>
                </p>
                <p className="small" style={{ opacity: 0.8 }}>
                  {moon.m.rashi.name} {formatDegrees(moon.m.degreeInRashi)} · pada {moon.m.pada} · {moon.t.paksha} {moon.t.name}
                </p>
                <p className="small" style={{ opacity: 0.8 }}>
                  Your own Moon, Lagna and life period take one minute.
                </p>
              </>
            ) : (
              <p className="small">Reading the sky…</p>
            )}
            <Link className="btn" href="/drishti#snapshot">
              Get my free snapshot
            </Link>
          </div>

          <Link href="/vastu" className={`card ${styles.tool} ${styles.toolVastu}`} data-reveal style={{ ["--reveal-delay" as string]: "240ms" }} data-sakhi="Upload a floor plan, confirm North and your rooms — I'll show you its centre and first findings. It's in Beta, so every finding shows its confidence.">
            <span className="badge badge--beta">VASTU · Beta</span>
            <h3>Your home's centre & zones</h3>
            <svg viewBox="0 0 120 120" className={styles.miniPlan} aria-hidden>
              <rect x="14" y="14" width="92" height="92" rx="3" />
              <path d="M14 45h40M54 14v52M54 66h52M78 66v40M14 80h30" />
              <circle className={styles.miniDot} cx="60" cy="60" r="4" />
              <g className={styles.miniWheel}>
                <circle cx="60" cy="60" r="34" />
                <path d="M60 22v-8M60 98v8M22 60h-8M98 60h8" />
              </g>
              <text x="60" y="10" textAnchor="middle">
                N
              </text>
            </svg>
            <span className="link-arrow">Open the studio</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
