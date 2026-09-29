# Routes

All routes use React Router (`src/App.tsx`) with a fade/slide page transition,
scroll-to-top, and a scroll progress bar. The navbar is a floating pill
(desktop links + mobile scroll row); footer links mirror the main routes.

| Route | Page | Auth | Description |
|-------|------|------|-------------|
| `/` | Landing | Public | Hero with QR reveal lens, trusted strip, stats band, Static/Dynamic tab rail, static-vs-dynamic comparison, final CTA |
| `/create/static` | Static generator | Public | 6 content types, Customize panel, live preview, PNG/SVG export |
| `/create/dynamic` | Dynamic studio | Required | Short links, retargeting, scan counts, pause/resume, same Customize panel; signed-out visitors get a sign-in gate |
| `/my-qrs` | Dashboard | Required | Separate Static (export history) and Dynamic (links) tabs, per-item delete |
| `/signin` | Sign in | Public | Google + GitHub demo buttons; redirects to the dynamic studio |
| `/contributors` | Contributors | Public | Editorial team page (data in `src/data/contributors.ts`) |
| `*` | 404 | Public | Not-found page |

## Auth gating pattern

Pages call `useAuth()` from `services/auth.tsx`. Signed-out visitors to
protected routes see a centered sign-in prompt card instead of the tool —
no redirects, no broken states.
