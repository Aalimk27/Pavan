/**
 * VASTU studio — presentation data and pure helpers.
 * Every direction, zone, centre and finding still comes from @/lib/vastu/engine;
 * this file only describes how to draw and label them.
 */

import { DIR16, ROOM_LABEL, type PlacedRoom, type Pt, type RoomType, type Severity, type Zone } from "@/lib/vastu/engine";

/* ───────────────────────── Rooms ───────────────────────── */

/** Palette order — the entrance first, because it must always be confirmed. */
export const ROOM_ORDER: RoomType[] = [
  "entrance",
  "living",
  "dining",
  "kitchen",
  "master",
  "bedroom",
  "toilet",
  "pooja",
  "study",
  "stairs",
  "balcony",
  "storage",
  "sump",
  "overhead",
];

/** Two-letter marks drawn inside each pin. */
export const ROOM_CODE: Record<RoomType, string> = {
  entrance: "EN",
  kitchen: "KI",
  master: "MB",
  bedroom: "BR",
  toilet: "WC",
  pooja: "PJ",
  living: "LV",
  dining: "DN",
  study: "SD",
  stairs: "ST",
  storage: "SG",
  balcony: "BL",
  sump: "UW",
  overhead: "OT",
};

/** A question Sakhi's brain recognises for each room (answers with the traditional rule card). */
export const ROOM_ASK: Record<RoomType, string> = {
  entrance: "Where should the main entrance be in Vastu?",
  kitchen: "Where should the kitchen be in Vastu?",
  master: "Where should the master bedroom be in Vastu?",
  bedroom: "Where should a bedroom be in Vastu?",
  toilet: "Where should the toilet be in Vastu?",
  pooja: "Where should the pooja room be in Vastu?",
  living: "Where should the living room be in Vastu?",
  dining: "Where should the dining area be in Vastu?",
  study: "Where should the study be in Vastu?",
  stairs: "Where should the staircase be in Vastu?",
  storage: "Where should heavy storage go in Vastu?",
  balcony: "Where should the balcony be in Vastu?",
  sump: "Where should the sump or borewell be in Vastu?",
  overhead: "Where should the overhead tank be in Vastu?",
};

/** "Bedroom 2", "Toilet / bath 1" … — numbered only when a type repeats. */
export function roomNames(rooms: PlacedRoom[]): Record<string, string> {
  const total: Partial<Record<RoomType, number>> = {};
  for (const r of rooms) total[r.type] = (total[r.type] ?? 0) + 1;
  const seen: Partial<Record<RoomType, number>> = {};
  const out: Record<string, string> = {};
  for (const r of rooms) {
    seen[r.type] = (seen[r.type] ?? 0) + 1;
    out[r.id] = (total[r.type] ?? 0) > 1 ? `${ROOM_LABEL[r.type]} ${seen[r.type]}` : ROOM_LABEL[r.type];
  }
  return out;
}

/* ───────────────────────── Severity ───────────────────────── */

export const SEVERITY_ORDER: Severity[] = ["priority", "gentle", "info", "strength"];

export const SEVERITY_META: Record<Severity, { label: string; group: string; colour: string; sakhi: string }> = {
  priority: {
    label: "Priority",
    group: "Give attention first",
    colour: "#c25a2c",
    sakhi: "Priority simply means 'start here'. Every one of these begins with a small habit — no renovation needed to begin.",
  },
  gentle: {
    label: "Gentle",
    group: "Gentle adjustments",
    colour: "#b4862a",
    sakhi: "Gentle adjustments are small, practical steps — furniture, light, colour, habit.",
  },
  info: {
    label: "Info",
    group: "Good to know",
    colour: "#0e7c86",
    sakhi: "Neutral placements. Nothing to fix — simple habits keep these zones balanced.",
  },
  strength: {
    label: "Strength",
    group: "Strengths",
    colour: "#22805a",
    sakhi: "These are what your home already does well. Notice them — gratitude for a good space matters too.",
  },
};

export const REMEDY_LEVELS = [
  { level: "behaviour", n: 1, name: "Behaviour & use", short: "Habit" },
  { level: "layout", n: 2, name: "Furniture & layout", short: "Layout" },
  { level: "colour", n: 3, name: "Colour, material & traditional remedy", short: "Colour" },
  { level: "renovation", n: 4, name: "Renovation", short: "Renovation" },
] as const;

/* ───────────────────────── Zones (presentation) ───────────────────────── */

/** Swatches that illustrate ZONE_INFO[zone].colours — illustration only. */
export const ZONE_SWATCH: Record<Zone, string[]> = {
  N: ["#5f9e7a", "#9cc3d5"],
  NE: ["#f6ecd2", "#ffffff", "#f3e39a"],
  E: ["#a9d3a0", "#ffffff"],
  SE: ["#e8833a", "#f2b6a6"],
  S: ["#b5573a", "#a0714f"],
  SW: ["#d9c4a0", "#7a5636", "#d1a84a"],
  W: ["#ffffff", "#a7adb3", "#5b7fb5"],
  NW: ["#ffffff", "#c9cdd2", "#f3ead6"],
  C: ["#fffdf7", "#fbecc0"],
};

/** Engine 3×3 mandala layout (row 0 = North, col 0 = West). */
export const MANDALA: Zone[][] = [
  ["NW", "N", "NE"],
  ["W", "C", "E"],
  ["SW", "S", "SE"],
];

export const ZONES8: Exclude<Zone, "C">[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

/* ───────────────────────── Geometry for drawing ───────────────────────── */

export const norm360 = (x: number) => ((x % 360) + 360) % 360;

/** Point at `imageDeg` (clockwise from image-up) and distance r from c. */
export function polar(c: Pt, r: number, imageDeg: number): Pt {
  const t = (imageDeg * Math.PI) / 180;
  return { x: c.x + r * Math.sin(t), y: c.y - r * Math.cos(t) };
}

/** Same rotation the engine uses to build its north-aligned mandala frame. */
export function toNorthFrame(p: Pt, c: Pt, northAngle: number): Pt {
  const t = (-northAngle * Math.PI) / 180;
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return { x: dx * Math.cos(t) - dy * Math.sin(t), y: dx * Math.sin(t) + dy * Math.cos(t) };
}

/** Bounding box of the boundary in the north-aligned frame (relative to c). */
export function northFrameBox(poly: Pt[], c: Pt, northAngle: number) {
  const rp = poly.map((p) => toNorthFrame(p, c, northAngle));
  const xs = rp.map((p) => p.x);
  const ys = rp.map((p) => p.y);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
}

/** Where a ray from c at `imageDeg` leaves the rectangle [x0,x1]×[y0,y1]. */
export function rayToRect(c: Pt, imageDeg: number, x0: number, y0: number, x1: number, y1: number): Pt {
  const t = (imageDeg * Math.PI) / 180;
  const dx = Math.sin(t);
  const dy = -Math.cos(t);
  const ts: number[] = [];
  if (dx > 1e-9) ts.push((x1 - c.x) / dx);
  if (dx < -1e-9) ts.push((x0 - c.x) / dx);
  if (dy > 1e-9) ts.push((y1 - c.y) / dy);
  if (dy < -1e-9) ts.push((y0 - c.y) / dy);
  const k = Math.max(0, Math.min(...ts.filter((v) => v >= 0)));
  return { x: c.x + dx * k, y: c.y + dy * k };
}

/** Closest point to p on segment ab. */
export function projectOnSegment(p: Pt, a: Pt, b: Pt): Pt {
  const vx = b.x - a.x;
  const vy = b.y - a.y;
  const len = vx * vx + vy * vy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / len));
  return { x: a.x + vx * t, y: a.y + vy * t };
}

/** Which way the top edge of the image faces, given where North points. */
export function topFaces(northAngle: number): string {
  return DIR16[Math.floor(norm360(-northAngle + 11.25) / 22.5) % 16];
}

export const DIR16_NAME: Record<string, string> = {
  N: "North",
  NNE: "North-North-East",
  NE: "North-East",
  ENE: "East-North-East",
  E: "East",
  ESE: "East-South-East",
  SE: "South-East",
  SSE: "South-South-East",
  S: "South",
  SSW: "South-South-West",
  SW: "South-West",
  WSW: "West-South-West",
  W: "West",
  WNW: "West-North-West",
  NW: "North-West",
  NNW: "North-North-West",
};

export const insetRect = (w: number, h: number, f = 0.12): Pt[] => [
  { x: w * f, y: h * f },
  { x: w * (1 - f), y: h * f },
  { x: w * (1 - f), y: h * (1 - f) },
  { x: w * f, y: h * (1 - f) },
];

/* ───────────────────────── Sample home ───────────────────────── */

/**
 * The sample plan is drawn by us (public/samples/sample-floorplan.svg), so its outer
 * walls and room positions are known. They are offered as *suggestions* — the visitor
 * still confirms North, the boundary and every label before any finding appears.
 */
export const SAMPLE = {
  src: "/samples/sample-floorplan.svg",
  name: "Sample home · 3 BHK",
  w: 1000,
  h: 800,
  north: 0,
  boundary: [
    { x: 83, y: 103 },
    { x: 917, y: 103 },
    { x: 917, y: 707 },
    { x: 83, y: 707 },
  ] as Pt[],
  rooms: [
    { type: "entrance", at: { x: 905, y: 333 } },
    { type: "living", at: { x: 530, y: 250 } },
    { type: "balcony", at: { x: 430, y: 140 } },
    { type: "pooja", at: { x: 815, y: 165 } },
    { type: "dining", at: { x: 480, y: 440 } },
    { type: "kitchen", at: { x: 800, y: 600 } },
    { type: "master", at: { x: 210, y: 610 } },
    { type: "bedroom", at: { x: 200, y: 205 } },
    { type: "bedroom", at: { x: 195, y: 360 } },
    { type: "toilet", at: { x: 845, y: 470 } },
    { type: "toilet", at: { x: 430, y: 640 } },
    { type: "stairs", at: { x: 610, y: 600 } },
  ] as Array<{ type: RoomType; at: Pt }>,
};

/* ───────────────────────── Images ───────────────────────── */

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("image"));
    img.src = src;
  });
}

/**
 * A modest, honest first guess at the exterior boundary: the outer extent of the
 * drawing's thick wall lines (runs of ≥3 strong rows/columns, so thin dimension
 * lines and text are ignored). Returns a rectangle in plan units, or null.
 */
export function detectOuterWalls(img: HTMLImageElement, w: number, h: number): Pt[] | null {
  try {
    const scale = Math.min(1, 520 / Math.max(img.naturalWidth, img.naturalHeight));
    const cw = Math.max(16, Math.round(img.naturalWidth * scale));
    const ch = Math.max(16, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, 0, 0, cw, ch);
    const { data } = ctx.getImageData(0, 0, cw, ch);

    // Adaptive darkness threshold from the luminance histogram.
    let sum = 0;
    const lum = new Float32Array(cw * ch);
    for (let i = 0; i < cw * ch; i++) {
      const l = 0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2];
      lum[i] = l;
      sum += l;
    }
    const mean = sum / (cw * ch);
    const thr = Math.min(120, mean * 0.55);
    const col = new Uint32Array(cw);
    const row = new Uint32Array(ch);
    for (let y = 0; y < ch; y++) {
      for (let x = 0; x < cw; x++) {
        if (lum[y * cw + x] < thr) {
          col[x]++;
          row[y]++;
        }
      }
    }
    const edges = (counts: Uint32Array): [number, number] | null => {
      const max = Math.max(...counts);
      if (max < 8) return null;
      const strong = (i: number) => counts[i] >= max * 0.32;
      let a = -1;
      let b = -1;
      for (let i = 0; i + 2 < counts.length; i++) if (strong(i) && strong(i + 1) && strong(i + 2)) { a = i; break; }
      for (let i = counts.length - 1; i - 2 >= 0; i--) if (strong(i) && strong(i - 1) && strong(i - 2)) { b = i; break; }
      if (a < 0 || b < 0 || b - a < counts.length * 0.25) return null;
      return [a, b];
    };
    const ex = edges(col);
    const ey = edges(row);
    if (!ex || !ey) return null;
    const sx = w / cw;
    const sy = h / ch;
    return [
      { x: ex[0] * sx, y: ey[0] * sy },
      { x: (ex[1] + 1) * sx, y: ey[0] * sy },
      { x: (ex[1] + 1) * sx, y: (ey[1] + 1) * sy },
      { x: ex[0] * sx, y: (ey[1] + 1) * sy },
    ];
  } catch {
    return null;
  }
}
