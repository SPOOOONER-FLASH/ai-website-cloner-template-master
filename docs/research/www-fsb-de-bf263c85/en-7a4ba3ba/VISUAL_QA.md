# Visual QA — clone vs target

Method: the browser pane could not composite frames in this session, so screenshot diffing was
unavailable. QA was run instead by executing the same measurement script against the live target
(`https://www.fsb.de/en/`) and the running clone (`http://localhost:3000`) at an identical
1512 × 900 viewport, and diffing the numbers. This compares exact geometry rather than rendered
pixels.

## Module geometry — 21/21 exact

Every `data-content-module` plus the Welcome intro, compared on both **top offset** and **height**:

| # | Type | Target top / height | Clone top / height |
|---|---|---|---|
| 1 | hero | 328 / 816 | 328 / 816 |
| 2 | page-teaser | 1280 / 848 | 1280 / 848 |
| 3 | welcome | 2264 / 636 | 2264 / 636 |
| 4 | spacer | 3036 / 96 | 3036 / 96 |
| 5 | hero | 3132 / 909 | 3132 / 909 |
| 6 | spacer | 4040 / 384 | 4040 / 384 |
| 7 | text | 4424 / 120 | 4424 / 120 |
| 8 | spacer | 4544 / 48 | 4544 / 48 |
| 9 | page-teaser | 4592 / 776 | 4592 / 776 |
| 10 | spacer | 5368 / 288 | 5368 / 288 |
| 11 | hero (side) | 5656 / 646 | 5656 / 646 |
| 12 | spacer | 6302 / 288 | 6302 / 288 |
| 13 | hero | 6590 / 1224 | 6590 / 1224 |
| 14 | spacer | 7814 / 288 | 7814 / 288 |
| 15 | text | 8102 / 96 | 8102 / 96 |
| 16 | spacer | 8198 / 48 | 8198 / 48 |
| 17 | page-teaser | 8246 / 776 | 8246 / 776 |
| 18 | spacer | 9022 / 288 | 9022 / 288 |
| 19 | text | 9310 / 96 | 9310 / 96 |
| 20 | spacer | 9406 / 48 | 9406 / 48 |
| 21 | hero | 9454 / 975 | 9454 / 975 |

**Zero mismatches.**

## Shell

| Metric | Target | Clone |
|---|---|---|
| Header height | 136 | 136 |
| Promo banner height | 48 | 48 |
| Sticky `top` | -48px | -48px |
| Footer top | 10525 | 10525 |
| Footer height | 313 | 313 |
| Footer border width (full-bleed) | 1497 | 1497 |
| Document height | 10837 | 10838 |

The 1px document-height difference is sub-pixel rounding on the footer box. No module is affected.

## Layout grid

| Metric | Target | Clone |
|---|---|---|
| `.layout` template | `[full-start] 0px [popout-start] 28.5714px [outset-start] 32px [content-start] 1376px [content-end] 32px [outset-end] 28.5714px [popout-end] 0px [full-end]` | identical (28.5px vs 28.5714px — engine rounding on the same `minmax()`) |
| `.grid-cols` content width | 1376 | 1376 |
| Column track | 42px × 24, 16px gap | 42px × 24, 16px gap |
| Teaser card box | 680 × 776 | 680 × 776 |

## Typography

| Token | Target | Clone |
|---|---|---|
| `.text-h1` | 26px / 32px / w700 / 0.52px | 26px / 32px / w700 / 0.52px |
| `.text-h3` | 18px / 24px / w700 / 0.36px | 18px / 24px / w700 / 0.36px |
| `.text-c1` | 18px / 24px / w400 / 0.36px | 18px / 24px / w400 / 0.36px |
| Family | Trade Gothic Next LT Pro / Traffic | **Archivo** (intended substitution), loaded 400/600/700 |

## Colour

| Surface | Target | Clone |
|---|---|---|
| Promo banner background | `rgb(244, 255, 113)` | **`rgb(26, 26, 26)`** (intended substitution) |
| Promo banner text | `rgb(0, 0, 0)` | **`rgb(255, 255, 255)`** (forced by the substitution — black on #1A1A1A is unreadable) |
| Body / text | `rgb(0, 0, 0)` on white | identical |

## Breakpoints

Verified by resizing to 1375px (one pixel below `xl`): the header nav links switch to
`display: none` and the hero caption drops from `col-span-6` to `col-span-5` (261px) — the
target's exact behaviour at that boundary. The generated stylesheet carries only the seven
requested breakpoints; Tailwind's defaults are cleared.

## Behaviours

| Behaviour | Status |
|---|---|
| Sticky header (`top: -48px`, no shadow/height change) | reproduced, CSS-only |
| Hero whole-module hover outline, `@media (hover: hover)`, instant | rule present |
| Teaser card hover outline, `-outline-offset-1`, instant | rule present |
| Footer `.underscore` fade-in underline, `transition: .3s` | rule present |
| Arrow-link `hover:underline`, offset 4px, no transition | reproduced |
| Teaser `scroll-snap-type: x mandatory` + `pointer-fine` wrap to 2-up | reproduced (cards measure 680px side by side) |
| Accordion chevron `rotate(180deg)`, `duration-300` | reproduced |
| Scroll-reveal animations / smooth-scroll library / parallax | **none on the target** — correctly not added |

## Two implementation deviations from the target's class list

Both were forced by Tailwind v4 semantics and produce the target's resolved values:

1. **`space-y-*` on `<main>`.** The target writes `space-y-48 lg:space-y-136` plus `mb-96` on the
   first block and relies on Tailwind v3's space-y (margin-**top** on later siblings) *collapsing*
   against that `mb-96`. Tailwind v4 emits margin-**bottom** on earlier siblings, where a literal
   `mb-96` overrides it instead of collapsing — which shifted everything below the hero up by 40px.
   Replaced with the explicit resolved margins: `mb-96 lg:mb-136` on the first block,
   `mb-48 lg:mb-136` on the Welcome wrapper.

2. **`.w-grid-1/2` / `.w-grid-3/4`.** The target's fractional teaser widths are hand-written CSS
   classes. A Tailwind variant such as `pointer-fine:` can only be applied to a Tailwind-generated
   utility, so `pointer-fine:w-grid-1/2` silently produced nothing and the cards stacked at 3/4
   width. Rewritten as arbitrary values —
   `w-[calc(100%*3/4-1/4*var(--grid-gap))] pointer-fine:w-[calc(100%*1/2-1/2*var(--grid-gap))]` —
   which restores the 680px 2-up layout.

## Known gaps

1. **Header modals not implemented.** The language, search and mega-menu panels are Alpine.js
   overlays that render `display: none` at rest and never appear in the desktop reference state.
   The three buttons ship as inert visual controls. Implementing them was out of scope for a
   visual prototype; flagged rather than faked.
2. **No screenshots.** See the method note above.
3. **Below 1376px is structurally carried but not visually verified.** The brief is desktop-only.
   All responsive classes were extracted and reproduced, and the 1375px boundary was spot-checked,
   but the 393–1032px range has not been reviewed.
4. **Placeholder copy is calibrated by line count, not by glyph.** Archivo's metrics differ from
   Trade Gothic, so individual line breaks fall in different places even where the block height
   matches exactly.
