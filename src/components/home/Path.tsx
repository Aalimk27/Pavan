"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./home.module.css";

const STEPS = [
  { t: "Choose your clarity", d: "Career, relationships, money, future, home, numbers, mind or spiritual life.", s: "Begin anywhere. There's no wrong door." },
  { t: "Sakhi routes you", d: "To DRISHTI, VASTU, ANK — or the right combination for your question.", s: "I listen first, then point you to exactly one next step." },
  { t: "A free preview, first", d: "A genuinely useful insight before anyone asks you to pay.", s: "If the preview helps you, that's already a good day." },
  { t: "Your report, done right", d: "Deterministic calculations, careful interpretation, quality checks — delivered by email, to your dashboard, and explained by Sakhi.", s: "Facts are calculated, never invented — by me or anyone." },
  { t: "A daily practice", d: "Gita, Katha and Gurukul keep the path alive — and Private Advisory is there when a decision deserves a person.", s: "This is where Prem Marg becomes a way to live." },
];

/** The Marg — a winding path that draws itself, in real pixels, as you walk down the page. */
export default function Path() {
  const ref = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [box, setBox] = useState({ w: 160, h: 1000 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const ro = new ResizeObserver(() => setBox({ w: svg.clientWidth || 160, h: svg.clientHeight || 1000 }));
    ro.observe(svg);
    return () => ro.disconnect();
  }, []);

  const { w, h } = box;
  const cx = w / 2;
  const a = w * 0.38;
  const d = `M${cx} 0 C ${cx + a} ${h * 0.1}, ${cx - a} ${h * 0.2}, ${cx} ${h * 0.3} S ${cx + a} ${h * 0.5}, ${cx} ${h * 0.6} S ${cx - a} ${h * 0.8}, ${cx} ${h}`;

  useEffect(() => {
    const el = ref.current;
    const path = pathRef.current;
    if (!el || !path) return;
    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len} ${len}`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      path.style.strokeDashoffset = "0";
      return;
    }
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (window.innerHeight * 0.7 - r.top) / r.height));
        path.style.strokeDashoffset = `${len * (1 - p)}`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, [d]);

  return (
    <section className={`section ${styles.pathSec}`}>
      <div className="container">
        <div className="section-head section-head--center">
          <p className="eyebrow eyebrow--center">How the path works</p>
          <h2>From one question to a better way to live.</h2>
        </div>
        <div ref={ref} className={styles.path}>
          <svg ref={svgRef} className={styles.pathSvg} viewBox={`0 0 ${w} ${h}`} aria-hidden>
            <path className={styles.pathGhost} d={d} />
            <path ref={pathRef} className={styles.pathLine} d={d} />
          </svg>
          <ol className={styles.steps}>
            {STEPS.map((s, i) => (
              <li key={s.t} className={styles.step} data-reveal data-sakhi={s.s}>
                <span className={styles.stepNum}>{String(i + 1).padStart(2, "0")}</span>
                <div className={styles.stepCard}>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
