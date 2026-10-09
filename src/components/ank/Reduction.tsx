import type { AnkResult } from "@/lib/ank";
import { reductionSteps, reductionText } from "./ank-data";
import s from "./instrument.module.css";

/**
 * The reduction, shown transparently: digits gather into a sum → compound → root.
 *   6 + 0 + 7 = 13 → 1 + 3 = 4      Compound 13 / Root 4
 * Each token enters in turn (staggered via --i); re-keyed by the parent to replay.
 */
export default function Reduction({ result }: { result: AnkResult }) {
  const steps = reductionSteps(result);
  let i = 0;
  const next = () => ({ ["--i" as string]: i++ });
  return (
    <div className={s.reduction}>
      <p className="visually-hidden">
        {reductionText(result)}. Compound {result.compound} / Root {result.root}.
      </p>
      <div className={s.chain} aria-hidden>
        {steps.map((step, si) => {
          const last = si === steps.length - 1;
          return (
            <span key={si} className={s.step}>
              {si > 0 && (
                <span className={s.arrow} style={next()}>
                  →
                </span>
              )}
              {step.digits.map((d, di) => (
                <span key={di} className={s.tokenGroup}>
                  {di > 0 && (
                    <span className={s.op} style={next()}>
                      +
                    </span>
                  )}
                  <span className={s.digit} style={next()}>
                    {d}
                  </span>
                </span>
              ))}
              <span className={s.op} style={next()}>
                =
              </span>
              <span className={last ? s.rootToken : s.compoundToken} style={next()}>
                {step.total}
              </span>
            </span>
          );
        })}
      </div>
      <p className={s.crLabel} style={{ ["--i" as string]: i + 1 }}>
        <span data-sakhi="The compound is the first total — the number's full voice. We keep it, because it carries nuance the root alone can lose.">
          Compound <strong>{result.compound}</strong>
        </span>
        <span className={s.crSlash} aria-hidden>
          /
        </span>
        <span data-sakhi="The root is the compound reduced to a single digit, 1 to 9 — the number's essence. Both are preserved, always.">
          Root <strong>{result.root}</strong>
        </span>
      </p>
    </div>
  );
}
