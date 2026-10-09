"use client";

import { useState } from "react";
import { PLACEMENT, ROOM_LABEL, ZONE_INFO, type RoomType, type Zone } from "@/lib/vastu/engine";
import { sakhi } from "@/components/sakhi/bus";
import { MANDALA, ROOM_ORDER, ZONE_SWATCH } from "./studio-data";
import s from "./sections.module.css";

const ZONE_SANSKRIT: Record<Zone, string> = {
  N: "उत्तर",
  NE: "ईशान",
  E: "पूर्व",
  SE: "आग्नेय",
  S: "दक्षिण",
  SW: "नैऋत्य",
  W: "पश्चिम",
  NW: "वायव्य",
  C: "ब्रह्मस्थान",
};

/** Rooms the frozen traditional table marks "ideal" for a zone — read straight from the engine. */
const idealIn = (z: Zone): RoomType[] => ROOM_ORDER.filter((r) => PLACEMENT[r][z] === "ideal");
const goodIn = (z: Zone): RoomType[] => ROOM_ORDER.filter((r) => PLACEMENT[r][z] === "good");

export default function ZoneMandala() {
  const [active, setActive] = useState<Zone>("NE");
  const info = ZONE_INFO[active];
  const ideal = idealIn(active);
  const good = goodIn(active);

  return (
    <div className={s.mandalaWrap}>
      <div className={s.mandalaGrid} role="group" aria-label="The nine zones of the Vastu Purusha mandala, North at the top">
        <span className={s.mandalaNorth} aria-hidden>
          N ▲
        </span>
        {MANDALA.flat().map((z, i) => {
          const zi = ZONE_INFO[z];
          return (
            <button
              key={z}
              type="button"
              aria-pressed={active === z}
              className={`${s.zoneTile} ${z === "C" ? s.zoneCentre : ""} ${active === z ? s.zoneOn : ""}`}
              style={{ ["--i" as string]: i }}
              onClick={() => {
                setActive(z);
                sakhi.mood("attentive", 1200);
              }}
              data-sakhi={`${zi.name}: the zone of ${zi.deity}, element ${zi.element}. Traditional colours — ${zi.colours}.`}
            >
              <span className={s.zoneCode}>{z === "C" ? "C" : z}</span>
              <span className={`sanskrit ${s.zoneSkt}`} lang="sa">
                {ZONE_SANSKRIT[z]}
              </span>
              <span className={s.zoneDeity}>{zi.deity}</span>
              <span className={s.zoneSwatches} aria-hidden>
                {ZONE_SWATCH[z].map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
            </button>
          );
        })}
      </div>

      <div className={s.zoneDetail} aria-live="polite">
        <p className="eyebrow">{active === "C" ? "The centre" : `Direction · ${active}`}</p>
        <h3 className={s.zoneName}>
          {info.name}
          <span className={`sanskrit ${s.zoneNameSkt}`} lang="sa">
            {ZONE_SANSKRIT[active]}
          </span>
        </h3>
        <dl className={s.zoneFacts}>
          <div>
            <dt>Presiding deity</dt>
            <dd>{info.deity}</dd>
          </div>
          <div>
            <dt>Element</dt>
            <dd>{info.element}</dd>
          </div>
          <div>
            <dt>Traditional colours</dt>
            <dd>
              <span className={s.zoneSwatchesLg} aria-hidden>
                {ZONE_SWATCH[active].map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              {info.colours}
            </dd>
          </div>
        </dl>
        <div className={s.zoneUses}>
          <p className={s.zoneUsesHead}>Traditionally ideal here</p>
          <p>{ideal.length ? ideal.map((r) => ROOM_LABEL[r]).join(" · ") : active === "C" ? "Kept open, light and uncluttered" : "—"}</p>
          {good.length > 0 && (
            <>
              <p className={s.zoneUsesHead}>Also comfortable</p>
              <p className={s.zoneUsesSoft}>{good.map((r) => ROOM_LABEL[r]).join(" · ")}</p>
            </>
          )}
        </div>
        <p className={s.zoneSource}>From the frozen traditional table the studio uses — the same table behind every finding.</p>
      </div>
    </div>
  );
}
