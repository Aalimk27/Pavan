"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { bhagyaAnk, homeNumber, isValidDate, mulank, type AnkResult } from "@/lib/ank";
import { track } from "@/lib/analytics";
import { saveHome, usePremMarg } from "@/lib/store";
import { sakhi } from "@/components/sakhi/bus";
import SakhiMark from "@/components/sakhi/SakhiMark";
import type { AnkCardItem } from "@/lib/sakhi/types";
import { CALC_LABEL, DEVANAGARI_DIGIT, grahaLabel, lc, meaningFor, planetOf, reductionText, type CalcKind } from "./ank-data";
import Reduction from "./Reduction";
import MeaningCard from "./MeaningCard";
import ConvergenceOffer from "./ConvergenceOffer";
import s from "./instrument.module.css";
import c from "./convergence.module.css";

const KINDS: CalcKind[] = ["mulank", "bhagya", "home"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const HOME_EXAMPLES = ["607", "B-1204", "14/3A", "Flat 22"];

type Found = { result: AnkResult; input: string; replay: number };
type HomeFound = Found & { ignored: string };

const ordinal = (n: number) => {
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;
};

/** Deterministic observation built only from the published meanings. No predictions, no claims. */
function observe(m?: Found, b?: Found, h?: HomeFound): string[] {
  const out: string[] = [];
  const items: { kind: CalcKind; root: number }[] = [];
  if (m) items.push({ kind: "mulank", root: m.result.root });
  if (b) items.push({ kind: "bhagya", root: b.result.root });
  if (h) items.push({ kind: "home", root: h.result.root });
  if (items.length < 2) return out;

  // Shared roots first — the clearest meeting point.
  const byRoot = new Map<number, CalcKind[]>();
  items.forEach((i) => byRoot.set(i.root, [...(byRoot.get(i.root) ?? []), i.kind]));
  for (const [root, kinds] of byRoot) {
    if (kinds.length < 2) continue;
    const pm = meaningFor("mulank", root);
    const names = kinds.map((k) => CALC_LABEL[k].name);
    const joined = names.length === 3 ? `${names[0]}, ${names[1]} and ${names[2]}` : `${names[0]} and ${names[1]}`;
    out.push(
      `Your ${joined} share the root ${root} — ${planetOf(root).graha}'s number. Its strengths, like ${lc(pm.strengths[0])}, may feel especially familiar; so may its watch-out, ${lc(pm.watchOuts[0])}.`,
    );
  }

  if (m && b && m.result.root !== b.result.root) {
    const mm = meaningFor("mulank", m.result.root);
    const bm = meaningFor("bhagya", b.result.root);
    out.push(
      `Traditionally, Mulank speaks of how you meet the world and Bhagya Ank of the path you walk. Yours pair ${mm.title} (${m.result.root}) with ${bm.title} (${b.result.root}) — ${lc(mm.strengths[0])} alongside ${lc(bm.strengths[0])}.`,
    );
  }

  if (h) {
    const hm = meaningFor("home", h.result.root);
    const person = m ?? b;
    const pm = person ? meaningFor("mulank", person.result.root) : null;
    out.push(`Your home, ${hm.title} (${h.result.root}), ${lc(hm.essence)}`);
    if (pm) out.push(`Worth noticing together: ${lc(pm.watchOuts[0])} in you, and ${lc(hm.watchOuts[0])} at home. A practice to share: ${hm.practice}`);
  }

  return out;
}

export default function AnkInstrument() {
  const [tab, setTab] = useState<CalcKind>("mulank");
  const [mul, setMul] = useState<Found>();
  const [bha, setBha] = useState<Found>();
  const [hom, setHom] = useState<HomeFound>();
  const [derivedMulank, setDerivedMulank] = useState(false);

  const [bd, setBd] = useState({ day: "", month: "", year: "" });
  const [bErr, setBErr] = useState<string>();
  const [homeText, setHomeText] = useState("");
  const [hErr, setHErr] = useState<string>();

  const started = useRef<Set<CalcKind>>(new Set());
  const celebrated = useRef(false);
  const tabRefs = useRef<Record<CalcKind, HTMLButtonElement | null>>({ mulank: null, bhagya: null, home: null });

  const profiles = usePremMarg((st) => st.profiles);
  const homes = usePremMarg((st) => st.homes);

  const start = (k: CalcKind) => {
    if (started.current.has(k)) return;
    started.current.add(k);
    track("calculator_started", { calculator: k, pillar: "ank" });
  };

  const afterFound = (k: CalcKind, r: AnkResult, total: number) => {
    const meaning = meaningFor(k, r.root);
    sakhi.mood("joy", 1800);
    // On narrow screens the stage sits below the inputs — bring the reduction into view.
    if (window.matchMedia("(max-width: 860px)").matches) {
      window.setTimeout(() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        document.getElementById("ank-stage")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }, 60);
    }
    if (total >= 3 && !celebrated.current) {
      celebrated.current = true;
      sakhi.celebrate("All three of your numbers are here. See where they meet, just below.");
      return;
    }
    const lead =
      k === "home"
        ? `Home number: compound ${r.compound}, root ${r.root} — the ${meaning.title}.`
        : `${CALC_LABEL[k].name} ${r.root} — ${meaning.title}${r.compound !== r.root ? `, from compound ${r.compound}` : ""}.`;
    sakhi.whisper(`${lead} ${meaning.essence}`, { selector: "#ank-stage", ms: 6500 });
  };

  const known = (overrides: Partial<Record<CalcKind, boolean>> = {}) =>
    KINDS.filter((k) => overrides[k] ?? (k === "mulank" ? !!mul : k === "bhagya" ? !!bha : !!hom)).length;

  /* ── Mulank ── */
  const pickDay = (day: number) => {
    start("mulank");
    const r = mulank(day);
    setMul((prev) => ({ result: r, input: String(day), replay: (prev?.replay ?? 0) + 1 }));
    setDerivedMulank(false);
    afterFound("mulank", r, known({ mulank: true }));
  };

  /* ── Bhagya ── */
  const submitBhagya = (e?: FormEvent) => {
    e?.preventDefault();
    start("bhagya");
    const d = Number(bd.day);
    const mo = Number(bd.month);
    const y = Number(bd.year);
    if (!bd.day || !bd.month || !bd.year) return setBErr("Please enter the day, month and year of birth.");
    if (!isValidDate(y, mo, d)) return setBErr("That date doesn't exist on the calendar — please check the day, month and year.");
    setBErr(undefined);
    const r = bhagyaAnk(y, mo, d);
    setBha((prev) => ({ result: r, input: `${d}-${mo}-${y}`, replay: (prev?.replay ?? 0) + 1 }));
    let addMul = false;
    if (!mul || derivedMulank) {
      addMul = true;
      setMul((prev) => ({ result: mulank(d), input: String(d), replay: (prev?.replay ?? 0) + 1 }));
      setDerivedMulank(true);
    }
    afterFound("bhagya", r, known({ bhagya: true, mulank: addMul || !!mul }));
  };

  const fillFromProfile = (date: string) => {
    const [y, m, d] = date.split("-").map(Number);
    setBd({ day: String(d), month: String(m), year: String(y) });
    setBErr(undefined);
  };

  /* ── Home ── */
  const submitHome = (value = homeText, e?: FormEvent) => {
    e?.preventDefault();
    start("home");
    const v = value.trim();
    if (!v) return setHErr("Please type your home or flat number — for example 607 or B-1204.");
    try {
      const r = homeNumber(v);
      setHErr(undefined);
      setHom((prev) => ({ result: r, ignored: r.ignored, input: v, replay: (prev?.replay ?? 0) + 1 }));
      afterFound("home", r, known({ home: true }));
    } catch (err) {
      setHErr(err instanceof Error ? err.message : "Please include the digits of your home number.");
    }
  };

  const saveThisHome = () => {
    if (!hom) return;
    saveHome({ label: `Home ${hom.input}`, number: hom.input, root: hom.result.root });
    sakhi.celebrate(`Saved. Home ${hom.input} — root ${hom.result.root} — now lives in My Prem Marg on this device.`);
  };
  const homeSaved = !!hom && homes.some((h) => h.number === hom.input);

  /* ── Tabs ── */
  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    const i = KINDS.indexOf(tab);
    let n: number | null = null;
    if (e.key === "ArrowRight") n = (i + 1) % 3;
    if (e.key === "ArrowLeft") n = (i + 2) % 3;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = 2;
    if (n === null) return;
    e.preventDefault();
    setTab(KINDS[n]);
    tabRefs.current[KINDS[n]]?.focus();
  };

  const goTo = (k: CalcKind) => {
    setTab(k);
    document.getElementById("calculate")?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => tabRefs.current[k]?.focus({ preventScroll: true }), 500);
  };

  const current: Found | undefined = tab === "mulank" ? mul : tab === "bhagya" ? bha : hom;
  const results: Record<CalcKind, Found | undefined> = { mulank: mul, bhagya: bha, home: hom };
  const count = KINDS.filter((k) => results[k]).length;
  const notes = observe(mul, bha, hom);

  const askSakhi = () => {
    const items: AnkCardItem[] = KINDS.flatMap((k) => {
      const f = results[k];
      if (!f) return [];
      const m = meaningFor(k, f.result.root);
      return [{ label: CALC_LABEL[k].name, source: k === "home" ? f.input : CALC_LABEL[k].source, compound: f.result.compound, root: f.result.root, chain: f.result.chain, title: m.title, essence: m.essence }];
    });
    sakhi.say("Here are your numbers side by side. Ask me anything about them — strengths, watch-outs, or a practice to begin with.", {
      cards: [{ kind: "ank", items, note: "No number is good or bad." }],
      chips: ["What practice should I start with?", "What is a compound number?", "Should I change my house number?"],
      open: true,
    });
  };

  return (
    <>
      {/* ───────────── The instrument ───────────── */}
      <section id="calculate" className={`section ${s.section}`} aria-labelledby="calc-title">
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">
              Three free calculators <span className="badge badge--free">Free</span>
            </p>
            <h2 id="calc-title">
              Find your numbers, <em className="accent">see every step.</em>
            </h2>
            <p className="lead">Nothing is hidden. Watch the digits gather into a compound, then a root — and keep both. Calculated in your browser; nothing is sent anywhere.</p>
          </div>

          <div className={s.instrument}>
            <div className={s.tabs} role="tablist" aria-label="ANK calculators">
              {KINDS.map((k) => {
                const f = results[k];
                return (
                  <button
                    key={k}
                    ref={(el) => {
                      tabRefs.current[k] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`tab-${k}`}
                    aria-selected={tab === k}
                    aria-controls={`panel-${k}`}
                    tabIndex={tab === k ? 0 : -1}
                    className={s.tab}
                    onClick={() => setTab(k)}
                    onKeyDown={onTabKey}
                  >
                    <span className={s.tabCoin} data-known={f ? "" : undefined} aria-hidden>
                      {f ? f.result.root : "·"}
                    </span>
                    <span className={s.tabText}>
                      <span className={s.tabName}>{CALC_LABEL[k].name}</span>
                      <span className={s.tabSource}>{CALC_LABEL[k].source}</span>
                    </span>
                    {f && <span className="visually-hidden">, root {f.result.root}</span>}
                  </button>
                );
              })}
            </div>

            <div className={s.body}>
              {/* Inputs */}
              <div className={s.inputs}>
                <div role="tabpanel" id="panel-mulank" aria-labelledby="tab-mulank" hidden={tab !== "mulank"} className={s.panel}>
                  <fieldset className={s.fieldset}>
                    <legend className={s.legend}>On which day of the month were you born?</legend>
                    <p className="hint">Mulank comes from the day alone — the month and year are not used.</p>
                    <div className={s.days} onFocus={() => start("mulank")}>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <label key={d} className={s.day} data-on={mul?.input === String(d) || undefined}>
                          <input type="radio" name="ank-day" value={d} checked={mul?.input === String(d)} onChange={() => pickDay(d)} className={s.dayInput} />
                          <span>{d}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </div>

                <div role="tabpanel" id="panel-bhagya" aria-labelledby="tab-bhagya" hidden={tab !== "bhagya"} className={s.panel}>
                  <form onSubmit={submitBhagya} noValidate>
                    <fieldset className={s.fieldset}>
                      <legend className={s.legend}>Your full date of birth</legend>
                      <p className="hint">Bhagya Ank adds every digit of the day, month and year.</p>
                      <div className={s.dateRow} onFocus={() => start("bhagya")}>
                        <div className="field">
                          <label htmlFor="ank-bd-day">Day</label>
                          <input id="ank-bd-day" className="input" inputMode="numeric" autoComplete="bday-day" maxLength={2} placeholder="29" value={bd.day} onChange={(e) => setBd({ ...bd, day: e.target.value.replace(/\D/g, "") })} aria-invalid={!!bErr} aria-describedby={bErr ? "ank-bd-err" : undefined} />
                        </div>
                        <div className="field">
                          <label htmlFor="ank-bd-month">Month</label>
                          <select id="ank-bd-month" className="select" autoComplete="bday-month" value={bd.month} onChange={(e) => setBd({ ...bd, month: e.target.value })} aria-invalid={!!bErr}>
                            <option value="">Month</option>
                            {MONTHS.map((m, i) => (
                              <option key={m} value={i + 1}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="field">
                          <label htmlFor="ank-bd-year">Year</label>
                          <input id="ank-bd-year" className="input" inputMode="numeric" autoComplete="bday-year" maxLength={4} placeholder="1992" value={bd.year} onChange={(e) => setBd({ ...bd, year: e.target.value.replace(/\D/g, "") })} aria-invalid={!!bErr} aria-describedby={bErr ? "ank-bd-err" : undefined} />
                        </div>
                      </div>
                    </fieldset>
                    {profiles.length > 0 && (
                      <div className={s.profiles}>
                        <span className="hint">From My Prem Marg:</span>
                        {profiles.slice(0, 3).map((p) => (
                          <button key={p.id} type="button" className={s.chip} onClick={() => fillFromProfile(p.date)}>
                            {p.name || "Saved profile"} · {p.date.split("-").reverse().join("/")}
                          </button>
                        ))}
                      </div>
                    )}
                    {bErr && (
                      <p id="ank-bd-err" className="error-text" role="alert">
                        {bErr}
                      </p>
                    )}
                    <button type="submit" className="btn btn--forest">
                      Reveal my Bhagya Ank
                    </button>
                  </form>
                </div>

                <div role="tabpanel" id="panel-home" aria-labelledby="tab-home" hidden={tab !== "home"} className={s.panel}>
                  <form onSubmit={(e) => submitHome(homeText, e)} noValidate>
                    <div className="field">
                      <label htmlFor="ank-home" className={s.legend}>
                        Your house, flat or door number
                      </label>
                      <input
                        id="ank-home"
                        className={`input ${s.homeInput}`}
                        placeholder="e.g. B-1204"
                        autoComplete="off"
                        maxLength={24}
                        value={homeText}
                        onFocus={() => start("home")}
                        onChange={(e) => setHomeText(e.target.value)}
                        aria-invalid={!!hErr}
                        aria-describedby={hErr ? "ank-home-err ank-home-hint" : "ank-home-hint"}
                      />
                      <p id="ank-home-hint" className="hint">
                        Use the number on your own door. Only its digits are added — letters and symbols are set aside.
                      </p>
                    </div>
                    <div className={s.profiles}>
                      <span className="hint">Try:</span>
                      {HOME_EXAMPLES.map((ex) => (
                        <button
                          key={ex}
                          type="button"
                          className={s.chip}
                          onClick={() => {
                            setHomeText(ex);
                            submitHome(ex);
                          }}
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                    {hErr && (
                      <p id="ank-home-err" className="error-text" role="alert">
                        {hErr}
                      </p>
                    )}
                    <button type="submit" className="btn btn--forest">
                      Reveal the home number
                    </button>
                  </form>
                </div>
              </div>

              {/* Stage: the reduction */}
              <div id="ank-stage" className={s.stage} aria-live="polite">
                {current ? (
                  <div key={`${tab}-${current.replay}`} className={s.stageIn}>
                    <p className={s.stageKicker}>
                      {tab === "mulank" && <>Born on the {ordinal(Number(current.input))}</>}
                      {tab === "bhagya" && <>Born {current.input.split("-").map((x, i) => (i === 1 ? MONTHS[Number(x) - 1] : x)).join(" ")}</>}
                      {tab === "home" && <>Home {current.input}</>}
                    </p>
                    <Reduction result={current.result} />
                    <div className={s.rootCoin} data-sakhi={`${current.result.root} is ruled by ${grahaLabel(current.result.root, " — ")}.`}>
                      <span className={s.rootCoinNum}>{current.result.root}</span>
                      <span className={`${s.rootCoinDeva} sanskrit`} aria-hidden>
                        {DEVANAGARI_DIGIT[current.result.root]}
                      </span>
                      <span className={s.rootCoinGraha}>{planetOf(current.result.root).graha}</span>
                    </div>
                    {tab === "mulank" && derivedMulank && <p className={s.stageNote}>Found from the day in your Bhagya Ank date.</p>}
                  </div>
                ) : (
                  <div className={s.stageEmpty}>
                    <div className={s.ghostCoin} aria-hidden>
                      ?
                    </div>
                    <p>
                      {tab === "mulank" && "Choose your day of birth — the reduction appears here."}
                      {tab === "bhagya" && "Enter your full date of birth — every digit will gather here."}
                      {tab === "home" && "Type your door number — we'll show which digits count, and why."}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {current && (
              <div className={s.after}>
                {tab === "home" && hom && (
                  <div className={s.homeExtras}>
                    <p className={s.digitsNote} data-sakhi="In this method only the digits on the door are added. Block letters, wings and separators mark the place, not the number.">
                      We counted the digits <strong>{hom.result.digits.join(", ")}</strong>.
                      {hom.ignored ? (
                        <>
                          {" "}
                          The {/[a-z]/i.test(hom.ignored) ? "letters and symbols" : "symbols"} <strong className={s.ignored}>{hom.ignored.split("").join(" ")}</strong> are set aside — in this method they mark the block or wing, not the number itself.
                        </>
                      ) : (
                        " There was nothing to set aside."
                      )}
                    </p>
                    <div className={s.saveRow}>
                      {homeSaved ? (
                        <p className={s.saved} role="status">
                          ✓ Saved to <Link href="/my">My Prem Marg</Link>
                        </p>
                      ) : (
                        <button type="button" className="btn btn--sm" onClick={saveThisHome} data-sakhi="Saving keeps this home and its root in My Prem Marg — on this device only, until accounts launch.">
                          Save this home to My Prem Marg
                        </button>
                      )}
                    </div>
                  </div>
                )}
                <MeaningCard
                  key={`${tab}-${current.result.root}`}
                  n={current.result.root}
                  meaning={meaningFor(tab, current.result.root)}
                  kicker={`${CALC_LABEL[tab].name} ${current.result.root}`}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ───────────── Convergence ───────────── */}
      <section id="convergence" className={`section section--forest ${c.section}`} aria-labelledby="conv-title">
        <div className={c.glow} aria-hidden />
        <div className="container">
          <div className="section-head section-head--center">
            <p className="eyebrow eyebrow--center">Convergence preview</p>
            <h2 id="conv-title">
              Where your numbers <em className="gold-text">meet.</em>
            </h2>
            <p className="lead">When two or three of your numbers are known, they are set side by side here — Mulank, Bhagya Ank and the number on your door.</p>
          </div>

          <ol className={c.coins} aria-label="Your numbers">
            {KINDS.map((k, i) => {
              const f = results[k];
              const m = f ? meaningFor(k, f.result.root) : null;
              return (
                <li key={k} className={c.coinItem} style={{ ["--d" as string]: `${i * 120}ms` }}>
                  {f && m ? (
                    <div
                      className={c.coin}
                      data-sakhi={`${CALC_LABEL[k].name}: ${reductionText(f.result)}. ${m.title} — ${m.essence}`}
                      tabIndex={0}
                      aria-label={`${CALC_LABEL[k].name}: compound ${f.result.compound}, root ${f.result.root}, ${m.title}`}
                    >
                      <span className={c.coinNum}>{f.result.root}</span>
                      <span className={c.coinGraha}>{planetOf(f.result.root).graha}</span>
                    </div>
                  ) : (
                    <button type="button" className={c.coinEmpty} onClick={() => goTo(k)} aria-label={`Find your ${CALC_LABEL[k].name}`}>
                      <span aria-hidden>?</span>
                    </button>
                  )}
                  <p className={c.coinLabel}>{CALC_LABEL[k].name}</p>
                  {f && m ? (
                    <p className={c.coinSub}>
                      <span className={c.nowrap}>Compound {f.result.compound}</span> <span className={c.nowrap}>/ Root {f.result.root}</span>
                      <br />
                      <em>{m.title}</em>
                    </p>
                  ) : (
                    <button type="button" className={c.coinFind} onClick={() => goTo(k)}>
                      Find it →
                    </button>
                  )}
                </li>
              );
            })}
          </ol>

          {count >= 2 ? (
            <div className={c.grid}>
              <article className={c.observation} aria-labelledby="obs-title">
                <div className={c.obsHead}>
                  <SakhiMark size={44} barbs={false} decorative />
                  <div>
                    <p className={c.obsKicker}>A free observation</p>
                    <h3 id="obs-title" className={c.obsTitle}>
                      {count} numbers, side by side
                    </h3>
                  </div>
                </div>
                <div className={c.obsBody}>
                  {notes.map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
                <p className={c.obsFine}>This observation only places the published meanings side by side. It is not a prediction, and no number needs correcting.</p>
                <button type="button" className={`link-arrow ${c.askBtn}`} onClick={askSakhi}>
                  Ask Sakhi about these numbers
                </button>
              </article>
              <ConvergenceOffer known={count} />
            </div>
          ) : (
            <p className={c.waiting}>
              {count === 0 ? "Find any two of your numbers above and the convergence appears here." : "One more number and the convergence appears here."}
            </p>
          )}

          {hom && (
            <aside className={c.vastu} aria-labelledby="vastu-next">
              <div>
                <p className={c.vastuKicker}>
                  One next step for your home <span className="badge badge--beta">Beta</span>
                </p>
                <h3 id="vastu-next" className={c.vastuTitle}>
                  A door number is one thread. VASTU reads the whole plan.
                </h3>
                <p className={c.vastuText}>Upload a floor plan and see the free VASTU preview — Brahmasthan, the 16 directions and practical, non-fearful remedies.</p>
              </div>
              <Link href="/vastu" className="link-arrow" data-sakhi="VASTU looks at the actual layout of your home — entrance, kitchen, bedrooms, the centre. It's in Beta, and the preview is free.">
                Check your floor plan
              </Link>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
