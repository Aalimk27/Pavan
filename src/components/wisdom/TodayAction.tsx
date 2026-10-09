"use client";

import { useEffect, useState } from "react";
import { dayKey } from "@/lib/daily";
import { markWisdomRead } from "@/lib/store";
import { track } from "@/lib/analytics";
import { sakhi } from "@/components/sakhi/bus";
import styles from "./wisdom.module.css";

/** "One action for today" with a gentle commitment button. The yes is remembered for today on this device. */
export default function TodayAction({ kind, id, action }: { kind: "gita" | "katha"; id: string; action: string }) {
  const [committed, setCommitted] = useState(false);
  const key = `premmarg:commit:${kind}:${id}`;

  useEffect(() => {
    try {
      setCommitted(window.localStorage.getItem(key) === dayKey());
    } catch {
      /* storage unavailable — stay uncommitted */
    }
  }, [key]);

  const commit = () => {
    if (committed) return;
    setCommitted(true);
    try {
      window.localStorage.setItem(key, dayKey());
    } catch {
      /* ignore */
    }
    markWisdomRead(dayKey(), { [kind]: id });
    track("wisdom_read", { kind, id, via: "action" });
    sakhi.celebrate(
      kind === "gita"
        ? "Beautiful. One small act, done with attention, is the whole Gita in miniature. I'm cheering you on today."
        : "Lovely. A story becomes yours the moment you live one line of it. Go gently today.",
    );
  };

  return (
    <div className={styles.action}>
      <p className={styles.actionKicker}>One action for today</p>
      <p className={styles.actionText}>{action}</p>
      <button
        type="button"
        className={`btn ${committed ? "btn--ghost" : ""} ${styles.actionBtn}`}
        onClick={commit}
        aria-pressed={committed}
        data-sakhi={committed ? undefined : "Say yes to just this one thing. Small and sincere is enough."}
      >
        {committed ? (
          <>
            <span aria-hidden>✓</span> I&rsquo;m doing this today
          </>
        ) : (
          "I’ll do this"
        )}
      </button>
    </div>
  );
}
