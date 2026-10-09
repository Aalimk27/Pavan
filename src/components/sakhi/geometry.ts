/**
 * SAKHI mark — single source of truth for the icon geometry.
 *
 *   Jyoti  (flame)            — the light of awareness that is always on
 *   Drishti (peacock eye)     — seeing clearly; Shri Krishna's mor-pankh
 *   Bindu  (the gold point)   — the point of focus; it follows you
 *   Kamala (lotus seat)       — purity and grace, rooted in the world
 *
 * Used by the live <SakhiMark/> component and by scripts/export-brand.ts.
 */

export const VIEWBOX = "0 0 240 240";

export const FLAME = "M120 12C133 44 188 88 188 141C188 180 157 208 120 208C83 208 52 180 52 141C52 88 107 44 120 12Z";
export const FLAME_INNER_SCALE = 0.885;
export const EYE_CENTER = { x: 120, y: 148 };
export const RING = { rx: 41, ry: 46 };
export const IRIS = { rx: 36, ry: 41 };
/** Peacock-eye core — a soft, organic heart (Prem) */
export const CORE = "M120 121C126 114 145 115 146 135C147 155 134 170 120 177C106 170 93 155 94 135C95 115 114 114 120 121Z";
export const BINDU = { x: 120, y: 143, r: 7.5 };

export const PETALS: ReadonlyArray<{ d: string; fill: "soft" | "gold" }> = [
  { d: "M120 229C93 230 66 220 50 201C75 196 102 206 120 229Z", fill: "soft" },
  { d: "M120 229C147 230 174 220 190 201C165 196 138 206 120 229Z", fill: "soft" },
  { d: "M120 229C101 221 84 204 78 181C99 186 115 202 120 229Z", fill: "gold" },
  { d: "M120 229C139 221 156 204 162 181C141 186 125 202 120 229Z", fill: "gold" },
];

/** Feather barbs — fine strokes from the eye out to the flame's edge. */
export function barbs(step = 9): string[] {
  const out: string[] = [];
  for (let a = -171; a <= 171; a += step) {
    const r = (a * Math.PI) / 180;
    const sx = EYE_CENTER.x + Math.sin(r) * (RING.rx + 2);
    const sy = EYE_CENTER.y - Math.cos(r) * (RING.ry + 2);
    const ex = EYE_CENTER.x + Math.sin(r) * 80;
    const ey = EYE_CENTER.y - Math.cos(r) * 112;
    const cx = (sx + ex) / 2 + Math.cos(r) * 4;
    const cy = (sy + ey) / 2 + Math.sin(r) * 4;
    out.push(`M${sx.toFixed(1)} ${sy.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}`);
  }
  return out;
}

type Stop = readonly [offset: number, color: string];
export interface Gradient {
  id: string;
  kind: "linear" | "radial";
  attrs: Record<string, string>;
  stops: readonly Stop[];
}

export type MarkVariant = "color" | "gold" | "ink" | "ivory";

export function gradients(variant: MarkVariant = "color"): Gradient[] {
  if (variant === "gold" || variant === "ink" || variant === "ivory") return [];
  return [
    { id: "gold", kind: "linear", attrs: { x1: "0", y1: "0", x2: "0", y2: "1" }, stops: [[0, "#FFF4C4"], [0.28, "#F3CF63"], [0.7, "#C9952F"], [1, "#8A6216"]] },
    { id: "goldsoft", kind: "linear", attrs: { x1: "0", y1: "0", x2: "1", y2: "1" }, stops: [[0, "#FFF0B5"], [0.55, "#E9BC52"], [1, "#A97A22"]] },
    { id: "forest", kind: "radial", attrs: { cx: ".5", cy: ".62", r: ".62" }, stops: [[0, "#17603F"], [0.7, "#0B3B27"], [1, "#05231A"]] },
    { id: "teal", kind: "radial", attrs: { cx: ".42", cy: ".38", r: ".7" }, stops: [[0, "#52D3C4"], [0.45, "#159A9C"], [1, "#075468"]] },
    { id: "sapphire", kind: "radial", attrs: { cx: ".42", cy: ".36", r: ".75" }, stops: [[0, "#4D78E3"], [0.5, "#1B3A9A"], [1, "#0A1A4F"]] },
    { id: "bindu", kind: "radial", attrs: { cx: ".38", cy: ".34", r: ".7" }, stops: [[0, "#FFF8D6"], [0.45, "#F6D06A"], [1, "#B07E1F"]] },
  ];
}

/** Flat palettes for single-colour marks (engraving, embroidery, stamps). */
export const FLAT: Record<Exclude<MarkVariant, "color">, { fg: string; bg: string }> = {
  gold: { fg: "#C9952F", bg: "transparent" },
  ink: { fg: "#0B3B27", bg: "transparent" },
  ivory: { fg: "#FBF6EA", bg: "transparent" },
};

/** Static SVG string — used for brand downloads, favicon and OG images. */
export function sakhiSvgString(opts: { variant?: MarkVariant; withBarbs?: boolean; title?: string } = {}): string {
  const { variant = "color", withBarbs = true, title = "SAKHI — the living light of Prem Marg" } = opts;
  const p = "sk";
  const inner = `translate(${EYE_CENTER.x} 150) scale(${FLAME_INNER_SCALE}) translate(-${EYE_CENTER.x} -150)`;
  const defs = gradients(variant)
    .map((g) => {
      const attrs = Object.entries(g.attrs).map(([k, v]) => `${k}="${v}"`).join(" ");
      const stops = g.stops.map(([o, c]) => `<stop offset="${o}" stop-color="${c}"/>`).join("");
      const tag = g.kind === "linear" ? "linearGradient" : "radialGradient";
      return `<${tag} id="${p}-${g.id}" ${attrs}>${stops}</${tag}>`;
    })
    .join("");

  if (variant !== "color") {
    const { fg } = FLAT[variant];
    // Single-colour: outline flame, ring, core and bindu, with lotus.
    const barbPaths = withBarbs ? `<g stroke="${fg}" stroke-width="1.1" stroke-linecap="round" fill="none" opacity=".55" clip-path="url(#${p}-clip)">${barbs().map((d) => `<path d="${d}"/>`).join("")}</g>` : "";
    // A mask cuts hairline gaps so overlapping shapes stay legible without a background colour.
    const cut = PETALS.slice(2).map((pt) => `<path d="${pt.d}"/>`).join("");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" role="img"><title>${title}</title><defs><clipPath id="${p}-clip"><path d="${FLAME}" transform="${inner}"/></clipPath>
<mask id="${p}-gap" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="240"><rect width="240" height="240" fill="#fff"/><g fill="none" stroke="#000" stroke-width="5" stroke-linejoin="round">${cut}</g><g fill="#000">${cut}</g></mask>
<mask id="${p}-bindu" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="240"><rect width="240" height="240" fill="#fff"/><circle cx="${BINDU.x}" cy="${BINDU.y}" r="${BINDU.r}" fill="#000"/></mask></defs>
<g mask="url(#${p}-gap)"><path d="${FLAME}" fill="none" stroke="${fg}" stroke-width="7" stroke-linejoin="round"/>${barbPaths}
<ellipse cx="${EYE_CENTER.x}" cy="${EYE_CENTER.y}" rx="${RING.rx}" ry="${RING.ry}" fill="none" stroke="${fg}" stroke-width="5"/>
<path d="${CORE}" fill="${fg}" mask="url(#${p}-bindu)"/><circle cx="${BINDU.x}" cy="${BINDU.y}" r="${BINDU.r - 3}" fill="${fg}"/>
<g fill="${fg}">${PETALS.slice(0, 2).map((pt) => `<path d="${pt.d}"/>`).join("")}</g></g>
<g fill="${fg}">${PETALS.slice(2).map((pt) => `<path d="${pt.d}"/>`).join("")}</g></svg>`;
  }

  const barbPaths = withBarbs
    ? `<g stroke="url(#${p}-gold)" stroke-width=".9" stroke-linecap="round" fill="none" opacity=".42" clip-path="url(#${p}-clip)">${barbs().map((d) => `<path d="${d}"/>`).join("")}</g>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX}" role="img"><title>${title}</title>
<defs>${defs}<clipPath id="${p}-clip"><path d="${FLAME}" transform="${inner}"/></clipPath></defs>
<path d="${FLAME}" fill="url(#${p}-gold)"/>
<path d="${FLAME}" fill="url(#${p}-forest)" transform="${inner}"/>${barbPaths}
<ellipse cx="${EYE_CENTER.x}" cy="${EYE_CENTER.y}" rx="${RING.rx}" ry="${RING.ry}" fill="url(#${p}-goldsoft)"/>
<ellipse cx="${EYE_CENTER.x}" cy="${EYE_CENTER.y}" rx="${IRIS.rx}" ry="${IRIS.ry}" fill="url(#${p}-teal)"/>
<path d="${CORE}" fill="url(#${p}-sapphire)" stroke="#C9952F" stroke-width="1.6"/>
<circle cx="${BINDU.x}" cy="${BINDU.y}" r="${BINDU.r}" fill="url(#${p}-bindu)"/>
<circle cx="${BINDU.x - 2.4}" cy="${BINDU.y - 2.6}" r="2.1" fill="#FFFBEA"/>
<ellipse cx="105" cy="126" rx="9" ry="5" fill="#FFFFFF" opacity=".22" transform="rotate(-35 105 126)"/>
<g stroke="#0B3B27" stroke-width="1.8" stroke-linejoin="round">${PETALS.map((pt) => `<path d="${pt.d}" fill="url(#${p}-${pt.fill === "soft" ? "goldsoft" : "gold"})"/>`).join("")}</g></svg>`;
}

/** Square app / social avatar: the mark on a forest field with a soft halo. */
export function sakhiAppIconString(): string {
  const mark = sakhiSvgString({ variant: "color" })
    .replace(/^<svg[^>]*>/, "")
    .replace(/<\/svg>$/, "")
    .replace(/<title>.*?<\/title>/, "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img"><title>SAKHI</title>
<defs><radialGradient id="app-bg" cx=".5" cy=".42" r=".75"><stop offset="0" stop-color="#145238"/><stop offset=".6" stop-color="#0A3323"/><stop offset="1" stop-color="#041A10"/></radialGradient>
<radialGradient id="app-halo" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#F3CF63" stop-opacity=".38"/><stop offset="1" stop-color="#F3CF63" stop-opacity="0"/></radialGradient></defs>
<rect width="512" height="512" rx="112" fill="url(#app-bg)"/><circle cx="256" cy="236" r="190" fill="url(#app-halo)"/>
<g transform="translate(46 44) scale(1.75)">${mark}</g></svg>`;
}
