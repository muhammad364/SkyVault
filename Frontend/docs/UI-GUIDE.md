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

The owner subsequently approved two explicit layout refinements for the signed-in workspace. At
tablet and desktop widths, the floating rail stays within the framed viewport while page content
scrolls; its bottom account area contains a generic account icon for Settings and a Sign out action
whose muted neutral surface carries danger-colored text and icon, with no Admin destination exposed
in user navigation. On the Phase 5 home, Quick actions sit directly below the greeting as a compact
full-width strip of horizontal action cards. The signed-in shell and workspace bento use compact
application typography and spacing so quota begins inside the initial reference tablet/desktop
viewport. These decisions supersede the earlier geometry-preservation rule only for the named
surfaces.

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
- Place the Phase 5 Quick actions strip immediately below its greeting. Its two working destinations
  use horizontal icon/text/arrow cards, sit side by side when space permits, and stack on narrow
  screens.
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
- In the signed-in rail, Settings belongs in the bottom account area with a generic account
  depiction. Sign out sits beneath it on `bg-card-muted` with danger-colored text/icon rather than a
  solid destructive fill. Do not advertise the Admin route in ordinary user navigation.

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
- Quota volume: zinc shell; midnight-slate normal fill, amber warning fill at 80%+, and
  danger/burgundy critical fill at 95%+.
- Materials and lighting consume theme-derived tokens. Preserve the existing geometry and motion.
- Every scene remains lazy and demand-rendered where possible, and uses its matching light/dark
  fallback on mobile, reduced motion, low-core hardware, loading, or Canvas failure.
- Active fallbacks are `landing-vault-fallback-light-v3.png`,
  `landing-vault-fallback-dark-v3.png`, `auth-key-fallback.svg`,
  `auth-key-fallback-dark-v3.svg`, `quota-vault-fallback.svg`, and
  `quota-vault-fallback-dark-v3.svg`.

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
