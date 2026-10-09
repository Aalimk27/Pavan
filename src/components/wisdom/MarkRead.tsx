"use client";

import { useEffect } from "react";
import { dayKey } from "@/lib/daily";
import { markWisdomRead } from "@/lib/store";
import { track } from "@/lib/analytics";

/** Records that today's reader opened this story or verse (local only). */
export default function MarkRead({ kind, id }: { kind: "gita" | "katha"; id: string }) {
  useEffect(() => {
    markWisdomRead(dayKey(), { [kind]: id });
    track("wisdom_read", { kind, id, via: "view" });
  }, [kind, id]);
  return null;
}
