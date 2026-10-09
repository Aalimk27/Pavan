"use client";

import type { ReactNode } from "react";
import SakhiMark from "@/components/sakhi/SakhiMark";
import { sakhi } from "@/components/sakhi/bus";
import "./ui.css";

/**
 * An inline "Sakhi says" moment inside a page. Optionally a prompt that,
 * when clicked, opens Sakhi with that message already asked.
 */
export default function SakhiNote({ children, ask, askLabel = "Ask Sakhi", tone = "light" }: { children: ReactNode; ask?: string; askLabel?: string; tone?: "light" | "dark" }) {
  return (
    <div className={`sakhi-note sakhi-note--${tone}`}>
      <div className="sakhi-note__mark">
        <SakhiMark size={52} barbs={false} decorative />
      </div>
      <div className="sakhi-note__body">
        <div className="sakhi-note__who">SAKHI</div>
        <div className="sakhi-note__text">{children}</div>
        {ask && (
          <button type="button" className="sakhi-note__ask" onClick={() => sakhi.open(ask)}>
            {askLabel} →
          </button>
        )}
      </div>
    </div>
  );
}

export function AskSakhiButton({ message, children = "Ask Sakhi", className = "btn btn--ghost" }: { message?: string; children?: ReactNode; className?: string }) {
  return (
    <button type="button" className={className} onClick={() => sakhi.open(message)}>
      {children}
    </button>
  );
}
