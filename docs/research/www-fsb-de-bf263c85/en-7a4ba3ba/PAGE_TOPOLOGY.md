# Page Topology — www.fsb.de/en/

Reference viewport 1512×900. Total document height 10 837px.

## Shell

```
<body>
  <div class="flex min-h-screen flex-col justify-between">
    <div class="sticky z-10 -top-[var(--h-main-nav-banner)] bg-white">   ← header, 136px
    <main class="isolate mt-48 lg:mt-192 space-y-48 lg:space-y-136">     ← 10 101px
    <div class="mt-48 sm:mt-96">                                          ← footer, 313px
```

- `main` top margin: 48px below `lg`, **192px** at ≥1032px.
- `main` vertical rhythm between its three direct children: `space-y-136` at ≥1032px (48px below).

`main` has exactly three children:

| # | Element | Height | Contents |
|---|---|---|---|
| 1 | `.modules.mb-96` | 1 800 | hero + page-teaser |
| 2 | `.layout` (no `data-content-module`) | 636 | Welcome intro block |
| 3 | `.modules` | 7 393 | the remaining 18 modules |

## Module inventory

The whole page is assembled from **four** module types, tagged `data-content-module`.

| Order | Type | Top | Height | Working name |
|---|---|---|---|---|
| 1 | `hero` | 328 | 816 | Hero — headline promo |
| 2 | `page-teaser` | 1 280 | 848 | "Two ways to our products" (2 cards) |
| — | *(Welcome intro)* | 2 264 | 636 | h1 + copy + "More links" + signature row |
| 3 | `spacer` | 3 036 | 96 | 96 |
| 4 | `hero` | 3 132 | 909 | Product collection overview |
| 5 | `spacer` | 4 040 | 384 | 96 / md 136 / lg 384 |
| 6 | `text` | 4 424 | 120 | "Projects – Where FSB Takes Shape" |
| 7 | `spacer` | 4 544 | 48 | 48 |
| 8 | `page-teaser` | 4 592 | 776 | Project cards (2) |
| 9 | `spacer` | 5 368 | 288 | 96 / md 136 / lg 288 |
| 10 | `hero` | 5 656 | 646 | "Designed By" — **side variant** |
| 11 | `spacer` | 6 302 | 288 | 96 / md 136 / lg 288 |
| 12 | `hero` | 6 590 | 1 224 | "About Us" |
| 13 | `spacer` | 7 814 | 288 | 96 / md 192 / xl 288 |
| 14 | `text` | 8 102 | 96 | "Service + Information" |
| 15 | `spacer` | 8 198 | 48 | 48 |
| 16 | `page-teaser` | 8 246 | 776 | Contact / FAQ cards (2) |
| 17 | `spacer` | 9 022 | 288 | 96 / md 192 / xl 288 |
| 18 | `text` | 9 310 | 96 | "Magazine" |
| 19 | `spacer` | 9 406 | 48 | 48 |
| 20 | `hero` | 9 454 | 975 | Chipperfield interview |

Counts: 5 × hero, 3 × page-teaser, 3 × text, 9 × spacer, 1 × Welcome intro.

## Module anatomy

### `hero` — variant A "stacked" (modules 1, 4, 12, 20)
Nested `.layout` × 3, all bands `outset` → media spans the 1440px outset band while the caption row
sits on the 1376px content band.

```
.layout > .layout-outset > .layout > .layout-outset.group.relative
    ├── .layout
    │     ├── .layout-outset.px-outset.md:px-0        ← <picture>, mb-16 / md:mb-48
    │     └── .grid.grid-cols.gap-x  [grid-column: content]
    │           └── .col-span-full.grid.grid-cols-subgrid.gap-x.gap-y-16
    │                 ├── div.col-span-full.md:col-span-5.xl:col-span-6   → h3 + p
    │                 └── div.col-span-full.md:col-span-3.md:-col-end-1.xl:col-span-6.xl:-col-end-1 → ArrowLink
    └── <a class="absolute inset-0 -mb-outset pb-outset">   ← whole-card hit area + hover outline
```
Media widths measured: 1440 × 696 / 741 / 960 / 879.

### `hero` — variant B "side" (module 10)
Single 24-col grid on the content band; no popout.

```
.layout > .layout-outset > .layout > .group.relative.grid.grid-cols.gap-x  [grid-column: content]
    ├── div.col-span-full.mb-16 md:col-span-8 md:-col-end-1 md:mb-0 xl:col-span-17   ← <picture> 970×646
    ├── div.col-span-full.grid.grid-cols-subgrid.gap-x.gap-y-16 md:order-first md:col-span-3 xl:col-span-7
    │     ├── div.md:row-start-1.col-span-full.xl:col-span-6   → h3 + p
    │     └── div.col-span-full.mt-auto.md:mb-48               → ArrowLink (pinned to bottom)
    └── <a class="absolute inset-0">
```

### `page-teaser` (modules 2, 8, 16)
Optional `h2.text-h3.mb-24 md:mb-48` on the content band, then a full-outset horizontal snap track.

```
.layout
  ├── h2.text-h3.mb-24.md:mb-48          [grid-column: content]   (module 2 only)
  └── .layout-outset  [grid-column: outset]
        └── .flex.gap-16.px-outset.pointer-fine:flex-wrap.horizontal-snap
            .snap-x.snap-mandatory.scroll-px-outset.overflow-auto
            .overscroll-x-contain.[scrollbar-width:none]
              └── <a> × 2   w-grid-3/4 min-w-grid-3/4 pointer-fine:w-grid-1/2 snap-start
                    ├── <img class="w-full h-auto object-cover aspect-square">   680×680
                    └── <p class="pt-16 md:pt-24 hover-hover:p-16 md:hover-hover:p-24 text-c1">
                          <strong>title</strong><br><span class="line-clamp-3">subtitle</span>
```
Card is 680 × 776 (680 image + 96 text incl. 24px padding box).

### `text` (modules 6, 14, 18)
Two 12-column halves on the content band.

```
.layout > .grid.grid-cols.gap  [grid-column: content]
    ├── div.col-span-full.grid.grid-cols-subgrid.items-start.gap.gap-y-24.self-start
    │       .sm:col-span-4 .md:col-span-6 .xl:col-span-12
    │     └── div.col-span-full.space-y-24.xl:col-span-6 → h2.text-h3
    └── div.col-span-full.grid.grid-cols-subgrid.gap .sm:col-span-4 .md:col-span-6 .xl:col-span-12
          └── section.col-span-full.copy → <p> + ArrowLink (mt-24)
```

### `spacer` (9×)
```html
<div class="layout" data-content-module="spacer">
  <div class="grid grid-cols-1 grid-rows-1 justify-items-center items-center">
    <div class="col-start-1 row-start-1 h-[var(--spacer-height)] w-full"
         style="--spacer-default: var(--space-96); --spacer-md: …; --spacer-lg: …; --spacer-xl: …">
```
`--spacer-height` resolves per breakpoint from `--spacer-{default,sm,md,lg,xl}` with `*-fallback: 0px`.

### Welcome intro (not a `data-content-module`)
```
.layout > .grid.grid-cols.gap-x.gap-y-24.xl:gap-y-96   [grid-column: content]
    ├── #slot-1  col-span-full row-start-1 xl:col-span-12 xl:col-start-1
    │     └── div.col-span-6.row-start-1.xl:col-span-10 → h1.text-h1 "Welcome" <br> <span.text-h1-light>…</span>
    ├── #slot-2  xl:col-span-6 xl:row-span-2 → section.copy.xl:col-span-5
    └── #slot-4  xl:col-span-6 !-col-end-1  → accordion "More links"
          • <button class="… sm:hidden"> toggle (mobile only, ≥744px always open)
          • <ul class="flex flex-col gap-36 pointer-fine:gap-16"> 3 ArrowLinks
.layout > #slot-5.mt-48  [grid-column: content]
    └── .mt-48.grid.gap-x.gap-y-48.sm:grid-cols-2
          └── .-col-end-1.grid.grid-cols-12.gap-x
                ├── .col-span-6 → decorative SVG 306×156
                └── .col-span-6.flex.flex-col.justify-between.text-c1
                      ├── <p> company name, 2 lines
                      └── signature SVG 87×46
          (+ .col-span-6.-col-end-1.mt-48.text-c1 caption)
```

## Header

`position: sticky; top: -48px; z-index: 10; background: #fff` — total 136px.

- **Promo banner** `<a>`: `h-48`, `bg-highlight`, `.layout` grid; inner
  `grid grid-cols-1 lg:grid-cols-4 items-center gap-16`; label `span.-col-end-1.text-c1
  underline-offset-4 group-hover:underline max-lg:text-center`.
- **Nav bar** `.layout.z-30.bg-white`, h-88: inner `grid grid-cols items-center gap-x gap-y-24 pt-32 pb-8`
  - `div.col-span-full.max-xl:hidden.sm:col-span-4.md:col-span-6.xl:col-span-12`
    → `nav.flex.gap-64` with 4 links `text-c1 underline-offset-4 hover:underline`
  - `div.col-span-full.grid.grid-cols-2.content-start.justify-between.gap-x.gap-y-24.xl:col-span-12`
    → logo `<a href="/" class="flex-shrink-0">` (svg `h-16 w-auto pr-8 sm:h-24`)
    → `nav.flex.flex-grow.justify-end.gap-32`: language button (icon + `span.text-c2` "DE | EN"),
      search button, menu button `.stack` (two stacked SVGs)
  - `div.col-span-full.max-xs:hidden` → breadcrumb `nav.flex.items-center.gap-4.text-c2` (empty on `/`)

Three overlays live inside the header and are `display:none` at rest: main-nav modal
(`absolute bottom-0 inset-x-0 translate-y-full overflow-y-auto bg-white`, max-height
`calc(100vh - var(--h-main-nav-banner) - var(--space-48))`), language modal and search modal
(both `fixed inset-0 z-10` with a `bg-gray/50` scrim and a centred `bg-white px-32 py-48` panel).

## Footer

```
div.mt-48.sm:mt-96
  └── div.layout-outset.border-t.border-black.py-48
        └── .layout > .grid.grid-cols.grid-rows.gap-x.gap-y-48.md:gap-y-96
              ├── nav  md:col-span-7 lg:col-span-8 xl:col-span-12
              │     └── ul  gap-y-20 md:flex md:flex-wrap md:gap-x-64
              │           4 × li > a.underscore.text-c1
              ├── div  col-span-2 sm:col-span-4 md:col-span-7 md:row-start-2 lg:col-span-8
              │        lg:grid lg:grid-cols-2 lg:gap-x xl:col-span-12  gap-y-24
              │     h3.text-h3.md:hidden + p.text-c1 + ArrowLink
              └── div  col-span-2 sm:col-span-4 md:-col-end-1 md:row-span-2
                       lg:col-span-3 lg:-col-end-1 xl:col-span-4 xl:-col-end-1  space-y-24
                    h3.text-h3 + ul.space-y-24 (4 × ArrowLink)
```

## z-index layers

| z | Element |
|---|---|
| 10 | sticky header wrapper; language/search modal wrappers; main-nav dropdown |
| 30 | nav bar (`.layout.z-30.bg-white`) — sits above the dropdown so the dropdown slides out beneath it |
| auto | everything in `main` (`main` is `isolate`, so module stacking is contained) |
