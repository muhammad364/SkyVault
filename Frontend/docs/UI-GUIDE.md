# SkyVault UI Guide

This file records the visual language established in Phases 0-2 so later phases remain consistent. `SKYVAULT_FRONTEND_MASTER_PROMPT (1).md` remains the source of truth; this guide also records later owner-approved refinements, including the larger Phase 2 hero scale and the accessible marketing marquee.

## Design direction

SkyVault uses the "Quiet Vault" language: a calm mint editorial workspace with crisp card surfaces, deep teal brand elements, generous spacing, large rounded corners, diffused shadows, and restrained motion. Screens should feel like a personal workspace rather than an administration dashboard.

## Brand

- Use `BrandSignature` for the live emblem and `SkyVault` wordmark.
- Render `Sky` with `text-foreground` and `Vault` with `text-primary`.
- Swap the supplied light and dark emblem assets by theme; never recolor or stretch them.
- Show the full brand signature once in a surface header. Do not repeat it inside the same hero.

## Color and surfaces

- Use only semantic tokens from `theme.css`; never add raw component colors.
- Primary surfaces follow: `bg-canvas` outer frame, `bg-surface` workspace, `bg-card` content, and `bg-card-muted` supporting regions.
- Teal is the brand voice. Amber and coral remain functional signals, not decoration.
- Glass and gradients are not part of the landing or standard workspace language.

## Typography

- Plus Jakarta Sans is the display voice; Inter is the body and interface voice.
- Hero headlines are prominent, balanced, and editorial. The established landing scale is `text-5xl md:text-6xl lg:text-7xl` with `leading-tight`.
- Supporting hero copy uses `text-lg md:text-xl`; labels use `text-base md:text-lg` when the hero needs stronger visual balance.
- Use JetBrains Mono only for technical values such as capacity, price, quota, identifiers, and dates.
- Keep headings warm and concise, paragraphs readable, and product copy free of technical jargon.

## Layout and spacing

- Preserve the framed mint canvas and rounded inner surface on every application layout.
- Build mobile-first with Tailwind's default breakpoints and never introduce fixed layout widths.
- Use asymmetric editorial composition instead of identical metric-card rows.
- Keep content groups spacious with Tailwind scale spacing, but let important hero copy confidently occupy its column.
- Avoid repeating information solely to fill space; strengthen hierarchy and scale instead.

## Components

- Buttons are pill-shaped, use token colors, and retain visible focus states and 44px touch targets.
- Cards use `rounded-lg`, semantic surfaces, `shadow-rest`, and at most a `-2px` hover/focus lift to `shadow-hover`.
- Storage-plan cards remain API-driven. Visually separate name, storage, billing cycle, and PKR price without inventing benefits, rankings, or recommendations.
- Loading regions use proportion-matched opacity skeletons; empty and error regions always keep useful copy and an action.

## Motion and scrolling

- Use Framer Motion with 160ms, 240ms, or 320ms durations and the vault easing `[0.22, 1, 0.36, 1]`.
- Route and deferred-section entrances use one cross-fade with an optional 8px rise.
- Lists and steps may reveal once with a 40ms stagger. Do not add scroll-jacking, parallax, bouncing springs, or ambient loops.
- Native smooth anchor scrolling is allowed and must become static under reduced motion.
- The Phase 2 information marquee is the sole approved looping 2D exception. It must pause offscreen, while hidden, on interaction, and through its Pause/Resume control.

## 3D language

- Use R3F/Drei primitives and `useFrame`; never use custom WebGL matrix transformations.
- Keep forms and functionality independent from 3D.
- The landing vault uses matte teal, a light steering wheel, an amber hub, restrained lighting, and pointer tilt capped at six degrees.
- Every scene remains lazy, demand-rendered where possible, and replaced by a static fallback on mobile, reduced-motion, low-power, loading, or Canvas failure paths.

## Accessibility and themes

- Every new surface must work in light and dark themes with semantic tokens.
- Reduced motion removes transforms or uses opacity only.
- Preserve semantic landmarks, keyboard access, visible focus, readable contrast, and tap equivalents for hover behavior.
- Verify 360, 390, 768, 1024, and 1440 widths with no horizontal overflow before closing a phase.

## Consistency check for later phases

Before completing any later phase, compare it against this guide and the master prompt: brand usage, token-only color, typography hierarchy, framed layout, card treatment, motion budget, 3D eligibility, reduced motion, keyboard access, both themes, and all reference widths must remain consistent.
