import Link from "next/link";
import Image from "next/image";
import { MEMBERSHIPS } from "@/lib/products";
import SakhiNote from "@/components/ui/SakhiNote";
import styles from "./home.module.css";

const VOWS = [
  { v: "Guidance without fear.", d: "Never doom, panic, dosha fear or manipulative remedy selling." },
  { v: "You keep your agency.", d: "Traditional systems offer interpretation — not control over your life." },
  { v: "Nothing is invented.", d: "Positions, dates, numbers and findings are calculated. No AI may fabricate them." },
  { v: "No quick fixes for sale.", d: "No casual gemstones, no name-changing numerology, no lucky-number sales." },
  { v: "Devotion stays devotion.", d: "Radha Naam Jap, sattvic food, prayer and discipline — offered as devotional practice, never as science." },
  { v: "Care comes first.", d: "Never a substitute for medical, mental-health, legal or financial advice." },
];

export function Vows() {
  return (
    <section className={`section ${styles.vows}`}>
      <div className="container">
        <div className={styles.vowsHead}>
          <p className="eyebrow">Our promise</p>
          <h2>
            Guidance <em className="accent">without fear</em>.
          </h2>
          <p className="lead">These aren't marketing lines. They are the rules our people, our Sakhi and our software follow — every day, on every page.</p>
        </div>
        <ol className={styles.vowList} data-tour="promise">
          {VOWS.map((x, i) => (
            <li key={x.v} data-reveal style={{ ["--reveal-delay" as string]: `${i * 60}ms` }}>
              <span className={styles.vowNum}>{["१", "२", "३", "४", "५", "६"][i]}</span>
              <div>
                <strong>{x.v}</strong>
                <p>{x.d}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Voices() {
  return (
    <section className={`section section--tight section--marble ${styles.voices}`}>
      <div className="container container--narrow center">
        <p className="eyebrow eyebrow--center" style={{ display: "flex", justifyContent: "center" }}>
          Voices of the path
        </p>
        <h2 className={styles.voicesTitle}>The first stories are being written.</h2>
        <p className="lead" style={{ margin: "0 auto" }}>
          Real words from our first members will live here — never invented, never paid for. If Prem Marg helps you, we'd be honoured to hear how.
        </p>
      </div>
    </section>
  );
}

export function Bridge() {
  return (
    <section className={`section ${styles.bridge}`}>
      <div className="container">
        <div className={styles.bridgeGrid}>
          <div className={`card card--gilded ${styles.bridgeCard}`} data-reveal>
            <p className="eyebrow">Membership</p>
            <h3>Walk the path every day.</h3>
            <div className={styles.metals}>
              {MEMBERSHIPS.map((m) => (
                <span key={m.id} className={styles.metal} style={{ background: m.metal }} data-sakhi={`${m.name}: ${m.scope.slice(0, 3).join(", ")}${m.scope.length > 3 ? "…" : ""}`}>
                  {m.name}
                </span>
              ))}
            </div>
            <p className="muted">Daily Gita and Katha, saved profiles, deeper Sakhi access, timing updates and more. Founding prices are announced at launch — set fairly, after we learn what members truly use.</p>
            <Link className="link-arrow" href="/membership">
              Explore membership
            </Link>
          </div>

          <div className={`card card--forest ${styles.bridgeCard}`} data-reveal style={{ ["--reveal-delay" as string]: "120ms" }}>
            <p className="eyebrow">Private Advisory</p>
            <h3>When a decision deserves a person.</h3>
            <p style={{ opacity: 0.82 }}>
              Buying a home, choosing land, or facing a big personal decision? RadheyShyam Realtor is Prem Marg's trusted human bridge — private, unhurried and personal.
            </p>
            <div className={styles.rsr}>
              <Image src="/brand/radheyshyam-realtor.png" alt="RadheyShyam Realtor" width={240} height={74} />
            </div>
            <Link className="btn" href="/advisory">
              Request Private Advisory
            </Link>
          </div>
        </div>
        <div className={styles.bridgeNote}>
          <SakhiNote ask="How is Prem Marg different from an astrology site?">
            Astrology is one door into Prem Marg. Gurukul is where we grow — from seeking predictions to building character. I'll walk with you either way.
          </SakhiNote>
        </div>
      </div>
    </section>
  );
}
