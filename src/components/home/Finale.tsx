"use client";

import SakhiMark from "@/components/sakhi/SakhiMark";
import { sakhi } from "@/components/sakhi/bus";
import { HOME_TOUR } from "@/components/sakhi/presence";
import styles from "./home.module.css";

export default function Finale() {
  return (
    <section className={`section section--night ${styles.finale}`}>
      <div className={styles.stars} aria-hidden />
      <div className="container center">
        <div className={styles.finaleMark}>
          <span className="sakhi-aura" aria-hidden />
          <SakhiMark size={180} barbs decorative />
        </div>
        <h2 className={styles.finaleTitle}>Begin with one question.</h2>
        <p className="lead" style={{ margin: "0 auto 32px", color: "rgba(251,246,234,.75)" }}>
          Sakhi is here — day and night, in your own words. Press <kbd className={styles.kbd}>/</kbd> on any page to call her.
        </p>
        <div className="row" style={{ justifyContent: "center" }}>
          <button type="button" className="btn btn--lg" onClick={() => sakhi.open()}>
            Talk to Sakhi
          </button>
          <button type="button" className="btn btn--lg btn--ghost" onClick={() => sakhi.guide(HOME_TOUR)}>
            Take the tour
          </button>
        </div>
      </div>
    </section>
  );
}
