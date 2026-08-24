# SkyVault Frontend - Phase Ledger

Statuses: NOT_STARTED | IN_PROGRESS | DONE | REGRESSED | BLOCKED

| #   | Phase                             | Status      | Verified on | Notes                                                                                                                                |
| --- | --------------------------------- | ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 0   | Foundation & Design System        | DONE        | 2026-08-20  | Foundation, design system, shared API client, and smoke tests verified.                                                              |
| 1   | App Shell, Routing, Errors        | DONE        | 2026-08-20  | App shell, route guards, branded error pages, offline banner, and smoke tests verified.                                              |
| 2   | Public Landing & Marketing        | DONE        | 2026-08-20  | Quiet Vault refinement accepted for closure by the owner; automated verification passed.                                             |
| 3   | Authentication & Account          | DONE        | 2026-08-20  | UC-01 through UC-06 implemented; automated verification passed and the owner completed and accepted the end-to-end frontend journey. |
| 4   | Storage Subscription & Allocation | DONE        | 2026-08-24  | Fresh quota-vault threshold, fallback, theme, build, and full-suite regression evidence passed.                                      |
| 5   | Workspace Home                    | DONE        | 2026-08-24  | Owner rendered review accepted; fresh home filename/quota and complete automated gates passed.                                       |
| 6   | Folder & File Management          | DONE        | 2026-08-24  | Owner rendered review accepted; 100 MiB, transfer, dock, containment, and complete automated gates passed.                           |
| 7   | Recycle Bin                       | DONE        | 2026-08-24  | Owner rendered review accepted; hierarchy-root and defensive-selection regressions passed.                                           |
| 8   | File Sharing                      | DONE        | 2026-08-24  | Owner rendered review accepted; responsive sharing and secret-safety regressions passed.                                             |
| 9   | Metadata Search & Discovery       | DONE        | 2026-08-24  | Owner rendered review accepted; search, shared file actions, and complete automated gates passed.                                    |
| 10  | Administration                    | DONE        | 2026-08-24  | Owner rendered review accepted; all-status plan management and complete automated gates passed.                                      |
| 11  | Hardening & Handover              | IN_PROGRESS | -           | Implementation and automated verification complete; owner review of the newly hardened UI remains pending.                           |

## Cross-phase visual system approval

- Status: ACCEPTED
- Date: 2026-08-22
- Scope: every frontend surface delivered in Phases 0–4 and every successor phase.
- Owner approval: after end-to-end visual testing, the owner accepted the zinc, midnight-slate, and
  burgundy redesign and explicitly authorised its persistence in the frontend documentation.
- Authoritative direction: gray outer framed canvas; white/zinc light surfaces; ink/zinc dark
  surfaces; midnight-slate interaction; burgundy identity and focus accents; neutral slate/black
  shadows; and a shared midnight-slate primary-action gradient. The active light/dark values are
  recorded in the master prompt and `UI-GUIDE.md`.
- Locked geometry: the redesign changes color and asset presentation only. Existing DOM structure,
  four-sided frame padding, spacing, widths, heights, breakpoints, radii, typography, ordering,
  motion, behavior, state handling, and API integration remain unchanged.
- Functional signals: amber is restricted to genuine warnings such as offline, grace-period, and
  quota-at-80% states. Danger red/burgundy is restricted to validation, errors, destructive actions,
  and quota-at-95%/over-quota states. Success uses slate. No active teal, mint, aqua, or green remains.
- Brand and assets: `BrandSignature` keeps a live wordmark (`Sky` foreground, `Vault` brand) and uses
  theme-specific v3 emblems. Active marks, favicon, landing fallback, auth fallback, quota fallback,
  and R3F materials use zinc/graphite, steel-slate, and restrained burgundy. Superseded assets remain
  available only as unreferenced rollback material until a separate cleanup is requested.
- 3D contract: landing uses a graphite frame, zinc door, silver dial, and burgundy hub; auth uses a
  graphite dial, zinc key/wheel, and burgundy hub; quota uses a zinc shell with slate normal, amber
  warning, and danger/burgundy critical fill. Geometry, performance gates, and fallback behavior are
  unchanged.
- Verification inherited from the approved implementation: TypeScript [x] lint [x] production build
  [x] Vitest [x] (81 tests) semantic token/contrast/theme asset/threshold coverage [x] changed-file
  formatting [x]. The owner completed and accepted the end-to-end visual review.
- Backend/API impact: none. `API-GAPS.md` and backend files remain unchanged.
- Readiness: Phases 0–4 remain `DONE`; Phase 5 is the next unstarted phase and may begin when the
  owner requests it.

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
- Quiet Vault visual refinement: added theme-specific transparent emblem assets with a live header `SkyVault` signature; sticky responsive public navigation; restrained hero entrance motion; an R3F safe-vault assembly with a graphite frame, zinc door, silver dial, burgundy hub, eight spokes, top grip, hinges and fasteners; interaction-driven dial motion and pointer tilt; a transparent static safe fallback; deferred below-fold sections; a scroll-revealed workflow; illustrated stationary plan cards; and a landing-proportion route skeleton. The duplicate hero signature and the right-side locking bars were removed in the final owner review.
- Approved Section 3.7 exception: the owner explicitly approved one 32-second transform-only information marquee. It pauses offscreen, while the page is hidden, on hover, on focus, and through its accessible pause control; reduced motion renders a static three-card grid. No other new looping 2D animation was added.
- Active refinement assets after the approved cross-phase redesign: `skyvault-emblem-light-v3.png`, `skyvault-emblem-dark-v3.png`, `landing-vault-fallback-light-v3.png`, and `landing-vault-fallback-dark-v3.png`. The v2 and supplied JPEG sources remain unchanged as unreferenced rollback material.
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
- Storage visual: asymmetric personal-vault quota signature card driven only by `StorageQuotaResponse`; accessible meter and fully visible allocated/used/available values; midnight-slate normal, amber-at-80%, and danger/burgundy-at-95% signals with non-color copy/icons. The 2026-08-24 owner revision replaced the visually ambiguous transparent cube/dial with a lazy upright rounded zinc vault based on the approved quota asset. Its inner level fills bottom-up from the response percentage, and its code-native theme-aware SVG fallback preserves the same live level on mobile, reduced motion, low-core hardware, loading, or Canvas failure.
- Navigation and responsiveness: Storage added to the floating rail and six-item mobile dock with 44px targets. A rendered browser pass verified light and dark at 360x640, 390x844, 768x1024, 1024x768, and 1440x900 with no horizontal overflow; representative mobile, tablet, and desktop surfaces were visually inspected.
- Dependency: `@radix-ui/react-dialog` supplies the accessible focus-trapped confirmation primitive and is styled only through the existing semantic design tokens.
- Backend changes: none. Backend files remained read-only.
- Deviations from the master prompt: none.
- Open questions for the owner: none. A real plan GUID can be supplied later through `VITE_RECOMMENDED_STORAGE_PLAN_ID` without blocking or changing catalogue behavior.
- Verification: tsc [x] lint [x] production build [x] Vitest [x] (37 files / 77 tests) endpoint/request/signal contracts [x] validators [x] mutation invalidation [x] lifecycle/flow states [x] accessible meter/dialog/payment fields [x] light/dark [x] responsive 360 [x] 390 [x] 768 [x] 1024 [x] 1440 [x] no-h-scroll [x] token/API/color/Canvas guardrail scans [x] diff whitespace check [x] Phase 4 smoke suite [x].
- Post-verification revision closure (2026-08-24): the quota visual/fallback change is shared with Phase 5 and preserves the established API values, thresholds, meters, and no-subscription behavior. Fresh focused normal/80%/95%/full/fallback/theme coverage, the complete 88-file/184-test suite, strict TypeScript, lint, production build, and owner-rendered review passed. The scene was further hardened to the master two-light maximum without changing its geometry or response-driven fill.

## Phase 5 - Workspace Home

- Status: DONE
- Date: 2026-08-22
- Controllers read: `Backend/Controllers/AuthController.cs`, `Backend/Controllers/StorageQuotaController.cs`, `Backend/Controllers/SubscriptionController.cs`, `Backend/Controllers/UserFileController.cs`, `Backend/Controllers/ShareLinkController.cs`, and `Backend/Controllers/RecycleBinController.cs`.
- DTOs and implementation read: `UserProfileResponseDto`, `StorageQuotaResponseDto`, `SubscriptionResponseDto`, `FileResponseDto`, `GenerateShareLinkResponseDto`, and `RecycleBinItemDto`; the corresponding file, sharing, and recycle-bin services/repositories were inspected for returned ordering and field semantics.
- Endpoints consumed: existing `GET /api/auth/profile`, `GET /api/storage/quota`, and `GET /api/subscriptions/me` hooks plus new GET-only frontend chains for `GET /api/files`, `GET /api/share-links`, and `GET /api/recycle-bin`. No workspace-summary endpoint was created or assumed.
- Frontend implementation: protected lazy `/vault` home; compact API-personalized greeting; shallow file-first quick-actions strip; equally weighted recent-files and root-folders panels; one combined quota/current-plan overview; smaller shared-links and trash summaries; independent skeleton, empty/no-plan, error/retry, and success states; and semantic responsive one/two/four-column composition.
- Read-only feature slices: exact TypeScript mirrors for the three response DTOs; one endpoint module per backend controller; pass-through feature services; React Query hooks and controller-specific query keys. Every read forwards React Query's `AbortSignal` through service and Axios.
- Presentation decisions: recent files are a copied view of `GET /api/files`, ordered by response `updatedAt` and limited to four; every recent-file flex/grid ancestor is width-constrained and long names ellipsize with the complete name retained in native-title context, preventing overlap with Root folders. Shared links show only count, explicit revocation, creation, and expiry metadata and never render the returned URL; trash shows the two most recently deleted top-level DTOs and their API-provided expiry dates. No expiry validity or backend business rule is inferred.
- Quick actions: after the Phase 6 owner-approved evolution, only the functional `/vault/files` Upload, New folder, and Browse destinations are exposed. The detailed `/vault/storage` destination remains reachable from the combined storage overview and rail. Search, Sharing mutations, and Trash mutations remain untouched for their own phases.
- Quota consistency: Phase 4 and Phase 5 share one presentation helper for bounded meter width and the approved normal, warning-at-80%, and danger-at-95% signals. Both surfaces reuse the revised rounded-vault 3D object and live-percentage SVG fallback rather than rendering different quota metaphors.
- Design and accessibility: Quiet Vault semantic tokens only; no raw colors or new dependency; framed shell and mobile dock preserved; compact application-scale shell/greeting/card typography; reduced but consistent card padding and section gaps; asymmetric card spans; `min-w-0`/truncate overflow protection; 44px actions; headings, lists, status regions, meters, and machine-readable dates; light/dark and reduced-motion behavior inherited from the approved shared system.
- Owner-requested preview refinements: the `md`+ signed-in rail is contracted to the framed viewport and remains sticky while page content scrolls; Settings moved from the primary rail list into a bottom account area with a generic account depiction; Sign out sits beneath it on a muted neutral surface with danger-colored text/icon; and the Admin destination is no longer exposed in user navigation. The shell header, workspace greeting, shallow Quick actions strip, quota card, and remaining summaries use tighter application-scale spacing so the start of quota enters the initial reference tablet/desktop viewport. Route guards and backend authorization remain unchanged.
- States covered: per-region loading, empty/no-subscription, error/retry, and success; global unauthorized and offline handling inherited; automatic read cancellation remains silent and an unmount-abortion test confirms the request signal is aborted.
- Backend changes: none. Backend files remained read-only.
- Deviations from the master prompt: none in implementation; the owner-approved refinements are now part of the master prompt and UI guide.
- Open questions for the owner: none.
- Verification: TypeScript [x] lint [x] production build [x] Vitest [x] (fresh complete gate: 88 files / 184 tests) endpoint/request/signal contracts [x] query keys [x] cancellation [x] loading/empty/error/success states [x] quota thresholds [x] secret non-rendering [x] quick-action routes [x] sticky rail/account/sign-out behavior [x] token/API/color/layout guardrail scans [x] changed-file formatting [x] light/dark rendered [x] responsive 360 [x] 390 [x] 768 [x] 1024 [x] 1440 [x] no-h-scroll rendered [x] keyboard browser pass [x].

### Phase 5 evolving-home decision (2026-08-23)

- This owner-approved evolving-home exception is closed. The home evolved only by composing the real contracts unlocked by Phases 6–8; no future mutation or workspace-summary API was pulled forward.
- Phase 6 transformation: file-first Upload/New folder/Browse actions; equally weighted recent-files and root-folder panels (four items each); one quota/subscription overview with independent subregion failure handling; smaller sharing and trash summaries; and the detailed Storage destination retained for allocation management.
- The separate plan tile and oversized quota priority were removed. Root folders are only the `subFolders` returned by `GET /api/folders/root`, ordered for presentation by `updatedAt`.
- Revision closure (2026-08-24): Recent files enforces ellipsis/overflow containment at the list, row, link, and label levels so an arbitrarily long API filename cannot cross into Root folders. The combined storage overview receives the same API-driven rounded quota vault as Phase 4. Focused regressions, the complete automated gate, and owner-rendered review passed.

## Phase 6 - Folder & File Management

- Status: DONE
- Date: 2026-08-23
- Scope: UC-11 through UC-19 through the existing folder and file controllers only. No Phase 7/8 mutation, resumable upload, version-history, mock domain data, or invented operation-status endpoint was added. A later owner-authorized backend transport correction aligns Kestrel with the already-defined 100 MiB file contract.
- Routes and reads: protected lazy `/vault/files` and `/vault/files/:folderId`; cancellable root/current contents and ancestry reads; desktop lazy tree plus mobile navigator; API breadcrumbs; persisted grid/list; current-folder filtering/sorting; folders before files.
- Actions: create, rename, move, copy-files-only, replace, upload, preview, download, and move-to-Trash deletion. Mixed selection supports Move/Delete; Copy is disabled when a folder is selected. Sequential batch operations report completed counts, stop queued work after the current request, and preserve partial-completion truth.
- Operation safety: a non-persisted workspace provider queues uploads one at a time. Upload/replace uses real browser progress and removes Cancel at 100% before indeterminate server processing. Preview is cancellable within its protected full-page viewer and is omitted from the floating dock; download remains cancellable and visible there. Submitted copy/move/delete is non-cancellable and uses indeterminate progress. Successful/cancelled dock entries auto-dismiss after three seconds, failures remain retryable, and long labels/progress are viewport-contained without horizontal scrolling. Sign-out aborts queued/safe work and clears transient files/controllers.
- Preview safety: only API-response-declared common raster images excluding SVG, PDF, plain text, audio, and video render in-browser. Unknown content is download-only; object URLs are revoked.
- Visual/accessibility: Quiet Vault cards, 44px controls, accessible Radix menus/dialogs, visible selection, `aria-busy`, `aria-live`, accessible progress semantics, drag/drop plus button, responsive bottom sheets, one lazy empty-state-only zinc/burgundy folder with light/dark fallback, and one-line filename truncation with full-name title context throughout file cards and the operation dock.
- Dependency: `@radix-ui/react-dropdown-menu` is the sole Phase 6 dependency, chosen for shadcn-aligned keyboard/focus behavior in card action menus and breadcrumb overflow.
- Backend revision (2026-08-24, owner-authorized): `FileUploadLimits` centralizes an exact 100 MiB file maximum and a 101 MiB multipart request envelope. Upload and replace declare both request-body and form limits with that envelope, avoiding Kestrel's approximately 28.6 MiB default while leaving `UserFileService` authoritative at 100 MiB. Upstream reverse-proxy limits remain deployment-owned.
- Verification: TypeScript [x] lint [x] production build [x] full Vitest [x] (fresh complete gate: 88 files / 184 tests) endpoint/service/query/store contracts [x] upload cancellation-boundary transition [x] manager/home UI coverage [x] changed-file formatting [x] diff whitespace check [x] light/dark rendered [x] responsive 360 [x] 390 [x] 768 [x] 1024 [x] 1440 [x] no-h-scroll rendered [x] keyboard browser pass [x].
- Revision closure (2026-08-24): focused coverage accepts exactly 100 MiB and rejects the next byte, verifies progress/cancellation/timeout boundaries, dock dismissal and preview suppression, and filename containment. The complete 88-file/184-test suite, strict TypeScript, lint, production build, backend Release build/source audit, and owner-rendered review passed.

## Phase 7 - Recycle Bin

- Status: DONE
- Date: 2026-08-23
- Contract: `RecycleBinController`, `RecycleBinItemDto`, `MessageResponseDto`, `RecycleBinService`, and the cleanup scheduler were re-read before implementation.
- Endpoints consumed: existing `GET /api/recycle-bin`; `POST /api/recycle-bin/files/{fileId}/restore`; `POST /api/recycle-bin/folders/{folderId}/restore`; `DELETE /api/recycle-bin/files/{fileId}`; `DELETE /api/recycle-bin/folders/{folderId}`.
- Frontend implementation: protected lazy `/vault/trash`; independent loading/error/empty/success states; API-date retention presentation; local name/type filtering and API-field sorting; 44px selection and action controls; single and bulk restore; typed permanent-deletion confirmation; and a working Phase 5 Trash destination.
- Hierarchy and operation safety: a deleted folder is now the sole list representative for its complete hierarchy. `GetItemsAsync` filters out folders whose current parent is deleted and files whose containing folder is deleted; retained relationships still drive complete folder restore/permanent deletion. Direct descendant restore/delete lookup rejects the request while the parent remains deleted, and Recycle Bin folders remain non-browsable. Frontend selection collapse remains defensive for stale responses. Restore and permanent deletion run sequentially in the workspace operation dock with honest indeterminate progress, completed counts, partial-failure reporting, and Stop queued. Submitted requests are not aborted and use no automatic Axios timeout.
- Backend revision (2026-08-24, owner-authorized): only `RecycleBinService` listing and owned-deleted-item guards changed. DTOs, routes, repository contracts, retention calculation, scheduler, and hierarchy traversal were preserved.
- Verification: TypeScript [x] lint [x] production build [x] full Vitest [x] (fresh complete gate: 88 files / 184 tests) exact endpoint/signal/timeout contracts [x] hierarchy collapse [x] Phase 5 Trash link [x] changed-file formatting [x] light/dark rendered [x] responsive 360 [x] 390 [x] 768 [x] 1024 [x] 1440 [x] no-h-scroll rendered [x] keyboard browser pass [x].
- Revision closure (2026-08-24): hierarchy-root presentation, direct descendant guards, stale-response defensive selection collapse, the complete automated gate, backend Release build/source audit, and owner-rendered review passed.

## Phase 8 - File Sharing

- Status: DONE
- Date: 2026-08-23
- Contract: `ShareLinkController`, `PublicShareController`, `GenerateShareLinkRequestDto`, `GenerateShareLinkResponseDto`, and `MessageResponseDto` were re-read before implementation. The internal `ShareLinkDto` was not mirrored because no controller returns it.
- Endpoints consumed: existing `GET /api/share-links`; `POST /api/share-links`; `PATCH /api/share-links/{shareLinkId}/revoke`; anonymous `GET /api/share/{shareToken}` preview and `GET /api/share/{shareToken}/download`.
- Owner management: protected lazy `/vault/sharing`; independent link-list and filename-lookup states; exact optional future-expiry request; memory-only generated URLs; explicit `Not revoked`/`Revoked` presentation; copy and revoke flows; and a Share action on owned-file menus. Filename lookup failure uses neutral copy and never exposes a GUID.
- Create-link layout revision (2026-08-24): the dialog, form, labels, native file selector, and generated-link input now propagate `min-w-0`, viewport caps, truncation, and horizontal clipping. Long filenames/URLs remain inside the card and the complete workflow no longer requires left-to-right scrolling at mobile or desktop widths.
- Public access: anonymous lazy `/share/:shareToken` is a frontend wrapper around only the real public endpoints. The API-provided raw-stream URL is parsed in memory, the frontend route is copied, safe response types reuse the Phase 6 preview whitelist, unsupported content stays download-only, and Blob URLs are revoked.
- Transfer and error safety: public preview/download is cancellable, begins indeterminate, reports real response-transfer progress when content length exists, and treats cancellation neutrally. JSON API errors returned as Blob responses are decoded before safe normalization so invalid, expired, revoked, shared-file-not-found, offline, and retry states remain distinct without raw backend text.
- Shell and home: Shared links is available in the desktop rail; the six-destination mobile dock retains its size through a keyboard-accessible More menu containing Shared links, Account settings, and Sign out. The Phase 5 shared-links summary now has a working `/vault/sharing` destination while continuing to hide share URLs.
- Backend changes/dependencies: none. Backend files remained read-only and no new dependency or 3D surface was added.
- Verification: TypeScript [x] lint [x] production build [x] full Vitest [x] (fresh complete gate: 88 files / 184 tests) exact endpoint/body/signal/timeout/Blob contracts [x] frontend URL wrapper [x] Blob error decoding [x] secret non-persistence/non-rendering [x] protected/anonymous routes [x] desktop/mobile navigation [x] Phase 5 Shared links destination [x] changed-file formatting [x] light/dark rendered [x] responsive 360 [x] 390 [x] 768 [x] 1024 [x] 1440 [x] no-h-scroll rendered [x] keyboard browser pass [x].
- Revision closure (2026-08-24): focused long-name/link viewport-containment and value-preservation coverage, the complete automated gate, and owner-rendered review passed.

## Phase 9 - Metadata Search & Discovery

- Status: DONE
- Date: 2026-08-23
- Contract: `SearchController`, `SearchRequestDto`, `SearchResultDto`, `SearchService`, and the owned-active-files repository read were re-read before implementation.
- Endpoint consumed: authorized `GET /api/search` with only nullable `query`, `fileType`, `fromDate`, and `toDate`. Every read forwards React Query's `AbortSignal`; parameter changes abandon stale reads silently.
- Search page: protected lazy `/vault/search`; compact keyword/type/upload-date form; exact URL hydration and serialization; 300 ms debounce; request-free initial guidance; session-only recent submissions; independent loading/error/retry/no-results/success states; and results displayed in untouched server order with every returned DTO field.
- Discovery and actions: each result links to the returned folder or root and reuses the Phase 6 preview, download, rename, move, copy, replace, move-to-Trash, selection/bulk, operation-dock, and Phase 8 sharing components. Successful vault work invalidates all parameterized search reads.
- Command experience: the global command opens through `/`, `Ctrl+K`, or `Cmd+K`; shows up to five session recents or a small server-ordered result preview; supports Arrow Up/Down, Enter, Escape, click, and touch; and routes submitted searches to the full page. Recent searches are capped at five, never persisted, and cleared with sign-out.
- Scope integrity: no content search, natural-language/AI mode, embeddings, semantic claim, size/folder filter, pagination, score, highlight, match context, or client-side re-ranking was added.
- Backend changes/dependencies: none. Backend files remained read-only and no new dependency or 3D surface was added.
- Verification: TypeScript [x] lint [x] production build [x] full Vitest [x] (fresh complete gate: 88 files / 184 tests) exact endpoint/query fields/signal [x] service passthrough [x] stable query keys [x] 300 ms debounce/stale cancellation [x] URL hydration [x] request-free initial state [x] session recents/sign-out cleanup [x] server order [x] route registration [x] keyboard command behavior [x] reused file/share actions [x] search invalidation [x] public-share error-state hardening [x] changed-file formatting [x] light/dark rendered [x] responsive 360 [x] 390 [x] 768 [x] 1024 [x] 1440 [x] no-h-scroll rendered [x] keyboard browser pass [x].
- Shared-component revision closure (2026-08-24): search actions inherit the Phase 6 dock's preview suppression, viewport containment, filename truncation, and three-second successful/cancelled dismissal. Focused regressions, the complete automated gate, and owner-rendered review passed.

## Phase 10 - Administration

- Status: DONE
- Date: 2026-08-23
- Owner gate and progression: the owner explicitly opened the gated administration phase and authorised continuing while Phases 5–9 remain `IN_PROGRESS` so functional implementation can finish before the recorded revision pass. This does not close those phases or open Phase 11.
- Controllers read: every backend controller was inventoried. Phase 10 consumes role-restricted actions from `AdminController`, `EmailConfigurationController`, `StorageAccountController`, `StoragePlanController`, `StorageProviderController`, and the admin reads in `SubscriptionController`, plus the shared authenticated profile/password/logout actions in `AuthController`.
- DTOs read and mirrored: `AdminUserDto`, `StorageOverviewDto`, `UserStorageAllocationDto`, `SystemStatisticsDto`, `AuditLogDto`; storage-plan create/update/response; storage-provider create/update/response; storage-account create/update/response; email-configuration create/update/response; existing subscription and authenticated account responses. Exact camel-case request/response fields and backend nullability are preserved; obsolete admin plan DTOs unused by controllers were not mirrored.
- Authentication and isolation: the shared login page now has accessible User/Admin tabs. Admin mode submits the real email/password DTO and omits registration/forgot-password UI. Role mismatch fails before session persistence. Admin sessions route only to `/admin` and are redirected out of `/vault`; ordinary users reach the branded 403 route for `/admin`. No admin destination appears in the user rail and no personal-vault feature appears in the admin shell.
- Routes and shell: protected lazy `/admin`, `/admin/users`, `/admin/users/:userId`, `/admin/plans`, `/admin/subscriptions`, `/admin/infrastructure`, `/admin/email`, `/admin/audit`, and `/admin/settings`. The quieter/dense framed shell uses a sticky desktop rail, six-slot mobile navigation with More, semantic tokens, 44px controls, and contained long content.
- Dashboard and monitoring: independently retryable current system statistics, storage overview, and five-entry audit regions; three response-backed summaries; two non-animated Recharts visuals using only midnight-slate/burgundy semantic colors; and no invented trends, revenue, health, history, forecasts, or 3D.
- Management: responsive user list/detail, storage allocation, subscription history, confirmed user activation/deactivation; all-status plan create/edit/filter/activate/deactivate; read-only subscription monitoring with independent user-name composition; provider and storage-account create/edit/status management; SMTP configuration create/edit/activate/deactivate/permanent delete; server-filtered audit log with detail and honest offset navigation; and administrator-specific account/profile/password/logout copy.
- Data flow and safety: every read follows endpoint → service → React Query hook and forwards `AbortSignal`. Role-restricted admin management writes use exact bodies/routes, `timeout: 0`, no unmount signal, confirmed destructive/status dialogs, React Hook Form + Zod validation, safe normalized errors, pending labels, and no submitted-request Cancel. Successful work invalidates the complete admin query family; plan work also invalidates the shared plan family. Shared account actions retain the established Phase 3 behavior.
- Responsive/accessibility: desktop tables have sticky headers, hairline rows, muted hover, mono numerics, and pill statuses; base layouts become stacked label-value cards. `min-w-0`, truncation, line clamp, word breaks, and deliberate desktop `overflow-x-auto` wrappers prevent content leakage. Native controls preserve 44px targets, visible focus, mobile 16px text, semantic landmarks, dialog focus management, and reduced-motion-safe charts.
- Plan catalogue revision (2026-08-24): role-restricted `GET /api/storage-plans/admin` calls the existing service with `isActive: null` and returns active plus inactive `StoragePlanResponseDto` records. The admin endpoint/service/hook chain uses this route; local All/Active/Inactive filters show an honest shown/total count, and inactive cards expose the existing confirmed Activate action. Anonymous `GET /api/storage-plans` remains active-only for customers and guests.
- Backend changes/dependencies: the owner-authorized admin storage-plan read above is the sole Phase 10 backend addition; no DTO, dependency, mock data, admin secret, provider credential, username login, or ordinary user feature was added.
- Documented contract limits: no admin username/dedicated login/MFA/refresh; no user role/activity/pagination/bulk contract; no time-series metrics; read-only admin subscriptions; restricted provider/account updates; no SMTP connection-health test; audit paging without totals/action catalogue; no mutation compensation/status; and no operational settings beyond email configuration. The former inactive-plan discovery gap is resolved.
- Deviations from the owner's visual suggestion: no admin 3D was added because the authoritative master design explicitly prohibits 3D in admin screens. Real backend statistics are visualized through the approved Recharts system instead.
- Verification: TypeScript [x] lint [x] production build [x] focused Vitest [x] full Vitest [x] (fresh complete gate: 88 files / 184 tests) exact endpoint/body/signal/timeout contracts [x] service passthrough [x] stable query keys/read cancellation [x] mutation invalidation [x] User/Admin role match [x] admin/vault route isolation [x] real 403 [x] exact RHF/Zod form DTOs [x] password write-only handling [x] API-only dashboard facts [x] admin-only navigation [x] lazy route registration [x] changed-file formatting [x] raw-color/new-dependency/backend-change scans [x] light/dark rendered [x] responsive 360 [x] 390 [x] 768 [x] 1024 [x] 1440 [x] no-h-scroll rendered [x] keyboard browser pass [x].
- Revision closure (2026-08-24): focused endpoint, all-status filtering, activation/deactivation, and response-contract coverage, the complete automated gate, backend Release build/source audit, and owner-rendered review passed.

## Phase 11 - Hardening & Handover

- Status: IN_PROGRESS - implementation and automated verification complete; owner-rendered review of newly changed surfaces remains pending.
- Date: 2026-08-24
- Backend/API scope: read-only inventory and Release compilation only. No backend file, endpoint, DTO, domain rule, mock data, or API behavior changed.
- Shared controls: added shadcn-aligned Radix Select and Popover plus React DayPicker controls. All production native application selects and date/date-time inputs in Files, Recycle Bin, Sharing, Search, and Administration were replaced while preserving exact wire values and existing API parameters. Controls include 44px targets, keyboard/typeahead navigation, accessible labels, clear actions, min/max constraints, long-value truncation, internal scrolling, and viewport collision padding.
- Containment hardening: dropdown menus, popovers, dialogs, sheets, command surfaces, filters, and long-value layouts now use viewport caps, collision padding, safe internal scrolling, `min-w-0`, and horizontal clipping. The quota scene now uses two lights while retaining the approved geometry, live fill, thresholds, themes, and fallback.
- Owned preview: removed the small dialog and `?preview=` state. Protected lazy `/vault/preview/:fileId` keeps the workspace rail, hides the ordinary header, accepts memory-only filename/return state, falls back to the existing owned-files read for metadata, and never exposes a GUID. Its toolbar provides safe Back, Download, and supported browser Fullscreen. A dedicated abortable hook provides preparation/real response progress, neutral cancellation, Retry, safe errors, and Blob URL cleanup. Owned/public viewers share the same response-declared safe MIME renderer.
- Production hardening: route chunks remain lazy; explicit vendor splitting isolates Three.js, Recharts/D3, controls, motion, data, and React. Added `Frontend/README.md`, `docs/STATE-COVERAGE.md`, and `docs/HANDOVER.md` with setup, architecture, deployment, cancellation, 100 MiB proxy requirements, state coverage, constraints, and manual review checklist.
- Dependencies: `@radix-ui/react-select`, `@radix-ui/react-popover`, and `react-day-picker` are the only Phase 11 additions. They provide accessible primitives and collision-aware calendars without changing product contracts.
- Verification: strict TypeScript [x] ESLint zero warnings [x] production build/chunk review [x] complete Vitest [x] (88 files / 184 tests) backend Release build [x] (zero errors; no backend test project) backend contract audit [x] native-control audit [x] changed-file Prettier [x] repository format check [x] `git diff --check` [x] light/dark owner review [ ] responsive 360 [ ] 390 [ ] 768 [ ] 1024 [ ] 1440 [ ] no-h-scroll [ ] touch-equivalents [ ] reduced motion [ ] keyboard/fullscreen browser pass [ ].
- Known advisory: the read-only backend build reports existing MailKit 4.13.0 `NU1902` (`GHSA-9j88-vvj5-vhgr`). Remediation is recorded in `HANDOVER.md` and requires separate backend authority.
- Open questions for the owner: none. The only closure gate is the requested owner review of the newly hardened controls and full-page preview.
