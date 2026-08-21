# SkyVault Frontend - Phase Ledger

Statuses: NOT_STARTED | IN_PROGRESS | DONE | REGRESSED | BLOCKED

| #   | Phase                             | Status      | Verified on | Notes                                                                                                                                |
| --- | --------------------------------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 0   | Foundation & Design System        | DONE        | 2026-08-20  | Foundation, design system, shared API client, and smoke tests verified.                                                              |
| 1   | App Shell, Routing, Errors        | DONE        | 2026-08-20  | App shell, route guards, branded error pages, offline banner, and smoke tests verified.                                              |
| 2   | Public Landing & Marketing        | DONE        | 2026-08-20  | Quiet Vault refinement accepted for closure by the owner; automated verification passed.                                             |
| 3   | Authentication & Account          | DONE        | 2026-08-20  | UC-01 through UC-06 implemented; automated verification passed and the owner completed and accepted the end-to-end frontend journey. |
| 4   | Storage Subscription & Allocation | DONE        | 2026-08-21  | UC-07 through UC-10 plus owner-approved renewal and cancellation implemented and verified.                                           |
| 5   | Workspace Home                    | NOT_STARTED | -           |                                                                                                                                      |
| 6   | Folder & File Management          | NOT_STARTED | -           |                                                                                                                                      |
| 7   | Recycle Bin                       | NOT_STARTED | -           |                                                                                                                                      |
| 8   | File Sharing                      | NOT_STARTED | -           |                                                                                                                                      |
| 9   | Intelligent Search & Discovery    | NOT_STARTED | -           |                                                                                                                                      |
| 10  | Administration                    | NOT_STARTED | -           | Owner-gated.                                                                                                                         |
| 11  | Hardening & Handover              | NOT_STARTED | -           |                                                                                                                                      |

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
- Quiet Vault visual refinement: added theme-specific transparent emblem assets with a live header `SkyVault` signature; sticky responsive public navigation; restrained hero entrance motion; an R3F safe-vault assembly with a teal-backed white dial, eight spokes, top grip, hinges and fasteners; interaction-driven dial motion and pointer tilt; a transparent static safe fallback; deferred below-fold sections; a scroll-revealed workflow; illustrated stationary plan cards; and a landing-proportion route skeleton. The duplicate hero signature and the right-side locking bars were removed in the final owner review.
- Approved Section 3.7 exception: the owner explicitly approved one 32-second transform-only information marquee. It pauses offscreen, while the page is hidden, on hover, on focus, and through its accessible pause control; reduced motion renders a static three-card grid. No other new looping 2D animation was added.
- Refinement assets: `skyvault-emblem-light-v2.png`, `skyvault-emblem-dark-v2.png`, and `landing-vault-fallback-v2.png`. The supplied JPEG sources remain unchanged.
- Refinement contract check: no backend, API path, model, CORS, environment, authentication, or public-plan data-flow changes. React Query cancellation and loading, empty, error/retry, offline, and success behavior remain intact.
- Final owner-review refinements: native smooth anchor navigation; route and deferred-section cross-fade with the permitted 8px rise; one-time mobile/desktop workflow-path growth and step rotation; API-driven two-column storage/billing facts on plan cards; and a tested Pause -> Resume control that clears the focus-held pause state.
- Automated refinement verification: tsc [x] lint [x] build [x] Vitest [x] (12 files / 18 tests) token/API/layout/Canvas guardrail scans [x] diff whitespace check [x]
- Responsive record: the earlier owner viewport pass remains the Phase 2 manual baseline; the final delta uses responsive Tailwind defaults only and passed static no-overflow/guardrail review. A new automated browser screenshot run was not authorised, and is not claimed here.
- Owner closure: the owner reviewed the refined landing surface, supplied the final visual corrections, and explicitly requested Phase 2 be marked `DONE` after their implementation and automated verification.
- Open questions for the owner: none.

## Phase 3 - Authentication & Account

- Status: DONE
- Date: 2026-08-20
- Controllers read: `Backend/Controllers/AuthController.cs`
- DTOs and implementation read: `Backend/DTOs/Authentication/**`, `Backend/Services/Authentication/AuthService.cs`, `Backend/Services/Authentication/Security/JwtTokenService.cs`, `Backend/Services/Authentication/Email/EmailService.cs`, and the UC-01 through UC-06 SRS contract
- Approved backend exception: authentication-only additions for resend verification, change password, generic recovery responses, and frontend-facing verification/reset email links. No other backend scope is authorised.
- Endpoints consumed: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/verify-email`, `POST /api/auth/resend-verification`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `GET/PUT /api/auth/profile`, `POST /api/auth/change-password`, and `POST /api/auth/logout` through `src/api/endpoints/auth.api.ts`.
- Frontend implementation: lazy canonical auth routes plus `/auth?mode=...` compatibility redirect; React Hook Form/Zod forms; typed hook/service/endpoint/Axios chains; safe known-error mapping and case-insensitive field mapping; one-time URL-token removal; access-token persistence, role decoding, expiry timer, Bearer attachment, central authenticated-401 cleanup, query cancellation/clear, redirect-after-login, and protected account settings.
- Account states: profile loading skeleton, error/retry, verified-email success state, profile update, password change with forced sign-in, and logout with guaranteed local cleanup. Phase 4 storage/quota UI was not introduced.
- Auth visual: lazy R3F key-and-dial scene built from native primitives and `useFrame`, two lights, restrained four-degree tilt, shared mobile/reduced-motion/low-core eligibility gates, Suspense and Canvas-error SVG fallback, and no additional Canvas host.
- Backend implementation: generic resend/forgot responses; authorized change-password action; frontend-base-url configuration; frontend verification/reset links; and removal of raw-token email fallback text. Access-token-only behavior remains unchanged.
- Automated verification: frontend tsc [x] lint [x] production build [x] Vitest [x] (24 files / 45 tests) backend build [x] Swagger route inventory [x] token/API/color/layout/Canvas guardrail scans [x] diff whitespace check [x].
- Build advisories: Vite reports the existing large vendor chunks; .NET reports the existing MailKit 4.13.0 `NU1902` moderate-severity advisory. Neither was introduced or changed in this phase.
- Post-implementation verification: frontend TypeScript build [x] isolated backend build [x] focused authentication error-normalization tests [x].
- Final refinements: verification completion follows the request promise without stalling; one-time tokens are removed from the address bar; session cleanup cancels requests and removes cached queries without interrupting active mutations; known backend authentication errors map to safe, specific guidance; verification and recovery pages link back to sign-in; and authenticated SMTP delivery includes multipart content, message identifiers, and acceptance diagnostics without exposing tokens.
- Owner closure: the owner completed end-to-end frontend testing, confirmed that the module and all its flows are satisfactory, and explicitly approved Phase 3 for completion on 2026-08-20.
- Open questions for the owner: none. No unresolved API gap blocks Phase 3.

## Phase 4 - Storage Subscription & Allocation

- Status: DONE
- Date: 2026-08-21
- Controllers read: `Backend/Controllers/StoragePlanController.cs`, `Backend/Controllers/SubscriptionController.cs`, `Backend/Controllers/AdditionalStorageController.cs`, and `Backend/Controllers/StorageQuotaController.cs`.
- DTOs and implementation read: the storage-plan, subscription, payment, additional-storage, and quota request/response DTOs; their entity status enums; `StoragePlanService`, `SubscriptionService`, `AdditionalStorageService`, and `StorageQuotaService`; and the UC-07 through UC-10 SRS contract.
- Endpoints consumed: `GET /api/storage-plans`, `GET /api/storage-plans/{storagePlanId}`, `POST /api/subscriptions`, `GET /api/subscriptions/me`, `POST /api/subscriptions/renew`, `POST /api/subscriptions/cancel`, `POST /api/additional-storage/quote`, `POST /api/additional-storage`, `GET /api/additional-storage/me`, and `GET /api/storage/quota` through typed endpoint -> service -> React Query chains.
- Frontend implementation: protected storage dashboard and checkout routes; API-owned quota, current-plan, plan-catalogue, and purchase-history surfaces; subscription, active-plan replacement, renewal, cancellation, quote, and additional-storage flows; transient validated payment form; safe storage/payment error normalization; exact status constants; coordinated query invalidation; and `404` current-subscription normalization to the valid no-plan state.
- Payment contract: cardholder name, card number, expiry month/year, and CVV mirror `ProcessPaymentRequestDto`. Prices and quotes are read-only PKR values from the API. Neither subscription nor additional-storage requests send an amount, and no card data is persisted or logged. The internal `PaymentResponseDto` is not exposed as a frontend model because no controller returns it.
- Owner decisions recorded: recommendation is controlled only by optional `VITE_RECOMMENDED_STORAGE_PLAN_ID`; unset, invalid, inactive, or unmatched values produce no badge. Payment processing is synchronous, so Pending is only the in-flight POST screen and no polling or return endpoint is invented. Renewal and cancellation are included by explicit owner choice. PKR remains the confirmed currency.
- Lifecycle and safety states: active, cancelled/expired grace-period, and no-subscription actions; explicit replacement acknowledgement; full processing/success/failure checkout states; payment retry with transient sensitive values cleared; focus-trapped destructive cancellation with focus restoration; no-subscription, write-disabled, and over-quota quota explanations; loading, empty, error/retry, offline, and success states.
- Storage visual: asymmetric personal-vault quota signature card driven only by `StorageQuotaResponse`; accessible meter and fully visible allocated/used/available values; teal, amber-at-80%, and coral-at-95% signals with non-color copy/icons; lazy demand-rendered R3F quota volume with mobile, reduced-motion, low-core, Suspense, and Canvas-error SVG fallback.
- Navigation and responsiveness: Storage added to the floating rail and six-item mobile dock with 44px targets. A rendered browser pass verified light and dark at 360x640, 390x844, 768x1024, 1024x768, and 1440x900 with no horizontal overflow; representative mobile, tablet, and desktop surfaces were visually inspected.
- Dependency: `@radix-ui/react-dialog` supplies the accessible focus-trapped confirmation primitive and is styled only through the existing semantic design tokens.
- Backend changes: none. Backend files remained read-only.
- Deviations from the master prompt: none.
- Open questions for the owner: none. A real plan GUID can be supplied later through `VITE_RECOMMENDED_STORAGE_PLAN_ID` without blocking or changing catalogue behavior.
- Verification: tsc [x] lint [x] production build [x] Vitest [x] (37 files / 77 tests) endpoint/request/signal contracts [x] validators [x] mutation invalidation [x] lifecycle/flow states [x] accessible meter/dialog/payment fields [x] light/dark [x] responsive 360 [x] 390 [x] 768 [x] 1024 [x] 1440 [x] no-h-scroll [x] token/API/color/Canvas guardrail scans [x] diff whitespace check [x] Phase 4 smoke suite [x].
