# SkyVault UI Guide

This guide records the owner-approved visual language established across Phases 0–4 and accepted
end to end on 2026-08-22. `SKYVAULT_FRONTEND_MASTER_PROMPT (1).md` remains the source of truth.
Later phases must extend this system without reinterpreting its colors, geometry, or interaction
language.

## Design direction

SkyVault uses the "Quiet Vault" language: a calm zinc editorial workspace with midnight-slate
interaction, burgundy identity accents, generous spacing, large rounded corners, neutral diffused
shadows, and restrained motion. The gray outer canvas must remain visible around the padded inner
application surface. Screens should feel like a user's personal digital workspace, not an
administration dashboard and not an edge-to-edge mockup.

The approved redesign changed color and asset presentation only. Preserve the existing DOM
structure, spacing, padding, radii, typography, responsive behavior, ordering, motion, functionality,
and API integration.

The owner subsequently approved explicit layout refinements for the signed-in workspace. At
tablet and desktop widths, the floating rail stays within the framed viewport while page content
scrolls; its bottom account area contains a generic account icon for Settings and a Sign out action
whose muted neutral surface carries danger-colored text and icon, with no Admin destination exposed
in user navigation. On the Phase 5 home, Quick actions sit directly below the greeting as a compact
full-width strip of horizontal action cards. The signed-in shell and workspace bento use compact
application typography and spacing so quota begins inside the initial reference tablet/desktop
viewport. These decisions supersede the earlier geometry-preservation rule only for the named
surfaces. Phase 6 adds a file-first home order, a responsive root/nested file manager, and a
workspace-level operation dock under the same Quiet Vault system.

The 2026-08-24 revision pass adds strict long-name containment, a hierarchy-root Recycle Bin,
an API-driven rounded quota vault, a width-contained Share dialog, self-clearing operation feedback,
and an all-status administrator plan catalogue. These are functional presentation rules, not optional
polish; later work must preserve them.

## Brand

- Use `BrandSignature` for the theme-aware emblem and live `SkyVault` wordmark.
- Render `Sky` with `text-foreground` and `Vault` with `text-brand`.
- Use `skyvault-emblem-light-v3.png` and `skyvault-emblem-dark-v3.png` for the raster emblem.
- Use `skyvault-mark.svg` and `skyvault-mark-dark-v3.svg` for code-native themed marks.
- Use `skyvault-favicon-v3.png` as the transparent favicon, Apple touch icon, and manifest source.
- Preserve the cloud-vault silhouette, proportions, transparency, and edges. Never stretch,
  ad-hoc recolor, or place the mark on an artificial white box in dark mode.
- Show the full brand signature once in a surface header. Do not repeat it inside the same hero.
- Burgundy is reserved for the `Vault` wordmark, the landing tagline, editorial eyebrows, focus
  treatment, and deliberately selected brand accents. Ordinary navigation and links use slate.

## Color and surfaces

Use only semantic tokens from `src/styles/theme.css`; components must not contain raw color values.
Tailwind maps those tokens to semantic utilities.

| Role                     | Light     | Dark      |
| ------------------------ | --------- | --------- |
| Outer framed canvas      | `#D9DADD` | `#0E1116` |
| Hero/auth backdrop       | `#E7E7E8` | `#24272A` |
| Main application surface | `#FDFDFD` | `#151920` |
| Cards/navigation         | `#FAFAFA` | `#1C2129` |
| Nested/hovered surfaces  | `#E9EAEC` | `#272D36` |
| Primary heading          | `#0F151C` | `#F5F6F8` |
| Important body copy      | `#121D2F` | `#D7DCE5` |
| Metadata/muted copy      | `#596474` | `#A6AFBC` |
| Interactive slate        | `#172237` | `#A8B5C9` |
| Brand burgundy           | `#6D0615` | `#E37B91` |
| Border                   | `#D9DCE1` | `#343B45` |
| Focus ring               | `#6D0615` | `#E37B91` |

Primary surfaces always layer in this order: `bg-canvas` outer frame, `bg-surface` workspace,
`bg-card` content, and `bg-card-muted` nested or hovered regions. Strong borders, body copy, brand,
warning, danger, destructive-action backgrounds, success, and zinc 3D materials each have separate
semantic tokens; do not substitute one role for another.

### Functional signal exception

- Amber appears only for actual warnings: offline status, grace periods, and quota at 80% or above.
- Danger red/burgundy appears only for validation, errors, destructive actions, and quota at 95% or
  above. Pair every signal with text and/or an icon; never rely on color alone.
- Success uses slate, never teal or green.
- Brand burgundy does not represent success and is not the default link color.
- No teal, mint, aqua, or green belongs in active interface code or active brand/3D assets.

### Primary actions

Every primary action uses the shared semantic gradient with white text and icons:

- Light: `#37445B → #29354C → #172237` at 135 degrees.
- Dark: `#52617A → #3B4860 → #29354C` at 135 degrees.

This primary-action gradient is the sole approved gradient exception. Decorative gradients, glowing
orbs, and gradient blobs remain prohibited.

## Typography

- Plus Jakarta Sans is the display voice; Inter is the body and interface voice.
- Hero headlines are prominent, balanced, and editorial. The established landing scale is
  `text-5xl md:text-6xl lg:text-7xl` with `leading-tight`.
- Supporting hero copy uses `text-lg md:text-xl`; labels use `text-base md:text-lg` when the hero
  needs stronger visual balance.
- Use JetBrains Mono only for technical values such as capacity, price, quota, identifiers, and
  dates.
- Keep headings warm and concise, paragraphs readable, and product copy free of technical jargon.

## Layout and spacing

- Preserve the gray framed canvas and rounded inner surface on every application layout. The outer
  frame remains `p-3 md:p-5`; no page becomes edge-to-edge.
- Keep the signed-in rail viewport-sticky at `md` and above, contracted inside the frame so scrolling
  long page content never carries navigation or its bottom account controls out of reach.
- Build mobile-first with Tailwind's default breakpoints and never introduce fixed layout widths.
- Use asymmetric editorial composition instead of identical metric-card rows.
- Place the Phase 5 Quick actions strip immediately below its greeting. After Phase 6 its three
  working destinations are Upload files, New folder, and Browse files; the recent-files and root-folders
  cards receive equal weight, followed by one combined quota/plan overview.
- Every Recent files row and file-operation/card container must carry width constraints through each
  grid/flex ancestor. Long filenames use one-line ellipsis and retain the complete value in a native
  title/accessibility context; they never widen a card, overlap Root folders, or create page scrolling.
- Keep signed-in shell headings and page greetings at application scale; reserve landing-page hero
  typography and large editorial whitespace for marketing surfaces.
- Use compact, consistent card padding and section gaps on the Phase 5 home. At 1024×768 and
  1440×900, the beginning of the quota signature should remain visible below Quick actions so users
  can discover the continuation of the page without losing the calm hierarchy.
- Keep content groups intentionally spaced with Tailwind scale values; whitespace should establish
  hierarchy without pushing the next primary region completely below the fold.
- Avoid repeating information solely to fill space; strengthen hierarchy and scale instead.

## Components

- Buttons are pill-shaped, use semantic colors, retain visible focus, and provide 44px minimum touch
  targets. Primary buttons use the approved gradient; secondary buttons use neutral zinc surfaces;
  destructive buttons use the destructive background and foreground tokens.
- Cards use `rounded-lg`, semantic surfaces, `shadow-rest`, and at most a `-2px` hover/focus lift to
  `shadow-hover`. Shadows are neutral slate/black diffusion and retain their established dimensions.
- Inputs use semantic border, ring, placeholder, and danger tokens. Validation always includes
  field copy and an icon in addition to color.
- Storage-plan cards remain API-driven. Visually separate name, storage, billing cycle, and PKR price
  without inventing benefits, rankings, prices, or recommendations.
- Loading regions use proportion-matched opacity skeletons; empty and error regions always keep
  useful copy and an action.
- Apply the same semantic treatment to badges, meters, dialogs, forms, plan illustrations,
  checkout processing/success/failure states, error surfaces, and navigation states.
- The shared quota visual is an upright rounded vault derived from the approved light/dark quota asset,
  not a transparent cube or isolated dial. Its inner storage level fills bottom-up from the real quota
  percentage and changes from slate to warning at 80% and danger at 95%. The dynamic flat SVG fallback
  preserves the same level and silhouette on mobile, reduced motion, low-core hardware, loading, and
  Canvas failure.
- In the signed-in rail, Settings belongs in the bottom account area with a generic account
  depiction. Sign out sits beneath it on `bg-card-muted` with danger-colored text/icon rather than a
  solid destructive fill. Do not advertise the Admin route in ordinary user navigation.
- File/folder cards keep a 44px selection control and always-reachable three-dot menu. Folders precede
  files; grid/list preference persists locally; name/extension filtering and API-field sorting apply
  only to the currently loaded folder. Breadcrumbs remain API-driven and collapse middle ancestors
  into the Radix overflow menu.
- Desktop uses a lazy split-pane folder tree; mobile exposes the same navigator in a bottom sheet.
  Create/rename use focused pending labels. Move, copy, replace, and Trash confirmations state the
  real backend effect, including hierarchy deletion and the absence of version history.
- The floating file-operation dock uses glass only at that permitted overlay surface. It reports real
  upload/replace transport percentages, indeterminate backend processing, cancellable downloads, and
  sequential batch counts. Preview preparation belongs inside the preview dialog and never creates a
  dock entry. Long labels truncate, the dock is capped to the viewport with no horizontal scroll, and
  progress remains fully visible. Completed/cancelled entries auto-dismiss after three seconds; failed
  entries remain visible for retry or explicit dismissal. Never fabricate percentages or show Cancel
  for a submitted server write.
- Upload and replace advertise an exact 100 MiB maximum file size. The API request envelope is 101 MiB
  solely for multipart overhead; UI validation and backend file validation remain aligned at 100 MiB.
- Recycle Bin uses compact responsive rows rather than dashboard metrics. Each row keeps a 44px selection
  target and menu, displays only API-provided deletion/removal dates, and uses typed confirmation before
  permanent deletion. A deleted folder is the only visible row for its complete deleted hierarchy;
  descendant folders/files are neither browsable nor independently actionable while that parent remains
  deleted. Folder copy must name its hierarchy effect. Bulk restore/delete is indeterminate in the shared
  operation dock and offers Stop queued rather than aborting the submitted request.
- Sharing management uses compact link rows and explicit response facts: `Not revoked` or `Revoked`,
  creation time, and API-provided expiry. Never derive `Active`, expose identifiers in place of missing
  names, or render/copy a token outside the focused creation workflow.
- The Share dialog is always `min-w-0`, viewport-capped, and horizontally clipped. Its native file select,
  generated-link field, form, and labels remain within the card at 360px; long selected filenames and URLs
  truncate rather than forcing a left-to-right scrollbar.
- The anonymous share viewer uses minimal branded chrome, generic file copy, and the shared safe-preview
  whitelist. Unsupported response types are download-only; preparation and transfer progress stay honest,
  cancellable, and keyboard reachable.
- Keep Shared links in the desktop rail. On mobile, preserve six 44px dock destinations and place Shared
  links, Account settings, and Sign out in the accessible More menu instead of adding another fixed tab.
- The command search stays compact in the workspace header and opens with `/`, `Ctrl+K`, or `Cmd+K`.
  Its dialog uses a single keyword field, server-ordered preview, session recents, and visible keyboard
  selection; Arrow keys, Enter, Escape, click, and touch must remain equivalent.
- Full search uses a compact metadata-filter card followed by responsive file rows. Keep keyword, free-text
  type/extension, and upload-date fields only. Preserve backend order and show response metadata without
  scores, highlights, inferred match copy, or AI language.
- Search result menus and selection reuse the file-manager actions, confirmations, progress dock, and Share
  dialog. The returned folder name is a 44px location link to root or the exact returned folder route.

## Administration

- The login card uses accessible User/Admin tabs. Admin mode still submits the backend's exact email and
  password request—there is no username login contract—and omits registration and password-recovery links.
  Persist a session only after the returned token role matches the selected tab.
- The admin shell is role-exclusive, quieter, and denser than the personal vault. Its sticky desktop rail
  and six-slot mobile dock expose Overview, Users, Plans, Subscriptions, Infrastructure, and More; More
  contains Email delivery, Audit log, Account settings, and danger-colored Sign out. Never include ordinary
  vault destinations in this shell or admin destinations in the user rail.
- Overview uses a compact editorial heading, three factual record summaries, one current-state record chart,
  one storage chart, and recent audit work. Recharts uses only midnight slate and burgundy, disables chart
  animation, and visualizes response values without trends, growth, revenue, forecasts, or health scores.
- Admin lists use hairline rows, `card-muted` hover, sticky headings, mono numerics, and pill statuses. At base
  width, every table becomes a stacked label–value card; desktop tables stay inside deliberate
  `overflow-x-auto` wrappers. Every flex/grid child that can contain an email, provider name, host, plan, or
  description uses `min-w-0` plus truncate, line clamp, or breaking so content never leaks from a card.
- User management supports local name/email/status filtering of the complete returned collection, exact user
  detail, storage allocation, subscription history, and confirmed activation/deactivation. Do not infer or
  display a user role because `AdminUserDto` does not return one.
- Plan management consumes the role-restricted all-status catalogue, never the anonymous active-only read.
  Provide local All/Active/Inactive filters and an honest shown/total count. Active plans expose confirmed
  Deactivate; inactive plans expose confirmed Activate. New plans remain active by default, while editing an
  inactive plan preserves its returned status unless the explicit activation action is used.
- Subscriptions are read-only. Compose user display names from the user list when available and show neutral
  unavailable/loading copy if that independent lookup fails. Status, plan, price, billing, dates, and grace
  period come only from the response.
- Infrastructure keeps providers and storage accounts on one operational surface. Provider type and account
  provider assignment become read-only after creation because their update DTOs omit those fields. Capacity
  input uses whole bytes with a formatted preview; provider/account activation and deactivation are confirmed.
- Email delivery treats SMTP passwords as write-only. Never prefill, display, cache, or log one. Authenticated
  create/update requests require a newly entered password according to the current backend validation. Explain
  that activating one configuration causes the backend to deactivate the previously active configuration;
  permanent deletion is confirmed.
- Audit filters map only to `administratorId`, `action`, `performedFrom`, `performedTo`, `skip`, and `take`.
  Pagination does not claim a total: Previous uses the current offset and Next is available only after a full
  returned page. Audit descriptions and identifiers stay contained; the default list emphasizes action,
  administrator email, entity type, and performed date.
- Admin account settings reuse the authenticated profile, change-password, and logout contracts with
  administrator-specific copy. A successful password change clears the session and returns to Admin sign in.
- Role-restricted admin management mutations use focused Radix dialogs and React Hook Form + Zod validation.
  Once submitted, those writes have no Cancel action or automatic timeout; controls use pending labels and
  remain open on safe normalized errors. Shared account actions retain the established Phase 3 behavior.
- Do not place 3D in administration. The existing master rule is intentional: real current-state charts carry
  the statistical presentation while keeping dense operational screens legible and low-distraction.

## Motion and scrolling

- Use Framer Motion with 160ms, 240ms, or 320ms durations and the vault easing
  `[0.22, 1, 0.36, 1]`.
- Route and deferred-section entrances use one cross-fade with an optional 8px rise.
- Lists and steps may reveal once with a 40ms stagger. Do not add scroll-jacking, parallax, bouncing
  springs, or ambient loops.
- Native smooth anchor scrolling is allowed and must become static under reduced motion.
- The Phase 2 information marquee is the sole approved looping 2D exception. It must pause offscreen,
  while hidden, on interaction, and through its Pause/Resume control.

## 3D language and fallbacks

- Use R3F/Drei primitives and `useFrame`; never use custom WebGL matrix transformations.
- Keep forms and functionality independent from 3D.
- Landing vault: graphite frame, soft-white/zinc door, silver dial, burgundy hub.
- Auth key: graphite dial, zinc key and wheel, burgundy hub.
- Quota volume: upright rounded zinc vault matching the approved asset; visible bottom-up midnight-slate
  fill, amber warning fill at 80%+, danger/burgundy critical fill at 95%+, and a dial that stays legible
  above the level.
- Empty file manager: one zinc folder with burgundy tab, rendered only when the current folder is truly
  empty. It never appears in populated grids, dialogs, the folder tree, or Workspace Home.
- Materials and lighting consume theme-derived tokens. Preserve the existing geometry and motion.
- Every scene remains lazy and demand-rendered where possible, and uses its matching light/dark
  fallback on mobile, reduced motion, low-core hardware, loading, or Canvas failure. The quota fallback
  is a code-native, theme-token SVG based on the approved assets so it can reflect the API percentage
  without WebGL; reduced motion suppresses its transition.
- Active static fallbacks are `landing-vault-fallback-light-v3.png`,
  `landing-vault-fallback-dark-v3.png`, `auth-key-fallback.svg`,
  `auth-key-fallback-dark-v3.svg`, `folder-empty-fallback.svg`, and
  `folder-empty-fallback-dark.svg`. `quota-vault-fallback.svg` and
  `quota-vault-fallback-dark-v3.svg` remain the approved source references for the live-percentage,
  code-native quota fallback rather than displaying a fixed, misleading fill level.

## Accessibility and themes

- Every new surface must work in light and dark themes with semantic tokens and WCAG AA contrast.
- Dark mode uses lifted burgundy and steel-zinc values; never copy low-contrast light-theme accents.
- Reduced motion removes transforms or uses opacity only.
- Preserve semantic landmarks, keyboard access, visible focus, readable placeholder and metadata
  contrast, and tap equivalents for hover behavior.
- Verify 360×640, 390×844, 768×1024, 1024×768, and 1440×900 in both themes with no horizontal
  overflow before closing a phase.

## Consistency check for later phases

Before completing any later phase, compare it against this guide and the master prompt: live
wordmark usage, theme-aware active assets, token-only color, functional signal meaning, primary
gradient, typography hierarchy, gray framed layout, card treatment, motion budget, 3D materials and
eligibility, fallback parity, reduced motion, keyboard access, both themes, and all reference widths
must remain consistent. API contracts, state coverage, and backend-owned calculations remain
unchanged by the visual system.
