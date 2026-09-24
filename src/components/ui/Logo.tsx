// ─── INOQR Logo ─────────────────────────────────────────────
// Official mark lives at src/assets/inoqr-logo.png. This component is
// still the single place the logo is rendered — swap the asset,
// nothing else changes.

import mark from "../../assets/inoqr-logo.png";

export function Logo({ compact = false, large = false }: { compact?: boolean; large?: boolean }) {
  const imgH = large ? "h-12" : compact ? "h-8" : "h-10";
  const textC = large ? "text-[20px]" : "text-[18px]";
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="INOQR">
      <img
        src={mark}
        alt=""
        aria-hidden
        draggable={false}
        className={`${imgH} w-auto object-contain`}
      />
      <span className={`${textC} font-bold tracking-tight text-ink`}>INOQR</span>
    </span>
  );
}
