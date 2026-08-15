# HeroModule Specification

## Overview
- **Target file:** `src/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/HeroModule.tsx`
- **Interaction model:** static. Whole module is one link with a hover outline.
- **Instances:** 5 — four `variant="stacked"`, one `variant="side"`.

## Variant A — `stacked` (page modules 1, 4, 12, 20)

### DOM
```
div.layout [data-content-module="hero"]
└── div.layout-outset  [grid-column: outset]
    └── div.layout
        └── div.layout-outset.group.relative  [grid-column: outset]
            ├── div.layout
            │   ├── div.layout-outset.px-outset.md:px-0  [grid-column: outset]
            │   │   └── div.col-span-full.mb-16.md:mb-48  → media placeholder
            │   └── div.grid.w-full.grid-cols.gap-x  [grid-column: content]
            │       └── div.col-span-full.grid.grid-cols-subgrid.gap-x.gap-y-16
            │           ├── div.col-span-full.md:col-span-5.xl:col-span-6  → h3 + p
            │           └── div.col-span-full.md:col-span-3.md:-col-end-1.xl:col-span-6.xl:-col-end-1 → ArrowLink
            └── a.absolute.inset-0.-mb-outset.pb-outset.outline-offset
                  .hover-hover:group-hover:outline
                  .hover-hover:group-hover:outline-1
                  .hover-hover:group-hover:outline-black
```

### Computed styles @1512px
- Outer `.layout`: width `1497`, `grid-template-columns: [full-start] 0px [popout-start] 28.5714px [outset-start] 32px [content-start] 1376px [content-end] 32px [outset-end] 28.5714px [popout-end] 0px [full-end]`
- `.layout-outset` band: width `1440px`, x `29px`
- Media wrapper: width `1440px`, `margin: 0 0 48px` (`mb-16` → 16px below 820px)
- Media: `width: 100%`, `object-fit: cover`
- Caption grid: width `1376px`, x `61`, `grid-template-columns: repeat(24, 42px)`, `column-gap: 16px`
- Caption subgrid: `gap: 16px`
- Left cell: `grid-column: span 6 / span 6` → width `332px`
  - `h3.text-h3`: font-size `18px` / line-height `24px` / weight `700` / letter-spacing `0.36px` / color `rgb(0,0,0)`
  - `p.text-c1`: font-size `18px` / line-height `24px` / weight `400` / letter-spacing `0.36px`
- Right cell: `grid-column: span 6 / -1` → width `332px`, x `1105`
- Overlay `<a>`: `position: absolute; inset: 0; padding-bottom: 32px; margin-bottom: -32px`
  (extends the hit area / outline into the gap below the module)

### Per-instance measurements
| # | Media box | aspect-ratio | Caption block height | Body copy |
|---|---|---|---|---|
| 1 | 1440 × 696 | `2880 / 1391` | 72 | 1 line |
| 4 | 1440 × 741 | `2880 / 1481` | 120 | 4 lines |
| 12 | 1440 × 960 | `2880 / 1920` (3:2) | 216 | 8 lines |
| 20 | 1440 × 879 | `2880 / 1757` | 48 | none (title wraps to 2 lines) |

## Variant B — `side` (page module 10)

### DOM
```
div.layout [data-content-module="hero"]
└── div.layout-outset
    └── div.layout
        └── div.group.relative.grid.grid-cols.gap-x  [grid-column: content]
            ├── div.col-span-full.mb-16.md:col-span-8.md:-col-end-1.md:mb-0.xl:col-span-17  → media
            ├── div.col-span-full.grid.grid-cols-subgrid.gap-x.gap-y-16
            │      .md:order-first.md:col-span-3.md:grid-rows.xl:col-span-7
            │   ├── div.md:row-start-1.col-span-full.xl:col-span-6  → h3 + p
            │   └── div.col-span-full.mt-auto.md:mb-48               → ArrowLink
            └── a.absolute.inset-0.outline-offset-outset
                  .hover-hover:group-hover:outline
                  .hover-hover:group-hover:outline-1
                  .hover-hover:group-hover:outline-black
```

### Computed styles @1512px
- Content grid: width `1376px`, x `61`, height `646px`, `repeat(24, 42px)`, `column-gap: 16px`
- Media cell: `grid-column: span 17 / span 17` → width `970px`, x `467`, height `646px`,
  `aspect-ratio: 1940 / 1293` (3:2), `object-fit: cover`
- Text cell: `grid-column: span 7 / span 7` → width `390px`, x `61`, `gap: 16px`, subgrid of 8 tracks
  - Title block: `grid-column: span 6 / span 6` → width `332px`, height `48px` (h3 24 + p 24)
  - Link block: `grid-column: 1 / -1`, `margin-top: auto`, `margin-bottom: 48px` → y offset `574` within the module

## States & Behaviors

### Hover (whole module)
- **Trigger:** `:hover` on `.group`, gated by `@media (hover: hover)`
- **Before:** `outline: none`
- **After:** `outline: solid max(.1rem, 1px) rgb(0,0,0)`;
  offset `max(-.1rem, -1px)` (variant A) / `calc(-1 * var(--layout-outset))` (variant B)
- **Transition:** none — instant
- Caption `ArrowLink` simultaneously gains `text-decoration: underline` via `group-hover:underline`

No other states. Not scroll-driven, not click-driven, no per-state content.

## Assets **[SUB]**
No images downloaded. Each `<picture>` becomes `<MediaPlaceholder>`:
`background: rgb(var(--c-aluminum))` (#E7E7E7), original `aspect-ratio` preserved verbatim, centred
label in `--text-c2` (12px/16px, letter-spacing 0.24px), colour `rgb(0 0 0 / .55)`.

Labels: `工程实景 2880:1391`, `产品图 2880:1481`, `工程实景 3:2`, `人物访谈 2880:1757`, `产品图 3:2`.

## Text Content **[SUB]** — Canton Hyland placeholders
Character counts held close to the original so wrapping and block heights match.

| # | Title | Body | Link |
|---|---|---|---|
| 1 | "Canton Hyland CH-1138 Lever Relaunch" | "The mortise lock range returns." | "Learn more" |
| 4 | "The Canton Hyland Product Collection Overview" | 4-line paragraph on ANSI Grade 3 / ISO 9001 sourcing | "Learn more" |
| 12 | "About Us" | 8-line paragraph on Guangdong manufacturing, export to architects | "Learn more" |
| 20 | "Specifying Hardware for Export Projects" | — | "Learn more" |
| 10 | "Designed For" / "Four certified product families" | — | "Download here" |

## Responsive Behavior
- **Variant A ≥1376:** caption halves `col-span-6` + `col-span-6 -col-end-1`
- **Variant A 820–1375:** `col-span-5` + `col-span-3 -col-end-1`; media loses side padding (`md:px-0`), `mb-48`
- **Variant A <820:** caption stacks full width; media inset by `px-outset`; `mb-16`
- **Variant B ≥1376:** image `col-span-17`, text `col-span-7`
- **Variant B 820–1375:** image `col-span-8 -col-end-1`, text `col-span-3` with `order: -1`
- **Variant B <820:** stacked, image first, `mb-16`, link no longer pinned to bottom
