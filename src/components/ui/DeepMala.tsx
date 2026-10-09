"use client";

import { useEffect, useState } from "react";
import { dayKey } from "@/lib/daily";
import { lightLamp, usePremMarg } from "@/lib/store";
import { track } from "@/lib/analytics";
import { sakhi } from "@/components/sakhi/bus";
import "./deepmala.css";

/**
 * DEEP MALA — a garland of seven lamps for the last seven days.
 * Light today's lamp after reading the day's wisdom. Gentle — no streak pressure.
 */
export default function DeepMala({ tone = "dark", label = true }: { tone?: "dark" | "light"; label?: boolean }) {
  const lamps = usePremMarg((s) => s.lamps);
  const [days, setDays] = useState<{ key: string; label: string; today: boolean }[]>([]);

  useEffect(() => {
    const out = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      out.push({ key: dayKey(d), label: d.toLocaleDateString(undefined, { weekday: "short" }), today: i === 0 });
    }
    setDays(out);
  }, []);

  const litCount = days.filter((d) => lamps.includes(d.key)).length;
  const todayKey = days.find((d) => d.today)?.key;
  const todayLit = todayKey ? lamps.includes(todayKey) : false;

  const light = () => {
    if (!todayKey || todayLit) return;
    lightLamp(todayKey);
    track("lamp_lit", { day: todayKey });
    sakhi.celebrate("Your lamp is lit. 🪔 A small light, kept daily, becomes a way of life.");
  };

  return (
    <div className={`deepmala deepmala--${tone}`}>
      <div className="deepmala__row" role="list" aria-label="Lamps lit over the last seven days">
        {days.map((d) => {
          const lit = lamps.includes(d.key);
          return (
            <div role="listitem" key={d.key} className={`deepmala__day${lit ? " is-lit" : ""}${d.today ? " is-today" : ""}`}>
              <button
                type="button"
                className="deepmala__lamp"
                onClick={d.today ? light : undefined}
                disabled={!d.today || lit}
                aria-label={`${d.label}: ${lit ? "lamp lit" : d.today ? "light today's lamp" : "not lit"}`}
                data-sakhi={d.today && !lit ? "Read today's verse or story, then light this lamp. A small daily light." : undefined}
              >
                <svg viewBox="0 0 64 64" aria-hidden>
                  <defs>
                    <radialGradient id={`dm-glow-${d.key}`} cx=".5" cy=".5" r=".5">
                      <stop offset="0" stopColor="#FFE9A8" stopOpacity=".9" />
                      <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id={`dm-flame-${d.key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#FFF8D6" />
                      <stop offset=".5" stopColor="#F6C445" />
                      <stop offset="1" stopColor="#E8833A" />
                    </linearGradient>
                  </defs>
                  {lit && <circle className="deepmala__halo" cx="32" cy="24" r="22" fill={`url(#dm-glow-${d.key})`} />}
                  {lit && <path className="deepmala__flame" d="M32 8c4 7 7 11 7 16a7 7 0 0 1-14 0c0-5 3-9 7-16z" fill={`url(#dm-flame-${d.key})`} />}
                  <path d="M10 38c6 10 38 10 44 0-3 9-12 15-22 15S13 47 10 38z" className="deepmala__bowl" />
                  <path d="M10 38c6-3 38-3 44 0" className="deepmala__rim" fill="none" />
                  <path d="M30 34h4v5h-4z" className="deepmala__wick" />
                </svg>
              </button>
              <span className="deepmala__label">{d.today ? "Today" : d.label}</span>
            </div>
          );
        })}
      </div>
      {label && (
        <p className="deepmala__caption">
          {todayLit ? `Today's lamp is lit · ${litCount} of 7 this week` : litCount ? `${litCount} of 7 lamps lit this week · today's lamp is waiting` : "Light today's lamp after your daily wisdom"}
        </p>
      )}
    </div>
  );
}
