/**
 * Exports the SAKHI mark in every brand variant to /public/brand.
 * Run: node --experimental-strip-types scripts/export-brand.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { sakhiAppIconString, sakhiSvgString } from "../src/components/sakhi/geometry.ts";

const out = new URL("../public/brand/", import.meta.url);
mkdirSync(out, { recursive: true });

const files: Record<string, string> = {
  "sakhi-mark.svg": sakhiSvgString({ variant: "color" }),
  "sakhi-mark-simple.svg": sakhiSvgString({ variant: "color", withBarbs: false }),
  "sakhi-mark-gold.svg": sakhiSvgString({ variant: "gold" }),
  "sakhi-mark-ink.svg": sakhiSvgString({ variant: "ink" }),
  "sakhi-mark-ivory.svg": sakhiSvgString({ variant: "ivory" }),
  "sakhi-app-icon.svg": sakhiAppIconString(),
};

for (const [name, svg] of Object.entries(files)) {
  writeFileSync(new URL(name, out), svg + "\n");
  console.log("wrote", name);
}
// Favicon: the simple mark reads best at 16–32px.
writeFileSync(new URL("../src/app/icon.svg", import.meta.url), sakhiSvgString({ variant: "color", withBarbs: false }) + "\n");
console.log("wrote src/app/icon.svg");
