# TextModule + Spacer + ArrowLink + MediaPlaceholder Specification

Four small primitives, specced together because each is under 30 lines.

---

# 1. TextModule

- **Target file:** `src/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/TextModule.tsx`
- **Interaction model:** static
- **Instances:** 3 (page modules 6, 14, 18) — heights 120 / 96 / 96

## DOM
```
div.layout [data-content-module="text"]
└── div.grid.w-full.grid-cols.gap  [grid-column: content]
    ├── div.col-span-full.grid.grid-cols-subgrid.items-start.gap.gap-y-24.self-start
    │      .sm:col-span-4.md:col-span-6.xl:col-span-12
    │   └── div.col-span-full.space-y-24.xl:col-span-6
    │       └── h2.text-h3
    └── div.col-span-full.grid.grid-cols-subgrid.gap.sm:col-span-4.md:col-span-6.xl:col-span-12
        └── section.col-span-full.copy
            ├── p
            └── ArrowLink (mt-24)
```

## Computed styles @1512px
- Outer grid: `grid-column: content`, width `1376`, x `61`, `repeat(24, 42px)`, `gap: 16px`
- Left half: `grid-column: span 12 / span 12` → width `680px`, x `61`, height `24px`,
  `gap: 24px 16px`, `align-items: start`, `align-self: start`
  - Heading cell: `grid-column: span 6 / span 6` → width `332px`
  - `h2.text-h3`: font-size `18px` / line-height `24px` / weight `700` / letter-spacing `0.36px`
- Right half: `grid-column: span 12 / span 12` → width `680px`, x `757`, `gap: 16px`
  - `section.copy`: `grid-column: 1 / -1`, width `680px`
  - `p`: font-size `18px` / line-height `24px` / weight `400` / letter-spacing `0.36px`;
    heights measured `72px` (3 lines, module 6) and `48px` (2 lines, modules 14 & 18)
  - `ArrowLink`: `margin-top: 24px`, height `24px`

## Text content **[SUB]**
| # | Heading | Body | Link |
|---|---|---|---|
| 6 | "Projects – Where Canton Hyland Takes Shape" | 3 lines: sectors served (offices, hotels, residences, schools, civic buildings) | "Overview" |
| 14 | "Service + Downloads" | 2 lines: technical guidance, submittal support, BIM files | "Our Services at a Glance" |
| 18 | "Insights" | 2 lines: notes on standards, finishes and specification practice | "Inspiring Insights" |

## Responsive
- **≥1376:** two `col-span-12` halves; heading cell `col-span-6`
- **820–1375:** two `col-span-6` halves
- **744–819:** `col-span-4` halves
- **<744:** stacked, full width

---

# 2. Spacer

- **Target file:** `src/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/Spacer.tsx`
- **Interaction model:** static
- **Instances:** 9

## DOM (verbatim from source)
```html
<div class="layout" data-content-module="spacer">
  <div class="grid grid-cols-1 grid-rows-1 justify-items-center items-center">
    <div class="col-start-1 row-start-1 h-[var(--spacer-height)] w-full"
         style="--spacer-default: var(--space-96); --spacer-md: var(--space-136); --spacer-lg: var(--space-384)">
    </div>
  </div>
</div>
```

`--spacer-height` cascades: `var(--spacer-xl, var(--spacer-lg, var(--spacer-md, var(--spacer-sm,
var(--spacer-default)))))`, with each `--spacer-{sm,md,lg,xl}` defaulting to its `*-fallback: 0px`
and being re-declared at the matching breakpoint. Reproduce by declaring `--spacer-height` per
breakpoint in the stylesheet.

## Measured heights @1512px
| Page module | default | sm | md | lg | xl | rendered |
|---|---|---|---|---|---|---|
| 3 | 96 | — | — | — | — | 96 |
| 5 | 96 | — | 136 | 384 | — | 384 |
| 7 | 48 | — | — | — | — | 48 |
| 9 | 96 | — | 136 | 288 | — | 288 |
| 11 | 96 | — | 136 | 288 | — | 288 |
| 13 | 96 | — | 192 | — | 288 | 288 |
| 15 | 48 | — | — | — | — | 48 |
| 17 | 96 | — | 192 | — | 288 | 288 |
| 19 | 48 | — | — | — | — | 48 |

---

# 3. ArrowLink

- **Target file:** `src/components/sites/www-fsb-de-bf263c85/shared/ArrowLink.tsx`
- **Interaction model:** static + hover underline
- **Occurrences:** ~15 across heroes, text modules, welcome block and footer

## DOM
```html
<a class="relative hover:underline underline-offset-4 inline-block pl-12 text-c1">
  <svg class="absolute left-0 top-[.3rem] h-auto w-8" viewBox="0 0 6 10" fill="none">…</svg>
  <span>Label</span>
</a>
```

## Computed styles @1512px
- `display: inline-block`; `position: relative`; `padding-left: 12px`; height `24px`
- Label: font-size `18px` / line-height `24px` / weight `400` / letter-spacing `0.36px` / `rgb(0,0,0)`
- Chevron svg: `position: absolute`; `left: 0`; `top: 3px`; width `8px`; rendered box `8 × 13`;
  `viewBox="0 0 6 10"`; single `path`, stroke-less fill in `currentColor`
- Measured widths: "Learn more" 103px, "Overview" 85px, "Download here" 132px,
  "Our Services at a Glance" 207px, "Sign-up here" ~110px

## Hover
- `text-decoration: none → underline`, `text-underline-offset: 4px`, **no transition**
- Inside a hero, also fires from the parent `.group` (`group-hover:underline`)

## Asset **[SUB]**
The chevron is a trivial geometric glyph, redrawn (not traced): `M1 1 L5 5 L1 9` as a filled
right-pointing triangle in a `0 0 6 10` viewBox, `fill: currentColor`.

---

# 4. MediaPlaceholder **[SUB] — clone-only component**

- **Target file:** `src/components/sites/www-fsb-de-bf263c85/shared/MediaPlaceholder.tsx`
- Stands in for every `<picture>` / `<img>` / decorative `<svg>` on the page. **No target asset is
  downloaded.**

## Required behaviour
- Renders a `div` with `aspect-ratio` set to the **original** ratio, passed as a prop
- `width: 100%`; `background-color: rgb(var(--c-aluminum))` → `#E7E7E7`
- Centred label, `--text-c2` (12px / 16px / letter-spacing 0.24px), `color: rgb(0 0 0 / .55)`,
  `text-align: center`, `padding: 8px`
- No border, no radius — matches the site's hard-rectangle language
- `role="img"` + `aria-label` carrying the same label text

## Ratios in use
`2880/1391`, `2880/1481`, `2880/1920`, `2880/1757`, `1940/1293`, `1/1`, `306/156`, `87/46`

## Labels in use
`工程实景 2880:1391` · `产品图 2880:1481` · `工程实景 3:2` · `人物访谈 2880:1757` ·
`产品图 3:2` · `产品图 1:1` · `工程实景 1:1` · `装饰图形 306:156` · `签名图形 87:46`
