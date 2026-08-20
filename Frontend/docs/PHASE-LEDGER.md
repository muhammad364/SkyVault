# SkyVault Frontend - Phase Ledger

Statuses: NOT_STARTED | IN_PROGRESS | DONE | REGRESSED | BLOCKED

| # | Phase | Status | Verified on | Notes |
|---|-------|--------|-------------|-------|
| 0 | Foundation & Design System | DONE | 2026-08-20 | Foundation, design system, shared API client, and smoke tests verified. |
| 1 | App Shell, Routing, Errors | DONE | 2026-08-20 | App shell, route guards, branded error pages, offline banner, and smoke tests verified. |
| 2 | Public Landing & Marketing | IN_PROGRESS | 2026-08-20 | Quiet Vault visual refinement implemented and automated checks passed; owner responsive visual pass pending. |
| 3 | Authentication & Account | NOT_STARTED | - | |
| 4 | Storage Subscription & Allocation | NOT_STARTED | - | |
| 5 | Workspace Home | NOT_STARTED | - | |
| 6 | Folder & File Management | NOT_STARTED | - | |
| 7 | Recycle Bin | NOT_STARTED | - | |
| 8 | File Sharing | NOT_STARTED | - | |
| 9 | Intelligent Search & Discovery | NOT_STARTED | - | |
| 10 | Administration | NOT_STARTED | - | Owner-gated. |
| 11 | Hardening & Handover | NOT_STARTED | - | |

## Phase 0 - Foundation & Design System

- Status: IN_PROGRESS
- Date: 2026-08-20
- Controllers read: `Backend/Controllers/AuthController.cs`
- Error contract read: `Backend/Exceptions/ApiErrorResponse.cs`, `Backend/Exceptions/GlobalExceptionHandler.cs`, `Backend/Program.cs`
- Endpoints consumed: none
- Files added/changed: frontend foundation, tokenized design system, shared API client, test suite, project records, and pnpm lockfile
- Deviations from the master prompt: none
- Open questions for the owner: none
- Verification: tsc [x] lint [x] build [x] light/dark [x] responsive 360 [x] 390 [x] 768 [x] 1024 [x] 1440 [x] no-h-scroll [x] touch-equivalents [x] cancellation [x] keyboard [x] smoke test [x]

## Phase 1 - App Shell, Routing, Errors

- Status: DONE
- Date: 2026-08-20
- Controllers read: `Backend/Controllers/AuthController.cs`
- Error contract read: `Backend/Exceptions/ApiErrorResponse.cs`, `Backend/Exceptions/GlobalExceptionHandler.cs`, `Backend/Program.cs`
- Endpoints consumed: none
- Files added/changed: route guards, auth session store, public/auth/workspace/admin layouts, floating rail, command bar slot, theme toggle, offline banner, global and route error boundaries, dedicated branded error pages, Phase 1 placeholder route pages, router wiring, and smoke tests
- Deviations from the master prompt: none
- Open questions for the owner: none
- Verification: tsc [x] lint [x] build [x] light/dark [x] responsive 360 [x] 390 [x] 768 [x] 1024 [x] 1440 [x] no-h-scroll [x] touch-equivalents [x] cancellation [x] keyboard [x] smoke test [x]

## Phase 2 - Public Landing & Marketing

- Status: IN_PROGRESS
- Date: 2026-08-20
- Controllers read: `Backend/Controllers/StoragePlanController.cs`
- DTOs and implementation read: `Backend/DTOs/StoragePlan/Responses/StoragePlanResponseDto.cs`, `Backend/Services/StorageService/StoragePlanService.cs`, `Backend/Services/StorageService/SubscriptionService.cs`
- Endpoints consumed: `GET /api/storage-plans` -> `src/api/endpoints/storage-plans.api.ts` -> `publicPlansService.list` -> `usePublicStoragePlans`
- Files added/changed: landing route and public layout navigation; hero, marketing highlights, how-it-works and public-plans components; lazy R3F vault scene, SVG and local canvas-error fallbacks; storage plan response model; endpoint/service/query hook; query key; public-plan smoke tests; API gap record; `three` and `@types/three` as the direct runtime/type peer requirements for the approved R3F scene.
- Owner-approved backend exceptions: `[AllowAnonymous]` was added only to `StoragePlanController.GetAllPlans`; a `SkyVaultFrontend` CORS policy permits only Vite's `http://localhost:5173` and `http://127.0.0.1:5173` origins. The controller-level authorization remains in force for every other plan action; mutation and subscription actions are unchanged.
- Design system compliance: semantic tokens only; light and dark theme support; reduced-motion, low-core, and sub-768px SVG fallback; keyboard-visible CTAs and retry action.
- States covered: landing route skeleton, plan loading skeleton, zero-plan empty state, public-plan error/retry, global offline banner, existing unauthorised route, success state; read cancellation is forwarded through React Query, service, endpoint, and Axios.
- Pricing decision: the owner confirmed `Price` values are PKR. The public preview shows PKR, the API-provided storage size in GB, and the API-provided billing cycle.
- Quiet Vault visual refinement: added theme-specific transparent emblem assets with a live `SkyVault` signature; sticky responsive public navigation; restrained hero entrance motion; an R3F safe-vault assembly with dial, spokes, hinges, locking rods and fasteners; interaction-driven lock motion and pointer tilt; a transparent static safe fallback; deferred below-fold sections; a scroll-revealed workflow; illustrated stationary plan cards; and a landing-proportion route skeleton.
- Approved Section 3.7 exception: the owner explicitly approved one 32-second transform-only information marquee. It pauses offscreen, while the page is hidden, on hover, on focus, and through its accessible pause control; reduced motion renders a static three-card grid. No other new looping 2D animation was added.
- Refinement assets: `skyvault-emblem-light-v2.png`, `skyvault-emblem-dark-v2.png`, and `landing-vault-fallback-v2.png`. The supplied JPEG sources remain unchanged.
- Refinement contract check: no backend, API path, model, CORS, environment, authentication, or public-plan data-flow changes. React Query cancellation and loading, empty, error/retry, offline, and success behavior remain intact.
- Automated refinement verification: tsc [x] lint [x] build [x] Vitest [x] (12 files / 18 tests) token/API/layout/Canvas guardrail scans [x] diff whitespace check [x]
- Owner visual verification required before `DONE`: light/dark [ ] responsive 360x640 [ ] 390x844 [ ] 768x1024 [ ] 1024x768 [ ] 1440x900 [ ] no-h-scroll [ ] sticky-anchor clearance [ ] marquee pause/static reduced-motion [ ] 3D eligibility gates [ ] restrained vault interaction [ ] live plan data [ ]
- Open questions for the owner: none; run the visual verification checklist above and report any issue or approval.
