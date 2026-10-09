import type { AnkMeaning } from "@/lib/ank";
import { DEVANAGARI_DIGIT, grahaLabel } from "./ank-data";
import s from "./instrument.module.css";

/** Title, essence, strengths, watch-outs and practice — never "good" or "bad". */
export default function MeaningCard({ n, meaning, kicker, id }: { n: number; meaning: AnkMeaning; kicker: string; id?: string }) {
  return (
    <article className={s.meaning} id={id} aria-labelledby={id ? `${id}-title` : undefined}>
      <header className={s.meaningHead}>
        <div className={s.meaningCoin} aria-hidden>
          <span>{n}</span>
        </div>
        <div>
          <p className={s.meaningKicker}>
            {kicker} · {grahaLabel(n)}
          </p>
          <h3 className={s.meaningTitle} id={id ? `${id}-title` : undefined}>
            {meaning.title}
          </h3>
          <p className={s.meaningEssence}>{meaning.essence}</p>
        </div>
        <span className={`${s.meaningDeva} sanskrit`} aria-hidden>
          {DEVANAGARI_DIGIT[n]}
        </span>
      </header>
      <div className={s.meaningCols}>
        <div data-sakhi="Strengths are what this number tends to support — gifts to lean on, not promises.">
          <h4 className={s.meaningLabel}>Strengths</h4>
          <ul className={s.listStrength}>
            {meaning.strengths.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
        <div data-sakhi="Watch-outs aren't warnings of doom — just tendencies worth noticing, so you can choose differently.">
          <h4 className={s.meaningLabel}>Watch-outs</h4>
          <ul className={s.listWatch}>
            {meaning.watchOuts.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className={s.practice} data-sakhi="A practice is a small daily discipline — devotional and practical, never a prescription and never a substitute for professional care.">
        <h4 className={s.meaningLabel}>Practice</h4>
        <p>{meaning.practice}</p>
      </div>
      <p className={s.noGoodBad}>No number is good or bad — each carries strengths and watch-outs. You retain agency.</p>
    </article>
  );
}
