"use client";

import { useEffect, useRef } from "react";

/** Diya sparks — gold motes rising from Sakhi's flame, drifting, drawn gently toward the pointer. */
export default function Sparks({ density = 46 }: { density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; tw: number };
    const ps: P[] = [];
    const spawn = (): P => {
      const a = Math.random() * Math.PI * 2;
      const rad = Math.random() * w * 0.12;
      return {
        x: w / 2 + Math.cos(a) * rad,
        y: h * 0.56 + Math.sin(a) * rad * 0.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(0.25 + Math.random() * 0.55),
        life: 0,
        max: 220 + Math.random() * 260,
        r: 0.6 + Math.random() * 1.8,
        tw: Math.random() * Math.PI * 2,
      };
    };
    for (let i = 0; i < density; i++) {
      const p = spawn();
      p.life = Math.random() * p.max;
      ps.push(p);
    }

    let pointer: { x: number; y: number } | null = null;
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let visible = true;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);

    const root = document.documentElement;
    function tick() {
      raf = 0;
      if (!visible || !ctx) return;
      ctx.clearRect(0, 0, w, h);
      const amp = parseFloat(root.style.getPropertyValue("--sk-amp") || "0") || 0;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.life++;
        p.tw += 0.05;
        if (pointer) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const d = Math.hypot(dx, dy);
          if (d < 180) {
            p.vx += (dx / d) * 0.006;
            p.vy += (dy / d) * 0.004;
          }
        }
        p.vx += Math.sin(p.tw) * 0.004;
        p.x += p.vx * (1 + amp);
        p.y += p.vy * (1 + amp * 1.5);
        const k = p.life / p.max;
        const alpha = Math.sin(Math.PI * Math.min(1, k)) * (0.55 + 0.45 * Math.sin(p.tw * 2));
        if (k >= 1 || p.y < -10) {
          ps[i] = spawn();
          continue;
        }
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255,240,190,${alpha})`);
        g.addColorStop(0.4, `rgba(243,207,99,${alpha * 0.5})`);
        g.addColorStop(1, "rgba(243,207,99,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [density]);

  return <canvas ref={ref} className="hero-sparks" aria-hidden />;
}
