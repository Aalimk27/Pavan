"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import { ROOM_LABEL, ZONE_INFO, analyse, bestZonesFor, polygonCentroid, type PlacedRoom, type Pt, type RoomType, type Severity } from "@/lib/vastu/engine";
import { sakhi } from "@/components/sakhi/bus";
import { track } from "@/lib/analytics";
import PlanStage, { type StageMode, type StagePlan } from "./PlanStage";
import FindingsPanel from "./FindingsPanel";
import { DIR16_NAME, ROOM_ASK, ROOM_CODE, ROOM_ORDER, SAMPLE, SEVERITY_META, detectOuterWalls, insetRect, loadImage, roomNames, topFaces } from "./studio-data";
import s from "./studio.module.css";

type Step = 0 | 1 | 2 | 3 | 4;
type Plan = StagePlan & { kind: "sample" | "upload" };

const STEPS = [
  { n: 1, label: "Plan", sakhi: "Start with a JPG or PNG of your floor plan — or the sample home." },
  { n: 2, label: "North", sakhi: "Confirming North is the single most important step. Everything else is measured from it." },
  { n: 3, label: "Boundary", sakhi: "The exterior boundary decides where your home's centre — the Brahmasthan — falls." },
  { n: 4, label: "Rooms", sakhi: "Label the main entrance and each room you know. Every finding is tied to one of these pins." },
  { n: 5, label: "Findings", sakhi: "Findings appear only after you've confirmed North, the boundary and the rooms." },
] as const;

const MAX_BYTES = 20 * 1024 * 1024;
export const SAMPLE_EVENT = "pm:vastu-sample";

const uid = () => Math.random().toString(36).slice(2, 9);
const zoneList = (zs: string[]) => (zs.length <= 1 ? zs.join("") : `${zs.slice(0, -1).join(", ")} or ${zs[zs.length - 1]}`);

export default function VastuStudio() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [step, setStep] = useState<Step>(0);
  const [north, setNorthState] = useState(0);
  const [boundary, setBoundaryState] = useState<Pt[]>([]);
  const [rooms, setRoomsState] = useState<PlacedRoom[]>([]);
  const [confirmed, setConfirmed] = useState({ north: false, boundary: false, rooms: false });
  const [selectedVertex, setSelectedVertex] = useState<number | null>(null);
  const [selectedPin, setSelectedPin] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<RoomType | null>("entrance");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [measuring, setMeasuring] = useState(false);
  const [revealKey, setRevealKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [origin, setOrigin] = useState<"sample" | "detected" | "inset">("inset");
  const [initialBoundary, setInitialBoundary] = useState<Pt[]>([]);

  const fileRef = useRef<HTMLInputElement>(null);
  const objectUrl = useRef<string | null>(null);
  const lastWhisper = useRef(0);
  const placedTypes = useRef(new Set<RoomType>());
  const prevSeverity = useRef<Record<string, Severity>>({});
  const studioRef = useRef<HTMLDivElement>(null);

  const W = plan?.w ?? 1000;
  const H = plan?.h ?? 800;
  const centre = useMemo(() => (boundary.length >= 3 ? polygonCentroid(boundary) : { x: W / 2, y: H / 2 }), [boundary, W, H]);
  const names = useMemo(() => roomNames(rooms), [rooms]);
  const ready = confirmed.north && confirmed.boundary && confirmed.rooms;
  const analysis = useMemo(() => (ready && step === 4 && boundary.length >= 3 ? analyse(boundary, north, rooms) : null), [ready, step, boundary, north, rooms]);

  /* ───────────── Sakhi, gently (never a stream of whispers) ───────────── */
  const whisper = useCallback((text: string, opts: Parameters<typeof sakhi.whisper>[1] = {}, force = false) => {
    const now = Date.now();
    if (!force && now - lastWhisper.current < 2400) return;
    lastWhisper.current = now;
    sakhi.whisper(text, opts);
  }, []);

  /* ───────────── edits (an edit undoes that step's confirmation) ───────────── */
  const setNorth = useCallback((deg: number) => {
    setNorthState(deg);
    setConfirmed((c) => (c.north ? { ...c, north: false } : c));
  }, []);
  const setBoundary = useCallback((poly: Pt[]) => {
    setBoundaryState(poly);
    setConfirmed((c) => (c.boundary ? { ...c, boundary: false } : c));
  }, []);
  const setRooms = useCallback(
    (next: PlacedRoom[]) => {
      setRoomsState(next);
      // In Findings, moving a pin is a live "what if" on confirmed labels.
      if (step !== 4) setConfirmed((c) => (c.rooms ? { ...c, rooms: false } : c));
    },
    [step],
  );

  /* ───────────── loading a plan ───────────── */
  const resetFor = (p: Plan, poly: Pt[], rs: PlacedRoom[], northDeg: number, o: typeof origin) => {
    setPlan(p);
    setNorthState(northDeg);
    setBoundaryState(poly);
    setInitialBoundary(poly);
    setRoomsState(rs);
    setOrigin(o);
    setConfirmed({ north: false, boundary: false, rooms: false });
    setSelectedPin(null);
    setSelectedVertex(null);
    setFocusId(null);
    setActiveType(rs.some((r) => r.type === "entrance") ? null : "entrance");
    placedTypes.current = new Set(rs.map((r) => r.type));
    setError(null);
    setStep(1);
  };

  const loadSample = useCallback(() => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    resetFor(
      { src: SAMPLE.src, w: SAMPLE.w, h: SAMPLE.h, name: SAMPLE.name, kind: "sample" },
      SAMPLE.boundary.map((p) => ({ ...p })),
      SAMPLE.rooms.map((r, i) => ({ id: `s${i}`, type: r.type, at: { ...r.at } })),
      SAMPLE.north,
      "sample",
    );
    track("floorplan_uploaded", { source: "sample", pillar: "vastu" });
    sakhi.mood("joy", 1400);
    whisper("Here's a sample 3-bedroom home. Its drawn arrow points straight up, so North is 0°. Check the needle, then confirm.", { selector: "#vastu-stage" }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [whisper]);

  const acceptFile = async (file: File) => {
    setError(null);
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
      setError("PDF plans are accepted for the paid annotated report. For this free in-browser preview, please use a JPG or PNG — a screenshot or a straight phone photo of the plan works well.");
      whisper("PDFs come with the full report. For the preview, a JPG or PNG screenshot of the same plan is perfect.", { selector: "#vastu-panel" }, true);
      return;
    }
    if (!/^image\/(png|jpe?g)$/i.test(file.type) && !/\.(png|jpe?g)$/i.test(file.name)) {
      setError("Please choose a JPG or PNG image of your floor plan.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("That image is larger than 20 MB. A smaller export or a screenshot of the plan works just as well.");
      return;
    }
    setLoading(true);
    const url = URL.createObjectURL(file);
    try {
      const img = await loadImage(url);
      const nw = img.naturalWidth;
      const nh = img.naturalHeight;
      if (nw < 120 || nh < 120) throw new Error("small");
      const sc = 1000 / Math.max(nw, nh);
      const w = Math.round(nw * sc);
      const h = Math.round(nh * sc);
      const detected = detectOuterWalls(img, w, h);
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      objectUrl.current = url;
      resetFor({ src: url, w, h, name: file.name, kind: "upload" }, detected ?? insetRect(w, h), [], 0, detected ? "detected" : "inset");
      track("floorplan_uploaded", { source: "upload", pillar: "vastu", file_type: file.type || "image", size_kb: Math.round(file.size / 1024) });
      sakhi.mood("joy", 1400);
      whisper("Your plan is here — and it stays in this browser. First: which way is North on it?", { selector: "#vastu-stage" }, true);
    } catch {
      URL.revokeObjectURL(url);
      setError("We couldn't read that image. Please try a clear JPG or PNG export of the plan.");
    } finally {
      setLoading(false);
    }
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) void acceptFile(f);
    e.target.value = "";
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) void acceptFile(f);
  };

  useEffect(() => {
    const onSample = () => {
      loadSample();
      studioRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    };
    window.addEventListener(SAMPLE_EVENT, onSample);
    return () => window.removeEventListener(SAMPLE_EVENT, onSample);
  }, [loadSample]);

  useEffect(
    () => () => {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );

  /* ───────────── step flow ───────────── */
  const canVisit = (n: Step) => n === 0 || (n < 4 ? !!plan : ready);

  const goTo = (n: Step) => {
    if (!canVisit(n) || n === step) return;
    setStep(n);
    setSelectedVertex(null);
    setSelectedPin(null);
    if (n === 4) return reveal();
    whisper(STEPS[n].sakhi, { selector: "#vastu-panel" }, true);
  };

  const reveal = () => {
    setStep(4);
    setFocusId(null);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMeasuring(true);
    sakhi.mood("thinking", 1600);
    const result = analyse(boundary, north, rooms);
    window.setTimeout(
      () => {
        setMeasuring(false);
        setRevealKey((k) => k + 1);
        prevSeverity.current = Object.fromEntries(result.findings.map((f) => [f.id, f.severity]));
        const { strengths, gentle, priority, info } = result.summary;
        const bits = [
          `${strengths} strength${strengths === 1 ? "" : "s"}`,
          priority ? `${priority} to look at first` : null,
          gentle ? `${gentle} gentle adjustment${gentle === 1 ? "" : "s"}` : null,
          info ? `${info} neutral` : null,
        ].filter(Boolean);
        sakhi.celebrate(`Your home is mapped: ${bits.join(", ")}. Tap any pin to see why.`);
        lastWhisper.current = Date.now();
        track("report_previewed", { pillar: "vastu", rules: result.version, ...result.summary, rooms: rooms.length, corners: boundary.length });
        track("upsell_viewed", { product_id: "vastu-report", placement: "vastu_studio" });
      },
      reduce ? 150 : 1500,
    );
  };

  const confirmNorth = () => {
    setConfirmed((c) => ({ ...c, north: true }));
    setStep(2);
    whisper(`North confirmed at ${north}° — the top of your plan faces ${DIR16_NAME[topFaces(north)]}. Now trace the outer walls.`, { selector: "#vastu-stage" }, true);
  };

  const confirmBoundary = () => {
    setConfirmed((c) => ({ ...c, boundary: true }));
    setStep(3);
    setSelectedVertex(null);
    whisper(
      plan?.kind === "sample" && rooms.length
        ? "Boundary confirmed. I've suggested the sample's rooms — check each pin, then confirm."
        : "Boundary confirmed — that glowing point is your Brahmasthan. Now mark the main entrance.",
      { selector: "#vastu-stage" },
      true,
    );
  };

  const confirmRooms = () => {
    setConfirmed((c) => ({ ...c, rooms: true }));
    setSelectedPin(null);
    setActiveType(null);
    reveal();
  };

  const restart = () => {
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    objectUrl.current = null;
    setPlan(null);
    setStep(0);
    setRoomsState([]);
    setBoundaryState([]);
    setConfirmed({ north: false, boundary: false, rooms: false });
    setFocusId(null);
    setError(null);
  };

  /* ───────────── rooms ───────────── */
  const place = (at: Pt) => {
    if (!activeType) return;
    const id = uid();
    const type = activeType;
    setRooms([...rooms, { id, type, at }]);
    setSelectedPin(id);
    setActiveType(null);
    if (!placedTypes.current.has(type)) {
      placedTypes.current.add(type);
      const best = bestZonesFor(type).map((z) => ZONE_INFO[z].name);
      whisper(
        type === "entrance"
          ? "Main entrance marked. Now the kitchen, bedrooms, toilets and pooja — as many as you know."
          : `${ROOM_LABEL[type]} placed.${best.length ? ` Tradition favours the ${zoneList(best)} — we'll see where yours sits.` : ""}`,
        { selector: "#vastu-stage", cta: { label: "Why?", message: ROOM_ASK[type] } },
        true,
      );
    }
  };

  const removePin = (id: string) => {
    setRooms(rooms.filter((r) => r.id !== id));
    if (selectedPin === id) setSelectedPin(null);
  };

  const retype = (id: string, type: RoomType) => setRooms(rooms.map((r) => (r.id === id ? { ...r, type } : r)));

  const onPinMoved = (id: string) => {
    if (step !== 4) return;
    const next = analyse(boundary, north, rooms);
    const f = next.findings.find((x) => x.id === id);
    const before = prevSeverity.current[id];
    prevSeverity.current = Object.fromEntries(next.findings.map((x) => [x.id, x.severity]));
    setFocusId(id);
    if (f && before && before !== f.severity) {
      whisper(`${names[id] ?? f.subject} now sits in the ${ZONE_INFO[f.zone].name} — ${SEVERITY_META[f.severity].label.toLowerCase()}. This is only a what-if; your confirmed labels haven't changed.`, { selector: "#vastu-stage" }, true);
    }
  };

  const hasEntrance = rooms.some((r) => r.type === "entrance");
  const otherRooms = rooms.filter((r) => r.type !== "entrance").length;
  const selected = rooms.find((r) => r.id === selectedPin) ?? null;
  const focused = analysis?.findings.find((f) => f.id === focusId) ?? null;

  const mode: StageMode = step === 1 ? "north" : step === 2 ? "boundary" : step === 3 ? "rooms" : "findings";
  const hint =
    step === 1
      ? "Drag the needle — or use the dial's arrow keys"
      : step === 2
        ? "Drag corners · tap an edge to add one · select + Delete removes"
        : step === 3
          ? activeType
            ? `Tap the plan where the ${ROOM_LABEL[activeType].toLowerCase()} is`
            : "Choose a label, then tap the plan · drag pins to adjust"
          : measuring
            ? "Measuring from the Brahmasthan…"
            : "Tap a pin to see its finding · drag a pin to explore a what-if";

  const done = (n: number) => (n === 0 ? !!plan : n === 1 ? confirmed.north : n === 2 ? confirmed.boundary : n === 3 ? confirmed.rooms : step === 4 && !measuring);

  return (
    <div className={s.studio} ref={studioRef} id="studio-app">
      {/* Stepper */}
      <ol className={s.stepper} aria-label="Studio steps">
        {STEPS.map((st, i) => {
          const n = i as Step;
          const state = step === n ? "current" : done(n) ? "done" : canVisit(n) ? "open" : "locked";
          return (
            <li key={st.label} className={`${s.stepItem} ${s[`step_${state}`]}`}>
              <button type="button" onClick={() => goTo(n)} disabled={!canVisit(n)} aria-current={step === n ? "step" : undefined} data-sakhi={st.sakhi}>
                <span className={s.stepDot} aria-hidden>
                  {state === "done" ? "✓" : st.n}
                </span>
                <span className={s.stepLabel}>{st.label}</span>
                <span className="visually-hidden">{state === "done" ? " (confirmed)" : state === "locked" ? " (locked until the earlier steps are confirmed)" : ""}</span>
              </button>
            </li>
          );
        })}
      </ol>

      <div className={s.layout}>
        {/* Stage */}
        <div className={s.stageCol}>
          {plan && (
            <div className={s.toolbar}>
              <span className={s.planName} title={plan.name}>
                {plan.kind === "sample" ? "Sample" : "Your plan"} · {plan.name}
              </span>
              <span className={s.northChip} data-sakhi="This is where North points on your plan, measured clockwise from the top edge.">
                <span className={s.northArrow} style={{ transform: `rotate(${north}deg)` }} aria-hidden>
                  ▲
                </span>
                N {north}°
              </span>
              <button type="button" className={s.textBtn} onClick={restart}>
                Start again
              </button>
            </div>
          )}

          <div
            id="vastu-stage"
            className={`${s.stage} ${dragOver ? s.stageDrag : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
          >
            {plan ? (
              <PlanStage
                plan={plan}
                mode={mode === "findings" && step !== 4 ? "rooms" : step === 0 ? "north" : mode}
                north={north}
                onNorth={setNorth}
                boundary={boundary}
                onBoundary={setBoundary}
                centre={centre}
                rooms={rooms}
                names={names}
                onRooms={setRooms}
                activeType={activeType}
                onPlace={place}
                selectedVertex={selectedVertex}
                onSelectVertex={setSelectedVertex}
                selectedPin={selectedPin}
                onSelectPin={setSelectedPin}
                onPinMoved={onPinMoved}
                analysis={analysis}
                focusId={focusId}
                onFocus={setFocusId}
                measuring={measuring}
                revealKey={revealKey}
              />
            ) : (
              <EmptyStage loading={loading} onPick={() => fileRef.current?.click()} onSample={loadSample} />
            )}

            {plan && step === 4 && focused && !measuring && (
              <div className={s.callout} role="status" style={{ ["--sev" as string]: SEVERITY_META[focused.severity].colour } as React.CSSProperties}>
                <span className={s.calloutSev}>{SEVERITY_META[focused.severity].label}</span>
                <strong>{names[focused.id] ?? focused.subject}</strong>
                <span className={s.calloutZone}>
                  {ZONE_INFO[focused.zone].name}
                  {focused.zone16 ? ` · ${focused.zone16}` : ""}
                </span>
                <button
                  type="button"
                  className={s.calloutMore}
                  onClick={() => document.getElementById(`finding-${focused.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" })}
                >
                  Details ↓
                </button>
              </div>
            )}
          </div>

          {plan && (
            <p className={s.hint} aria-live="polite">
              <span aria-hidden>✦</span> {hint}
            </p>
          )}
        </div>

        {/* Panel */}
        <div className={s.panel} id="vastu-panel">
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg,application/pdf,.pdf" className="visually-hidden" onChange={onFile} tabIndex={-1} aria-hidden />

          {step === 0 && (
            <section className={s.pane} aria-labelledby="pane-plan">
              <p className={s.paneKicker}>Step 1 of 5</p>
              <h3 id="pane-plan">Begin with your floor plan</h3>
              <p className={s.paneText}>
                A JPG or PNG — a clean export, a scan, or a straight phone photo of the drawing. For this free preview your plan is processed <strong>only in your browser</strong>; nothing is uploaded.
              </p>
              <button type="button" className={`${s.drop} ${dragOver ? s.dropOn : ""}`} onClick={() => fileRef.current?.click()} disabled={loading}>
                <span className={s.dropIcon} aria-hidden>
                  ⇪
                </span>
                <span>
                  <strong>{loading ? "Reading your plan…" : "Choose a JPG or PNG"}</strong>
                  <span className={s.dropSub}>or drop it on the drafting table</span>
                </span>
              </button>
              <p className={s.fine}>PDF plans are accepted for the paid annotated report.</p>

              <div className={s.or}>
                <span>or</span>
              </div>

              <button type="button" className={s.sampleCard} onClick={loadSample} data-sakhi="The sample is a 3-bedroom home drawn for this studio. A perfect way to see every step in a minute.">
                <Image src={SAMPLE.src} alt="" width={150} height={120} unoptimized className={s.sampleThumb} />
                <span>
                  <strong>Try a sample home</strong>
                  <span className={s.dropSub}>3 BHK · entrance, pooja, kitchen, three bedrooms, two toilets, stairs</span>
                </span>
                <span className={s.sampleGo} aria-hidden>
                  →
                </span>
              </button>
              {error && (
                <p className="error-text" role="alert">
                  {error}
                </p>
              )}
            </section>
          )}

          {step === 1 && plan && (
            <section className={s.pane} aria-labelledby="pane-north">
              <p className={s.paneKicker}>Step 2 of 5 · Confirm</p>
              <h3 id="pane-north">Which way is North?</h3>
              <p className={s.paneText}>
                Turn the gold needle until it matches the north arrow printed on your plan. No arrow? Stand at the main door with a phone compass and note which way the plan&apos;s top edge faces.
              </p>
              <div className={s.northControls}>
                <div className="field">
                  <label htmlFor="vastu-north">North, degrees clockwise from the top</label>
                  <div className={s.degRow}>
                    <button type="button" className={s.nudge} onClick={() => setNorth((north + 345) % 360)} aria-label="Turn 15 degrees anticlockwise">
                      −15
                    </button>
                    <button type="button" className={s.nudge} onClick={() => setNorth((north + 359) % 360)} aria-label="Turn 1 degree anticlockwise">
                      −1
                    </button>
                    <input
                      id="vastu-north"
                      className={`input ${s.degInput}`}
                      type="number"
                      inputMode="numeric"
                      min={0}
                      max={359}
                      step={1}
                      value={north}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        if (Number.isFinite(v)) setNorth(((Math.round(v) % 360) + 360) % 360);
                      }}
                    />
                    <button type="button" className={s.nudge} onClick={() => setNorth((north + 1) % 360)} aria-label="Turn 1 degree clockwise">
                      +1
                    </button>
                    <button type="button" className={s.nudge} onClick={() => setNorth((north + 15) % 360)} aria-label="Turn 15 degrees clockwise">
                      +15
                    </button>
                  </div>
                </div>
                <div className={s.readout} data-sakhi="The edge of the plan that sits at the top of your screen faces this direction in the real world.">
                  <span className={s.readoutLabel}>Top of plan faces</span>
                  <span className={s.readoutValue}>
                    {DIR16_NAME[topFaces(north)]} <span className="muted">({topFaces(north)})</span>
                  </span>
                </div>
              </div>
              <p className={`note ${s.noteTight}`}>North matters most: even 15° can move a room into a neighbouring zone.</p>
              <button type="button" className={`btn btn--forest ${s.confirm}`} onClick={confirmNorth}>
                {confirmed.north ? "North confirmed ✓ — continue" : `Confirm North at ${north}°`}
              </button>
            </section>
          )}

          {step === 2 && plan && (
            <section className={s.pane} aria-labelledby="pane-boundary">
              <p className={s.paneKicker}>Step 3 of 5 · Confirm</p>
              <h3 id="pane-boundary">Trace the exterior boundary</h3>
              <p className={s.paneText}>
                {origin === "sample"
                  ? "The sample's outer walls are traced for you. "
                  : origin === "detected"
                    ? "We found the outer extent of your drawing's thick wall lines and started there. "
                    : "We've placed a starting rectangle. "}
                Move each corner onto the outside face of the exterior walls, including balconies and projections that belong to the home.
              </p>
              <ul className={s.howto}>
                <li>
                  <span aria-hidden>◆</span> Drag a corner to move it
                </li>
                <li>
                  <span aria-hidden>◆</span> Tap an edge to add a corner (L-shapes, cuts)
                </li>
                <li>
                  <span aria-hidden>◆</span> Select a corner, then Delete to remove it
                </li>
                <li>
                  <span aria-hidden>◆</span> Arrow keys nudge · Shift for larger steps
                </li>
              </ul>
              <p className={s.status} data-sakhi="As you move corners, the Brahmasthan moves with them — it is the true geometric centre of the shape you draw.">
                <strong>{boundary.length}</strong> corners · the Brahmasthan follows your shape
              </p>
              <div className="row">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  disabled={selectedVertex === null || boundary.length <= 3}
                  onClick={() => {
                    if (selectedVertex === null) return;
                    setBoundary(boundary.filter((_, j) => j !== selectedVertex));
                    setSelectedVertex(null);
                  }}
                >
                  Remove selected corner
                </button>
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => setBoundary(initialBoundary.map((p) => ({ ...p })))}>
                  Reset outline
                </button>
              </div>
              <button type="button" className={`btn btn--forest ${s.confirm}`} onClick={confirmBoundary} disabled={boundary.length < 3}>
                {confirmed.boundary ? "Boundary confirmed ✓ — continue" : "Confirm boundary"}
              </button>
            </section>
          )}

          {step === 3 && plan && (
            <section className={s.pane} aria-labelledby="pane-rooms">
              <p className={s.paneKicker}>Step 4 of 5 · Confirm</p>
              <h3 id="pane-rooms">Mark the entrance and rooms</h3>
              <p className={s.paneText}>
                {plan.kind === "sample" && rooms.length
                  ? "The sample's rooms are suggested. Check each pin — move any that look wrong — then confirm."
                  : "Choose a label, then tap the plan where that room is. Drag a pin to adjust it."}
              </p>
              <div className={s.palette} role="group" aria-label="Room labels">
                {ROOM_ORDER.map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={activeType === t}
                    className={`${s.chip} ${activeType === t ? s.chipOn : ""} ${t === "entrance" && !hasEntrance ? s.chipNeed : ""}`}
                    onClick={() => setActiveType(activeType === t ? null : t)}
                  >
                    <span className={s.chipCode} aria-hidden>
                      {ROOM_CODE[t]}
                    </span>
                    {ROOM_LABEL[t]}
                  </button>
                ))}
              </div>

              {selected && (
                <div className={s.selected}>
                  <label className="label" htmlFor="vastu-retype">
                    Selected pin
                  </label>
                  <div className={s.selectedRow}>
                    <select id="vastu-retype" className="select" value={selected.type} onChange={(e) => retype(selected.id, e.target.value as RoomType)}>
                      {ROOM_ORDER.map((t) => (
                        <option key={t} value={t}>
                          {ROOM_LABEL[t]}
                        </option>
                      ))}
                    </select>
                    <button type="button" className="btn btn--ghost btn--sm" onClick={() => removePin(selected.id)}>
                      Remove
                    </button>
                  </div>
                </div>
              )}

              {rooms.length > 0 && (
                <ul className={s.pinList} aria-label="Placed labels">
                  {rooms.map((r) => (
                    <li key={r.id} className={selectedPin === r.id ? s.pinListOn : ""}>
                      <button type="button" className={s.pinListName} onClick={() => setSelectedPin(r.id)}>
                        <span className={s.chipCode} aria-hidden>
                          {ROOM_CODE[r.type]}
                        </span>
                        {names[r.id]}
                      </button>
                      <button type="button" className={s.pinListX} onClick={() => removePin(r.id)} aria-label={`Remove ${names[r.id]}`}>
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <ul className={s.checklist} aria-label="Before findings">
                <li className={hasEntrance ? s.ok : ""}>
                  <span aria-hidden>{hasEntrance ? "✓" : "○"}</span> Main entrance marked
                </li>
                <li className={otherRooms > 0 ? s.ok : ""}>
                  <span aria-hidden>{otherRooms > 0 ? "✓" : "○"}</span> At least one room labelled
                </li>
              </ul>
              <button type="button" className={`btn ${s.confirm}`} onClick={confirmRooms} disabled={!hasEntrance || otherRooms === 0}>
                Confirm labels &amp; see findings
              </button>
            </section>
          )}

          {step === 4 && plan && (
            <FindingsPanel
              analysis={analysis}
              measuring={measuring}
              names={names}
              rooms={rooms}
              north={north}
              corners={boundary.length}
              planKind={plan.kind}
              focusId={focusId}
              onFocus={setFocusId}
              onAdjust={() => goTo(3)}
              onRestart={restart}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyStage({ loading, onPick, onSample }: { loading: boolean; onPick: () => void; onSample: () => void }) {
  return (
    <div className={s.empty}>
      <svg viewBox="0 0 400 300" className={s.emptyArt} aria-hidden>
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <rect x="70" y="40" width="260" height="220" strokeDasharray="6 6" />
          <line x1="156.7" y1="40" x2="156.7" y2="260" strokeDasharray="2 6" />
          <line x1="243.3" y1="40" x2="243.3" y2="260" strokeDasharray="2 6" />
          <line x1="70" y1="113.3" x2="330" y2="113.3" strokeDasharray="2 6" />
          <line x1="70" y1="186.7" x2="330" y2="186.7" strokeDasharray="2 6" />
          <circle cx="200" cy="150" r="118" opacity="0.5" />
        </g>
        <circle cx="200" cy="150" r="5" className={s.emptyBindu} />
        <text x="200" y="22" textAnchor="middle" className={s.emptyN}>
          N
        </text>
      </svg>
      <div className={s.emptyText}>
        <p className={s.emptyTitle}>Your floor plan appears here</p>
        <p className={s.emptySub}>Drop a JPG or PNG on the table — it never leaves this browser.</p>
        <div className="row" style={{ justifyContent: "center" }}>
          <button type="button" className="btn btn--sm" onClick={onPick} disabled={loading}>
            {loading ? "Reading…" : "Choose a plan"}
          </button>
          <button type="button" className={`btn btn--ghost btn--sm ${s.emptyGhost}`} onClick={onSample}>
            Try the sample home
          </button>
        </div>
      </div>
    </div>
  );
}
