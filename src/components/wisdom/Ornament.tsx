/** Hand-drawn gilt ornaments for the manuscript and storybook frames. Decorative only. */

export function Corner({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" aria-hidden focusable="false">
      <path d="M4 76V22C4 12 12 4 22 4h54" fill="none" stroke="currentColor" strokeWidth="1.4" />
      <path d="M12 76V26c0-8 6-14 14-14h50" fill="none" stroke="currentColor" strokeWidth=".7" opacity=".7" />
      <path d="M22 22c6-10 18-10 22-2-8-2-14 0-18 6 6-4 14-2 16 4-8-3-16 0-20 6 0-6-1-10 0-14z" fill="currentColor" opacity=".85" />
      <circle cx="18" cy="18" r="2.4" fill="currentColor" />
      <path d="M40 4l3 4-3 4-3-4zM4 40l4 3-4 3" fill="currentColor" opacity=".8" />
    </svg>
  );
}

/** A thin rule with a lotus at its centre. */
export function LotusRule({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <svg viewBox="0 0 240 28" focusable="false">
        <defs>
          <linearGradient id="pm-lotus-rule" x1="0" x2="1">
            <stop offset="0" stopColor="currentColor" stopOpacity="0" />
            <stop offset=".5" stopColor="currentColor" stopOpacity=".9" />
            <stop offset="1" stopColor="currentColor" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 18h96M144 18h96" stroke="url(#pm-lotus-rule)" strokeWidth="1" />
        <path d="M120 4c5 5 6 10 0 18-6-8-5-13 0-18z" fill="currentColor" />
        <path d="M120 22c-4-6-11-9-18-8 3 6 10 9 18 8zM120 22c4-6 11-9 18-8-3 6-10 9-18 8z" fill="currentColor" opacity=".75" />
        <path d="M120 22c-8-2-15 0-22 4 9 1 16 0 22-4zM120 22c8-2 15 0 22 4-9 1-16 0-22-4z" fill="currentColor" opacity=".45" />
      </svg>
    </div>
  );
}

/** A small diya, used as a bullet and in the Marg. `glow` is 0..1. */
export function Diya({ glow = 1, className }: { glow?: number; className?: string }) {
  const lit = glow > 0;
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden focusable="false">
      {lit && <circle cx="32" cy="22" r={10 + 14 * glow} fill="#ffe9a8" opacity={0.12 + 0.3 * glow} />}
      {lit && (
        <path
          d="M32 6c4 7 7 11 7 16a7 7 0 0 1-14 0c0-5 3-9 7-16z"
          fill="#f6c445"
          style={{ transformOrigin: "32px 30px", transform: `scale(${0.55 + 0.45 * glow})` }}
        />
      )}
      <path d="M10 38c6 10 38 10 44 0-3 9-12 15-22 15S13 47 10 38z" fill="#d4a537" />
      <path d="M10 38c6-3 38-3 44 0" fill="none" stroke="#8a6420" strokeWidth="1.5" />
      <rect x="30" y="33" width="4" height="5" rx="1" fill="#5a3e12" />
    </svg>
  );
}
