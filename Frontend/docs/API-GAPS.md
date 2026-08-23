# SkyVault Frontend — API Gaps

No API gaps discovered during Phase 0.

The authentication API exposes JWT issuance through login but no refresh-token endpoint. The frontend will not invent refresh behavior; Phase 3 will centralize expiry/sign-out handling around the existing contract.

## Phase 2

- Resolved by owner decision on 2026-08-20: `StoragePlanResponseDto.Price` values are displayed as PKR. A currency field remains preferable for future multi-currency support, but no API change is needed for this product decision.

## Phase 3

- Resolved by the owner-approved authentication exception on 2026-08-20: resend verification and change password now have explicit API contracts, recovery responses are generic, and verification/reset emails target the frontend routes.
- The API still has no refresh-token contract. The frontend therefore uses only the issued access token, checks the API-provided expiry, and clears the session on expiry or an authenticated `401`; no refresh behavior was invented.
- Logout remains a stateless server acknowledgement. The frontend always cancels and clears private queries and removes the local access-token session, including when the logout request fails.
- Phase 3 closure (2026-08-20): the owner completed and accepted the end-to-end authentication and account journey, including delivered verification email links. No unresolved authentication API gap blocks completion.

## Phase 4

- No unresolved API gap blocks Phase 4. The frontend consumes the existing subscription, additional-storage, storage-plan, and quota contracts without backend changes.
- Resolved by owner decision on 2026-08-21: prices and server quotes are displayed as PKR. The API still has no currency field, so a future multi-currency product would require an explicit contract addition.
- Resolved by owner decision on 2026-08-21: the backend payment operation is synchronous and exposes no durable payment-status or return endpoint. The frontend therefore treats only the active POST as Pending and does not invent polling.
- Resolved by owner decision on 2026-08-21: the API has no recommended-plan designation. Optional public configuration `VITE_RECOMMENDED_STORAGE_PLAN_ID` may label only the matching active API plan; absent, invalid, inactive, or unmatched configuration creates no fallback recommendation.
- `GET /api/subscriptions/me` uses `404` to represent a user without a subscription. The frontend normalizes that response to `null` in the subscription service so the expected no-plan state is not presented as an error.
- `PaymentResponseDto` remains an internal backend detail and is deliberately not mirrored because no Phase 4 controller action returns it.

## Phase 5

- No unresolved API gap blocks the Workspace Home implementation. By owner decision on 2026-08-22, Phase 5 composes the existing profile, quota, subscription, file-list, share-link-list, and recycle-bin-list contracts instead of inventing a workspace-summary endpoint.
- The API exposes no count, limit, pagination, or recent-files query contract for these summaries. The frontend therefore keeps each response unchanged in its feature query cache and derives only the visible presentation: up to four files ordered by `updatedAt`, two links ordered by `createdAt`, and two recycle-bin items ordered by `deletedAt`.
- `GET /api/share-links` returns no file name. The Phase 5 summary does not join or invent one and does not render `shareUrl`; it displays only explicit creation, expiry, and revocation metadata. Expiry validity remains backend-owned and is not inferred by the home.
- Phase 5 originally added no file, sharing, or recycle-bin mutation. By owner-approved evolution on 2026-08-23, it now links only to the completed Phase 6 file manager and composes root folders; sharing and recycle-bin mutations remain scoped to Phases 7–8.

## Phase 6

- Resolved on 2026-08-24 by an owner-authorized backend transport correction: frontend validation and
  `UserFileService` already enforced an exact 100 MiB file limit, but Kestrel's unconfigured
  30,000,000-byte request-body default rejected multipart requests above about 28.6 MiB before the
  controller. Upload and replace now declare a 101 MiB request/form envelope for multipart overhead,
  while a shared backend constant keeps the actual file limit at 100 MiB. A production IIS/Nginx/other
  reverse proxy must be configured to allow at least the same envelope; the application cannot override
  an upstream proxy rejection.
- The folder/file APIs expose no pagination, limit, count, server sorting, or server filtering. The manager loads the existing current-folder response unchanged and applies only presentation filtering/sorting; no all-folder count is implied.
- There is no ancestry or recursive-tree endpoint. Breadcrumb ancestry uses cancellable parent-folder GET calls, and the navigator lazily reads a folder only when its branch opens.
- There is no preview-capability/details endpoint. The frontend requests preview only on demand and renders only the returned Blob content type for common raster images excluding SVG, PDF, plain text, audio, and video; every other type is download-only.
- There is no folder-copy or bulk move/delete endpoint. Copy is available only when every selected item is a file through `POST /api/files/copy`; mixed move/delete calls the real single-item endpoints sequentially and reports partial completion. Queued work can stop only after the current request.
- There is no operation-progress/status contract. Upload/replace percentage is browser-to-API transport progress only; after 100% the UI is indeterminate. Preview/download uses response transfer progress when content length is available. Copy/move/delete is always indeterminate.
- Backend upload, replace, and copy reserve logical quota/provider capacity before provider and metadata work, without a cancellation-compensation contract. Aborting after server processing begins can leave reservation/provider side effects. The owner-approved frontend safety boundary therefore removes upload/replace Cancel at transport completion, never aborts submitted copy/move/delete, and disables automatic Axios timeouts for file/folder writes. A backend transaction/compensation contract would be required to make later cancellation safe.
- `@radix-ui/react-dropdown-menu` is the sole new dependency and supplies accessible, shadcn-aligned action and breadcrumb overflow menus without inventing product behavior.

## Phase 7

- The Recycle Bin API exposes only single-file and single-folder restore/permanent-delete endpoints. Bulk work therefore calls those real endpoints sequentially, reports partial completion, and can stop queued work only after the current submitted request.
- The API exposes no operation percentage/status endpoint and no cancellation-compensation contract. Restore and permanent deletion are indeterminate, submitted writes use no automatic timeout, and permanent provider deletion is never aborted from the client.
- `MessageResponseDto` does not report the restored destination. The frontend explains the backend's documented original-parent/root fallback before submission but never claims which location was used afterward.
- Resolved on 2026-08-24 by an owner-authorized backend behavior correction: `GetItemsAsync` now returns
  only deleted hierarchy-root folders and independently deleted files. Descendant folders retain their
  current parent links and contained files retain `FolderId`, so folder restore/permanent delete still
  traverses the complete hierarchy without adding DTO fields. Direct file/folder mutation lookup also
  rejects a descendant while its owning parent folder remains deleted. The frontend therefore no longer
  presents or independently acts on deleted descendants; selection collapse remains defensive for stale
  responses already in flight.
- Retention is displayed only from each `RecycleBinItemDto.ExpiresAt`. The frontend does not calculate a fixed retention window, disable restore based on the client clock, or reproduce scheduler behavior.

## Phase 8

- The public share API returns a raw file stream and exposes no public metadata DTO, filename, or separate preview-capability response. The anonymous page therefore uses generic file copy, renders only the response-declared Phase 6 safe content types, and offers download because the explicit public download endpoint exists.
- `GenerateShareLinkResponseDto.ShareUrl` targets `/api/share/{shareToken}` rather than the SPA. By owner decision, the frontend parses that exact API URL in memory and copies `/share/:shareToken`; the client route calls only the existing anonymous preview/download endpoints and requires production SPA fallback for `/share/*`.
- Owner link listing includes revoked links and exposes no filename. The management page composes `GET /api/share-links` with `GET /api/files` when available and otherwise shows `File name unavailable`; it never substitutes a file GUID.
- The response has no explicit expired or active field. The frontend presents only `isRevoked`, `createdAt`, and `expiresAt`, using `Not revoked` rather than `Active` and never inferring expiry validity from the client clock.
- Generated URLs and tokens are transient in-memory workflow data only. They are never written to Zustand, browser persistence, logs, or Phase 5 summaries; unrecognized raw-stream URLs are not copied as a fallback.

## Phase 9

- The search API supports metadata keyword matching plus only `fileType`, `fromDate`, and `toDate`. It exposes no natural-language mode, embeddings, semantic/content search, size filter, folder filter, or separate discovery contract; the frontend does not advertise or emulate them.
- The endpoint exposes no pagination, page size, total count, or continuation token. The frontend consumes the returned collection as-is and does not invent client paging.
- `SearchResultDto` exposes no score, highlights, matched fields, snippets, or match context. Backend result order is preserved exactly and the UI does not calculate relevance or fabricate why a file matched.
- Search mutations do not exist. Result actions reuse the real Phase 6 file endpoints and Phase 8 share-link endpoint, then invalidate the active parameterized reads.

## Phase 10

- Authentication exposes one `POST /api/auth/login` contract with `email` and `password`; there is no separate
  admin login endpoint or username request field. The User/Admin tabs are a frontend entry distinction only.
  Admin mode verifies the returned JWT role before persisting a session and does not invent username, MFA,
  refresh-token, or admin recovery behavior.
- `AdminUserDto` exposes no role, username, last-active date, subscription summary, file count, or admin-safe
  self-deactivation indicator. The UI cannot distinguish administrators from users in the returned collection,
  invent activity, or prevent an action based on unavailable role/self metadata. User list/filter/pagination
  parameters and bulk activation endpoints are also absent, so filtering is presentation-only and mutations are
  single-user actions.
- System statistics are current aggregate counts only, and storage overview is a current aggregate byte
  snapshot. No time series, revenue, growth, sign-in activity, failure/health status, provider utilization
  history, or forecast contract exists. Admin charts visualize only returned current values.
- Admin subscriptions are read-only and expose no server filter, pagination, total, or embedded user name.
  Management composes the independent users list when available and never invents lifecycle mutations.
- Resolved on 2026-08-24 by an owner-authorized admin read: public `GET /api/storage-plans` remains
  anonymous and hard-coded to active plans, while role-restricted `GET /api/storage-plans/admin` calls
  the existing service/repository chain with `isActive: null` and returns both statuses using the existing
  `StoragePlanResponseDto`. The admin screen consumes only this endpoint, filters All/Active/Inactive in
  presentation, and can invoke the existing activate/deactivate actions for every returned plan. No new DTO,
  query parameter, or public exposure was introduced.
- Storage providers expose no credentials/settings DTO, delete action, filtering, or pagination. Provider
  update accepts only `name`; `providerType` is immutable in the UI. Storage-account update accepts name,
  total-capacity bytes, and priority but not provider reassignment. The account list's optional `isActive`
  parameter is the only server-side infrastructure filter.
- Email configuration has no connection-test or delivery-health endpoint. Responses intentionally omit the
  password. Current service validation requires a password whenever authentication is enabled, including an
  update, so the frontend requests it again and never claims the stored secret was preserved without input.
  Only one active configuration is enforced by the backend; deletion returns no response DTO.
- Audit logs expose `skip` and `take` but no total count, page metadata, continuation token, action catalogue,
  or role-filtered administrator list. The UI therefore does not display a total/page count and accepts only
  the controller's administrator GUID, free-text action, and performed-date filters.
- Role-restricted admin management writes accept server cancellation tokens but expose no compensation/status
  contract. The frontend submits them without unmount cancellation or automatic Axios timeout and removes
  Cancel after submission; completion is followed by invalidating the complete admin read family.
- No additional operational-settings controller exists beyond email configurations. Provider keys,
  connection strings, scheduler controls, feature flags, arbitrary platform settings, and fabricated admin
  controls remain absent.
