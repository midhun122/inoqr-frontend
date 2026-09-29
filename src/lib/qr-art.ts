import type { ExtensionFunction } from "qr-code-styling";
import type { QRCustomization, QREyeBorderStyle, QREyeCenterStyle } from "../types";
import type { QRMotif } from "../components/qr/StyledQRCode";

const SVG_NS = "http://www.w3.org/2000/svg";

/** Borders the engine cannot draw (hand-painted by the artwork pass). */
export function isCustomEyeBorder(style: QREyeBorderStyle): boolean {
  return style === "circle";
}

/** Centers the engine cannot draw (hand-painted by the artwork pass). */
export function isCustomEyeCenter(style: QREyeCenterStyle): boolean {
  return style === "diamond" || style === "round";
}

function el(name: string, attrs: Record<string, string | number>): SVGElement {
  const e = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
}

export interface QREyeArt {
  border: QREyeBorderStyle;
  center: QREyeCenterStyle;
  borderColor: string;
  centerColor: string;
  bg: string;
}

/** Eye styles the engine cannot draw itself (verified decodable). */
export function resolveEyeArt(custom: QRCustomization): QREyeArt | null {
  const customBorder = isCustomEyeBorder(custom.eyeBorderStyle);
  const customCenter = isCustomEyeCenter(custom.eyeCenterStyle);
  if (!customBorder && !customCenter) return null;
  return {
    border: custom.eyeBorderStyle,
    center: custom.eyeCenterStyle,
    borderColor: custom.eyeBorderColor || custom.foregroundColor,
    centerColor: custom.eyeCenterColor || custom.foregroundColor,
    bg: custom.backgroundColor,
  };
}

function paintBorder(layer: SVGElement, style: QREyeBorderStyle, x: number, y: number, s: number, color: string, bg: string): void {
  if (!isCustomEyeBorder(style)) return;
  const m = s / 7;
  const cx = x + 3.5 * m;
  const cy = y + 3.5 * m;
  layer.appendChild(el("circle", { cx, cy, r: 3.5 * m, fill: color }));
  layer.appendChild(el("circle", { cx, cy, r: 2.5 * m, fill: bg }));
}

function paintCenter(
  layer: SVGElement,
  style: QREyeCenterStyle,
  cx: number,
  cy: number,
  m: number,
  color: string,
): void {
  if (style === "diamond") {
    const r = 1.5 * m;
    layer.appendChild(
      el("polygon", { points: `${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`, fill: color }),
    );
  } else if (style === "round") {
    const w = 3 * m;
    layer.appendChild(
      el("rect", { x: cx - w / 2, y: cy - w / 2, width: w, height: w, rx: 0.9 * m, fill: color }),
    );
  }
}

function stampMotif(layer: SVGElement, inner: string, color: string, svg: SVGElement): void {
  const clip = svg.querySelector('clipPath[id^="clip-path-dot-color"]');
  if (!clip) return;
  const art = document.createElementNS(SVG_NS, "g");
  art.setAttribute("data-motif-art", "1");
  art.setAttribute("fill", color);
  clip.querySelectorAll("rect").forEach((r) => {
    const x = parseFloat(r.getAttribute("x") ?? "NaN");
    const y = parseFloat(r.getAttribute("y") ?? "NaN");
    const w = parseFloat(r.getAttribute("width") ?? "NaN");
    const h = parseFloat(r.getAttribute("height") ?? "NaN");
    if (![x, y, w, h].every(Number.isFinite) || w <= 0 || h <= 0) return;
    const cell = document.createElementNS(SVG_NS, "g");
    cell.setAttribute("transform", `translate(${x} ${y}) scale(${w / 24} ${h / 24})`);
    cell.innerHTML = inner;
    art.appendChild(cell);
  });
  layer.appendChild(art);
}

export interface ArtworkSpec {
  motif: QRMotif | null;
  eyes: QREyeArt | null;
}

/**
 * Single post-draw pass: designer motifs per data module + hand-drawn
 * finder upgrades. Finder clip paths are never walked for motifs, and
 * library finder rects are hidden only where custom art replaces them —
 * eyes keep exact 7-module geometry by construction.
 */
export function artworkExtension(spec: ArtworkSpec): ExtensionFunction | null {
  if (!spec.motif && !spec.eyes) return null;
  return (svg) => {
    svg.querySelectorAll("[data-qr-art]").forEach((n) => n.remove());
    const layer = document.createElementNS(SVG_NS, "g");
    layer.setAttribute("data-qr-art", "1");

    if (spec.motif) {
      stampMotif(layer, spec.motif.inner, spec.motif.color, svg);
    }

    if (spec.eyes) {
      const { border, center, borderColor, centerColor, bg } = spec.eyes;
      const customBorder = border === "circle";
      const customCenter = center === "diamond" || center === "round";
      const boxes: { x: number; y: number; w: number }[] = [];
      svg.querySelectorAll('rect[clip-path*="corners-square-color"]').forEach((r) => {
        if (customBorder) r.setAttribute("display", "none");
        const x = parseFloat(r.getAttribute("x") ?? "NaN");
        const y = parseFloat(r.getAttribute("y") ?? "NaN");
        const w = parseFloat(r.getAttribute("width") ?? "NaN");
        if ([x, y, w].every(Number.isFinite) && w > 0) boxes.push({ x, y, w });
      });
      if (customCenter) {
        svg.querySelectorAll('rect[clip-path*="corners-dot-color"]').forEach((r) => r.setAttribute("display", "none"));
      }
      for (const b of boxes) {
        const m = b.w / 7;
        const cx = b.x + 3.5 * m;
        const cy = b.y + 3.5 * m;
        if (customBorder) paintBorder(layer, border, b.x, b.y, b.w, borderColor, bg);
        if (customCenter) paintCenter(layer, center, cx, cy, m, centerColor);
      }
    }

    svg.appendChild(layer);
  };
}
