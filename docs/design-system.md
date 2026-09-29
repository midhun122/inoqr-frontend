# Design System

## Typography (three voices)

- **Display** — DM Serif Display, regular, tight leading. Emotive headlines
  only, often with an italic accent word. Never bolded.
- **Sans** — Inter. Body, UI, buttons, card titles. The workhorse.
- **Mono** — Roboto Mono, uppercase, wide tracking. Eyebrows, kickers,
  technical labels (`.mono-label`, `.font-display` utilities in `index.css`).

## Tokens (`src/index.css`, `tailwind.config.js`)

Colors are RGB triplets (`--ink`, `--ink-soft`, `--muted`, `--faint`,
`--canvas`, `--canvas-soft`, `--field`, `--hairline`, `--accent`,
`--accent-deep`) so opacity modifiers work in both themes. The `.dark` /
`[data-theme="dark"]` block flips every token — components use themed
utilities (`bg-canvas`, `text-ink`, `border-hairline`) and never hardcode
mode-specific colors except QR-correct whites.

Radii: cards `24px`, inputs `8px`, buttons/nav pills fully round.
Shadows: `shadow-card` surfaces, `shadow-pop` accents.

## Components

`Button` (primary/accent/secondary/ghost/outline, md/sm, loading),
`Input`/`Textarea` + `FieldError`, `Pill` (neutral/accent/ok/warn),
`SegmentedControl`, `Logo` (single render point, `src/assets/inoqr-logo.png`),
`ThemeToggle`, `Marquee`, `GeneratorLayout` (header + editor/sidebar cards).

## Motion & chrome

`MotionReveal` (viewport fade-up), `Parallax` (scroll depth, transform-only),
`CustomCursor` (dot + ring, fine pointers only, I-beam preserved in text
fields), `QRRevealField` (hero scanner lens), `ThinkingOrb` (generator
loading state), `ScrollProgress` hairline, page-transition wrapper in `App`.

## Responsive rules

Mobile-first; grids collapse (`sm:`/`md:`/`lg:`), tab bars and card rails
scroll horizontally with snap, canvases are DPR-capped and pause offscreen,
all animation respects `prefers-reduced-motion`.
