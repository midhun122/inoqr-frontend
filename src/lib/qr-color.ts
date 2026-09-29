const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

export function isValidHex(value: string): boolean {
  return HEX_RE.test(value.trim());
}

/** Normalize #abc → #aabbcc and uppercase; returns null when invalid. */
export function normalizeHex(value: string): string | null {
  const v = value.trim();
  if (!HEX_RE.test(v)) return null;
  if (v.length === 4) {
    const [r, g, b] = v.slice(1);
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  return v.toUpperCase();
}

function channelToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function luminance(hex: string): number {
  const n = normalizeHex(hex) ?? "#000000";
  const r = parseInt(n.slice(1, 3), 16);
  const g = parseInt(n.slice(3, 5), 16);
  const b = parseInt(n.slice(5, 7), 16);
  return 0.2126 * channelToLinear(r) + 0.7152 * channelToLinear(g) + 0.0722 * channelToLinear(b);
}

/** WCAG contrast ratio between two hex colors (1–21). */
export function contrastRatio(a: string, b: string): number {
  const l1 = luminance(a);
  const l2 = luminance(b);
  const [hi, lo] = l1 >= l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}

/** Glyph ink for a white logo tile: foreground when dark, near-black otherwise. */
export function glyphOnWhiteTile(foreground: string): string {
  return luminance(foreground) < 0.18 ? normalizeHex(foreground) ?? "#141414" : "#141414";
}
