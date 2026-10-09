"use client";

import { sakhi } from "@/components/sakhi/bus";
import { SAMPLE_EVENT } from "./studio-events";

/** Hero buttons: jump to the studio, or open it with the sample home already on the table. */
export default function StudioLaunch() {
  const go = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("studio-app")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  };
  return (
    <div className="row">
      <button
        type="button"
        className="btn btn--lg"
        onClick={() => {
          go();
          window.setTimeout(() => sakhi.whisper("Start with a JPG or PNG of your plan — it stays in your browser.", { selector: "#vastu-panel" }), 700);
        }}
      >
        Open the studio
      </button>
      <button type="button" className="btn btn--ghost btn--lg" onClick={() => window.dispatchEvent(new Event(SAMPLE_EVENT))}>
        Try a sample home
      </button>
    </div>
  );
}
