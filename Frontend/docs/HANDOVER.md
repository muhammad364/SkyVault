# SkyVault Frontend Handover

## Readiness snapshot

Phases 0-10 are `DONE` as of 2026-08-24. This closure combines the owner's completed light/dark and five-viewport review with fresh automated regression evidence. Phase 11 implementation and automated verification are complete but remain `IN_PROGRESS` until the owner reviews the newly hardened controls and full-page preview.

The backend remained read-only during Phase 11. No endpoint, DTO, domain rule, dependency, or mock domain data was added there.

## Automated evidence

- TypeScript strict/project build: passed.
- ESLint with zero warnings: passed.
- Production Vite build: passed.
- Complete Vitest: 88 files / 184 tests passed.
- Backend Release build: passed with zero errors; this repository has no backend test project, so no backend unit-test claim is made.
- Backend source-contract audit: exact 100 MiB upload/replace limit and 101 MiB multipart envelope; hierarchy-root Recycle Bin listing and descendant guards; role-restricted all-status storage-plan read.
- Native application control audit: zero remaining `<select>`, `type="date"`, or `type="datetime-local"` controls in production TSX.
- Bundle audit: route-level lazy pages remain separate; Three.js, Recharts/D3, Radix, DayPicker/date-fns, motion, data, and React vendor groups are split. The largest chunk is the optional Three.js vendor group at approximately 863 kB before gzip / 232 kB gzip; it is not part of unrelated route page chunks.
- Formatting and whitespace evidence is recorded in `PHASE-LEDGER.md` after the final gate.

## Revision regression inventory

- Exactly 100 MiB is accepted; one byte over is rejected before upload/replace submission.
- Upload/replace retain real transport progress, no automatic write timeout, and the approved safe cancellation boundary.
- Recycle Bin presents only hierarchy roots and defensively collapses stale descendant selections.
- Long filenames stay contained on Home, Files, Search, sharing workflows, and the operation dock.
- The quota vault uses response-driven fill with normal, warning-at-80%, danger-at-95%, full/over-quota, theme, and fallback behavior; its scene now uses at most two lights.
- Share creation is viewport-contained with long filenames and generated URLs.
- Preview never appears in the operation dock; completed/cancelled operations dismiss after three seconds.
- Administrator plans use the role-restricted all-status read and retain local All/Active/Inactive filters plus activation/deactivation.

## Deployment checklist

1. Set the production `VITE_API_BASE_URL` and build the immutable bundle for that environment.
2. Serve `dist` over HTTPS and configure SPA fallback for every client route, especially `/share/*` and `/vault/preview/*`.
3. Add the exact frontend origin to backend CORS configuration.
4. Configure every proxy/ingress request-body limit to at least 101 MiB and verify streaming/timeouts independently of ASP.NET limits.
5. Confirm storage-provider, database, email, scheduler, and public frontend base URL configuration in the backend environment.
6. Verify cache headers, CSP/security headers, logging redaction, and observability without recording tokens, share URLs, payment fields, SMTP passwords, or file content.
7. Run the commands in `README.md`, then complete the manual Phase 11 checklist in `STATE-COVERAGE.md`.

## Known constraints and follow-up

- The API and behavior limitations are catalogued in `API-GAPS.md`; the frontend does not compensate by inventing data or endpoints.
- The backend build reports existing NuGet advisory `NU1902`: MailKit 4.13.0 has a known moderate-severity advisory (`GHSA-9j88-vvj5-vhgr`). Backend dependency remediation is outside this read-only frontend phase and should be scheduled before production release.
- React Router emits non-failing v7 transition warnings in some tests. They do not affect the React Router 6 production build but should be handled during a future router-major upgrade.
- Three.js is the largest optional vendor group. It is isolated from route page chunks; any future size reduction should preserve the approved 3D/fallback behavior and be measured against real loading telemetry.
- Preview metadata falls back to the existing owned-files list because the preview stream returns no filename metadata. A metadata-specific backend contract could make deep links cheaper but is not required for correctness.

## Ownership boundary

Frontend changes belong under `Frontend`. Backend controllers, DTOs, services, migrations, and domain behavior remain authoritative and require a separate explicitly authorized backend change. Do not add a frontend field or capability unless it maps to a real controller contract or a clearly presentation-only preference.
