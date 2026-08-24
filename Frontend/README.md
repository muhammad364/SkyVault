# SkyVault Frontend

SkyVault is a React and TypeScript client for the existing ASP.NET Core SkyVault API. The frontend mirrors controller request/response DTOs, keeps the backend authoritative for domain behavior, and does not use mock domain data or invented endpoints.

## Prerequisites

- Node.js 20 or newer
- Corepack with pnpm 10.13.1
- The SkyVault backend and its configured database/storage providers

From `Frontend`:

```bash
corepack enable
corepack pnpm install
corepack pnpm dev
```

## Environment

Create a local `.env` file when needed. Do not commit secrets.

```dotenv
VITE_API_BASE_URL=https://localhost:7181
VITE_RECOMMENDED_STORAGE_PLAN_ID=
```

- `VITE_API_BASE_URL` is required for API-backed behavior. It must be the backend origin, without an invented frontend proxy path.
- `VITE_RECOMMENDED_STORAGE_PLAN_ID` is optional. When it is absent or does not match an active API plan, no recommendation is displayed.

## Scripts

```bash
corepack pnpm dev          # Vite development server
corepack pnpm build        # strict TypeScript project build + production bundle
corepack pnpm preview      # serve the production bundle locally
corepack pnpm lint         # ESLint, zero warnings
corepack pnpm test         # complete Vitest suite
corepack pnpm test:watch   # Vitest watch mode
corepack pnpm format       # write Prettier formatting
corepack pnpm format:check # verify repository formatting
```

## Architecture and API flow

Feature code lives under `src/features`; shared layout, feedback, and controls live under `src/components`; route guards and lazy route registration live under `src/routes` and `src/app`.

Every server interaction follows the same typed chain:

```text
DTO model -> api/endpoints function -> feature service -> React Query hook -> page/component
```

Reads forward React Query's `AbortSignal` to Axios and treat navigation cancellation silently. State-changing calls use their exact DTO and controller route; writes whose backend has no compensation contract use no automatic timeout and are not aborted after submission. Transient files, generated share links, payment fields, SMTP passwords, tokens, Blob URLs, and operation controllers are never persisted.

## Routes

- Public: `/`, `/auth/*`, `/share/:shareToken`, `/errors/:status`
- User workspace: `/vault`, `/vault/storage`, `/vault/files`, `/vault/files/:folderId`, `/vault/preview/:fileId`, `/vault/sharing`, `/vault/search`, `/vault/trash`, `/vault/settings`
- Administration: `/admin`, `/admin/users`, `/admin/plans`, `/admin/subscriptions`, `/admin/infrastructure`, `/admin/email`, `/admin/audit`, `/admin/settings`

User and administrator shells are role-exclusive. Owned-file preview is a protected lazy route that preserves the workspace rail, hides the ordinary workspace header, and uses the browser Fullscreen API only after an explicit action. Public share preview remains anonymous and calls only the public-share controller.

## Upload and deployment limits

The product accepts files up to exactly 100 MiB (`104,857,600` bytes) for upload and replace. The ASP.NET request/form envelope is 101 MiB to leave room for multipart metadata. Production IIS, Nginx, CDN, ingress, or other reverse proxies must allow at least that request envelope; an upstream rejection cannot be corrected by the frontend or controller.

Production hosting must:

- Serve the built `dist` directory over HTTPS.
- Provide SPA fallback to `index.html` for client routes, including `/vault/*`, `/admin/*`, and `/share/*`.
- Configure the backend CORS allowlist for the exact frontend origin.
- Keep `VITE_API_BASE_URL` pointed at the intended API origin.
- Preserve API streaming and response-length headers where available so transfer progress can be reported honestly.
- Apply appropriate cache headers: immutable caching for hashed assets and revalidation/no-cache for `index.html`.

## Verification and handover

See [HANDOVER.md](docs/HANDOVER.md), [STATE-COVERAGE.md](docs/STATE-COVERAGE.md), [API-GAPS.md](docs/API-GAPS.md), and [PHASE-LEDGER.md](docs/PHASE-LEDGER.md). Phase 11 automated verification does not replace the recorded owner light/dark and viewport review.
