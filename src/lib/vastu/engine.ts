/**
 * VASTU — Spatial Intelligence Engine (blueprint §7). BETA.
 *
 * Pipeline: customer confirms North + exterior boundary + room labels →
 * engine computes geometric centre (Brahmasthan), overlays the directional grid,
 * and evaluates each confirmed element against frozen traditional rules.
 *
 * Every finding stores rule, severity, confidence and evidence location.
 * Remedy hierarchy: behaviour/use → furniture/layout → colour/material/traditional → renovation.
 * Structural suggestions always require architect/engineer review.
 */

export const VASTU_RULES_VERSION = "vastu-rules/0.9.0-beta";

export interface Pt {
  x: number;
  y: number;
}

export type Dir8 = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
export type Zone = Dir8 | "C";

export const DIR16 = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"] as const;

export const ZONE_INFO: Record<Zone, { name: string; deity: string; element: string; colours: string }> = {
  N: { name: "North", deity: "Kubera", element: "Water", colours: "greens and soft blues" },
  NE: { name: "North-East", deity: "Ishanya", element: "Water · Ether", colours: "cream, white and light yellow" },
  E: { name: "East", deity: "Indra · Surya", element: "Air · Light", colours: "light green and white" },
  SE: { name: "South-East", deity: "Agni", element: "Fire", colours: "warm oranges and soft pinks" },
  S: { name: "South", deity: "Yama", element: "Fire · Earth", colours: "terracotta and warm earth" },
  SW: { name: "South-West", deity: "Nirriti", element: "Earth", colours: "beige, brown and earthy yellow" },
  W: { name: "West", deity: "Varuna", element: "Water · Space", colours: "white, grey and blue" },
  NW: { name: "North-West", deity: "Vayu", element: "Air", colours: "white, silver and cream" },
  C: { name: "Brahmasthan (Centre)", deity: "Brahma", element: "Space", colours: "light, open and uncluttered" },
};

/* ───────────────────────────── Geometry ───────────────────────────── */

export function polygonArea(poly: Pt[]): number {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return a / 2;
}

/** Geometric centre (area centroid) of a simple polygon — the Brahmasthan. */
export function polygonCentroid(poly: Pt[]): Pt {
  const a = polygonArea(poly);
  if (Math.abs(a) < 1e-9) {
    const n = poly.length;
    return { x: poly.reduce((s, p) => s + p.x, 0) / n, y: poly.reduce((s, p) => s + p.y, 0) / n };
  }
  let cx = 0;
  let cy = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const f = p.x * q.y - q.x * p.y;
    cx += (p.x + q.x) * f;
    cy += (p.y + q.y) * f;
  }
  return { x: cx / (6 * a), y: cy / (6 * a) };
}

export function pointInPolygon(pt: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i];
    const b = poly[j];
    if (a.y > pt.y !== b.y > pt.y && pt.x < ((b.x - a.x) * (pt.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

const norm360 = (x: number) => ((x % 360) + 360) % 360;

/**
 * Compass bearing of `pt` seen from `centre`.
 * `northAngle` = direction North points on the image, degrees clockwise from image-up.
 */
export function bearing(centre: Pt, pt: Pt, northAngle: number): number {
  const imageAngle = (Math.atan2(pt.x - centre.x, -(pt.y - centre.y)) * 180) / Math.PI;
  return norm360(imageAngle - northAngle);
}

export function dir8(b: number): Dir8 {
  const order: Dir8[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return order[Math.floor(norm360(b + 22.5) / 45) % 8];
}

export function dir16(b: number): (typeof DIR16)[number] {
  return DIR16[Math.floor(norm360(b + 11.25) / 22.5) % 16];
}

/** Rotate a point about `c` so that North points to image-up. */
function toNorthFrame(p: Pt, c: Pt, northAngle: number): Pt {
  const t = (-northAngle * Math.PI) / 180;
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return { x: dx * Math.cos(t) - dy * Math.sin(t), y: dx * Math.sin(t) + dy * Math.cos(t) };
}

/** 3×3 Vastu Purusha Mandala cell (in the north-aligned frame) — row 0 = North. */
export function mandalaCell(pt: Pt, poly: Pt[], northAngle: number): { row: number; col: number; u: number; v: number } {
  const c = polygonCentroid(poly);
  const rp = poly.map((p) => toNorthFrame(p, c, northAngle));
  const q = toNorthFrame(pt, c, northAngle);
  const minX = Math.min(...rp.map((p) => p.x));
  const maxX = Math.max(...rp.map((p) => p.x));
  const minY = Math.min(...rp.map((p) => p.y));
  const maxY = Math.max(...rp.map((p) => p.y));
  const u = (q.x - minX) / (maxX - minX || 1);
  const v = (q.y - minY) / (maxY - minY || 1);
  return { row: Math.min(2, Math.max(0, Math.floor(v * 3))), col: Math.min(2, Math.max(0, Math.floor(u * 3))), u, v };
}

const CELL_ZONE: Zone[][] = [
  ["NW", "N", "NE"],
  ["W", "C", "E"],
  ["SW", "S", "SE"],
];

/** Detect cuts — mandala cells substantially outside the boundary. */
export function detectCuts(poly: Pt[], northAngle: number): Array<{ zone: Zone; missing: number }> {
  const c = polygonCentroid(poly);
  const rp = poly.map((p) => toNorthFrame(p, c, northAngle));
  const minX = Math.min(...rp.map((p) => p.x));
  const maxX = Math.max(...rp.map((p) => p.x));
  const minY = Math.min(...rp.map((p) => p.y));
  const maxY = Math.max(...rp.map((p) => p.y));
  const N = 12; // samples per cell edge
  const out: Array<{ zone: Zone; missing: number }> = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      let miss = 0;
      for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
          const x = minX + ((col + (i + 0.5) / N) / 3) * (maxX - minX);
          const y = minY + ((row + (j + 0.5) / N) / 3) * (maxY - minY);
          if (!pointInPolygon({ x, y }, rp)) miss++;
        }
      }
      const missing = miss / (N * N);
      if (missing >= 0.35) out.push({ zone: CELL_ZONE[row][col], missing });
    }
  }
  return out;
}

/* ─────────────────────────────── Rules ─────────────────────────────── */

export type RoomType =
  | "entrance"
  | "kitchen"
  | "master"
  | "bedroom"
  | "toilet"
  | "pooja"
  | "living"
  | "dining"
  | "study"
  | "stairs"
  | "storage"
  | "balcony"
  | "sump"
  | "overhead";

export const ROOM_LABEL: Record<RoomType, string> = {
  entrance: "Main entrance",
  kitchen: "Kitchen",
  master: "Master bedroom",
  bedroom: "Bedroom",
  toilet: "Toilet / bath",
  pooja: "Pooja space",
  living: "Living room",
  dining: "Dining",
  study: "Study",
  stairs: "Staircase",
  storage: "Heavy storage",
  balcony: "Balcony / open area",
  sump: "Underground water / borewell",
  overhead: "Overhead water tank",
};

export type Fit = "ideal" | "good" | "neutral" | "consider" | "priority";

// Frozen traditional placement table. Order of zones: N NE E SE S SW W NW C
const Z: Zone[] = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "C"];
const T = (codes: string): Record<Zone, Fit> => {
  const map: Record<string, Fit> = { I: "ideal", G: "good", N: "neutral", C: "consider", P: "priority" };
  return Object.fromEntries(codes.split(" ").map((c, i) => [Z[i], map[c]])) as Record<Zone, Fit>;
};

export const PLACEMENT: Record<RoomType, Record<Zone, Fit>> = {
  //               N  NE E  SE S  SW W  NW C
  entrance: T("I I I C C P G G N"),
  kitchen: T("C P G I N C N G P"),
  master: T("N C N C G I G N C"),
  bedroom: T("G C G C G G G G C"),
  toilet: T("C P C N N C G I P"),
  pooja: T("G I G C C C N N G"),
  living: T("G G G N N N N G G"),
  dining: T("G N G N N N I G N"),
  study: T("G G I C N N G N N"),
  stairs: T("C P C N G G G N P"),
  storage: T("C P C N G I G N C"),
  balcony: T("I I I N C C N G G"),
  sump: T("G I G C C P N N P"),
  overhead: T("C P C C G I G N P"),
};

const WHY: Partial<Record<RoomType, string>> = {
  entrance: "The entrance is where energy and people enter; traditionally North, East and North-East welcome morning light and openness.",
  kitchen: "Agni (fire) governs the South-East; cooking there is traditionally considered most harmonious.",
  master: "The South-West (earth) is associated with stability and is traditionally reserved for the head of the household.",
  toilet: "Disposal is traditionally placed in the West or North-West and kept away from the sacred North-East and the centre.",
  pooja: "The North-East (Ishanya) is the most sacred zone, receiving early light — ideal for prayer.",
  stairs: "Stairs add weight; traditionally they rise in the South, South-West or West and keep the North-East light.",
  storage: "Heavy items belong in the South-West; the North-East is kept light and open.",
  balcony: "Openness to the North and East invites light and air.",
  sump: "Underground water is traditionally placed in the North-East, North or East.",
  overhead: "Overhead weight belongs in the South-West or West.",
  living: "Gathering spaces sit comfortably in the North, East or North-West.",
  dining: "The West is traditionally favoured for meals; East and North are also comfortable.",
  study: "Facing or sitting in the East and North-East is traditionally associated with focus and learning.",
  bedroom: "Most zones suit bedrooms; the North-East and South-East are traditionally kept for other uses.",
};

export type Severity = "strength" | "info" | "gentle" | "priority";

export interface Remedy {
  level: "behaviour" | "layout" | "colour" | "renovation";
  text: string;
}

export interface Finding {
  id: string;
  subject: string;
  zone: Zone;
  zone16?: string;
  fit: Fit;
  severity: Severity;
  confidence: "high" | "medium" | "low";
  rule: string;
  message: string;
  remedies: Remedy[];
  evidence: Pt;
}

const SEVERITY: Record<Fit, Severity> = { ideal: "strength", good: "strength", neutral: "info", consider: "gentle", priority: "priority" };

function remediesFor(room: RoomType, zone: Zone): Remedy[] {
  const z = ZONE_INFO[zone];
  const r: Remedy[] = [];
  if (zone === "NE" || zone === "C") {
    r.push({ level: "behaviour", text: `Keep the ${z.name} clean, bright and lightly used; avoid clutter and heavy use here.` });
  } else {
    r.push({ level: "behaviour", text: `Use the space mindfully: keep it clean, well-lit and orderly.` });
  }
  const layout: Partial<Record<RoomType, string>> = {
    kitchen: "Place the stove in the south-east part of the kitchen so the cook faces east; keep water and fire apart.",
    master: "Place the bed in the south-west part of the room with the head towards south or east.",
    toilet: "Keep the door closed, ensure ventilation and an exhaust; keep the area dry and fresh.",
    pooja: "Within the room, set the altar in its north-east corner, facing east or west.",
    stairs: "Keep the area under the stairs uncluttered; avoid placing the pooja or a toilet beneath.",
    storage: "Shift heavy cupboards to the south-west portion of the room.",
    entrance: "Keep the entrance well-lit, with a clean threshold, nameplate and auspicious marks such as a toran.",
    sump: "Keep the lid sealed and the surroundings clean and dry.",
    overhead: "Ensure the structure is sound and leak-free; keep the tank covered.",
    study: "Arrange the desk so you face east or north while studying.",
    bedroom: "Arrange the bed with the head towards south or east.",
  };
  r.push({ level: "layout", text: layout[room] ?? "Arrange furniture so the heaviest pieces sit towards the south-west of the room." });
  r.push({ level: "colour", text: `Favour ${z.colours} — the traditional palette of the ${z.name} (${z.element}).` });
  r.push({ level: "renovation", text: "Only if you wish to go further: consider re-planning this use. Any structural change requires review by a qualified architect or engineer." });
  return r;
}

export interface PlacedRoom {
  id: string;
  type: RoomType;
  at: Pt;
}

export interface VastuAnalysis {
  version: string;
  centre: Pt;
  findings: Finding[];
  cuts: Array<{ zone: Zone; missing: number }>;
  summary: { strengths: number; info: number; gentle: number; priority: number };
}

export function analyse(boundary: Pt[], northAngle: number, rooms: PlacedRoom[]): VastuAnalysis {
  const centre = polygonCentroid(boundary);
  const findings: Finding[] = [];

  for (const room of rooms) {
    const cell = mandalaCell(room.at, boundary, northAngle);
    const inCentre = cell.row === 1 && cell.col === 1;
    const b = bearing(centre, room.at, northAngle);
    const zone: Zone = inCentre ? "C" : dir8(b);
    const fit = PLACEMENT[room.type][zone];

    // Confidence: near an 8-zone boundary or the centre cell edge → lower.
    const edgeDist = Math.abs(((b + 22.5) % 45) - 22.5); // 0 at a boundary, 22.5 at a zone's middle
    const nearCentreEdge = Math.min(Math.abs(cell.u - 1 / 3), Math.abs(cell.u - 2 / 3), Math.abs(cell.v - 1 / 3), Math.abs(cell.v - 2 / 3)) < 0.04;
    const outside = !pointInPolygon(room.at, boundary);
    const confidence: Finding["confidence"] = outside ? "low" : edgeDist < 4 || nearCentreEdge ? "medium" : "high";

    const zoneName = ZONE_INFO[zone].name;
    const label = ROOM_LABEL[room.type];
    const messages: Record<Fit, string> = {
      ideal: `${label} in the ${zoneName} — a traditionally ideal placement. A real strength of this home.`,
      good: `${label} in the ${zoneName} — a comfortable, well-supported placement.`,
      neutral: `${label} in the ${zoneName} — workable. Simple habits keep this zone balanced.`,
      consider: `${label} in the ${zoneName} — tradition suggests a gentle adjustment. Small, practical steps are usually enough.`,
      priority: `${label} in the ${zoneName} — the first place to give attention. Start with the simplest step below; no renovation is needed to begin.`,
    };

    findings.push({
      id: room.id,
      subject: label,
      zone,
      zone16: inCentre ? undefined : dir16(b),
      fit,
      severity: SEVERITY[fit],
      confidence,
      rule: WHY[room.type] ?? "Traditional placement guidance.",
      message: messages[fit],
      remedies: fit === "consider" || fit === "priority" ? remediesFor(room.type, zone) : [],
      evidence: room.at,
    });
  }

  const cuts = detectCuts(boundary, northAngle).filter((c) => c.zone !== "C");
  for (const cut of cuts) {
    const key = cut.zone === "NE" || cut.zone === "SW" ? "priority" : "consider";
    findings.push({
      id: `cut-${cut.zone}`,
      subject: `Cut in the ${ZONE_INFO[cut.zone].name}`,
      zone: cut.zone,
      fit: key,
      severity: SEVERITY[key],
      confidence: cut.missing > 0.55 ? "high" : "medium",
      rule: "A missing corner (cut) reduces the zone's presence in the plan. Corners in the North-East and South-West are traditionally the most significant.",
      message: `About ${Math.round(cut.missing * 100)}% of the ${ZONE_INFO[cut.zone].name} cell lies outside the boundary.`,
      remedies: [
        { level: "behaviour", text: `Honour the ${ZONE_INFO[cut.zone].name} inside the home: keep its nearest corner clean and purposeful.` },
        { level: "layout", text: "Use furniture, plants or a lamp to visually complete the missing corner." },
        { level: "colour", text: `Introduce ${ZONE_INFO[cut.zone].colours} in the adjoining wall.` },
        { level: "renovation", text: "Extending or completing the corner is a structural decision for an architect or engineer." },
      ],
      evidence: centre,
    });
  }

  const summary = { strengths: 0, info: 0, gentle: 0, priority: 0 };
  for (const f of findings) {
    if (f.severity === "strength") summary.strengths++;
    else summary[f.severity]++;
  }
  // Priority first, then gentle, info, strengths.
  const rank: Record<Severity, number> = { priority: 0, gentle: 1, info: 2, strength: 3 };
  findings.sort((a, b) => rank[a.severity] - rank[b.severity]);
  return { version: VASTU_RULES_VERSION, centre, findings, cuts, summary };
}

/** Quick answer for Sakhi: "where should the kitchen be?" */
export function bestZonesFor(room: RoomType): Zone[] {
  return (Object.entries(PLACEMENT[room]) as Array<[Zone, Fit]>).filter(([, f]) => f === "ideal").map(([z]) => z);
}

export function goodZonesFor(room: RoomType): Zone[] {
  return (Object.entries(PLACEMENT[room]) as Array<[Zone, Fit]>).filter(([, f]) => f === "good").map(([z]) => z);
}

export function whyFor(room: RoomType): string {
  return WHY[room] ?? "";
}
