# SkyVault — Frontend Master Prompt (CATSE)

> **File purpose:** This is the single source of truth for the AI coding agent building the SkyVault
> presentation layer. Place it at `/docs/SKYVAULT_FRONTEND_MASTER_PROMPT.md` in the repository root
> and reference it at the start of **every** session:
>
> ```
> Read /docs/SKYVAULT_FRONTEND_MASTER_PROMPT.md in full, then read
> /frontend/docs/PHASE-LEDGER.md, then execute the next unstarted phase.
> ```
>
> **Version:** 1.1 · **Owner:** Muhammad Haroon Khalid · **Status:** Frozen (change only via explicit owner instruction)
> **Visual-system approval:** The cross-phase zinc, midnight-slate, and burgundy redesign was
> accepted by the owner on 2026-08-22 and is authoritative for every subsequent phase.

---

## 0. Agent Operating Contract (read first, obey always)

You are a **senior frontend engineer + UI designer**. You are working inside an existing repository
that already contains a **finished, tested, production-grade ASP.NET Core Web API** and its
documentation. Your mandate is **only** the presentation layer.

**Non-negotiables:**

1. **The backend is LOCKED.** You must not create, edit, rename, move, delete, or reformat any file
   outside `/frontend/**` (plus `/frontend/docs/**` which you own). This explicitly includes
   `*.cs`, `*.csproj`, `*.sln`, `appsettings*.json`, `Program.cs`, EF Core migrations, DTOs,
   controllers, services, repositories, and `/backend/docs/**`. You may **read** them. You may
   **never** write them.
2. **Never invent an endpoint, route, field, verb, status code, or query parameter.** Every API call
   you write must be traceable to a real action method in a real controller in the repository.
   If something the UI needs does not exist in the API, you **stop**, and record it in
   `/frontend/docs/API-GAPS.md` as a question for the owner. You do **not** fake it, mock it,
   stub it, or "temporarily" hardcode it.
3. **No backend logic in the frontend.** The frontend knows only the HTTP contract: request shape,
   response shape, status codes. It does not replicate quota math, permission rules, token
   validation, storage-provider behaviour, or any business rule owned by the service layer. It
   _displays_ what the API returns and _respects_ what the API rejects.
4. **No secrets in the frontend.** No provider keys, no connection strings, no admin credentials,
   no Google Drive credentials. Only `VITE_API_BASE_URL` and equally public config values.
5. **Work strictly one phase at a time** (Section 4). Never begin a phase before the previous phase
   is marked `DONE` and verified in the ledger. Never touch files belonging to a later phase.
6. **Style is frozen.** Section 3 is a specification, not inspiration. Do not substitute your own
   palette, radii, fonts, spacing, or "simpler" component patterns to save effort. Generic
   admin-dashboard output is a failed deliverable.
7. **Read before writing.** At the start of every phase, re-read the relevant controllers and DTOs
   from disk. Do not rely on memory or on this document's examples for contract details.
8. **Ask, don't assume.** If a requirement is ambiguous, ask a numbered question in your report and
   pick the most conservative option. Never silently redesign scope.

---

## 1. C — CONTEXT

### 1.1 The product

**SkyVault** is a cloud-based intelligent storage platform (per `/backend/docs/` SRS, IEEE 29148,
v1.0). It gives individual users secure, affordable file storage by purchasing bulk storage from a
provider (initially Google Drive) and assigning **logical storage quotas** based on subscribed plans.
Its differentiators are **affordability, simplicity, and intelligent search** (keyword +
natural-language) — not feature breadth.

Positioning line for all copy and design decisions:

> **SkyVault is a personal digital workspace — a calm, private vault for your files — not an admin console.**

### 1.2 The existing backend (locked, complete, verified)

- ASP.NET Core Web API + PostgreSQL + EF Core, layered:
  `Controllers → Services → Repositories → EF Core → PostgreSQL` (+ Google Drive provider).
- AutoMapper maps Entities ⇄ DTOs. Controllers accept **Request DTOs** and return **Response DTOs**.
- A **Global Exception Handler** converts all unhandled failures into a clean, uniform error
  response — no stack traces, no internal leakage.
- All endpoints are Swagger-tested and verified. **Swagger/OpenAPI is your contract source of truth.**

### 1.3 Functional modules (from the SRS — this is the whole scope; nothing new is permitted)

| ID   | Module                                   | Frontend feature folder             |
| ---- | ---------------------------------------- | ----------------------------------- |
| M-01 | User Authentication & Account Management | `features/auth`, `features/account` |
| M-02 | Storage Subscription & Allocation        | `features/subscriptions`            |
| M-03 | Folder Management                        | `features/folders`                  |
| M-04 | File Management                          | `features/files`                    |
| M-05 | Recycle Bin Management                   | `features/recycle-bin`              |
| M-06 | File Sharing (secure, view-only links)   | `features/sharing`                  |
| M-07 | Metadata Search & Discovery              | `features/search`                   |
| M-08 | Administration                           | `features/admin`                    |

**Explicitly out of scope (MVP exclusions — do not build UI for these):** mobile apps, real-time
collaboration, offline sync, resumable uploads, file versioning, multi-cloud distribution.

### 1.4 The decision being executed

The presentation layer was originally planned in Angular; it is now **React**. The backend
architecture is unchanged — React only replaces the presentation layer. Record this once in
`/frontend/docs/ADR-001-react-frontend.md` (frontend-owned file) and never modify backend docs to
reflect it.

### 1.5 Locked technology stack

| Concern      | Choice                                         | Notes                                                       |
| ------------ | ---------------------------------------------- | ----------------------------------------------------------- |
| Build tool   | **Vite** + React 18 + **TypeScript (strict)**  | `strict: true`, no `any` in models                          |
| Routing      | **react-router-dom v6**                        | Data-agnostic; route-level code splitting                   |
| Styling      | **Tailwind CSS v3** + CSS variables            | All colors via semantic tokens only                         |
| Components   | **shadcn/ui** (Radix primitives)               | Restyled to SkyVault tokens, not defaults                   |
| Icons        | **lucide-react**                               | 16 / 20 / 24 px only                                        |
| Motion       | **framer-motion**                              | Budget in §3.7                                              |
| 3D           | **@react-three/fiber** + **@react-three/drei** | Only where §3.8 permits                                     |
| Server state | **@tanstack/react-query v5**                   | All API reads/writes; no `fetch` in components              |
| Client state | **zustand**                                    | Auth session, UI prefs, upload queue only                   |
| Forms        | **react-hook-form** + **zod**                  | Client validation mirrors API validation, never replaces it |
| HTTP         | **axios** instance + interceptors              | Single client, typed wrappers                               |
| Charts       | **recharts**                                   | Admin/storage only, 2–3 colors max                          |
| Toasts       | **sonner**                                     | One toast system app-wide                                   |
| Tests        | **vitest** + **@testing-library/react**        | Per-phase smoke tests                                       |
| Lint         | ESLint + Prettier + `eslint-plugin-jsx-a11y`   | Must pass before a phase is `DONE`                          |

Do **not** add any other dependency without recording it in the phase report with a one-line
justification. No UI kit other than shadcn/ui. No Redux. No Bootstrap/MUI/Ant.

---

## 2. A — AUDIENCE

**Who consumes your output:**

- **The product owner (a single developer, reviewing phase by phase).** He must be able to read,
  understand, and modify every file you write. Therefore: small files, explicit names, no clever
  abstractions, no meta-programming, comments only where intent is non-obvious.
- **End users (registered users)** — non-technical individuals who want a private, pleasant place
  for their files. They are not analysts; they do not want metric grids.
- **Administrators** — a small internal group managing users, plans, and monitoring.

**Design implications:**

- Users must always know _where they are_, _how much space they have left_, and _how to get their
  file back_. Those three answers are never more than one glance away.
- Every destructive action is confirmed, reversible where the API allows it, and clearly labelled.
- Admin UI is deliberately quieter and denser than the user workspace, but uses the same tokens.

---

## 3. S — STYLE (frozen design system)

### 3.1 Aesthetic direction (one direction, executed precisely)

**"Quiet Vault" — a zinc editorial workspace with midnight-slate interaction and burgundy identity.**
The outer gray canvas remains visible around a crisp white or ink application surface. Cards use
closely spaced zinc layers, generous radii, and neutral diffused shadows. Midnight slate carries
ordinary interaction; burgundy is the distinctive brand voice; amber and danger red/burgundy are
reserved for functional signals. A single restrained 3D object per key surface remains the
signature element. The result is calm, premium, spacious, tactile, and never visually flat.

This direction is derived from the owner-approved light-theme mockup and its representative
white + zinc gray + midnight slate + burgundy palette. The mockup governs **color and material
treatment only**: the existing framed application padding, DOM structure, spacing, radii,
typography, responsiveness, motion, behavior, and API integration must not be changed to imitate
the mockup's edge-to-edge composition.

### 3.2 Color tokens — LIGHT (authoritative)

Define in `src/styles/theme.css` as CSS variables and expose through `tailwind.config.ts`.
**Never write a raw hex or `bg-white`/`text-black` in a component.**

| Token                      | Hex       | Use                                                      |
| -------------------------- | --------- | -------------------------------------------------------- |
| `--canvas`                 | `#D9DADD` | Outer framed canvas                                      |
| `--canvas-strong`          | `#E7E7E8` | Hero/auth backdrop and strong zinc field                 |
| `--surface`                | `#FDFDFD` | Inner application shell / workspace panel                |
| `--card`                   | `#FAFAFA` | Cards, navigation, sheets, popovers                      |
| `--card-muted`             | `#E9EAEC` | Nested/secondary card and hovered row                    |
| `--foreground`             | `#0F151C` | Primary heading and strongest text                       |
| `--secondary-foreground`   | `#121D2F` | Important body copy                                      |
| `--muted-foreground`       | `#596474` | Metadata and muted copy                                  |
| `--primary`                | `#172237` | Ordinary links, active navigation, and slate interaction |
| `--primary-hover`          | `#29354C` | Slate hover/pressed state                                |
| `--primary-foreground`     | `#FFFFFF` | Text/icon on primary actions                             |
| `--brand`                  | `#6D0615` | `Vault` wordmark, tagline, eyebrows, focus accents       |
| `--brand-soft`             | `#F6E8EB` | Restrained branded surface                               |
| `--warning`                | `#985E00` | Warning text/icon; 80% quota, grace period, offline      |
| `--warning-strong`         | `#D89222` | Warning meter/illustration fill                          |
| `--warning-soft`           | `#FFF3DE` | Warning surface                                          |
| `--warning-foreground`     | `#0F151C` | Text on strong warning fill                              |
| `--danger`                 | `#9B2338` | Validation, critical quota, and destructive signal       |
| `--danger-hover`           | `#7E172A` | Danger hover/pressed state                               |
| `--danger-soft`            | `#F8E7EA` | Error/critical surface                                   |
| `--danger-foreground`      | `#FFFFFF` | Text on danger fill                                      |
| `--destructive-background` | `#9B2338` | Destructive action background                            |
| `--destructive-hover`      | `#7E172A` | Destructive action hover/pressed state                   |
| `--destructive-foreground` | `#FFFFFF` | Text/icon on destructive actions                         |
| `--success`                | `#29354C` | Success signal; intentionally slate, never green         |
| `--success-soft`           | `#E5E9EF` | Success surface                                          |
| `--border`                 | `#D9DCE1` | Hairlines, input borders, dividers                       |
| `--border-strong`          | `#B9BDC2` | Emphasized neutral boundary                              |
| `--ring`                   | `#6D0615` | Focus ring (2px, offset 2px)                             |
| `--zinc-900`               | `#24272A` | Dark 3D metal                                            |
| `--zinc-700`               | `#373C42` | Secondary 3D metal                                       |
| `--zinc-600`               | `#4F5359` | Vault frame                                              |
| `--zinc-400`               | `#A2A2A4` | Metallic highlight                                       |
| `--zinc-300`               | `#B9BDC2` | Light metallic edge                                      |
| `--zinc-door`              | `#FAFAFA` | Light vault door material                                |

Primary actions use one approved gradient, exposed as `--primary-gradient` and Tailwind's
`bg-primary-action` semantic background-image utility:
`linear-gradient(135deg, #37445B 0%, #29354C 45%, #172237 100%)`. Text and icons remain
`#FFFFFF` at every stop. Components must consume the semantic gradient utility; they must not repeat
these hex values.

### 3.3 Color tokens — DARK (first-class, built in the same commit as light)

| Token                      | Hex       | Notes                                                    |
| -------------------------- | --------- | -------------------------------------------------------- |
| `--canvas`                 | `#0E1116` | Outer framed canvas, never pure black                    |
| `--canvas-strong`          | `#24272A` | Hero/auth backdrop and strong zinc field                 |
| `--surface`                | `#151920` | Inner application shell                                  |
| `--card`                   | `#1C2129` | Cards and navigation                                     |
| `--card-muted`             | `#272D36` | Nested/hovered surface                                   |
| `--foreground`             | `#F5F6F8` | Primary heading and strongest text                       |
| `--secondary-foreground`   | `#D7DCE5` | Important body copy                                      |
| `--muted-foreground`       | `#A6AFBC` | Metadata and muted copy                                  |
| `--primary`                | `#A8B5C9` | Ordinary links, active navigation, and slate interaction |
| `--primary-hover`          | `#D7DCE5` | Slate hover/pressed state                                |
| `--primary-foreground`     | `#FFFFFF` | Primary-action text/icon                                 |
| `--brand`                  | `#E37B91` | Lifted burgundy for brand and focus contrast             |
| `--brand-soft`             | `#351C25` | Restrained branded surface                               |
| `--warning`                | `#F0B44D` | Warning text/icon                                        |
| `--warning-strong`         | `#D89222` | Warning meter/illustration fill                          |
| `--warning-soft`           | `#382C18` | Warning surface                                          |
| `--warning-foreground`     | `#0F151C` | Text on strong warning fill                              |
| `--danger`                 | `#F07D91` | Validation and critical signal                           |
| `--danger-hover`           | `#B4233E` | Danger hover/pressed state                               |
| `--danger-soft`            | `#3A1C25` | Error/critical surface                                   |
| `--danger-foreground`      | `#FFFFFF` | Text on danger fill                                      |
| `--destructive-background` | `#9B2338` | Destructive action background                            |
| `--destructive-hover`      | `#B4233E` | Destructive hover/pressed state                          |
| `--destructive-foreground` | `#FFFFFF` | Text/icon on destructive actions                         |
| `--success`                | `#A8B5C9` | Success signal; intentionally slate, never green         |
| `--success-soft`           | `#252D39` | Success surface                                          |
| `--border`                 | `#343B45` | Hairlines, input borders, dividers                       |
| `--border-strong`          | `#4F5865` | Emphasized neutral boundary                              |
| `--ring`                   | `#E37B91` | Focus ring                                               |
| `--zinc-900`               | `#11151B` | Dark 3D metal                                            |
| `--zinc-700`               | `#2E343C` | Secondary 3D metal                                       |
| `--zinc-600`               | `#515862` | Vault frame                                              |
| `--zinc-400`               | `#B9BDC2` | Metallic highlight                                       |
| `--zinc-300`               | `#D5D8DC` | Light metallic edge                                      |
| `--zinc-door`              | `#E7E7E8` | Dark-theme vault door material                           |

Dark primary actions set `--primary-gradient` to
`linear-gradient(135deg, #52617A 0%, #3B4860 45%, #29354C 100%)` with white text/icons at every
stop.

Rules: exactly these families — **white/zinc neutrals + midnight slate + burgundy**, with amber and
danger red/burgundy reserved for functional states. No teal, mint, aqua, or green may remain in the
interface or active assets. Burgundy carries brand typography, editorial eyebrows, focus treatment,
validation, destructive actions, and critical quota states according to semantic context; ordinary
links and navigation use midnight slate. Amber appears only for real warnings such as offline,
grace-period, and 80% quota states. Success uses slate, never green. Every background override must
come with a matching foreground token.
Theme via `class="dark"` on `<html>`, default = system, persisted in `localStorage`, and the
`<html>` element always carries the canvas background class.

### 3.4 Typography

- **Display/Headings:** `Plus Jakarta Sans` (600/700) → Tailwind `font-display`.
- **Body/UI:** `Inter` (400/500/600) → `font-sans`.
- **Numeric/technical** (file sizes, quotas, IDs, share tokens): `JetBrains Mono` → `font-mono`, `tabular-nums`.
- **Maximum two families per screen** (mono counts as technical detail, use sparingly).
- Scale: `display 40/44` · `h1 32/38` · `h2 24/30` · `h3 20/26` · `body 15/24` · `small 13/20` ·
  `micro 11/16 uppercase tracking-[0.14em]`. Body line-height `leading-relaxed`. Never below 13px.
- Headline copy uses `text-balance`; paragraphs use `text-pretty`.
- Voice: warm, human, second person, no jargon. "Your vault", "Nothing here yet",
  "We couldn't reach your vault". Never "Error 500", never "Invalid operation".

### 3.5 Radii, spacing, elevation

- Radii: `--radius-sm 12px`, `--radius-md 16px`, `--radius-lg 20px`, `--radius-xl 24px`,
  `--radius-2xl 32px`, pill `9999px`. App shell & hero panels `2xl`; cards `lg`; inputs `sm`/pill;
  buttons & tags **pill**. Nothing square, nothing sharper than 12px except hairlines.
- Spacing: Tailwind scale only (`p-4 p-6 p-8`, `gap-4 gap-6 gap-8`). **Never arbitrary values**
  (`p-[17px]` is a defect). Section rhythm ≥ `gap-8` desktop, `gap-6` mobile.
- Never mix `margin`/`padding` with `gap` on the same element. Never use `space-y-*`.
- Elevation (3 levels only):
  - light rest `0 1px 2px rgba(15,21,28,.06)`
  - light float `0 10px 25px -5px rgba(15,21,28,.11)`
  - light hover `0 16px 40px -8px rgba(15,21,28,.17)`
  - dark uses the same neutral geometry with `rgba(0,0,0,.16/.22/.28)` and a `--border` hairline
- Glass (`backdrop-blur-md` + 70% card alpha) is allowed on **exactly two** surfaces: the floating
  command/search bar and the upload dock. Nowhere else.

### 3.6 Layout language (this is what makes it not a dashboard)

- **Framed workspace:** the gray `--canvas` is always visible as a margin (`p-3 md:p-5`) around a
  `rounded-2xl` app shell. The app never bleeds edge-to-edge on desktop.
- **Floating rail, not a sidebar:** a detached `rounded-2xl` vertical rail (icon + label, 72px
  collapsed / 232px expanded) sitting _inside_ the frame with its own shadow. Active item = soft
  `--card-muted` fill + 3px `--brand` indicator. No full-height grey sidebar with tab list.
- **Persistent signed-in rail:** at `md` and above, the rail is contracted to the framed viewport
  height and remains sticky while the page-owned content scrolls. Its bottom account area uses a
  generic account depiction linking to Settings, followed by Sign out on a muted neutral surface
  with danger-colored text and icon. Never expose the separate Admin route in the user rail; admin
  access remains protected by its role guard and is reached only through an explicitly authorised
  admin journey.
- **Workspace density:** signed-in shell headings, page greetings, bento headings, card padding, and
  section gaps use an application-scale hierarchy rather than landing-page hero scale. On the
  workspace home, the shell header, greeting, and shallow quick-actions strip must leave the start
  of the quota signature visible in the initial 1024×768 and 1440×900 viewports, making continued
  scrolling discoverable without crowding or removing content. Interactive targets remain at least
  44px.
- **No top "header bar with search + bell + avatar."** Instead: a page-owned editorial header
  (greeting/heading + one primary action) and a **floating command bar** (⌘K / `/`) that is the
  hero search interaction.
- **Editorial hero over metric grid.** Example intent:

  ```
  Good evening, Haroon.

  Your vault            42.8 GB of 100 GB          [ Upload ]
  ──────────────────────────────────────────────────────────
  Continue where you left off        ·        Recent activity
  ```

  Not: `[ 12 ][ 32 ][ 43 ][ 91 ]`.

- **Asymmetric bento** for the workspace home: one large "signature" tile (3D vault + quota),
  supported by 3–5 differently sized tiles (recent files, storage plan, shared links, trash).
  Deliberately uneven — never four identical stat cards in a row.
- Mobile-first: single column → tablet: 2-col bento + collapsed rail → desktop: 3/4-col bento +
  expanded rail. On small screens the rail becomes a bottom-anchored pill dock, **not** a shrunken
  desktop layout.
- Cards are for **meaningful groups**, not for every number.

### 3.7 Motion budget

- Durations `160ms` (micro) / `240ms` (default) / `320ms` (page). Easing `cubic-bezier(.22,1,.36,1)`.
- Allowed: card hover lift `-2px` + shadow step; staggered list/grid entrance (`40ms` stagger,
  first paint only); route cross-fade + 8px rise; dialog scale `.97 → 1`; upload progress ring;
  quota arc count-up on mount; rail expand/collapse; toast slide.
- Forbidden: looping ambient animation, parallax scroll-jacking, bouncy springs, spinners longer
  than 600ms without a skeleton, anything animating on every keystroke.
- `@media (prefers-reduced-motion: reduce)` → all transforms become opacity-only or none. This must
  be implemented in Phase 1, not retrofitted.

### 3.8 3D usage (signature element — restrained and permitted only here)

Use `@react-three/fiber` + `drei` on **exactly these four surfaces**:

1. **Landing hero** — the SkyVault Vault: a rounded-cube vault with a slowly rotating dial,
   graphite frame, soft-white/zinc door, silver dial, restrained burgundy hub, soft neutral studio
   lighting, subtle pointer-parallax (max 6° tilt), _not_ auto-spinning.
2. **Storage/quota object** — a translucent vault or stacked-shell volume that visually fills with
   midnight slate as usage rises; amber at 80% and above, danger/burgundy at 95% and above. The shell
   uses zinc materials and every state is driven by real API quota values.
3. **Empty states** — a single small floating 3D object (empty vault / drifting document plane) with
   a real CTA underneath.
4. **Auth aside** — a slow, calm 3D key/dial panel beside the form (form itself stays 2D and fast).
   Use a graphite dial, zinc key and wheel, and restrained burgundy hub.

Hard rules:

- Every 3D surface is `React.lazy` + `<Suspense>` with a **static PNG/SVG fallback**, and is skipped
  entirely under `prefers-reduced-motion`, on `navigator.hardwareConcurrency <= 4`, or on viewports
  `< 768px` (mobile gets the flat fallback).
- Budget per scene: ≤ 60k triangles, ≤ 2 lights + 1 environment, `dpr={[1, 1.75]}`,
  `frameloop="demand"` where possible, no post-processing stack, no HDR files > 1 MB.
- Never place 3D behind text, in tables, in the file grid, in dialogs, or in admin screens.
- 3D never gates functionality: if the canvas fails, the page still works completely.

### 3.9 Component rules (abbreviated spec)

- **Buttons:** pill; primary = the approved semantic midnight-slate gradient + white
  `primary-foreground`; secondary = neutral `card-muted` surface + foreground; ghost = transparent +
  `card-muted` hover; destructive = `destructive-background` + `destructive-foreground`. Icon buttons
  preserve a minimum 44px circular target.
  Press = `scale .97`. Loading = inline spinner + label swap, never a blank button.
- **Inputs:** 44px min height, `radius-sm`, 1px `--border`, focus = 2px `--ring` + offset. Errors
  appear **below** the field in `--danger` with an icon, and the field border turns `--danger`. Never rely on
  color alone.
- **File/folder cards:** `radius-lg`, `p-5`, mono file size + relative date in `muted-foreground`,
  file-type glyph in a tinted 40px squircle, hover lift + reveal of a 3-dot menu (menu is always
  keyboard reachable). Grid `1 / 2 / 3 / 4` columns by breakpoint. List view shares the same tokens.
- **Breadcrumbs:** always present in folder views, truncate middle with an overflow menu, last
  segment is `aria-current="page"`.
- **Tables (admin):** no zebra stripes; hairline rows, `--card-muted` hover, sticky header, pill
  status badges, right-aligned numerics in mono.
- **Skeletons over spinners** for any content region; shimmer via opacity only.
- **Empty states** always = 3D-or-illustration + one sentence of warm copy + one primary CTA.
- Accessibility floor: WCAG AA (4.5:1 text), visible focus on everything, full keyboard operability
  (including the command bar, menus, dialogs, drag-drop has a button alternative), semantic
  landmarks (`<header> <nav> <main> <aside>`), `aria-live` for upload progress and toasts,
  `sr-only` labels for icon-only controls, dialogs trap focus and restore it on close.

### 3.10 Anti-patterns — automatic rejection

Do not produce: a grey left sidebar + top search bar + 4 stat cards layout; decorative gradients
(the semantic primary-action gradient is the sole approved gradient); glowing orbs, gradient blobs,
or blurry decorative shapes; neumorphism; emoji as icons; color families outside the approved
semantic system; more than 2 font families; a second toast/dialog system; `any`-typed models;
inline hex colors; `fetch` inside a component; `useEffect` data fetching; localStorage as a data
store for domain data; hardcoded/mock file, plan, or user data; a page that renders nothing while
loading; a screen with no error state; a desktop-only layout that scrolls horizontally on a phone;
an action that only exists on hover; an endpoint call that ignores the `AbortSignal`; an "Error:
canceled" toast.

### 3.11 Brand assets (already generated, in `/frontend/public/brand/`)

| Asset                      | File                                                           | Use                                                  |
| -------------------------- | -------------------------------------------------------------- | ---------------------------------------------------- |
| Raster emblem, light       | `skyvault-emblem-light-v3.png`                                 | Light surfaces in `BrandSignature`                   |
| Raster emblem, dark        | `skyvault-emblem-dark-v3.png`                                  | Dark surfaces in `BrandSignature`                    |
| Vector mark, light         | `skyvault-mark.svg`                                            | Light rail, loaders, code-native mark                |
| Vector mark, dark          | `skyvault-mark-dark-v3.svg`                                    | Dark rail, loaders, code-native mark                 |
| Landing fallback, light    | `landing-vault-fallback-light-v3.png`                          | Light mobile/reduced-motion/low-core/Canvas fallback |
| Landing fallback, dark     | `landing-vault-fallback-dark-v3.png`                           | Dark mobile/reduced-motion/low-core/Canvas fallback  |
| Auth fallback, light/dark  | `auth-key-fallback.svg`, `auth-key-fallback-dark-v3.svg`       | Auth scene fallbacks                                 |
| Quota fallback, light/dark | `quota-vault-fallback.svg`, `quota-vault-fallback-dark-v3.svg` | Storage scene fallbacks                              |
| Transparent favicon raster | `skyvault-favicon-v3.png`                                      | Favicon, Apple touch icon, and manifest source       |

The mark remains a **cloud whose lower half becomes a vault door**, preserving its silhouette,
composition, proportions, transparency, and edges. Active materials are zinc/graphite with a
restrained burgundy hub/accent. `BrandSignature` always renders the wordmark as live text:
`Sky` uses `--foreground` and `Vault` uses `--brand`; do not use a raster horizontal wordmark.
Theme-specific emblem, vector, and fallback assets switch with the active theme. Never place the
logo on a white box inside a dark surface, stretch it, or recolor it ad hoc. Minimum width is 120px
for the signature / 20px for the mark; clear space = mark height ÷ 2. Tagline: _"Your files. Your
space. Always secure."_ Page title pattern: `SkyVault — <Page>`.

### 3.12 Responsive contract (non-negotiable — mobile is a first-class target)

SkyVault is a **fully responsive web application**. Every screen you build must be _designed_ at small
width and _enhanced_ upward — never a desktop layout squeezed down, never a "mobile version" with
features removed. A screen that only looks correct at 1440px is an incomplete screen, and the phase
is not `DONE`.

**Breakpoints (Tailwind defaults only — do not invent custom ones):**

| Token | Width                           | Treatment                                                                                                                                                         |
| ----- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| base  | `< 640px` (design at **360px**) | One column. Rail becomes a bottom-anchored pill dock. Frame margin `p-3`. Bento tiles stack full-width in priority order. Command bar becomes a full-width sheet. |
| `sm`  | `≥ 640px`                       | Two-up file/folder grid, larger type step.                                                                                                                        |
| `md`  | `≥ 768px`                       | Rail returns as a collapsed 72px floating rail. 2-col bento. **3D becomes eligible** (below this, always the flat fallback).                                      |
| `lg`  | `≥ 1024px`                      | 3-col bento, rail expandable to 232px, split panes allowed (list + detail).                                                                                       |
| `xl`  | `≥ 1280px`                      | 4-col grid, max content width `1440px`, centered with the gray canvas visible as margin.                                                                          |
| `2xl` | `≥ 1536px`                      | Do not keep growing content — grow the canvas margin instead.                                                                                                     |

**Mandatory rules**

- Write mobile styles unprefixed, then layer `sm:` `md:` `lg:` `xl:`. Never write `max-*` variants
  except for a genuine "hide on mobile only" decorative case.
- **Reference viewports to check every phase: 360×640, 390×844, 768×1024, 1024×768, 1440×900.**
  Both orientations on tablet. Both light and dark at each.
- **No horizontal scroll at any width, ever** (except deliberately scrollable regions such as
  breadcrumbs or an admin table wrapped in `overflow-x-auto` with a visible affordance).
- Touch targets ≥ 44×44px; primary actions reachable within thumb range on mobile (bottom dock /
  sticky action bar), never only in a top-right corner.
- Every hover-revealed affordance (file card 3-dot menu, hover lift, tooltips) must have a
  **tap/keyboard equivalent** on touch devices — use `@media (hover: hover)` for hover-only styling.
  A menu that only appears on hover is a defect.
- Drag-and-drop upload is desktop enhancement only; mobile gets a full-width "Choose files" button
  plus the camera/file picker. Feature parity is preserved by an alternative control, never removed.
- Dialogs: centered modal at `md+`, **bottom sheet** (drag-to-dismiss, safe-area padded) at base.
  Long forms scroll inside the sheet with a pinned footer action.
- Tables never shrink below legibility: at base width, admin/file tables become **stacked
  label–value cards**, not a squashed grid.
- Typography and spacing scale with breakpoints (`text-3xl md:text-5xl`, `gap-6 md:gap-8`);
  never use fixed `px` widths/heights for layout containers. Use `max-w-*`, `min-w-0`, `flex-1`,
  `truncate`/`line-clamp-*` — long file names must truncate, never push layout.
- Respect mobile viewport realities: `100dvh` (not `100vh`), `env(safe-area-inset-*)` padding for the
  bottom dock, `16px` minimum input font-size to prevent iOS zoom, and no fixed elements that cover
  the keyboard's input.
- Images/canvas are fluid (`w-full h-auto`, `aspect-*`), never fixed-size. 3D canvases resize with a
  `ResizeObserver` and are skipped entirely `< 768px` (§3.8).
- Provide `useMediaQuery` / `useBreakpoint` in `src/hooks` and drive **behavioural** differences from
  it (dock vs rail, sheet vs modal). Purely visual differences stay in CSS/Tailwind — do not
  JS-branch what a breakpoint class can do.
- The `/design-system` route must render its showcase responsively too, so regressions are visible.

---

## 4. T — TASK (phased execution, one phase per session)

### 4.1 The ledger protocol (do this every session, without exception)

1. **Read** `/docs/SKYVAULT_FRONTEND_MASTER_PROMPT.md` (this file) in full.
2. **Read** `/frontend/docs/PHASE-LEDGER.md`. If it does not exist, create it from the template in §4.5.
3. **Verify reality, not the ledger's claims:** for every phase marked `DONE`, confirm the listed
   files actually exist, the app builds (`pnpm build`), lint passes, and the phase's acceptance
   criteria still hold. If a `DONE` phase is broken or missing, mark it `REGRESSED`, fix it, and
   report — do not start a new phase.
4. **Announce** in one short paragraph: which phases are `DONE`, which phase you are starting, and
   which controllers/DTOs you will read for it.
5. **Read the real contract** for that phase: the controller file(s), their action methods, route
   templates, `[HttpX]` verbs, `[Authorize]` attributes, request DTOs, response DTOs, and the global
   exception handler's error shape. Mirror them exactly.
6. **Implement the phase only.** No files from later phases. No "while I'm here" refactors of earlier
   phases beyond what the phase requires (if a change to shared code is required, name it in the report).
7. **Verify:** `pnpm tsc --noEmit` clean · `pnpm lint` clean · `pnpm build` clean · light **and** dark
   mode checked · **all five reference viewports of §3.12 (360×640, 390×844, 768×1024, 1024×768,
   1440×900) checked with zero horizontal scroll** · touch-equivalent for every hover affordance ·
   **cancellation checked per §5.8 (navigate away mid-request → `canceled`, no error UI; user cancel
   → clean state + neutral copy)** · keyboard pass on the phase's primary flow · phase smoke test passes.
8. **Update the ledger** (status, date, files added, endpoints consumed, open questions) and write
   the phase report (§6.3).
9. **Stop.** Do not roll into the next phase. Wait for owner review.

Owner-approved execution exception (2026-08-23): Phases 7–9 may be implemented sequentially in one
run only after each phase has passed its complete automated gate and its documentation checkpoint.
Phases 5–9 remain `IN_PROGRESS` until the owner's rendered review; this exception does not permit
later-phase contracts to be pulled into an earlier checkpoint or any backend change.

Additionally maintained by you: `/frontend/docs/API-GAPS.md` (anything the UI needs that the API
does not expose) and `/frontend/docs/ADR-001-react-frontend.md`.

### 4.2 Phase list (hierarchical — follows the real user journey)

Each phase = one functional slice, shippable and reviewable on its own.

**Phase 0 — Foundation & Design System** _(no feature UI)_
Scaffold `/frontend` (Vite + React + TS strict), Tailwind + `theme.css` tokens (light + dark), fonts,
shadcn/ui initialised and restyled to SkyVault tokens, `lib/utils`, formatters (bytes, relative
date, percentage), constants, `providers.tsx` (QueryClient, theme, router, toaster), the **axios
client + interceptors + typed `ApiError`** derived from the real global-exception-handler shape,
the **cancellation layer of §5.8** (`RequestCancelledError`, cancel-aware interceptor ordering,
per-read timeouts, `useMediaQuery`/`useBreakpoint` for the §3.12 behavioural breakpoints),
`react-query` defaults (retry policy, staleness, `retry: false` for cancelled requests), `zod` setup, brand assets wired
(favicon/apple-touch/manifest/title), `prefers-reduced-motion` plumbing, base 3D `<Scene>` wrapper
with lazy loading + fallback, and a **`/design-system` internal route** rendering every token,
button, input, card, badge, skeleton, empty state and error state in both themes.
_Acceptance:_ `/design-system` shows the full kit in light and dark; no feature code exists yet;
one raw hex anywhere = fail.

**Phase 1 — App Shell, Routing, Error & Resilience Layer**
Router with lazy routes; `PublicRoute` / `ProtectedRoute` / `AdminRoute` (guards read session state
only, they do not decode business rules); `AuthLayout`, `WorkspaceLayout` (framed shell + floating
rail + command-bar slot), `AdminLayout`; global `ErrorBoundary`; route-level error elements;
**dedicated error pages** — `400`, `401`, `403`, `404`, `408/timeout`, `413 too large`,
`429`, `500`, `503/maintenance`, `offline`, plus a generic `SomethingWentWrong` — each on-brand
(mark + short warm copy + "Back to my vault" + "Try again" where retry is safe, and an optional
correlation/trace id if the API returns one); network-offline banner; `NotFound` catch-all;
suspense fallbacks/skeletons for every route.
_Acceptance:_ every unhappy path renders a branded page, never a blank screen and never a stack
trace; manually forcing each status shows the right page; the app cannot be crashed by a thrown
render error.

**Phase 2 — Public Landing & Marketing Surface**
Landing page with the 3D vault hero (lazy + fallback), value proposition from the SRS (secure,
affordable, intelligent search), how-it-works, public plans preview (from the real plans endpoint if
it is public; otherwise static copy that links to sign-up — never faked data), footer, theme toggle,
and CTAs into sign-up/sign-in.
_Acceptance:_ Lighthouse-reasonable, hero degrades to a static image on low-end/reduced-motion, no
invented pricing numbers.

**Phase 3 — M-01 Authentication & Account (UC-01…UC-06)**
Register, email-verification landing (token from URL), resend verification, login, forgot password,
reset password (token from URL), logout, profile view/update, change password. Split-screen auth
layout (calm 3D aside + fast 2D form), `react-hook-form` + `zod` mirroring API validation, field-level
API error mapping, unverified-account state, session store + token attach/refresh in interceptors
exactly as the API defines, and redirect-after-login.
_Acceptance:_ every UC-01…UC-06 step is reachable; expired/invalid token states have real screens;
401 handling is centralised.

**Phase 4 — M-02 Storage Subscription & Allocation (UC-07…UC-10)**
Plan catalogue (editorial cards, one recommended plan, real plan data), subscribe flow, additional
storage purchase, payment hand-off exactly as the API prescribes (success/failure/pending return
states all handled), current subscription panel, and the **storage quota object** (3D + accessible
numeric/bar fallback) with amber ≥80% / danger-burgundy ≥95% states and an over-quota explanation.
_Acceptance:_ quota values come only from the API; no client-side quota arithmetic beyond formatting;
pending/failed payment returns are real screens.

**Phase 5 — Workspace Home (post-login hub)**
The asymmetric bento home evolves alongside Phases 6–8 by explicit owner decision while remaining
`IN_PROGRESS`. After Phase 6 it leads with compact Upload files, New folder, and Browse files actions,
then equally weighted recent-files and root-folders panels. Quota and subscription facts share one
storage overview instead of competing tiles; sharing and trash remain smaller independent summaries.
The home composes existing feature hooks only — it introduces no summary endpoint or early mutation.
_Acceptance:_ no four-identical-stat-card row; every API-backed region has loading, empty and error
states; root folders means only `GET /api/folders/root` subfolders; Phase 5 may be refined only with
real contracts unlocked by the phase just implemented.

**Phase 6 — M-03 Folder Management + M-04 File Management**
Folder tree/rail navigation, breadcrumbs, create/rename/move/delete folder, folder view with
grid/list toggle; file upload (drag-and-drop **plus** a button alternative, upload dock with
per-file browser-to-API progress via `onUploadProgress`, size rejection, and quota rejection message),
download, response-type-gated preview, rename, move, copy, replace, delete → recycle bin; mixed
file/folder multi-select with a bulk action bar; and presentation-only sort/filter. No pagination,
ancestry/tree, preview-capability, folder-copy, bulk-operation, or server-progress contract is assumed.
_Acceptance:_ every action maps 1:1 to a real endpoint; cancelled/failed uploads are recoverable;
empty folder state is designed; keyboard-only file management is possible; submitted storage writes
are never aborted after the safe client-transfer boundary.

**Phase 7 — M-05 Recycle Bin**
Deleted files/folders list, restore, permanent delete (typed/explicit confirmation), retention
information as returned by the API, empty-bin state, bulk restore/delete.
_Acceptance:_ no permanent deletion without confirmation; restore conflicts surfaced from the API.

**Phase 8 — M-06 File Sharing**
Create view-only share link, copy link, list returned links, revoke links explicitly reported as not
revoked, show expiry only as the API defines it, and provide the **public share-view page**
(unauthenticated, minimal chrome, view-only, plus its own invalid/expired/revoked/not-found states).
The owner-approved frontend wrapper parses the returned `/api/share/{shareToken}` URL only in memory
and copies `/share/:shareToken`; that route calls only the real anonymous preview/download endpoints.
Because the response has no explicit active/expired field, use `Not revoked` and never infer validity.
_Acceptance:_ the public page never exposes owner data beyond what the response DTO contains; no
download affordance unless the API allows it.

**Phase 9 — M-07 Metadata Search & Discovery**
The command bar as a primary interaction (`Ctrl/Cmd+K` / `/`), metadata keyword query, free-text
file type/extension, upload-date `fromDate` and `toDate`, session-recent searches, 300 ms debounced
querying, cancellation of stale requests, no-results guidance, and a full search page with the four
real parameters deep-linkable in the URL. Preserve the backend result order and reuse completed file
actions. The owner-approved implemented scope excludes natural-language/AI modes, embeddings, size
or folder filters, pagination, scores, highlights, and match context because the API exposes none.
_Acceptance:_ only real filters map to query parameters; no client-side re-ranking or match facts are
invented; results and the command dialog are keyboard navigable end to end.

**Phase 10 — M-08 Administration** _(gated — build only when the owner explicitly requests it)_
Admin shell (quieter, denser, same tokens), user management, plan management, platform monitoring
(recharts, 2–3 colors), operational settings — all limited to real admin endpoints, all behind
`AdminRoute`, with a real `403` experience for non-admins.

**Phase 11 — Hardening & Handover** _(only after 0–9 are `DONE`)_
Accessibility audit pass, contrast verification in both themes, bundle/code-split review, empty/error
state coverage matrix, `README.md` (setup, env vars, scripts, structure), and a
`docs/UI-GUIDE.md` documenting the design system as built.

### 4.3 Definition of Done (applies to every phase)

- All UI states implemented: **loading (skeleton) · empty · error · success · cancelled · unauthorised · offline**.
- Light + dark verified; **all five §3.12 reference viewports verified with no horizontal scroll and a
  touch/keyboard equivalent for every hover affordance**; keyboard pass on the primary flow.
- Typescript strict clean, lint clean, build clean, phase smoke test green.
- Every network call: typed request model → typed response model → typed error, **cancellation signal
  forwarded per §5.8**, via a feature service calling an `api/endpoints/*.api.ts` function. No exceptions.
- Every long-running operation in the phase has a working user-facing Cancel.
- Zero backend files touched; zero invented endpoints; zero mock domain data.
- Ledger updated; report written; open questions listed.

### 4.4 Ledger template (`/frontend/docs/PHASE-LEDGER.md`)

```markdown
# SkyVault Frontend — Phase Ledger

Statuses: NOT_STARTED | IN_PROGRESS | DONE | REGRESSED | BLOCKED

| #   | Phase                      | Status      | Verified on | Notes |
| --- | -------------------------- | ----------- | ----------- | ----- |
| 0   | Foundation & Design System | NOT_STARTED | —           |       |
| 1   | App Shell, Routing, Errors | NOT_STARTED | —           |       |
| ... |

## Phase <n> — <name>

- Status:
- Date:
- Controllers read:
- Endpoints consumed: METHOD /api/... → <file>
- Files added/changed:
- Deviations from the master prompt (with reason):
- Open questions for the owner:
- Verification: tsc [ ] lint [ ] build [ ] light/dark [ ] responsive 360 [ ] 390 [ ] 768 [ ] 1024 [ ] 1440 [ ]
  no-h-scroll [ ] touch-equivalents [ ] cancellation [ ] keyboard [ ] smoke test [ ]
```

---

## 5. E — EXAMPLES (patterns to imitate exactly)

### 5.1 Visual references (study before Phase 0; imitate structure, never copy assets)

- The owner-approved light-theme palette reference: a gray framed canvas around white/zinc surfaces,
  midnight-slate interaction, burgundy identity accents, graphite/zinc vault materials, and large
  radii. Its edge-to-edge mockup layout is **not** a structural reference.
- Dribbble searches: _"personal workspace UI"_, _"cloud storage app"_, _"file manager UI"_,
  _"bento dashboard"_, _"floating sidebar card"_, _"zinc burgundy dashboard"_,
  _"graphite 3D vault illustration"_.
- Product references for **feel** (not layout copying): Linear (precision, keyboard-first),
  Notion (calm surfaces), Arc (personality), Raycast (command bar), Vercel (dark-mode discipline).

### 5.2 Directory structure (create exactly this; add folders only when a phase needs them)

```
frontend/
├── public/
│   ├── favicon.ico
│   ├── apple-touch-icon.png
│   ├── manifest.webmanifest
│   └── brand/
│       ├── skyvault-mark.svg
│       ├── skyvault-mark-dark-v3.svg
│       ├── skyvault-emblem-light-v3.png
│       ├── skyvault-emblem-dark-v3.png
│       ├── landing-vault-fallback-light-v3.png
│       ├── landing-vault-fallback-dark-v3.png
│       ├── auth-key-fallback.svg
│       ├── auth-key-fallback-dark-v3.svg
│       ├── quota-vault-fallback.svg
│       ├── quota-vault-fallback-dark-v3.svg
│       └── skyvault-favicon-v3.png
├── docs/
│   ├── PHASE-LEDGER.md
│   ├── API-GAPS.md
│   ├── ADR-001-react-frontend.md
│   └── UI-GUIDE.md
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx
│   │   ├── routes.tsx
│   │   ├── providers.tsx
│   │   └── config.ts
│   ├── api/
│   │   ├── client.ts              # axios instance
│   │   ├── interceptors.ts        # auth attach, refresh, error normalisation
│   │   ├── errors.ts              # ApiError + status → UX mapping
│   │   ├── endpoints/             # ONE FILE PER BACKEND CONTROLLER
│   │   │   ├── auth.api.ts
│   │   │   ├── account.api.ts
│   │   │   ├── storagePlans.api.ts
│   │   │   ├── subscriptions.api.ts
│   │   │   ├── folders.api.ts
│   │   │   ├── files.api.ts
│   │   │   ├── recycleBin.api.ts
│   │   │   ├── sharing.api.ts
│   │   │   ├── search.api.ts
│   │   │   └── admin.api.ts
│   │   └── types/api.types.ts     # envelope, paging, problem-details shape
│   ├── models/                    # mirrors backend Request/Response DTOs
│   │   ├── auth/ user/ file/ folder/ subscription/ storage/ sharing/ search/ admin/
│   ├── features/
│   │   ├── auth/ account/ subscriptions/ folders/ files/ recycle-bin/ sharing/ search/ admin/ workspace/
│   │   │   └── { components/ pages/ hooks/ services/ models/ validators/ }
│   ├── components/
│   │   ├── ui/            # shadcn primitives, SkyVault-styled
│   │   ├── layout/        # Rail, CommandBar, WorkspaceFrame, PageHeader, ThemeToggle
│   │   ├── feedback/      # Skeletons, EmptyState, ErrorState, ConfirmDialog, OfflineBanner
│   │   ├── three/         # Scene wrapper, VaultObject, QuotaVolume, fallbacks
│   │   └── common/
│   ├── layouts/           # AuthLayout, WorkspaceLayout, AdminLayout, PublicLayout
│   ├── routes/            # PublicRoute, ProtectedRoute, AdminRoute
│   ├── pages/errors/      # 400 401 403 404 408 413 429 500 503 Offline Generic
│   ├── hooks/             # useAuth, useDebounce, useFileUpload, usePagination, useMediaQuery, useReducedMotion
│   ├── store/             # auth.store.ts, ui.store.ts, upload.store.ts
│   ├── lib/               # utils, formatters, constants, storage, queryKeys
│   └── styles/            # globals.css, theme.css
├── .env.example           # VITE_API_BASE_URL=
├── tailwind.config.ts · tsconfig.json · vite.config.ts · package.json
```

### 5.3 The mandatory data flow (never shortcut a layer)

```
Page  →  Feature hook (react-query)  →  Feature service  →  api/endpoints/<controller>.api.ts
      →  api/client.ts (axios + interceptors)  →  ASP.NET Core Controller
      →  Service  →  Repository  →  EF Core / Google Drive
```

A component must never import axios, never build a URL, and never know a status code.

### 5.4 Model layer rules (frontend models mirror **DTOs**, not entities)

- One TS interface per backend DTO, **same name, same field names, same casing as the JSON**.
  `UploadFileRequest`, `FileResponse`, `CreateFolderRequest`, `SubscriptionResponse`, …
- Request models contain **only** the fields the endpoint accepts — nothing extra, nothing less.
- Enums mirror backend enums as string-literal unions (or const objects), never magic numbers.
- Nullability mirrors the DTO exactly (`string | null` vs optional `?`). No `any`, no `object`.
- Never model EF Core entities, navigation properties, internal ids, or provider-side fields.
- If a DTO changes on the backend, the _model file_ changes — nothing else should need to.

```ts
// src/models/file/FileResponse.ts  — mirrors FileResponseDto exactly
export interface FileResponse {
  id: string
  name: string
  contentType: string
  sizeInBytes: number
  folderId: string | null
  createdAtUtc: string
  modifiedAtUtc: string | null
  isDeleted: boolean
}
```

### 5.5 Endpoint module shape (one file per controller, functions named after action methods)

```ts
// src/api/endpoints/files.api.ts
import { apiClient } from '@/api/client'
import type { FileResponse } from '@/models/file/FileResponse'
import type { RenameFileRequest } from '@/models/file/RenameFileRequest'

const BASE = '/api/files' // ← must match the controller's [Route] exactly

export const filesApi = {
  getByFolder: (folderId: string) =>
    apiClient.get<FileResponse[]>(`${BASE}`, { params: { folderId } }).then((r) => r.data),

  upload: (form: FormData, onProgress?: (pct: number) => void) =>
    apiClient
      .post<FileResponse>(`${BASE}`, form, {
        onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
      })
      .then((r) => r.data),

  rename: (id: string, body: RenameFileRequest) =>
    apiClient.put<FileResponse>(`${BASE}/${id}/rename`, body).then((r) => r.data),

  download: (id: string) =>
    apiClient.get<Blob>(`${BASE}/${id}/download`, { responseType: 'blob' }).then((r) => r.data),
}
```

> Verify every path, verb, and parameter against the actual controller before writing it. The above
> is a **shape template**, not a contract. **It is also incomplete on purpose:** every function must
> additionally take an optional trailing `signal?: AbortSignal` and forward it to axios — see §5.8,
> which supersedes this snippet.

### 5.6 Error normalisation (single funnel, mirrors the global exception handler)

```ts
// src/api/errors.ts
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly fieldErrors?: Record<string, string[]>,
    readonly traceId?: string,
  ) {
    super(message)
  }
}
export class RequestCancelledError extends Error {} // aborted, NOT a failure — see §5.8

// Interceptor order: detect cancellation FIRST (axios.isCancel / code 'ERR_CANCELED') and throw
// RequestCancelledError before any ApiError mapping, so aborts never reach error UI.
// Interceptor: read the real handler's payload shape from the backend, map it to ApiError,
// never surface raw server text, never log payloads containing tokens.
// 401 → refresh-or-sign-out · 403 → Forbidden page · 404 → NotFound (route) or inline empty
// 408/timeout, 413, 429, 5xx → matching error page or toast + retry, per §4.2 Phase 1.
```

### 5.7 Feature hook + component split

```ts
// features/files/hooks/useFiles.ts
export function useFiles(folderId: string) {
  return useQuery({
    queryKey: queryKeys.files.byFolder(folderId),
    queryFn: () => fileService.list(folderId),
  })
}
```

Components render `isPending → <FileGridSkeleton/>`, `isError → <ErrorState onRetry/>`,
`data.length === 0 → <EmptyVault/>`, else the grid. **All four branches, every time.**

### 5.8 Request cancellation (the backend expects it — `AbortSignal` → `CancellationToken`)

**Every action method from Controller → Service → Repository in this backend accepts a
`CancellationToken`.** That is a deliberate design decision: when the client aborts an HTTP request,
ASP.NET Core cancels the token, and the work (EF Core query, Google Drive transfer, long scan) is
abandoned instead of burning server resources. **The frontend must honour that contract.** Fire-and-
forget requests that ignore abortion are a defect, not an optimisation.

**Rules**

1. **Every endpoint function accepts an optional `signal: AbortSignal` and forwards it to axios.**
   Signature: `(args…, signal?: AbortSignal)`. Axios passes it straight through to the browser, which
   aborts the underlying request — ASP.NET Core then trips the `CancellationToken`. No custom header,
   no query flag, no backend change is required or permitted.
2. **react-query supplies the signal — use it, don't create your own.** Query functions receive a
   context object containing `signal`; forward it. This gives free cancellation on unmount, on
   `queryKey` change (folder navigation, pagination, search keystrokes) and on `queryClient.cancelQueries`.

   ```ts
   // features/files/hooks/useFiles.ts
   export function useFiles(folderId: string) {
     return useQuery({
       queryKey: queryKeys.files.byFolder(folderId),
       queryFn: ({ signal }) => fileService.list(folderId, signal), // ← always forward
     })
   }
   ```

3. **Services are pass-through for the signal.** `fileService.list(folderId, signal)` →
   `filesApi.getByFolder(folderId, signal)`. A service must never drop the parameter.
4. **Only safely cancellable work owns an active `AbortController`.** Reads and downloads/previews
   remain cancellable throughout. Upload/replace exposes Cancel only while browser bytes are still
   transferring; at 100% it becomes indeterminate “Securing in your vault” and Cancel disappears.
   Submitted copy/move/delete work is not aborted because the backend has no cancellation compensation;
   sequential batches may stop only queued items after the current request. The transient operation
   store clears every controller in `finally` and sign-out aborts only queued/safely cancellable work.

   ```ts
   // features/files/hooks/useFileUpload.ts (shape)
   const controller = new AbortController()
   uploadStore.track(itemId, controller)
   await filesApi.upload(form, onProgress, controller.signal)
   // Cancel button → uploadStore.cancel(itemId) → controller.abort()
   ```

5. **An aborted request is NOT an error — never show an error page or a red toast for it.**
   In the axios interceptor detect abortion (`axios.isCancel(err)` / `err.code === 'ERR_CANCELED'` /
   `err.name === 'CanceledError'`) and re-throw a distinct `RequestCancelledError` (or return a
   sentinel) **before** it reaches `ApiError` mapping. Rules for consumers:
   - Do not log it as a failure, do not increment retry counters, do not fire error telemetry.
   - Do not toast anything for automatic cancellation (navigation, stale search, unmount).
   - For _user-initiated_ cancellation show a neutral, warm confirmation: **"Upload cancelled."** /
     **"Cancelled — nothing was changed."** Never "Request failed" and never "Error: canceled".
   - Aborted mutations must leave the UI in a clean state: roll back optimistic updates, remove the
     item from the upload dock (or mark it `Cancelled` with a **Retry**), and invalidate the affected
     query keys so the UI re-syncs with the server's actual state.
6. **Search and any type-ahead must cancel the previous in-flight request.** Debounce (300ms) **and**
   abort the stale one — this is exactly what the backend's tokens are there for. Never let a slow
   earlier response overwrite a newer one.
7. **Timeouts also abort.** The axios client keeps a sensible read timeout, while Phase 6 file/folder
   writes and transfers explicitly use `timeout: 0`. A client timer must never abort a storage mutation
   after backend reservation/provider work may have begun. Timed reads use the 408-style retry state.
8. **On sign-out and on switching accounts**, call `queryClient.cancelQueries()` then
   `queryClient.clear()`, and abort all tracked upload controllers.
9. **Never abort a mutation the user did not ask to cancel.** Do not attach unmount-abortion to
   mutations that change server state (rename, delete, subscribe) — the write may already have
   committed. Cancellation on unmount is for **reads**; writes are cancelled only by an explicit
   user action, and any cancellable write must be safe to abandon (the backend's token handling
   guarantees the transaction is not half-applied — do not attempt client-side compensation).
10. **Verification per phase:** navigate away mid-load and confirm the request shows as `canceled` in
    DevTools with no error UI; cancel an upload and confirm the dock, toast and server state agree.

Updated endpoint template (this is the required shape, replacing §5.5's simplified version):

```ts
// src/api/endpoints/files.api.ts
export const filesApi = {
  getByFolder: (folderId: string, signal?: AbortSignal) =>
    apiClient.get<FileResponse[]>(BASE, { params: { folderId }, signal }).then((r) => r.data),

  upload: (form: FormData, onProgress?: (pct: number) => void, signal?: AbortSignal) =>
    apiClient
      .post<FileResponse>(BASE, form, {
        signal,
        timeout: 0, // uploads must not time out; they are cancelled by the user instead
        onUploadProgress: (e) => e.total && onProgress?.(Math.round((e.loaded / e.total) * 100)),
      })
      .then((r) => r.data),

  rename: (id: string, body: RenameFileRequest, signal?: AbortSignal) =>
    apiClient.put<FileResponse>(`${BASE}/${id}/rename`, body, { signal }).then((r) => r.data),
}
```

### 5.9 Copy examples (tone calibration)

| Situation                    | Write                                                                      | Never write                          |
| ---------------------------- | -------------------------------------------------------------------------- | ------------------------------------ |
| Empty folder                 | "Nothing here yet — drop a file in to start filling this space."           | "No records found."                  |
| Over quota                   | "Your vault is full. Free up space or add more storage to keep uploading." | "Error: quota exceeded (507)."       |
| 500                          | "Something went wrong on our side. Your files are safe."                   | "Internal Server Error."             |
| 403                          | "This part of SkyVault isn't yours to open."                               | "Forbidden."                         |
| Offline                      | "You're offline. We'll reconnect to your vault automatically."             | "Network request failed."            |
| User cancelled an upload     | "Upload cancelled."                                                        | "Error: canceled" / "Request failed" |
| User cancelled a bulk action | "Cancelled — nothing was changed."                                         | "Operation aborted (ERR_CANCELED)."  |
| Request timed out            | "This is taking longer than expected." + Retry                             | "Timeout of 30000ms exceeded."       |

---

## 6. O — OUTPUT

### 6.1 What you produce per session

1. Code for **exactly one phase**, inside `/frontend/**` only.
2. An updated `/frontend/docs/PHASE-LEDGER.md`.
3. A short phase report in chat (§6.3).
4. New entries in `API-GAPS.md` if any gap was found.

### 6.2 Code conventions

- Files: components `PascalCase.tsx`, hooks `useThing.ts`, services `thing.service.ts`,
  endpoints `thing.api.ts`, models `ThingResponse.ts`. Imports via `@/` alias.
- One component per file; **max ~200 lines** — split beyond that. Pages compose, they don't implement.
- Named exports everywhere except route-level lazy pages.
- Comments: only for non-obvious intent (e.g. "API returns UTC without a Z suffix").
- Commits (if you commit): `feat(frontend/phase-6): folder navigation and file grid`.

### 6.3 Phase report format (paste in chat, keep it tight)

```
PHASE <n> — <name> — COMPLETE
Ledger state read: phases 0..<n-1> DONE and re-verified.
Controllers read: <files>
Endpoints consumed: <METHOD path → api function>
Files added (<count>): <grouped list>
Design system compliance: tokens only ✔ · light+dark ✔ · reduced-motion ✔ · keyboard ✔
Responsive (§3.12): 360×640 ✔ 390×844 ✔ 768×1024 ✔ 1024×768 ✔ 1440×900 ✔ · no h-scroll ✔ · touch equivalents ✔
Cancellation (§5.8): signals forwarded ✔ · user-cancellable ops: <list | none> · abort ≠ error ✔
States covered: loading ✔ empty ✔ error ✔ cancelled ✔ unauthorised ✔ offline ✔
Verification: tsc ✔ lint ✔ build ✔ smoke test ✔
Backend files touched: NONE
Deviations: <none | item + reason>
Open questions: 1) … 2) …
Next phase: <n+1> — <name> (awaiting your go-ahead)
```

---

## 7. GUARDRAILS (violations are failures, not stylistic preferences)

**Backend & contract**

1. Never write outside `/frontend/**`. Never edit `.cs`, `.csproj`, `.sln`, `appsettings*`, migrations, or `/backend/docs/**`.
2. Never invent endpoints, fields, verbs, params, or status codes. Unknown → `API-GAPS.md` + ask.
3. Never reimplement business rules (quota math, permissions, retention, token validation) client-side.
4. Never expose internals in the UI: no stack traces, no raw exception text, no SQL, no provider ids,
   no internal enum numbers, no Google Drive identifiers.
5. Never bypass the layer chain (§5.3) or call the API from a component.
6. Never add mock/sample/hardcoded domain data — not for demos, not "temporarily".
7. Never use `localStorage` for domain data (files, folders, plans). Session token/theme/UI prefs only,
   exactly as the API's auth scheme requires.
8. Never log or store tokens, passwords, or share secrets.

**Process** 9. Never work on more than one phase per session; never start a phase with an unverified predecessor. 10. Never mark a phase `DONE` without meeting the full §4.3 Definition of Done. 11. Never delete or rewrite another phase's files to make yours pass. 12. Never silently deviate from this document — deviations are declared in the report with a reason. 13. Never add a dependency outside §1.5 without declaring and justifying it.

**Design** 14. Never break the token system (§3.2/§3.3) — no raw hex, no `bg-white`, no arbitrary spacing. 15. Never ship a screen without loading, empty, and error states. 16. Never ship a route without a branded error boundary/fallback. 17. Never ship light-only or dark-only UI. 18. Never make 3D a dependency for functionality, and never exceed the 3D budget (§3.8). 19. Never fall back to the generic sidebar-plus-stat-cards dashboard (§3.10). 20. Never break the accessibility floor (§3.9): contrast, focus, keyboard, semantics, `aria-live`.

**Responsiveness (§3.12)** 21. Never ship a screen that is only verified at desktop width, and never produce horizontal scroll
at 360px. All five reference viewports, both themes, every phase. 22. Never lock functionality behind hover, drag, or a desktop-only control without a tap/keyboard
equivalent; never use fixed `px` layout sizes, `100vh`, or arbitrary breakpoints.

**Cancellation (§5.8)** 23. Never call an endpoint function without forwarding react-query's `signal` for reads; never drop
the `signal` parameter in a service or endpoint module. 24. Never treat an aborted request as an error — no error page, no red toast, no retry loop, no
error telemetry. Aborted uploads/bulk actions must leave a clean, re-syncable UI. 25. Never ship a long-running operation (upload, download, bulk move/delete/restore) without a real
user-facing Cancel wired to an `AbortController`, and never auto-abort a state-changing mutation
on unmount.

**When stuck:** stop, choose the most conservative option that cannot break anything, document the
choice and the question in the ledger and report, and hand the decision back to the owner.

---

## 8. Session kick-off snippet (paste this to the agent each time)

```
Read /docs/SKYVAULT_FRONTEND_MASTER_PROMPT.md in full — it is binding.
Then read /frontend/docs/PHASE-LEDGER.md and re-verify every phase marked DONE
(files exist, build passes, acceptance criteria hold).
Tell me: the verified ledger state, the next phase you will execute, and the exact
controllers/DTOs you will read for it. Then execute that ONE phase, following the
frozen design system in §3, and stop with the §6.3 report.
Backend files are read-only. Do not invent endpoints. Do not skip states.
Mobile-first and fully responsive per §3.12 (verify 360/390/768/1024/1440, no h-scroll).
Forward AbortSignal on every call per §5.8 — the backend takes a CancellationToken everywhere;
an aborted request is never an error.
```
