# INOQR — Frontend Overview

INOQR is a static + dynamic QR code studio. This build is a **frontend-only
reference for documentation** — auth, links, and history are browser-local
demos. The real backend swap is tracked in `demo-scope.md`.

## Stack

React 19 · TypeScript · Vite · Tailwind CSS (token themes) · React Router ·
Framer Motion · Lucide icons · `qrcode.react` (decorative minis) ·
`qr-code-styling` (generator renderer) · `thinking-orbs` (loading orb)

## Scripts

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + production build → dist/
npm run preview  # serve dist/ locally
npm run lint     # oxlint
```

Node 20+ required.

## Environment

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Future backend base URL (reserved, unused by this build) | `https://api.inoqr.org` |
| `VITE_GOOGLE_CLIENT_ID` | Future OAuth client id (reserved) | — |

See `.env.example`.

## Structure

```
src/
├── assets/          # logo PNG, hero art
├── components/
│   ├── ui/          # Button, Input, Logo, Marquee, Primitives, ThemeToggle
│   ├── qr/          # StyledQRCode, QRPreview, QRDownloadActions,
│   │                #   CustomizePanel, StylePreviews
│   ├── motion/      # MotionReveal, Parallax, CustomCursor, QRRevealField, ThinkingOrb
│   ├── layout/      # Navbar, Footer, GeneratorLayout
│   └── contributors/# ContributorRow
├── pages/           # Landing, Static/Dynamic generators, MyQRs,
│                    #   SignIn, Contributors, NotFound
├── data/            # contributors.ts
├── hooks/           # useDebouncedValue
├── lib/             # qr-encode, qr-export, qr-style, qr-art,
│                    #   qr-color, qr-logos, qr-motifs
├── services/        # theme, auth (demo), dynamic-store (demo), static-history
├── types/           # shared types incl. QRCustomization
└── styles/          # design tokens
```
