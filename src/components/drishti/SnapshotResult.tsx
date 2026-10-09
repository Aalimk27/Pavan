"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CALC_VERSION, GRAHA_SANSKRIT, formatDegrees, norm360, type Graha } from "@/lib/astro/engine";
import { formatOffset } from "@/lib/astro/time";
import { ANK_PLANET, ANK_PLANET_EN, PERSONAL_MEANING, bhagyaAnk, describeChain, mulank, type AnkResult } from "@/lib/ank";
import { DASHA_THEME, LAGNA_NOTE, NAKSHATRA_ESSENCE, RASHI_NATURE } from "@/lib/content/drishti";
import { track } from "@/lib/analytics";
import { saveProfile, usePremMarg } from "@/lib/store";
import { sakhi } from "@/components/sakhi/bus";
import SakhiMark from "@/components/sakhi/SakhiMark";
import DashaBand from "./DashaBand";
import RashiChakra from "./RashiChakra";
import { RASHI_DEVANAGARI, fmtDate } from "./wheel";
import { dateLabel, hhmm, isoDate, toCardData, type SnapshotRun } from "./snapshot";
import styles from "./result.module.css";

const grahaName = (g: Graha) => (GRAHA_SANSKRIT[g] === g ? g : `${g} (${GRAHA_SANSKRIT[g]})`);

function pct(start: Date, end: Date, now: Date) {
  return Math.min(100, Math.max(0, ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100));
}

function AnkCard({ kind, r, source }: { kind: "Mulank" | "Bhagya Ank"; r: AnkResult; source: string }) {
  const meaning = PERSONAL_MEANING[r.root];
  const planet = ANK_PLANET[r.root];
  const compound = r.chain.length > 1;
  return (
    <div
      className={styles.ank}
      data-sakhi={
        kind === "Mulank"
          ? `Your Mulank comes from the day you were born — ${r.root}, ${planet}'s number. It describes how you tend to act day to day; it is never a verdict.`
          : `Your Bhagya Ank adds every digit of your birth date — ${r.root}, ${planet}'s number. Read it as a direction your efforts tend to take.`
      }
    >
      <div className={styles.ankDigit} aria-hidden>
        {r.root}
      </div>
      <div>
        <p className={styles.kicker}>{kind}</p>
        <p className={styles.ankTitle}>
          {meaning.title} · <span className={styles.dim}>{planet} ({ANK_PLANET_EN[planet]})</span>
        </p>
        <p className={styles.ankChain}>
          {source}: {describeChain(r)}
          {compound ? ` · Compound ${r.compound} / Root ${r.root}` : ` · Root ${r.root}`}
        </p>
        <p className={styles.ankEssence}>{meaning.essence}</p>
      </div>
    </div>
  );
}

export default function SnapshotResult({ run, onReset }: { run: SnapshotRun; onReset: () => void }) {
  const { snap: s, params: p } = run;
  const rootRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const announced = useRef<number | null>(null);
  const profiles = usePremMarg((st) => st.profiles);
  const [justSaved, setJustSaved] = useState(false);

  const date = isoDate(p);
  const time = hhmm(p);
  const saved = profiles.some((x) => x.date === date && x.time === time && x.place === p.place.label);
  const now = run.computedAt;
  const maha = s.dasha.mahadasha;
  const antar = s.dasha.antardasha;
  const next = s.dasha.nextMahadasha;
  const mul = mulank(p.day);
  const bhagya = bhagyaAnk(p.year, p.month, p.day);
  const moonNature = RASHI_NATURE[s.moon.rashi.name];
  const elong = norm360(s.moon.longitude - s.sun.longitude);
  const who = p.name ? `${p.name}’s` : "Your";

  useEffect(() => {
    if (announced.current === run.id) return;
    announced.current = run.id;
    track("report_previewed", { product: "drishti_snapshot", time_known: run.timeKnown, confidence: s.confidence });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rootRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    headingRef.current?.focus({ preventScroll: true });
    const t1 = window.setTimeout(
      () => sakhi.celebrate(`${who === "Your" ? "Your" : who} snapshot is ready — Moon in ${s.moon.rashi.name}, ${s.moon.nakshatra.name} Nakshatra. Calculated, not guessed.`),
      600,
    );
    const t2 = window.setTimeout(
      () => sakhi.whisper("The glowing mark on your life timeline is where you are now. Tap any chapter to read what it invites.", { selector: "#dasha-band" }),
      9000,
    );
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run.id]);

  const onSave = () => {
    saveProfile({
      name: p.name || "My chart",
      date,
      time,
      place: p.place.label,
      lat: p.place.lat,
      lon: p.place.lon,
      tz: p.place.tz,
      summary: { lagna: s.lagna?.rashi.name, moon: s.moon.rashi.name, nakshatra: s.moon.nakshatra.name, mahadasha: maha.lord },
    });
    setJustSaved(true);
    sakhi.celebrate("Saved to My Prem Marg. It stays on this device, private to you.");
  };

  const onAsk = () => {
    sakhi.say(
      `Here is ${p.name ? `${p.name}’s` : "your"} snapshot. Your Moon rests in ${s.moon.rashi.name} in ${s.moon.nakshatra.name} Nakshatra, and you are in the ${grahaName(maha.lord)} Mahadasha until ${fmtDate(maha.end)}. Ask me anything about it.`,
      { cards: [{ kind: "snapshot", data: toCardData(run) }], chips: ["What does my Nakshatra mean?", "What is DRISHTI Core?"] },
    );
  };

  return (
    <section ref={rootRef} className={styles.result} aria-labelledby="snapshot-result-title">
      <div className={styles.glow} aria-hidden />

      {/* ── header ── */}
      <header className={styles.head}>
        <div>
          <p className={styles.eyebrow}>Your DRISHTI snapshot</p>
          <h2 id="snapshot-result-title" ref={headingRef} tabIndex={-1} className={styles.title}>
            {who} sky <em>at birth</em>
          </h2>
          <p className={styles.meta}>
            {dateLabel(p)} · {time ?? "time unknown"} · {p.place.label} · {formatOffset(run.offsetMinutes)}
          </p>
        </div>
        <div className={styles.flags}>
          {!run.timeKnown && s.confidence === "high" ? (
            <span className={`${styles.flag} ${styles.flagCheck}`} data-sakhi="Without a birth time I read the Moon at local noon. Your Sun is certain; anything the Moon touches is approximate until you add a time.">
              ◐ Read at local noon
            </span>
          ) : s.confidence === "high" ? (
            <span className={`${styles.flag} ${styles.flagOk}`} data-sakhi="Every position sits comfortably away from a sign or nakshatra boundary, so small time differences won't change these results.">
              ✓ High confidence
            </span>
          ) : (
            <span className={`${styles.flag} ${styles.flagCheck}`} data-sakhi="One position sits within a quarter-degree of a boundary. A few minutes' difference in birth time could change it.">
              ◐ Check birth time
            </span>
          )}
          {!run.timeKnown && (
            <span className={`${styles.flag} ${styles.flagCheck}`} data-sakhi="The Lagna changes sign roughly every two hours, so without your birth time I leave it out rather than guess.">
              Lagna withheld
            </span>
          )}
        </div>
      </header>

      {/* ── wheel + facts ── */}
      <div className={styles.grid}>
        <div className={styles.wheelCol}>
          <RashiChakra
            id="natal"
            label={`Your Rashi Chakra at birth: Moon in ${s.moon.rashi.name}, Sun in ${s.sun.rashi.name}${s.lagna ? `, Lagna in ${s.lagna.rashi.name}` : ""}. Use the arrow keys to explore each ring.`}
            moon={s.moon}
            sun={s.sun}
            lagna={s.lagna}
            hub={{
              kicker: "Your Moon",
              title: s.moon.nakshatra.name,
              lines: [`${s.moon.rashi.name} ${formatDegrees(s.moon.degreeInRashi)}`, `Pada ${s.moon.pada}`],
            }}
          />
          <ul className={styles.legend} aria-label="Wheel legend">
            <li>
              <span className={styles.lgMoon} aria-hidden /> Moon · phase as at birth
            </li>
            <li>
              <span className={styles.lgSun} aria-hidden /> Sun
            </li>
            {s.lagna && (
              <li>
                <span className={styles.lgLagna} aria-hidden /> Lagna
              </li>
            )}
          </ul>
        </div>

        <div className={styles.facts}>
          {/* Lagna */}
          <article
            className={`${styles.fact} ${s.lagna ? "" : styles.factWithheld}`}
            data-sakhi="Lagna is the sign rising on the eastern horizon at your birth. It shapes how you meet the world — and it needs an exact birth time."
          >
            <p className={styles.kicker}>Lagna · Ascendant</p>
            {s.lagna ? (
              <>
                <p className={styles.factValue}>
                  {s.lagna.rashi.name} <span className={`${styles.deva} sanskrit`}>{RASHI_DEVANAGARI[s.lagna.rashi.index]}</span>
                </p>
                <p className={styles.factSub}>
                  {s.lagna.rashi.english} · {formatDegrees(s.lagna.degreeInRashi)}
                </p>
                <p className={styles.factText}>{LAGNA_NOTE[s.lagna.rashi.name]}</p>
              </>
            ) : (
              <>
                <p className={styles.factValue}>Withheld</p>
                <p className={styles.factSub}>Needs an exact birth time</p>
                <p className={styles.factText}>The rising sign moves through all twelve rashis in a single day, so we won&rsquo;t guess it. Add your time later and it will appear here.</p>
              </>
            )}
          </article>

          {/* Moon */}
          <article
            className={styles.fact}
            data-sakhi="Your Moon rashi describes your mind and emotional nature. In Vedic tradition it matters as much as the Sun — often more."
          >
            <p className={styles.kicker}>Moon rashi · Chandra</p>
            <p className={styles.factValue}>
              {s.moon.rashi.name} <span className={`${styles.deva} sanskrit`}>{RASHI_DEVANAGARI[s.moon.rashi.index]}</span>
            </p>
            <p className={styles.factSub}>
              {s.moon.rashi.english} · {formatDegrees(s.moon.degreeInRashi)}
            </p>
            <p className={styles.factText}>
              {moonNature.mind.charAt(0).toUpperCase() + moonNature.mind.slice(1)}. Your gift: {moonNature.gift}.
            </p>
          </article>

          {/* Nakshatra */}
          <article
            className={`${styles.fact} ${styles.factStar}`}
            data-sakhi={`A Nakshatra is one of 27 lunar mansions, each 13°20′ wide. ${s.moon.nakshatra.name}'s lord, ${s.moon.nakshatra.lord}, began your dasha sequence.`}
          >
            <p className={styles.kicker}>Janma Nakshatra</p>
            <p className={styles.factValue}>{s.moon.nakshatra.name}</p>
            <p className={styles.factSub}>
              Pada {s.moon.pada} · deity {s.moon.nakshatra.deity} · lord {s.moon.nakshatra.lord}
            </p>
            <p className={styles.factText}>
              {NAKSHATRA_ESSENCE[s.moon.nakshatra.name].charAt(0).toUpperCase() + NAKSHATRA_ESSENCE[s.moon.nakshatra.name].slice(1)}.
            </p>
          </article>

          {/* Sun */}
          <article
            className={styles.fact}
            data-sakhi="The Sun's rashi speaks of soul, purpose and vitality. Vedic positions sit about 24° behind Western ones, so this may differ from the sun sign you know."
          >
            <p className={styles.kicker}>Sun rashi · Surya</p>
            <p className={styles.factValue}>
              {s.sun.rashi.name} <span className={`${styles.deva} sanskrit`}>{RASHI_DEVANAGARI[s.sun.rashi.index]}</span>
            </p>
            <p className={styles.factSub}>
              {s.sun.rashi.english} · {formatDegrees(s.sun.degreeInRashi)}
            </p>
            <p className={styles.factText}>
              Sidereal, so it may differ from your Western sun sign. Born with the Moon {Math.round(((1 - Math.cos((elong * Math.PI) / 180)) / 2) * 100)}% lit, in the{" "}
              {elong < 180 ? "waxing (Shukla)" : "waning (Krishna)"} fortnight.
            </p>
          </article>
        </div>
      </div>

      {/* ── honesty notes ── */}
      {(s.confidence === "check-time" || run.range) && (
        <div className={styles.notes}>
          {s.confidence === "check-time" && (
            <p className={styles.noteLine}>
              <strong>Check your birth time.</strong> One of these positions sits within a quarter-degree of a boundary, so a few minutes&rsquo; difference could change it. If your time is approximate, treat the borderline result with care.
            </p>
          )}
          {run.range && (
            <p className={styles.noteLine}>
              <strong>Read at local noon.</strong>{" "}
              {run.range.nakshatra
                ? `On that day the Moon moved from ${run.range.nakshatra[0]} into ${run.range.nakshatra[1]} — without your time, your Nakshatra could be either. `
                : `The Moon stayed in ${s.moon.nakshatra.name} all day, so your Nakshatra holds. `}
              {run.range.rashi && `It also crossed from ${run.range.rashi[0]} into ${run.range.rashi[1]}. `}
              {run.range.maha
                ? `Your current Mahadasha could be ${run.range.maha[0]} or ${run.range.maha[1]} depending on the hour.`
                : run.range.mahaEnd && `Your current Mahadasha ends somewhere between ${fmtDate(run.range.mahaEnd[0])} and ${fmtDate(run.range.mahaEnd[1])}, depending on the hour.`}
            </p>
          )}
        </div>
      )}

      {/* ── life timeline ── */}
      <div className={styles.block}>
        <div className={styles.blockHead}>
          <p className={styles.eyebrow}>Vimshottari dasha</p>
          <h3 className={styles.h3}>Your life, in chapters</h3>
          <p className={styles.lede}>
            Nine planetary periods unfold in a fixed order across a 120-year cycle, beginning from the lord of your Nakshatra. Each chapter invites something different — none is a verdict.
          </p>
        </div>
        <DashaBand birth={run.utc} moonLongitude={s.moon.longitude} timeline={s.dasha.timeline} now={now} current={maha} />
      </div>

      {/* ── now ── */}
      <div className={styles.nowGrid}>
        <article className={styles.now} data-sakhi={`A Mahadasha is a long chapter of life. ${maha.lord}'s period is about ${DASHA_THEME[maha.lord].theme}.`}>
          <p className={styles.kicker}>Mahadasha · now</p>
          <p className={styles.nowValue}>{grahaName(maha.lord)}</p>
          <p className={styles.nowDates}>
            {fmtDate(maha.start)} → <strong>until {fmtDate(maha.end)}</strong>
          </p>
          <div className={styles.progress} role="img" aria-label={`${Math.round(pct(maha.start, maha.end, now))}% of this Mahadasha has passed`}>
            <span style={{ width: `${pct(maha.start, maha.end, now)}%` }} />
          </div>
          <p className={styles.factText}>
            A chapter of <strong>{DASHA_THEME[maha.lord].theme}</strong>.
          </p>
          <p className={styles.cultivate}>
            <span>To cultivate</span> {DASHA_THEME[maha.lord].cultivate}
          </p>
        </article>
        <article className={styles.now} data-sakhi={`Within each Mahadasha run nine shorter sub-periods. Right now ${antar.lord} colours the chapter with ${DASHA_THEME[antar.lord].theme}.`}>
          <p className={styles.kicker}>Antardasha · now</p>
          <p className={styles.nowValue}>{grahaName(antar.lord)}</p>
          <p className={styles.nowDates}>
            {fmtDate(antar.start)} → <strong>until {fmtDate(antar.end)}</strong>
          </p>
          <div className={styles.progress} role="img" aria-label={`${Math.round(pct(antar.start, antar.end, now))}% of this Antardasha has passed`}>
            <span style={{ width: `${pct(antar.start, antar.end, now)}%` }} />
          </div>
          <p className={styles.factText}>
            Within it, a sub-period of <strong>{DASHA_THEME[antar.lord].theme}</strong>.
          </p>
          {next && (
            <p className={styles.cultivate}>
              <span>Next chapter</span> {grahaName(next.lord)} Mahadasha begins {fmtDate(next.start)}.
            </p>
          )}
        </article>
      </div>

      {/* ── numbers ── */}
      <div className={styles.block}>
        <div className={styles.blockHead}>
          <p className={styles.eyebrow}>ANK · from the same date</p>
          <h3 className={styles.h3}>Your numbers</h3>
        </div>
        <div className={styles.ankGrid}>
          <AnkCard kind="Mulank" r={mul} source={`Day ${p.day}`} />
          <AnkCard kind="Bhagya Ank" r={bhagya} source={`${p.day}·${p.month}·${p.year}`} />
        </div>
        <Link href="/ank" className={`link-arrow ${styles.ankLink}`}>
          Explore your numbers, and your home&rsquo;s, in ANK
        </Link>
      </div>

      {/* ── actions ── */}
      <div className={styles.actions}>
        <div className={styles.actionRow}>
          {saved ? (
            <span className={styles.savedPill} role="status">
              ✓ {justSaved ? "Saved" : "Already saved"} to My Prem Marg · <Link href="/my">Open</Link>
            </span>
          ) : (
            <button type="button" className="btn" onClick={onSave}>
              Save to My Prem Marg
            </button>
          )}
          <button type="button" className={`btn btn--ghost ${styles.askBtn}`} onClick={onAsk}>
            <SakhiMark size={26} barbs={false} decorative /> Ask Sakhi about this
          </button>
          <button type="button" className={styles.textBtn} onClick={onReset}>
            Calculate another
          </button>
        </div>
        <div className={styles.upsell}>
          <p>
            <strong>This is the doorway.</strong> The full DRISHTI reading builds 13 premium infographics — career, wealth, relationships, timing and dharma — from these same calculations.
          </p>
          <a href="#tiers" className="link-arrow">
            Compare the readings
          </a>
        </div>
        <p className={styles.transparency}>
          <span>{CALC_VERSION}</span> · sidereal · Lahiri ayanamsa ({formatDegrees(s.ayanamsa)} at birth) · Meeus algorithms · regression-tested against Swiss Ephemeris · birth instant {run.utc.toISOString().slice(0, 16).replace("T", " ")} UTC
        </p>
      </div>
    </section>
  );
}
