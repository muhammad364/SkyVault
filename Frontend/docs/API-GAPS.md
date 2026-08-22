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

- The folder/file APIs expose no pagination, limit, count, server sorting, or server filtering. The manager loads the existing current-folder response unchanged and applies only presentation filtering/sorting; no all-folder count is implied.
- There is no ancestry or recursive-tree endpoint. Breadcrumb ancestry uses cancellable parent-folder GET calls, and the navigator lazily reads a folder only when its branch opens.
- There is no preview-capability/details endpoint. The frontend requests preview only on demand and renders only the returned Blob content type for common raster images excluding SVG, PDF, plain text, audio, and video; every other type is download-only.
- There is no folder-copy or bulk move/delete endpoint. Copy is available only when every selected item is a file through `POST /api/files/copy`; mixed move/delete calls the real single-item endpoints sequentially and reports partial completion. Queued work can stop only after the current request.
- There is no operation-progress/status contract. Upload/replace percentage is browser-to-API transport progress only; after 100% the UI is indeterminate. Preview/download uses response transfer progress when content length is available. Copy/move/delete is always indeterminate.
- Backend upload, replace, and copy reserve logical quota/provider capacity before provider and metadata work, without a cancellation-compensation contract. Aborting after server processing begins can leave reservation/provider side effects. The owner-approved frontend safety boundary therefore removes upload/replace Cancel at transport completion, never aborts submitted copy/move/delete, and disables automatic Axios timeouts for file/folder writes. A backend transaction/compensation contract would be required to make later cancellation safe.
- `@radix-ui/react-dropdown-menu` is the sole new dependency and supplies accessible, shadcn-aligned action and breadcrumb overflow menus without inventing product behavior.
