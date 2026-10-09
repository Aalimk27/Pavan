"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { DIR16, ZONE_INFO, type PlacedRoom, type Pt, type RoomType, type Severity, type VastuAnalysis, type Zone } from "@/lib/vastu/engine";
import { DIR16_NAME, MANDALA, ROOM_CODE, SEVERITY_META, ZONES8, northFrameBox, polar, projectOnSegment, rayToRect, topFaces } from "./studio-data";
import s from "./studio.module.css";

export type StageMode = "north" | "boundary" | "rooms" | "findings";

export interface StagePlan {
  src: string;
  w: number;
  h: number;
  name: string;
}

type Drag =
  | { kind: "dial"; pointerId: number }
  | { kind: "vertex"; index: number; pointerId: number }
  | { kind: "pin"; id: string; pointerId: number; off: Pt; startX: number; startY: number; moved: boolean };

export interface PlanStageProps {
  plan: StagePlan;
  mode: StageMode;
  north: number;
  onNorth: (deg: number) => void;
  boundary: Pt[];
  onBoundary: (poly: Pt[]) => void;
  centre: Pt;
  rooms: PlacedRoom[];
  names: Record<string, string>;
  onRooms: (rooms: PlacedRoom[]) => void;
  activeType: RoomType | null;
  onPlace: (at: Pt) => void;
  selectedVertex: number | null;
  onSelectVertex: (i: number | null) => void;
  selectedPin: string | null;
  onSelectPin: (id: string | null) => void;
  onPinMoved: (id: string) => void;
  analysis: VastuAnalysis | null;
  focusId: string | null;
  onFocus: (id: string | null) => void;
  measuring: boolean;
  revealKey: number;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

/** Distance from c along `imageDeg` until the ray leaves the polygon (largest crossing). */
function rayExit(c: Pt, imageDeg: number, poly: Pt[]): number {
  const t = (imageDeg * Math.PI) / 180;
  const dx = Math.sin(t);
  const dy = -Math.cos(t);
  let best = 0;
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const ex = b.x - a.x;
    const ey = b.y - a.y;
    const den = dx * ey - dy * ex;
    if (Math.abs(den) < 1e-9) continue;
    const u = ((a.x - c.x) * ey - (a.y - c.y) * ex) / den;
    const v = ((a.x - c.x) * dy - (a.y - c.y) * dx) / den;
    if (u > 0 && v >= 0 && v <= 1) best = Math.max(best, u);
  }
  return best;
}

export default function PlanStage(props: PlanStageProps) {
  const { plan, mode, north, boundary, centre, rooms, names, analysis, focusId, measuring, selectedVertex, selectedPin, activeType, revealKey } = props;
  const W = plan.w;
  const H = plan.h;
  const M = Math.round(Math.max(W, H) * 0.08);
  const vbW = W + 2 * M;
  const vbH = H + 2 * M;

  const svgRef = useRef<SVGSVGElement>(null);
  const ghostRef = useRef<SVGGElement>(null);
  const [k, setK] = useState(1.4); // plan units per CSS pixel
  const drag = useRef<Drag | null>(null);
  const tap = useRef<{ x: number; y: number; id: number } | null>(null);
  const live = useRef(props);
  live.current = props;

  /* Keep marks a constant on-screen size, whatever the plan resolution. */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const measure = () => {
      const w = svg.getBoundingClientRect().width;
      if (w > 0) setK(vbW / w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(svg);
    return () => ro.disconnect();
  }, [vbW]);

  /* Touch: dragging a handle must not scroll the page; everything else still scrolls. */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const onTouch = (e: TouchEvent) => {
      if ((e.target as Element | null)?.closest?.("[data-drag]")) e.preventDefault();
    };
    svg.addEventListener("touchstart", onTouch, { passive: false });
    return () => svg.removeEventListener("touchstart", onTouch);
  }, []);

  const toPlan = useCallback((clientX: number, clientY: number): Pt => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return { x: 0, y: 0 };
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: p.x, y: p.y };
  }, []);

  const clampPt = useCallback((p: Pt): Pt => ({ x: clamp(p.x, 0, W), y: clamp(p.y, 0, H) }), [W, H]);

  const dialCentre = useMemo(() => ({ x: W / 2, y: H / 2 }), [W, H]);
  const dialR = Math.min(W, H) * 0.34;

  /* ───────────── pointer plumbing ───────────── */

  const capture = (e: ReactPointerEvent) => {
    try {
      svgRef.current?.setPointerCapture(e.pointerId);
    } catch {
      /* some browsers refuse capture on synthetic pointers — dragging still works */
    }
  };

  const startDial = (e: ReactPointerEvent<SVGGElement>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.currentTarget.focus({ preventScroll: true });
    drag.current = { kind: "dial", pointerId: e.pointerId };
    capture(e);
    rotateTo(e.clientX, e.clientY);
  };

  const rotateTo = (cx: number, cy: number) => {
    const p = toPlan(cx, cy);
    const c = dialCentre;
    if (Math.hypot(p.x - c.x, p.y - c.y) < 4) return;
    let deg = (Math.atan2(p.x - c.x, -(p.y - c.y)) * 180) / Math.PI;
    deg = ((deg % 360) + 360) % 360;
    const snap = Math.round(deg / 45) * 45;
    if (Math.abs(deg - snap) < 2.5) deg = snap;
    live.current.onNorth(Math.round(deg) % 360);
  };

  const startVertex = (i: number) => (e: ReactPointerEvent<SVGGElement>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.currentTarget.focus({ preventScroll: true });
    live.current.onSelectVertex(i);
    drag.current = { kind: "vertex", index: i, pointerId: e.pointerId };
    capture(e);
  };

  const insertOnEdge = (i: number) => (e: ReactPointerEvent<SVGLineElement>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    const poly = live.current.boundary;
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const p = projectOnSegment(toPlan(e.clientX, e.clientY), a, b);
    const next = [...poly.slice(0, i + 1), p, ...poly.slice(i + 1)];
    live.current.onBoundary(next);
    live.current.onSelectVertex(i + 1);
    drag.current = { kind: "vertex", index: i + 1, pointerId: e.pointerId };
    capture(e);
  };

  const startPin = (id: string) => (e: ReactPointerEvent<SVGGElement>) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    e.currentTarget.focus({ preventScroll: true });
    const room = live.current.rooms.find((r) => r.id === id);
    if (!room) return;
    const p = toPlan(e.clientX, e.clientY);
    drag.current = { kind: "pin", id, pointerId: e.pointerId, off: { x: p.x - room.at.x, y: p.y - room.at.y }, startX: e.clientX, startY: e.clientY, moved: false };
    if (live.current.mode === "rooms") live.current.onSelectPin(id);
    capture(e);
  };

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    tap.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    const P = live.current;
    if (!d) {
      // Ghost pin follows the pointer while a label is chosen (mouse / pen only).
      if (P.mode === "rooms" && P.activeType && ghostRef.current && e.pointerType !== "touch") {
        const p = toPlan(e.clientX, e.clientY);
        ghostRef.current.setAttribute("transform", `translate(${p.x} ${p.y})`);
        ghostRef.current.style.opacity = p.x >= 0 && p.y >= 0 && p.x <= W && p.y <= H ? "1" : "0";
      }
      return;
    }
    if (e.pointerId !== d.pointerId) return;
    if (d.kind === "dial") rotateTo(e.clientX, e.clientY);
    else if (d.kind === "vertex") {
      const next = P.boundary.slice();
      next[d.index] = clampPt(toPlan(e.clientX, e.clientY));
      P.onBoundary(next);
    } else if (d.kind === "pin") {
      if (!d.moved && Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 4) return;
      d.moved = true;
      const p = toPlan(e.clientX, e.clientY);
      const at = clampPt({ x: p.x - d.off.x, y: p.y - d.off.y });
      P.onRooms(P.rooms.map((r) => (r.id === d.id ? { ...r, at } : r)));
    }
  };

  const endDrag = (e: ReactPointerEvent<SVGSVGElement>) => {
    const d = drag.current;
    const P = live.current;
    if (d && e.pointerId === d.pointerId) {
      drag.current = null;
      try {
        svgRef.current?.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      if (d.kind === "pin") {
        if (d.moved) P.onPinMoved(d.id);
        else if (P.mode === "findings") P.onFocus(P.focusId === d.id ? null : d.id);
      }
      tap.current = null;
      return;
    }
    const t = tap.current;
    tap.current = null;
    if (!t || t.id !== e.pointerId || e.type === "pointercancel") return;
    if (Math.hypot(e.clientX - t.x, e.clientY - t.y) > 8) return;
    const p = toPlan(e.clientX, e.clientY);
    const inside = p.x >= 0 && p.y >= 0 && p.x <= W && p.y <= H;
    if (P.mode === "rooms") {
      if (P.activeType && inside) P.onPlace(p);
      else P.onSelectPin(null);
    } else if (P.mode === "boundary") P.onSelectVertex(null);
    else if (P.mode === "findings") P.onFocus(null);
  };

  /* ───────────── keyboard ───────────── */

  const nudge = (e: ReactKeyboardEvent): Pt | null => {
    const step = (e.shiftKey ? 20 : 4) * Math.max(1, k * 0.6);
    switch (e.key) {
      case "ArrowLeft":
        return { x: -step, y: 0 };
      case "ArrowRight":
        return { x: step, y: 0 };
      case "ArrowUp":
        return { x: 0, y: -step };
      case "ArrowDown":
        return { x: 0, y: step };
      default:
        return null;
    }
  };

  const onDialKey = (e: ReactKeyboardEvent<SVGGElement>) => {
    const big = e.shiftKey ? 10 : 1;
    let d: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") d = big;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") d = -big;
    else if (e.key === "PageUp") d = 15;
    else if (e.key === "PageDown") d = -15;
    else if (e.key === "Home") {
      e.preventDefault();
      props.onNorth(0);
      return;
    }
    if (d === null) return;
    e.preventDefault();
    props.onNorth((((north + d) % 360) + 360) % 360);
  };

  const onVertexKey = (i: number) => (e: ReactKeyboardEvent<SVGGElement>) => {
    if ((e.key === "Delete" || e.key === "Backspace") && boundary.length > 3) {
      e.preventDefault();
      props.onBoundary(boundary.filter((_, j) => j !== i));
      props.onSelectVertex(null);
      return;
    }
    if (e.key === "Escape") return props.onSelectVertex(null);
    const d = nudge(e);
    if (!d) return;
    e.preventDefault();
    const next = boundary.slice();
    next[i] = clampPt({ x: next[i].x + d.x, y: next[i].y + d.y });
    props.onBoundary(next);
  };

  const onPinKey = (id: string) => (e: ReactKeyboardEvent<SVGGElement>) => {
    if (mode === "rooms" && (e.key === "Delete" || e.key === "Backspace")) {
      e.preventDefault();
      props.onRooms(rooms.filter((r) => r.id !== id));
      props.onSelectPin(null);
      return;
    }
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (mode === "findings") props.onFocus(focusId === id ? null : id);
      else props.onSelectPin(id);
      return;
    }
    if (e.key === "Escape") return mode === "findings" ? props.onFocus(null) : props.onSelectPin(null);
    const d = nudge(e);
    if (!d) return;
    e.preventDefault();
    props.onRooms(rooms.map((r) => (r.id === id ? { ...r, at: clampPt({ x: r.at.x + d.x, y: r.at.y + d.y }) } : r)));
    props.onPinMoved(id);
  };

  /* ───────────── derived drawing data ───────────── */

  const pts = boundary.map((p) => `${p.x},${p.y}`).join(" ");
  const severityById = useMemo(() => {
    const m: Record<string, Severity> = {};
    for (const f of analysis?.findings ?? []) m[f.id] = f.severity;
    return m;
  }, [analysis]);
  const compact = vbW / k < 560;
  const bigR = Math.hypot(W, H) * 1.2;
  const frame = { x0: -M / 2, y0: -M / 2, x1: W + M / 2, y1: H + M / 2 };

  const box = useMemo(() => northFrameBox(boundary, centre, north), [boundary, centre, north]);
  const cell = { w: (box.maxX - box.minX) / 3, h: (box.maxY - box.minY) / 3 };
  const focusCut = focusId?.startsWith("cut-") ? (focusId.slice(4) as Zone) : null;
  const cutZones = new Set((analysis?.cuts ?? []).map((c) => c.zone));

  const zoneLabels = useMemo(
    () =>
      ZONES8.map((z, i) => {
        const deg = north + i * 45;
        const r = rayExit(centre, deg, boundary);
        return { z, p: polar(centre, Math.max(0, r * 0.74), deg) };
      }),
    [boundary, centre, north],
  );

  /* ───────────── pieces ───────────── */

  const rulers = (
    <g className={s.rulers} aria-hidden>
      {Array.from({ length: Math.floor(W / 25) + 1 }, (_, i) => i * 25).map((x) => (
        <g key={`rx${x}`}>
          <line x1={x} y1={-M + 2} x2={x} y2={-M + 2 + (x % 100 === 0 ? M * 0.22 : M * 0.1)} />
          <line x1={x} y1={H + M - 2} x2={x} y2={H + M - 2 - (x % 100 === 0 ? M * 0.22 : M * 0.1)} />
        </g>
      ))}
      {Array.from({ length: Math.floor(H / 25) + 1 }, (_, i) => i * 25).map((y) => (
        <g key={`ry${y}`}>
          <line x1={-M + 2} y1={y} x2={-M + 2 + (y % 100 === 0 ? M * 0.22 : M * 0.1)} y2={y} />
          <line x1={W + M - 2} y1={y} x2={W + M - 2 - (y % 100 === 0 ? M * 0.22 : M * 0.1)} y2={y} />
        </g>
      ))}
    </g>
  );

  const edgeLabel = (deg: number, text: string, strong: boolean, key: string) => {
    const p = rayToRect(mode === "north" ? dialCentre : centre, deg, frame.x0, frame.y0, frame.x1, frame.y1);
    return (
      <text key={key} x={p.x} y={p.y} dy="0.35em" textAnchor="middle" className={strong ? s.edgeStrong : s.edgeSoft} style={{ fontSize: (strong ? 12 : 9.5) * k }}>
        {text}
      </text>
    );
  };

  const bindu = (
    <g
      className={s.bindu}
      transform={`translate(${centre.x} ${centre.y})`}
      data-sakhi="This glowing point is your Brahmasthan — the geometric centre of the boundary you confirmed. Tradition keeps it open, light and uncluttered."
    >
      <circle r={22 * k} className={s.binduGlow} />
      <circle r={6 * k} className={s.binduCore} />
      <circle r={10 * k} className={s.binduRing} style={{ strokeWidth: 1.4 * k }} />
      {!compact || mode === "boundary" ? (
        <text y={-16 * k} textAnchor="middle" className={s.binduText} style={{ fontSize: 10.5 * k }}>
          BRAHMASTHAN
        </text>
      ) : null}
    </g>
  );

  const renderPin = (room: PlacedRoom, i: number) => {
    const sev = mode === "findings" && !measuring ? severityById[room.id] : undefined;
    const selected = mode === "findings" ? focusId === room.id : selectedPin === room.id;
    const name = names[room.id] ?? room.type;
    const showLabel = !compact || selected;
    const flip = room.at.x > W * 0.7;
    const fs = 10.5 * k;
    const labelW = name.length * fs * 0.6 + 12 * k;
    const r = 11 * k;
    const tone = sev ? SEVERITY_META[sev].colour : undefined;
    return (
      <g
        key={room.id}
        data-drag
        tabIndex={0}
        role="button"
        aria-pressed={selected}
        aria-label={`${name}${sev ? `, ${SEVERITY_META[sev].label}` : ""}. Drag or use arrow keys to move${mode === "rooms" ? "; Delete removes it" : "; Enter shows the finding"}.`}
        className={`${s.pin} ${selected ? s.pinSelected : ""} ${sev ? s.pinSev : ""}`}
        transform={`translate(${room.at.x} ${room.at.y})`}
        style={{ ["--pin" as string]: tone ?? undefined, ["--d" as string]: `${i * 70}ms` }}
        onPointerDown={startPin(room.id)}
        onKeyDown={onPinKey(room.id)}
      >
        <circle r={22 * k} className={s.hit} />
        {selected && <circle r={r + 7 * k} className={s.pinHalo} style={{ strokeWidth: 2 * k }} />}
        <g className={s.pinBody} key={`${revealKey}-${sev ?? "n"}`}>
          <circle r={r} className={s.pinDisc} style={{ strokeWidth: 2 * k }} />
          <text dy="0.36em" textAnchor="middle" className={s.pinCode} style={{ fontSize: 8.5 * k }}>
            {ROOM_CODE[room.type]}
          </text>
        </g>
        {showLabel && (
          <g transform={`translate(${flip ? -(r + 5 * k) - labelW : r + 5 * k} ${-9 * k})`} className={s.pinLabel}>
            <rect width={labelW} height={18 * k} rx={5 * k} />
            <text x={6 * k} y={12.6 * k} style={{ fontSize: fs }}>
              {name}
            </text>
          </g>
        )}
      </g>
    );
  };

  /* ───────────── render ───────────── */

  const top = topFaces(north);
  const label =
    mode === "north"
      ? `Plan with a compass dial. North points ${north} degrees clockwise from the top; the top of the plan faces ${DIR16_NAME[top]}.`
      : mode === "boundary"
        ? `Plan with the exterior boundary: ${boundary.length} corners.`
        : mode === "rooms"
          ? `Plan with ${rooms.length} room labels placed.`
          : `Annotated plan: 16-direction wheel centred on the Brahmasthan, 3 by 3 mandala grid, and ${rooms.length} room pins coloured by finding.`;

  return (
    <svg
      ref={svgRef}
      className={`${s.svg} ${mode === "rooms" && activeType ? s.placing : ""}`}
      viewBox={`${-M} ${-M} ${vbW} ${vbH}`}
      role="group"
      aria-label={label}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onPointerLeave={() => {
        if (ghostRef.current) ghostRef.current.style.opacity = "0";
      }}
    >
      <defs>
        <clipPath id="pm-plan-clip">
          <polygon points={pts} />
        </clipPath>
        <pattern id="pm-cut" width={10 * k} height={10 * k} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2={10 * k} stroke="#c25a2c" strokeWidth={2.2 * k} strokeOpacity="0.55" />
        </pattern>
        <radialGradient id="pm-sweep" cx="0" cy="0" r="1" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#ecc461" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ecc461" stopOpacity="0" />
        </radialGradient>
      </defs>

      {rulers}

      <rect x={0} y={0} width={W} height={H} className={s.paper} />
      <image href={plan.src} x={0} y={0} width={W} height={H} preserveAspectRatio="none" className={`${s.planImg} ${mode === "findings" ? s.planDim : ""}`} />

      {/* ── NORTH ── */}
      {mode === "north" && (
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => edgeLabel(north + a, ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][i], i % 2 === 0, `e${a}`))}
          <g
            className={s.dial}
            data-drag
            tabIndex={0}
            role="slider"
            aria-label="North direction on the plan"
            aria-valuemin={0}
            aria-valuemax={359}
            aria-valuenow={north}
            aria-valuetext={`${north} degrees; the top of the plan faces ${DIR16_NAME[top]}`}
            onPointerDown={startDial}
            onKeyDown={onDialKey}
          >
            <circle cx={dialCentre.x} cy={dialCentre.y} r={dialR} className={s.dialDisc} />
            <circle cx={dialCentre.x} cy={dialCentre.y} r={dialR} className={s.dialRing} style={{ strokeWidth: 1.5 * k }} />
            <circle cx={dialCentre.x} cy={dialCentre.y} r={dialR * 0.62} className={s.dialInner} style={{ strokeWidth: 1 * k }} />
            {Array.from({ length: 72 }, (_, i) => i * 5).map((a) => {
              const long = a % 45 === 0;
              const mid = a % 15 === 0;
              const p1 = polar(dialCentre, dialR, north + a);
              const p2 = polar(dialCentre, dialR - (long ? 16 : mid ? 10 : 5) * k, north + a);
              return <line key={a} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} className={long ? s.tickLong : s.tick} style={{ strokeWidth: (long ? 2 : 1) * k }} />;
            })}
            {(["N", "E", "S", "W"] as const).map((d, i) => {
              const p = polar(dialCentre, dialR + 15 * k, north + i * 90);
              return (
                <text key={d} x={p.x} y={p.y} dy="0.36em" textAnchor="middle" className={d === "N" ? s.dialN : s.dialLetter} style={{ fontSize: (d === "N" ? 19 : 14) * k }}>
                  {d}
                </text>
              );
            })}
            <g transform={`rotate(${north} ${dialCentre.x} ${dialCentre.y})`} className={s.needle}>
              <path
                d={`M ${dialCentre.x} ${dialCentre.y - dialR * 0.8} L ${dialCentre.x + 11 * k} ${dialCentre.y} L ${dialCentre.x} ${dialCentre.y + 6 * k} L ${dialCentre.x - 11 * k} ${dialCentre.y} Z`}
                className={s.needleN}
              />
              <path
                d={`M ${dialCentre.x} ${dialCentre.y + dialR * 0.55} L ${dialCentre.x + 8 * k} ${dialCentre.y} L ${dialCentre.x - 8 * k} ${dialCentre.y} Z`}
                className={s.needleS}
              />
              <circle cx={dialCentre.x} cy={dialCentre.y - dialR * 0.8} r={13 * k} className={s.needleGrip} style={{ strokeWidth: 2 * k }} />
            </g>
            <circle cx={dialCentre.x} cy={dialCentre.y} r={7 * k} className={s.dialCap} />
          </g>
        </g>
      )}

      {/* ── BOUNDARY ── */}
      {mode === "boundary" && (
        <g>
          <polygon points={pts} className={s.polyFill} />
          <polygon points={pts} className={s.polyStroke} style={{ strokeWidth: 2.4 * k, strokeDasharray: `${10 * k} ${6 * k}` }} />
          {boundary.map((a, i) => {
            const b = boundary[(i + 1) % boundary.length];
            return (
              <line
                key={`edge${i}`}
                data-drag
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={s.edgeHit}
                style={{ strokeWidth: 18 * k }}
                onPointerDown={insertOnEdge(i)}
              >
                <title>Tap or drag here to add a corner</title>
              </line>
            );
          })}
          {bindu}
          {boundary.map((p, i) => (
            <g
              key={`v${i}`}
              data-drag
              tabIndex={0}
              role="button"
              aria-pressed={selectedVertex === i}
              aria-label={`Corner ${i + 1} of ${boundary.length}. Drag or use arrow keys to move; Delete removes it.`}
              className={`${s.handle} ${selectedVertex === i ? s.handleOn : ""}`}
              transform={`translate(${p.x} ${p.y})`}
              onPointerDown={startVertex(i)}
              onKeyDown={onVertexKey(i)}
              onFocus={() => props.onSelectVertex(i)}
            >
              <circle r={22 * k} className={s.hit} />
              <circle r={11 * k} className={s.handleRing} style={{ strokeWidth: 2 * k }} />
              <circle r={5 * k} className={s.handleDot} />
            </g>
          ))}
        </g>
      )}

      {/* ── ROOMS ── */}
      {mode === "rooms" && (
        <g>
          <polygon points={pts} className={s.polyQuiet} style={{ strokeWidth: 1.6 * k }} />
          <g clipPath="url(#pm-plan-clip)" className={s.zoneHints}>
            {ZONES8.map((_, i) => {
              const p = polar(centre, bigR, north + i * 45 + 22.5);
              return <line key={i} x1={centre.x} y1={centre.y} x2={p.x} y2={p.y} style={{ strokeWidth: 1 * k, strokeDasharray: `${4 * k} ${6 * k}` }} />;
            })}
          </g>
          {bindu}
          {rooms.map(renderPin)}
          <g ref={ghostRef} className={s.ghost} style={{ opacity: 0 }} aria-hidden>
            {activeType && (
              <>
                <circle r={11 * k} style={{ strokeWidth: 2 * k }} />
                <text dy="0.36em" textAnchor="middle" style={{ fontSize: 8.5 * k }}>
                  {ROOM_CODE[activeType]}
                </text>
              </>
            )}
          </g>
        </g>
      )}

      {/* ── FINDINGS ── */}
      {mode === "findings" && (
        <g key={revealKey} className={s.findings}>
          <g clipPath="url(#pm-plan-clip)">
            {ZONES8.map((z, i) => {
              const a0 = north + i * 45 - 22.5;
              const p1 = polar(centre, bigR, a0);
              const p2 = polar(centre, bigR, a0 + 45);
              return (
                <path
                  key={z}
                  d={`M ${centre.x} ${centre.y} L ${p1.x} ${p1.y} A ${bigR} ${bigR} 0 0 1 ${p2.x} ${p2.y} Z`}
                  className={`${s.wedge} ${i % 2 ? s.wedgeAlt : ""}`}
                  data-sakhi={`${ZONE_INFO[z].name} — the zone of ${ZONE_INFO[z].deity}, element ${ZONE_INFO[z].element}. Traditional colours: ${ZONE_INFO[z].colours}.`}
                />
              );
            })}
            {Array.from({ length: 16 }, (_, i) => {
              const p = polar(centre, bigR, north + i * 22.5 + 11.25);
              return <line key={`l16${i}`} x1={centre.x} y1={centre.y} x2={p.x} y2={p.y} className={s.ray16} style={{ strokeWidth: 0.9 * k }} />;
            })}
            {ZONES8.map((_, i) => {
              const p = polar(centre, bigR, north + i * 45 + 22.5);
              return <line key={`l8${i}`} x1={centre.x} y1={centre.y} x2={p.x} y2={p.y} className={s.ray8} style={{ strokeWidth: 1.8 * k }} pathLength={1} />;
            })}
          </g>

          {/* 3×3 Vastu Purusha mandala in the north-aligned frame */}
          <g transform={`rotate(${north} ${centre.x} ${centre.y})`} className={s.mandala}>
            {MANDALA.map((row, r) =>
              row.map((z, c) => {
                const x = centre.x + box.minX + c * cell.w;
                const y = centre.y + box.minY + r * cell.h;
                const isC = z === "C";
                const cut = cutZones.has(z);
                return (
                  <g key={z}>
                    {isC && <rect x={x} y={y} width={cell.w} height={cell.h} className={s.brahmaCell} />}
                    {cut && <rect x={x} y={y} width={cell.w} height={cell.h} fill="url(#pm-cut)" className={focusCut === z ? s.cutFocus : s.cutCell} style={{ strokeWidth: 2 * k }} />}
                  </g>
                );
              }),
            )}
            <rect x={centre.x + box.minX} y={centre.y + box.minY} width={box.maxX - box.minX} height={box.maxY - box.minY} className={s.gridLine} style={{ strokeWidth: 1.2 * k, strokeDasharray: `${6 * k} ${5 * k}` }} />
            {[1, 2].map((n) => (
              <g key={n}>
                <line x1={centre.x + box.minX + n * cell.w} y1={centre.y + box.minY} x2={centre.x + box.minX + n * cell.w} y2={centre.y + box.maxY} className={s.gridLine} style={{ strokeWidth: 1.2 * k, strokeDasharray: `${6 * k} ${5 * k}` }} />
                <line x1={centre.x + box.minX} y1={centre.y + box.minY + n * cell.h} x2={centre.x + box.maxX} y2={centre.y + box.minY + n * cell.h} className={s.gridLine} style={{ strokeWidth: 1.2 * k, strokeDasharray: `${6 * k} ${5 * k}` }} />
              </g>
            ))}
          </g>

          <polygon points={pts} className={s.polyFinal} style={{ strokeWidth: 2.2 * k }} />

          {zoneLabels.map(({ z, p }) => (
            <g key={`zl${z}`} transform={`translate(${p.x} ${p.y})`} className={s.zoneTag} aria-hidden>
              <rect x={-15 * k} y={-9 * k} width={30 * k} height={18 * k} rx={9 * k} />
              <text dy="0.36em" textAnchor="middle" style={{ fontSize: 9.5 * k }}>
                {z}
              </text>
            </g>
          ))}

          {DIR16.map((d, i) => edgeLabel(north + i * 22.5, d, i % 2 === 0, `d16${d}`))}

          {measuring && (
            <g className={s.sweep} style={{ transformOrigin: `${centre.x}px ${centre.y}px` }} aria-hidden>
              <path
                d={`M ${centre.x} ${centre.y} L ${centre.x} ${centre.y - bigR * 0.6} A ${bigR * 0.6} ${bigR * 0.6} 0 0 1 ${polar(centre, bigR * 0.6, 40).x} ${polar(centre, bigR * 0.6, 40).y} Z`}
                fill="url(#pm-sweep)"
              />
            </g>
          )}

          {bindu}
          {rooms.map(renderPin)}
        </g>
      )}
    </svg>
  );
}
