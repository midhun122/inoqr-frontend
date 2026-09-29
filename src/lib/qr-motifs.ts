/**
 * Designer module motifs, derived from the supplied style sheets:
 * - Bubbles   ← style.svg  (scattered ring dots)
 * - Stardust  ← style2.svg (5-point stars; geometry reused verbatim)
 * - Gem       ← style3.svg (4-point diamonds; geometry reused verbatim)
 * - Hearts    ← style5.svg (hearts; geometry reused verbatim)
 *
 * Each motif is a single fill shape in a 24×24 cell, stamped once per dark
 * data module by the renderer extension. Finders are never touched.
 * (style4.svg is maze line-art — it cannot tile per-module; see notes.)
 */
export interface ModuleMotif {
  id: string;
  name: string;
  hint: string;
  /** Inner SVG markup for a 24×24 cell. Shapes must not set their own fill. */
  inner: string;
}

const STAR = "M20 40 21.24 42.64 24 43.06 22 45.11 22.47 48 20 46.64 17.53 48 18 45.11 16 43.06 18.76 42.64";
const DIAMOND = "M19.17 17.17l4 4-4 4-4-4 4-4";
const HEART = "M52.01 25.08c2-1.97 3.98-.99 3.99.98.01 1.98-3.99 4.94-3.99 4.94S48 28.04 48 26.06 50 23.1 52.01 25.08z";

function placed(path: string, cx: number, cy: number, scale: number): string {
  return `<g transform="translate(12 12) scale(${scale}) translate(${-cx} ${-cy})"><path d="${path}"/></g>`;
}

export const MODULE_MOTIFS: ModuleMotif[] = [
  {
    id: "bubbles",
    name: "Bubbles",
    hint: "Round bubble modules",
    inner: `<circle cx="12" cy="12" r="10"/>`,
  },
  {
    id: "stardust",
    name: "Stardust",
    hint: "Star modules",
    inner: placed(STAR, 20, 44, 2.6),
  },
  {
    id: "gem",
    name: "Gem",
    hint: "Diamond modules",
    inner: placed(DIAMOND, 19.17, 21.17, 2.375),
  },
  {
    id: "hearts",
    name: "Hearts",
    hint: "Heart modules",
    inner: placed(HEART, 52, 27, 2.375),
  },
];

export function motifInner(id: string | null): string | null {
  if (!id) return null;
  return MODULE_MOTIFS.find((m) => m.id === id)?.inner ?? null;
}
