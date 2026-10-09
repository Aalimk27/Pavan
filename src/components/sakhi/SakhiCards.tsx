"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { SakhiCard } from "@/lib/sakhi/types";
import { gitaById } from "@/lib/content/gita";
import { kathaBySlug } from "@/lib/content/katha";
import { gurukulBySlug } from "@/lib/content/gurukul";
import { moonNow, tithiNow, formatDegrees, GRAHA_SANSKRIT, type Graha } from "@/lib/astro/engine";
import { NAKSHATRA_ESSENCE, DASHA_THEME } from "@/lib/content/drishti";
import { DRISHTI_TIERS, formatPrice } from "@/lib/products";
import { ROOM_LABEL, ZONE_INFO, bestZonesFor, goodZonesFor, whyFor } from "@/lib/vastu/engine";
import { useSakhi } from "./SakhiProvider";
import { speakSanskrit } from "./voice";

function Sky() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(t);
  }, []);
  const m = moonNow(now);
  const t = tithiNow(now);
  return (
    <div className="sk-card sk-card--dark">
      <div className="sk-card__kicker">The sky · right now</div>
      <p className="sk-card__title">
        Moon in {m.nakshatra.name}, {m.rashi.name}
      </p>
      <div className="sk-card__grid">
        <div className="sk-stat">
          <div className="sk-stat__label">Nakshatra</div>
          <div className="sk-stat__value">
            {m.nakshatra.name} · pada {m.pada}
          </div>
        </div>
        <div className="sk-stat">
          <div className="sk-stat__label">Tithi</div>
          <div className="sk-stat__value">
            {t.paksha} {t.name}
          </div>
        </div>
      </div>
      <p className="small" style={{ margin: 0, opacity: 0.75 }}>
        {m.rashi.name} {formatDegrees(m.degreeInRashi)} sidereal · essence: {NAKSHATRA_ESSENCE[m.nakshatra.name]}.
      </p>
    </div>
  );
}

export default function SakhiCards({ cards }: { cards: SakhiCard[] }) {
  const s = useSakhi();
  return (
    <div className="sk-cards">
      {cards.map((c, i) => {
        switch (c.kind) {
          case "ank":
            return (
              <div className="sk-card" key={i}>
                <div className="sk-card__kicker">ANK · calculated</div>
                {c.items.map((it) => (
                  <div className="sk-num" key={it.label}>
                    <div className="sk-num__digit">{it.root}</div>
                    <div>
                      <strong>
                        {it.label} {it.root} — {it.title}
                      </strong>
                      <div className="small muted">
                        {it.source} · {it.chain.length > 1 ? `Compound ${it.compound} / Root ${it.root}` : `Root ${it.root}`}
                      </div>
                      <div className="small">{it.essence}</div>
                    </div>
                  </div>
                ))}
                <div className="sk-card__actions">
                  <Link className="link-arrow" href="/ank" onClick={s.closePanel}>
                    Strengths & watch-outs
                  </Link>
                </div>
              </div>
            );
          case "snapshot": {
            const d = c.data;
            const theme = DASHA_THEME[d.mahadasha.lord as Graha];
            return (
              <div className="sk-card sk-card--dark" key={i}>
                <div className="sk-card__kicker">DRISHTI snapshot · {d.place}</div>
                <p className="sk-card__title">{d.dateLabel}</p>
                <div className="sk-card__grid">
                  {d.lagna && (
                    <div className="sk-stat">
                      <div className="sk-stat__label">Lagna</div>
                      <div className="sk-stat__value">
                        {d.lagna.rashi} <span className="small">({d.lagna.english})</span>
                      </div>
                    </div>
                  )}
                  <div className="sk-stat">
                    <div className="sk-stat__label">Moon · Rashi</div>
                    <div className="sk-stat__value">
                      {d.moon.rashi} <span className="small">{d.moon.degree}</span>
                    </div>
                  </div>
                  <div className="sk-stat">
                    <div className="sk-stat__label">Nakshatra</div>
                    <div className="sk-stat__value">
                      {d.nakshatra.name} · {d.nakshatra.pada}
                    </div>
                  </div>
                  <div className="sk-stat">
                    <div className="sk-stat__label">Sun</div>
                    <div className="sk-stat__value">{d.sun.rashi}</div>
                  </div>
                  <div className="sk-stat" style={{ gridColumn: "1 / -1" }}>
                    <div className="sk-stat__label">Life period now</div>
                    <div className="sk-stat__value">
                      {d.mahadasha.lord} ({GRAHA_SANSKRIT[d.mahadasha.lord as Graha]}) Mahadasha → {d.mahadasha.until}
                    </div>
                    <div className="small" style={{ opacity: 0.8 }}>
                      {d.antardasha.lord} Antardasha → {d.antardasha.until} · a season of {theme?.theme}
                    </div>
                  </div>
                </div>
                {d.confidence === "check-time" && (
                  <p className="small" style={{ margin: "4px 0 0", color: "var(--gold-300)" }}>
                    One point sits close to a boundary — an exact birth time matters here.
                  </p>
                )}
                <div className="sk-card__actions">
                  <Link className="btn btn--sm" href="/drishti#tiers" onClick={s.closePanel}>
                    See the full DRISHTI reading
                  </Link>
                </div>
              </div>
            );
          }
          case "verse": {
            const v = gitaById(c.id);
            if (!v) return null;
            return (
              <div className="sk-card" key={i}>
                <div className="sk-card__kicker">Bhagavad Gita {v.id}</div>
                <p className="sanskrit">{v.sanskrit}</p>
                <p className="small muted" style={{ fontStyle: "italic", whiteSpace: "pre-line" }}>
                  {v.transliteration}
                </p>
                <p style={{ margin: "6px 0" }}>{v.meaning}</p>
                <p className="small" style={{ margin: 0 }}>
                  <strong>Today:</strong> {v.action}
                </p>
                <div className="sk-card__actions">
                  <button type="button" className="btn btn--sm btn--ghost" onClick={() => speakSanskrit(v.sanskrit)}>
                    ▶ Recite
                  </button>
                  <Link className="link-arrow" href="/gita" onClick={s.closePanel}>
                    Reflect on it
                  </Link>
                </div>
              </div>
            );
          }
          case "katha": {
            const k = kathaBySlug(c.slug);
            if (!k) return null;
            return (
              <div className="sk-card" key={i}>
                <div className="sk-card__kicker">
                  Katha · {k.tradition} · {k.readingMinutes} min
                </div>
                <p className="sk-card__title">{k.title}</p>
                <p className="small" style={{ margin: "0 0 6px" }}>
                  {k.summary}
                </p>
                <Link className="link-arrow" href={`/katha/${k.slug}`} onClick={s.closePanel}>
                  Read the story
                </Link>
              </div>
            );
          }
          case "gurukul": {
            const g = gurukulBySlug(c.slug);
            if (!g) return null;
            return (
              <div className="sk-card" key={i}>
                <div className="sk-card__kicker">
                  Gurukul · {g.sanskrit} {g.sanskritRoman}
                </div>
                <p className="sk-card__title">{g.title}</p>
                <p className="small" style={{ margin: "0 0 6px" }}>
                  {g.tagline}
                </p>
                <p className="small" style={{ margin: "0 0 8px" }}>
                  <strong>Day 1:</strong> {g.practice[0]}
                </p>
                <Link className="link-arrow" href={`/gurukul/${g.slug}`} onClick={s.closePanel}>
                  Begin the seven days
                </Link>
              </div>
            );
          }
          case "route":
            return (
              <div className="sk-card" key={i}>
                <div className="sk-card__kicker">{c.pillar.toUpperCase()}</div>
                <p className="sk-card__title">{c.title}</p>
                <p className="small" style={{ margin: "0 0 8px" }}>
                  {c.text}
                </p>
                <Link className="btn btn--sm" href={c.href} onClick={s.closePanel}>
                  {c.cta}
                </Link>
              </div>
            );
          case "vastu-rule": {
            const best = bestZonesFor(c.room).map((z) => ZONE_INFO[z].name);
            const good = goodZonesFor(c.room).map((z) => ZONE_INFO[z].name);
            return (
              <div className="sk-card" key={i}>
                <div className="sk-card__kicker">Vastu · traditional guidance</div>
                <p className="sk-card__title">{ROOM_LABEL[c.room]}</p>
                <p className="small" style={{ margin: "0 0 6px" }}>
                  <strong>Ideal:</strong> {best.join(", ") || "—"}
                  {good.length > 0 && (
                    <>
                      {" "}
                      · <strong>Also comfortable:</strong> {good.join(", ")}
                    </>
                  )}
                </p>
                <p className="small muted" style={{ margin: "0 0 8px" }}>
                  {whyFor(c.room)}
                </p>
                <Link className="link-arrow" href="/vastu" onClick={s.closePanel}>
                  Check my actual home
                </Link>
              </div>
            );
          }
          case "sky":
            return <Sky key={i} />;
          case "products":
            return (
              <div className="sk-card" key={i}>
                <div className="sk-card__kicker">DRISHTI reports</div>
                {DRISHTI_TIERS.map((p) => (
                  <div key={p.id} className="sk-num">
                    <div className="sk-num__digit" style={{ fontSize: "1rem" }}>
                      {formatPrice(p)}
                    </div>
                    <div>
                      <strong>{p.name}</strong>
                      <div className="small">{p.summary}</div>
                    </div>
                  </div>
                ))}
                <div className="sk-card__actions">
                  <Link className="link-arrow" href="/drishti#tiers" onClick={s.closePanel}>
                    Compare carefully
                  </Link>
                </div>
              </div>
            );
          case "advisory":
            return (
              <div className="sk-card sk-card--dark" key={i}>
                <div className="sk-card__kicker">Private Advisory</div>
                <p className="sk-card__title">RadheyShyam Realtor</p>
                <p className="small" style={{ margin: "0 0 8px", opacity: 0.85 }}>
                  Property selection and human consultation — private, unhurried, personal.
                </p>
                <Link className="btn btn--sm" href="/advisory" onClick={s.closePanel}>
                  Request advisory
                </Link>
              </div>
            );
          case "care":
            return (
              <div className="sk-card" key={i}>
                <div className="sk-card__kicker">You matter</div>
                <p className="small" style={{ margin: "0 0 6px" }}>
                  If you are in immediate danger, call your local emergency number now. In India you can call Tele-MANAS on <strong>14416</strong> (24×7, free). In the US and Canada, call or text <strong>988</strong>. In the UK & Ireland, Samaritans: <strong>116 123</strong>. Elsewhere, findahelpline.com lists free, confidential lines.
                </p>
                <a className="link-arrow" href="https://findahelpline.com" target="_blank" rel="noreferrer">
                  Find a helpline near you
                </a>
              </div>
            );
          case "links":
            return (
              <div className="sk-card" key={i}>
                <div className="sk-card__actions" style={{ marginTop: 0 }}>
                  {c.links.map((l) => (
                    <Link key={l.href} className="btn btn--sm btn--ghost" href={l.href} onClick={s.closePanel}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
        }
      })}
    </div>
  );
}
