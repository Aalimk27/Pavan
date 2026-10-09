"use client";

import { ROOM_LABEL, type RoomType } from "@/lib/vastu/engine";
import { sakhi } from "@/components/sakhi/bus";
import { ROOM_ASK } from "./studio-data";
import s from "./sections.module.css";

const ASK: RoomType[] = ["entrance", "kitchen", "master", "toilet", "stairs", "study", "sump"];

/** Quick questions that open Sakhi with a traditional placement answer. */
export default function AskChips() {
  return (
    <ul className={s.askChips} aria-label="Quick questions for Sakhi">
      {ASK.map((r) => (
        <li key={r}>
          <button type="button" className={s.askChip} onClick={() => sakhi.open(ROOM_ASK[r])}>
            Where should the {ROOM_LABEL[r].toLowerCase()} be?
          </button>
        </li>
      ))}
    </ul>
  );
}
