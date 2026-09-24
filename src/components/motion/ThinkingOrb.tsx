// ─── INOQR ThinkingOrb ──────────────────────────────────────
// The genuine pulsating dotted orb from
// https://rareformlabs.github.io/thinking-orbs/
// (`thinking-orbs` on npm, MIT © Jakub Antalik) — plain 2D canvas,
// no WebGL, DPR-capped, pauses offscreen, honors reduced-motion.
//
// Bare canvas (no disc) with a brand-blue tint: the engine keeps its
// depth shading on the tint, so the orb reads crisply on white AND
// on near-black via theme="auto". A whisper of accent halo lifts it
// off light surfaces without a hard edge.

import { ThinkingOrb as RealOrb } from "thinking-orbs";

export function ThinkingOrb({
  state,
  orb = 88,
  label = "Thinking…",
}: {
  state: "thinking" | "ready";
  orb?: number;
  label?: string;
}) {
  const thinking = state === "thinking";

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative grid shrink-0 place-items-center"
      style={{ width: orb, height: orb }}
    >
      <div
        aria-hidden
        className="absolute rounded-full"
        style={{
          inset: -28,
          background: "radial-gradient(circle, rgba(0,102,255,0.14) 0%, transparent 70%)",
        }}
      />
      <RealOrb
        state="working"
        size={64}
        theme="auto"
        color="#0066FF"
        speed={1}
        dots={1.4}
        dotSize={1.3}
        paused={!thinking}
        aria-label={thinking ? label : "Ready"}
        className="relative"
        style={{ width: orb, height: orb }}
      />
      <span className="sr-only">{thinking ? label : "Ready"}</span>
    </div>
  );
}
