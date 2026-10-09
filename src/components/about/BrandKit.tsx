import Image from "next/image";
import s from "./sakhi.module.css";

type Ground = "light" | "dark";

const ASSETS: ReadonlyArray<{ file: string; name: string; use: string; grounds: Ground[] }> = [
  { file: "sakhi-mark.svg", name: "Primary mark", use: "Full colour with feather barbs. Hero moments, print, 88px and above.", grounds: ["light", "dark"] },
  { file: "sakhi-mark-simple.svg", name: "Simple mark", use: "Full colour, no barbs. Small sizes, favicons, UI — down to 24px.", grounds: ["light", "dark"] },
  { file: "sakhi-mark-gold.svg", name: "Gold", use: "Single colour for foil, embroidery, engraving and stamps.", grounds: ["light", "dark"] },
  { file: "sakhi-mark-ink.svg", name: "Forest ink", use: "Single colour for ivory paper, letterheads and one-colour print.", grounds: ["light"] },
  { file: "sakhi-mark-ivory.svg", name: "Ivory", use: "Single colour reversed out of forest, photography and night.", grounds: ["dark"] },
  { file: "sakhi-app-icon.svg", name: "App icon", use: "The mark on its forest field. Avatars, app tiles and social profiles.", grounds: ["light", "dark"] },
];

export const PALETTE: ReadonlyArray<{ name: string; sanskrit: string; hex: string; role: string; ink: string; sakhi: string }> = [
  { name: "Forest", sanskrit: "वन", hex: "#0B3B27", role: "The temple garden. Grounds, heroes, ink.", ink: "#FBF6EA", sakhi: "Forest is our ground — deep, calm and growing. Most of my world is this green." },
  { name: "Gold", sanskrit: "स्वर्ण", hex: "#D4A537", role: "Light and auspiciousness. Accents, never floods.", ink: "#062A1C", sakhi: "Gold is light. We use it like a diya — a little, in the right place." },
  { name: "Ivory", sanskrit: "शुभ्र", hex: "#FBF6EA", role: "Marble and paper. The reading surface.", ink: "#0B3B27", sakhi: "Ivory is the temple floor — where you read, think and rest your eyes." },
  { name: "Peacock", sanskrit: "मयूर", hex: "#0E7C86", role: "The iris of the eye. Beta, links, quiet emphasis.", ink: "#FBF6EA", sakhi: "Peacock blue-green lives in my iris. It marks things still learning — like Vastu Beta." },
  { name: "Sapphire", sanskrit: "नील", hex: "#1B3A9A", role: "The heart of the eye. Used rarely, with meaning.", ink: "#FBF6EA", sakhi: "Sapphire is the colour of my heart-shaped core. We keep it rare." },
];

export default function BrandKit() {
  return (
    <div className={s.kit}>
      <div className={s.kitGrid}>
        {ASSETS.map((a) => (
          <figure key={a.file} className={s.kitTile} data-sakhi={`${a.name}: ${a.use}`}>
            <div className={`${s.kitGrounds} ${a.grounds.length === 1 ? s.kitSingle : ""}`}>
              {a.grounds.map((g) => (
                <div key={g} className={`${s.kitGround} ${g === "dark" ? s.kitDark : s.kitLight}`}>
                  <Image src={`/brand/${a.file}`} alt="" width={120} height={120} unoptimized className={s.kitImg} />
                  <span className={s.kitGroundLabel}>{g === "dark" ? "On forest" : "On ivory"}</span>
                </div>
              ))}
            </div>
            <figcaption className={s.kitCap}>
              <span className={s.kitName}>{a.name}</span>
              <span className={s.kitUse}>{a.use}</span>
              <a className={s.kitDl} href={`/brand/${a.file}`} download>
                <span aria-hidden>↓</span> {a.file}
              </a>
            </figcaption>
          </figure>
        ))}
      </div>

      <div>
      <h3 className={s.kitH}>Palette</h3>
      <ul className={s.palette}>
        {PALETTE.map((c) => (
          <li key={c.hex} className={s.swatch} data-sakhi={c.sakhi}>
            <span className={s.swatchChip} style={{ background: c.hex, color: c.ink }}>
              <span className="sanskrit" lang="hi">
                {c.sanskrit}
              </span>
            </span>
            <span className={s.swatchName}>{c.name}</span>
            <code className={s.swatchHex}>{c.hex}</code>
            <span className={s.swatchRole}>{c.role}</span>
          </li>
        ))}
      </ul>
      </div>

      <div className={s.rules}>
        <div className={s.rule}>
          <h3 className={s.kitH}>Minimum size</h3>
          <div className={s.sizes}>
            <figure className={s.sizeItem}>
              <Image src="/brand/sakhi-mark.svg" alt="" width={88} height={88} unoptimized />
              <figcaption>
                <strong>88px</strong> primary mark
              </figcaption>
            </figure>
            <figure className={s.sizeItem}>
              <Image src="/brand/sakhi-mark-simple.svg" alt="" width={48} height={48} unoptimized />
              <figcaption>
                <strong>48px</strong> simple mark
              </figcaption>
            </figure>
            <figure className={s.sizeItem}>
              <Image src="/brand/sakhi-mark-simple.svg" alt="" width={24} height={24} unoptimized />
              <figcaption>
                <strong>24px</strong> absolute minimum
              </figcaption>
            </figure>
          </div>
          <p className={s.ruleText}>
            Below 88px the feather barbs blur into noise — switch to the simple mark. Never use any version smaller than <strong>24px</strong> on screen
            (or 8mm in print).
          </p>
        </div>

        <div className={s.rule}>
          <h3 className={s.kitH}>Clear space</h3>
          <div className={s.clear} aria-hidden>
            <div className={s.clearBox}>
              <span className={`${s.clearM} ${s.clearT}`}>x</span>
              <span className={`${s.clearM} ${s.clearR}`}>x</span>
              <span className={`${s.clearM} ${s.clearB}`}>x</span>
              <span className={`${s.clearM} ${s.clearL}`}>x</span>
              <Image src="/brand/sakhi-mark-simple.svg" alt="" width={120} height={120} unoptimized className={s.clearImg} />
            </div>
          </div>
          <p className={s.ruleText}>
            Keep a margin of <strong>x</strong> on every side, where <strong>x</strong> is half the width of the eye’s gold ring (about one-sixth of the
            mark’s height). Nothing — text, edges or other logos — enters this space.
          </p>
        </div>

        <div className={s.rule}>
          <h3 className={s.kitH}>Please don’t</h3>
          <ul className={s.donts}>
            <li>Stretch, skew or rotate the flame.</li>
            <li>Recolour parts outside the palette, or add shadows, outlines and glows.</li>
            <li>Place the full-colour mark on busy photographs — use the ivory or gold mark.</li>
            <li>Present Sakhi as a person, guru or deity. She is an AI companion.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
