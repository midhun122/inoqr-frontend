# QR Customization Reference

One shared system (`QRCustomization` in `src/types`) drives both the static
and dynamic generators. Data (payload) and appearance (customization) are
independent — the renderer (`StyledQRCode`, backed by `qr-code-styling`)
combines them. Preview and PNG/SVG exports render from identical options,
so downloads always match the preview.

## Tabs

**Pattern** — 6 engine module styles (Square, Rounded, Dots, Soft,
Classy, Classy soft), each with a drawn preview tile. Plus a **Designer**
row of hand-built motifs stamped per data module: Bubbles, Stardust, Gem,
Hearts. Finders are never touched by motifs.

**Eyes** — Border: Square, Soft, Circle. Center: Square, Dot, Diamond,
Round. Independent border/center colors default to matching the modules
("Match modules" resets an override).

**Colors** — Foreground/background swatch + validated hex input, Invert
action, live WCAG contrast readout with a low-contrast (< 3:1) warning.

**Logo** — None, 10 built-in lucide icons on white tiles, or custom upload
(PNG/JPG/WebP ≤ 2 MB, click or drag-drop, local-only, preview/replace/
remove). Size S/M/L, capped for scan safety.

**Advanced** — Error correction L/M/Q/H in plain language. A logo (or
Stardust artwork) auto-raises EC to Maximum with an explanatory note.
Reset design restores all defaults (`#000000` / `#FFFFFF`, square, EC M).

## Reliability policy

Every shipped style was rendered headlessly and decoded with two
independent QR decoders before release:

| Shipped | Evidence |
|---------|----------|
| All module styles, EC levels, colors, logos (incl. max size + photo uploads), Bubbles, Gem, Hearts, Stardust, Circle/Diamond/Round eyes | Decode passes + pixel inspection |

| Cut | Reason |
|-----|--------|
| Diamond modules, Rounded/Soft-square eyes, brand-icon logos | Not supported by the renderer / icon set |
| First-generation Circle eye | Rendered oversized and fused with adjacent modules |
| Leaf eye | Undersized geometry, zero decoder passes |
| Maze artwork as modules | Line art cannot tile a QR cell |

## State shape

```ts
type QRCustomization = {
  moduleStyle: string; foregroundColor: string; backgroundColor: string;
  eyeBorderStyle: string; eyeCenterStyle: string;
  eyeBorderColor: string; eyeCenterColor: string; // "" = match modules
  logoType: "none" | "builtin" | "upload";
  builtinLogo?: string; uploadedLogo?: string; logoSize: number;
  errorCorrection: "L" | "M" | "Q" | "H";
  moduleMotif: string; // "none" or a Designer motif id
};
```

Key builders live in `src/lib/qr-style.ts` (`buildStyledQR`,
`customizationKey`, `effectiveErrorCorrection`), artwork stamping in
`src/lib/qr-art.ts`, logo tiles in `src/lib/qr-logos.ts`, motif art in
`src/lib/qr-motifs.ts`, color math in `src/lib/qr-color.ts`.
