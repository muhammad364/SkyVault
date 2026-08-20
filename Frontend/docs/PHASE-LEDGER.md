# SkyVault Frontend - Phase Ledger

Statuses: NOT_STARTED | IN_PROGRESS | DONE | REGRESSED | BLOCKED

| # | Phase | Status | Verified on | Notes |
|---|-------|--------|-------------|-------|
| 0 | Foundation & Design System | DONE | 2026-08-20 | Foundation, design system, shared API client, and smoke tests verified. |
| 1 | App Shell, Routing, Errors | DONE | 2026-08-20 | App shell, route guards, branded error pages, offline banner, and smoke tests verified. |
| 2 | Public Landing & Marketing | DONE | 2026-08-20 | Public landing, live public plan preview, and all required verification completed. |
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

- Status: DONE
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

- Status: DONE
- Date: 2026-08-20
- Controllers read: `Backend/Controllers/StoragePlanController.cs`
- DTOs and implementation read: `Backend/DTOs/StoragePlan/Responses/StoragePlanResponseDto.cs`, `Backend/Services/StorageService/StoragePlanService.cs`, `Backend/Services/StorageService/SubscriptionService.cs`
- Endpoints consumed: `GET /api/storage-plans` -> `src/api/endpoints/storage-plans.api.ts` -> `publicPlansService.list` -> `usePublicStoragePlans`
- Files added/changed: landing route and public layout navigation; hero, marketing highlights, how-it-works and public-plans components; lazy R3F vault scene, SVG and local canvas-error fallbacks; storage plan response model; endpoint/service/query hook; query key; public-plan smoke tests; API gap record; `three` and `@types/three` as the direct runtime/type peer requirements for the approved R3F scene.
- Owner-approved backend exceptions: `[AllowAnonymous]` was added only to `StoragePlanController.GetAllPlans`; a `SkyVaultFrontend` CORS policy permits only Vite's `http://localhost:5173` and `http://127.0.0.1:5173` origins. The controller-level authorization remains in force for every other plan action; mutation and subscription actions are unchanged.
- Design system compliance: semantic tokens only; light and dark theme support; reduced-motion, low-core, and sub-768px SVG fallback; keyboard-visible CTAs and retry action.
- States covered: landing route skeleton, plan loading skeleton, zero-plan empty state, public-plan error/retry, global offline banner, existing unauthorised route, success state; read cancellation is forwarded through React Query, service, endpoint, and Axios.
- Pricing decision: the owner confirmed `Price` values are PKR. The public preview shows PKR, the API-provided storage size in GB, and the API-provided billing cycle.
- Verification: tsc [x] lint [x] build [x] smoke test [x] (8 files / 13 tests) light/dark [x] responsive 360 [x] 390 [x] 768 [x] 1024 [x] 1440 [x] no-h-scroll [x] touch-equivalents [x] cancellation [x] keyboard [x]
- Open questions for the owner: none
