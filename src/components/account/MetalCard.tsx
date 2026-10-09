"use client";

import { useRef, type CSSProperties, type ReactNode, type PointerEvent } from "react";
import { sakhi } from "@/components/sakhi/bus";
import s from "./membership.module.css";

/**
 * A membership plate with a real metallic finish. The light catches the metal
 * where the pointer is — a quiet, tactile sheen (disabled for reduced motion in CSS).
 */
export default function MetalCard({
  metal,
  tier,
  featured,
  sakhiLine,
  children,
}: {
  metal: string;
  tier: string;
  featured?: boolean;
  sakhiLine: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  function move(e: PointerEvent<HTMLElement>) {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    el.style.setProperty("--rx", `${((0.5 - y) * 5).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * 6).toFixed(2)}deg`);
  }
  function leave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <article
      ref={ref}
      className={`${s.plan} ${featured ? s.planFeatured : ""}`}
      style={{ "--metal": metal } as CSSProperties}
      data-tier={tier}
      data-sakhi={sakhiLine}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </article>
  );
}

export function JoinButton({ tier, children }: { tier: string; children: ReactNode }) {
  return (
    <a
      href="#founding-list"
      className={`btn ${s.planCta}`}
      onClick={(e) => {
        e.preventDefault();
        const target = document.getElementById("founding-list");
        target?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
        window.setTimeout(() => target?.querySelector<HTMLInputElement>("input[type=email]")?.focus({ preventScroll: true }), 500);
        sakhi.whisper(`${tier} it is — leave your email and you'll hear the founding price before anyone else.`, { selector: "#founding-list", ms: 6000 });
      }}
    >
      {children}
    </a>
  );
}
