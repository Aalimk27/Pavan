"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import SakhiMark from "@/components/sakhi/SakhiMark";
import { sakhi } from "@/components/sakhi/bus";
import s from "./notfound.module.css";

/** The 404 Sakhi: she looks around, then offers to help find the way. */
export default function NotFoundSakhi() {
  const path = usePathname();
  useEffect(() => {
    sakhi.mood("thinking", 1800);
    const t = setTimeout(() => {
      sakhi.whisper("This path isn’t on the map yet — but I can take you wherever you meant to go.", {
        cta: { label: "Help me find it", message: `I was looking for ${path || "a page"} and it wasn't there. Can you help me find my way?` },
        ms: 9000,
      });
    }, 1400);
    return () => clearTimeout(t);
  }, [path]);

  return (
    <div className={s.markWrap} aria-hidden>
      <span className={s.compass} />
      <SakhiMark size="100%" barbs decorative />
    </div>
  );
}
