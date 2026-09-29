# Demo Scope (what the backend will replace)

This build is frontend-only. The following are browser-local stand-ins —
**do not document them as product behavior.**

| Area | Current demo | Real replacement |
|------|--------------|------------------|
| Sign-in | `services/auth.tsx` simulates Google/GitHub (900 ms delay, fixed "Ada" profile, `localStorage`) | OAuth redirect flow → `GET /me/` bootstrap, HttpOnly session cookie |
| Dynamic links | `services/dynamic-store.ts` (`localStorage`, seeded with fake demo links) | `GET/POST/PATCH/DELETE /api/v1/qrs` |
| Static history | `services/static-history.ts` (`localStorage`, last 24 exports) | Backend persistence or drop |
| Folders | Not implemented in UI | `GET/POST/PATCH/DELETE /api/v1/folders` |

## Swap points (minimal diff when backend lands)

1. `services/auth.tsx` — replace mock with redirect + `/me/` bootstrap.
2. `services/dynamic-store.ts` — replace storage fns with API calls (same signatures where possible); `shortUrl()` must use the real resolver URL.
3. `services/static-history.ts` — repoint or remove.
4. `.env.example` — fill `VITE_API_BASE_URL` / OAuth client id.
5. Remove seed demo links; handle `?error=authentication_failed|server_error` on landing.

UI, theming, QR engine, and customization need no changes for the swap.
