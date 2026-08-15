# SiteFooter Specification

## Overview
- **Target file:** `src/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/SiteFooter.tsx`
- **Interaction model:** static + `.underscore` hover underline (the page's only 300ms hover transition)
- **Height:** 313px @1512px; top margin 48px (`mt-48`), 96px at ≥744px (`sm:mt-96`)

## DOM Structure
```
div.mt-48.flex-grow-0.sm:mt-96
└── div.layout-outset.border-t.border-black.py-48
    └── div.layout
        └── div.grid.grid-cols.grid-rows.gap-x.gap-y-48.md:gap-y-96
            ├── nav.col-span-full.grid.grid-cols-subgrid.md:col-span-7.md:block
            │        .lg:col-span-8.xl:col-span-12
            │   └── ul.col-span-full.grid.grid-cols-subgrid.items-start.gap-x.gap-y-20
            │          .md:flex.md:flex-wrap.md:gap-x-64
            │       └── li.col-span-2.md:col-span-3 × 4
            │           └── a.underscore.inline-block.text-c1
            │               (last one is a <button type="button" class="underscore inline-block
            │                appearance-none text-c1">)
            ├── div.col-span-2.flex.flex-col.items-start.gap-y-24.sm:col-span-4
            │        .md:col-span-7.md:row-start-2.lg:col-span-8.lg:grid.lg:grid-cols-2
            │        .lg:gap-x.xl:col-span-12
            │   ├── h3.text-h3.md:hidden      "Newsletter"
            │   ├── p.text-c1
            │   └── div > ArrowLink
            └── div.col-span-2.space-y-24.sm:col-span-4.md:-col-end-1.md:row-span-2
                     .lg:col-span-3.lg:-col-end-1.xl:col-span-4.xl:-col-end-1
                ├── h3.text-h3     "Social Media"
                └── ul.space-y-24 → li × 4 → ArrowLink
```

## Computed Styles (exact @1512px)
- Outer wrapper: `margin-top: 96px`, `flex-grow: 0`
- `.layout-outset` band: width `1440px`, x `29`;
  `border-top: 1px solid rgb(0,0,0)`; `padding: 48px 0`
- Inner `.layout` → `.grid.grid-cols`: `grid-template-columns: repeat(24, 42px)`;
  `column-gap: 16px`; `row-gap: 96px` (`gap-y-48` → 48px below 820px)
- Link nav: `grid-column: span 12 / span 12` (xl) → width `680px`
  - `ul`: `display: flex`, `flex-wrap: wrap`, `column-gap: 64px`, `row-gap: 20px`
  - `a.underscore`: `.text-c1` → 18px / 24px / 400 / 0.36px; `display: inline-block`;
    `position: relative`; `padding-bottom: 3px`
- Newsletter block: `grid-column: span 12 / span 12` (xl); `row-gap: 24px`;
  at `lg` becomes `display: grid; grid-template-columns: repeat(2, …); column-gap: 16px`
  - `h3.text-h3`: `display: none` at ≥820px (`md:hidden`)
  - `p.text-c1`: 18px / 24px / 400 / 0.36px
- Social block: `grid-column: span 4 / -1` (xl) → width `... / -1`, `row-span: 2` at ≥820px
  - `h3.text-h3`: 18px / 24px / **700** / 0.36px
  - `ul`: children separated by `margin-top: 24px` (`space-y-24`)

## States & Behaviors

### `.underscore` hover — the page's only animated hover
```css
.underscore          { position: relative; padding-bottom: .3rem }
.underscore::after   { content: ""; position: absolute; bottom: 0; left: 0;
                       width: 100%; height: 1px; background-color: currentColor;
                       opacity: 0; transition: .3s }
.underscore:hover::after { opacity: 1 }
```
- **Trigger:** `:hover` (not capability-gated)
- **Before:** `opacity: 0` · **After:** `opacity: 1`
- **Transition:** `.3s` (all properties, default easing)
- Applies to the four legal links only. The ArrowLinks in the newsletter and social blocks use the
  plain `hover:underline` treatment instead — **do not** unify them.

### ArrowLinks
`underline` on hover, offset 4px, instant. See `text-module-spacer-arrowlink.spec.md`.

## Assets
None. No images, no social-platform logos — the social links are text with the shared chevron.

## Text Content **[SUB]** — Canton Hyland placeholders

| Slot | Clone text |
|---|---|
| Legal 1 | "Imprint" |
| Legal 2 | "Newsletter" |
| Legal 3 | "Privacy Notice" |
| Legal 4 (button) | "Data preferences" |
| Newsletter h3 | "Newsletter" |
| Newsletter body | "The Canton Hyland newsletter covers new product families, standards updates and export documentation changes." |
| Newsletter link | "Sign-up here" |
| Social h3 | "Social Media" |
| Social links | "Instagram" · "Pinterest" · "LinkedIn" · "Facebook" |

All four social links point at `#` in the prototype — **no external URLs are carried over**.

## Responsive Behavior
- **≥1376 (`xl`):** nav `col-span-12`, newsletter `col-span-12`, social `col-span-4 -col-end-1`
- **1032–1375 (`lg`):** nav `col-span-8`, newsletter `col-span-8` + `grid-cols-2`, social `col-span-3 -col-end-1`
- **820–1375 (`md`):** nav `col-span-7` + `display: block`; newsletter `col-span-7 row-start-2`;
  social `-col-end-1 row-span-2`; `row-gap: 96px`; newsletter h3 hidden
- **744–819 (`sm`):** newsletter and social `col-span-4`; `row-gap: 48px`; newsletter h3 visible
- **<744:** nav list becomes a 2-column subgrid (`li.col-span-2`, `gap-y-20`); newsletter and
  social `col-span-2`; wrapper `margin-top: 48px`
