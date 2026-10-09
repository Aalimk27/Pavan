import SakhiMark from "@/components/sakhi/SakhiMark";

/** PREM MARG lockup — the Sakhi light beside the inscription. */
export default function Wordmark({ tagline = true, size = 38, live = true }: { tagline?: boolean; size?: number; live?: boolean }) {
  return (
    <span className="wordmark">
      <span className="wordmark__mark" style={{ width: size, height: size }}>
        <SakhiMark size={size} barbs={false} gaze={live ? "pointer" : "center"} decorative />
      </span>
      <span className="wordmark__text">
        <span className="wordmark__name">PREM MARG</span>
        {tagline && <span className="wordmark__tag">A Better Way to Live</span>}
      </span>
    </span>
  );
}
