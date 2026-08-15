# PageTeaserModule Specification

## Overview
- **Target file:** `src/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/PageTeaserModule.tsx`
- **Interaction model:** static content in a native CSS scroll-snap track. No JS, no autoplay,
  no tabs. On `pointer: fine` the track wraps and does not scroll.
- **Instances:** 3 (page modules 2, 8, 16). Module 2 has a heading; 8 and 16 do not.

## DOM Structure
```
div.layout [data-content-module="page-teaser"]
├── h2.text-h3.mb-24.md:mb-48  [grid-column: content]        ← optional
└── div.layout-outset  [grid-column: outset]
    └── div.flex.gap-16.px-outset.pointer-fine:flex-wrap.horizontal-snap
           .snap-x.snap-mandatory.scroll-px-outset.overflow-auto
           .overscroll-x-contain.[scrollbar-width:none]
        └── a.w-grid-3/4.min-w-grid-3/4.snap-start.-outline-offset-1
              .pointer-fine:w-grid-1/2.pointer-fine:min-w-grid-1/2
              .hover-hover:hover:outline.hover-hover:hover:outline-1
              .hover-hover:hover:outline-black                          ← × 2
            ├── img.w-full.h-auto.object-cover.aspect-square
            └── p.pt-16.md:pt-24.hover-hover:p-16.md:hover-hover:p-24.text-c1
                ├── strong
                ├── br
                └── span.line-clamp-3
```

## Computed Styles (exact @1512px)

### Module heading (instance 2 only)
- `grid-column: content`, width `1376px`, x `61`, height `24px`
- `.text-h3`: font-size `18px`, line-height `24px`, weight `700`, letter-spacing `0.36px`
- `margin-bottom: 48px` (`mb-24` → 24px below 820px)

### Track
- `grid-column: outset` → width `1440px`, x `29`
- display `flex`; `gap: 16px`; `padding: 0 32px` (`px-outset`)
- `scroll-snap-type: x mandatory`; `scroll-padding-left: 32px`; `scroll-padding-right: 32px`
- `overflow-x: auto`; `overscroll-behavior-x: contain`; `scrollbar-width: none`
- `flex-wrap: wrap` **only** under `@media (pointer: fine)`

### Card `<a>`
- width `680px`, height `776px`; `scroll-snap-align: start`; `outline-offset: -1px`
- Default width `calc(100% * 3/4 - 1/4 * 16px)`; under `pointer: fine` →
  `calc(100% * 1/2 - 1/2 * 16px)` = **680px** at the 1376px track content width
- Same expression applied to `min-width`

### Card image
- width `680px`, height `680px`, `aspect-ratio: 1 / 1`, `object-fit: cover`

### Card text `<p>`
- width `680px`, height `96px`; `padding: 24px` (from `md:hover-hover:p-24`);
  16px below 820px. Note this is a **device-capability** rule, not a hover rule.
- `.text-c1`: font-size `18px` / line-height `24px` / letter-spacing `0.36px`
- `<strong>`: same size, `font-weight: 700`, inline, height `24px`
- `<span.line-clamp-3>`: `display: -webkit-box; -webkit-box-orient: vertical;
  -webkit-line-clamp: 3; overflow: hidden`, `display: flow-root` computed, width `632px`
  (= 680 − 2 × 24 padding)

## States & Behaviors

### Card hover
- **Trigger:** `:hover` on the card `<a>`, gated by `@media (hover: hover)`
- **Before:** `outline: none`
- **After:** `outline: solid max(.1rem,1px) rgb(0,0,0)`, `outline-offset: -1px`
- **Transition:** none — instant
- Nothing else changes: no scale, no shadow, no image zoom, no colour shift

### Scroll snap
- User-driven only. No autoplay, no timer, no indicator dots, no arrows.

## Assets **[SUB]**
No images downloaded. Each card image → `<MediaPlaceholder ratio="1/1" label="产品图 1:1">`
(or `工程实景 1:1` for the project cards): `background: rgb(var(--c-aluminum))`, 12px centred label.

## Text Content **[SUB]** — Canton Hyland placeholders

### Instance 2 — heading "Two ways to source our products"
| Card | `<strong>` | `<span>` |
|---|---|---|
| 1 | "For distributors" | "Order from the Canton Hyland export catalogue" |
| 2 | "For specifiers" | "Configure and schedule hardware in the CH Project Planner" |

### Instance 8 — no heading (preceded by the "Projects" text module)
| Card | `<strong>` | `<span>` |
|---|---|---|
| 1 | "Riverside Tower, Guangzhou" | "Ambit Architects" |
| 2 | "Nanhai Civic Library, Foshan" | "Studio Kepler Partners" |

### Instance 16 — no heading (preceded by the "Service" text module)
| Card | `<strong>` | `<span>` |
|---|---|---|
| 1 | "Get in Touch!" | "We'll match you with the right export engineer" |
| 2 | "Frequently Asked Questions" | "Quick answers on grades, standards and lead times" |

## Responsive Behavior
- **≥1376 (`xl`):** 2 cards at 680px side by side (wrapped, `pointer: fine`); card padding 24px
- **820–1375 (`md`):** same 2-up layout; padding 24px; heading `mb-48`
- **744–819 (`sm`):** touch layout — 3/4-width snap carousel; padding 16px; heading `mb-24`
- **<744:** 3/4-width snap carousel, `px-outset` 16px, `scroll-padding-left` 16px
