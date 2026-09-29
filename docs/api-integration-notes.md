# API Integration Notes (open questions for backend lead)

Collected during frontend development — resolve before the backend swap.

1. **Resolver URL format** (blocking): what short URL does a dynamic QR
   encode? Presumed `https://qr.inovuslabs.org/r/{resolver_id}` — confirm
   exact shape before `shortUrl()` is repointed.
2. **Folders UI**: endpoints exist, UI deferred. Ship QRs first with
   `folder_id: null`, or include folder management in the same pass?
3. **Local dev**: backend `FRONTEND_URL` must target the Vite dev server
   for OAuth callbacks; confirm pagination style on `GET /qrs` and whether
   delete returns `200` or `204` (client codes for both).
4. **Error mapping**: `401 → sign-in prompt`, `403/404 → error pages`,
   `422/400 → inline form errors`, `5xx/network → error page + offline
   handling`, OAuth `?error=` → landing banner. Needs a reusable error-page
   component + `ErrorBoundary` (see production plan).
5. **Slugs**: confirm whether server slugs can expire/pause (drives the
   "link unavailable" page copy).
