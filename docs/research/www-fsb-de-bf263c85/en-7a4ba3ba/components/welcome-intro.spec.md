# WelcomeIntro Specification

## Overview
- **Target file:** `src/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/WelcomeIntro.tsx`
- **Interaction model:** static at desktop. One accordion that is **permanently open at ≥744px** —
  its toggle button is `sm:hidden` and the panel is forced open by `sm:!block sm:!h-auto`.
- **Position:** `main`'s second child, between the two `.modules` containers. Height 636px @1512px.
- Not a `data-content-module` — it is a page-level intro block.

## DOM Structure
```
div.layout   (margin-top from main's space-y-136)
├── div.grid.w-full.grid-cols.gap-x.gap-y-24.xl:gap-y-96  [grid-column: content]
│   ├── #slot-1  .col-span-full.row-start-1.grid.grid-cols-subgrid
│   │            .sm:col-span-4.md:col-span-6.xl:col-span-12.xl:col-start-1
│   │   └── div.col-span-6.row-start-1.xl:col-span-10
│   │       └── h1.text-h1  →  "Welcome" <br> <span.text-h1-light>…</span>
│   ├── #slot-2  .col-span-full.grid.grid-cols-subgrid.gap
│   │            .sm:col-span-4.md:col-span-6.xl:col-span-6.xl:row-span-2
│   │   └── section.copy.col-span-full.xl:col-span-5
│   │       └── div.copy > div  (single prose paragraph)
│   └── #slot-4  .col-span-full.!-col-end-1.grid.grid-cols-subgrid.gap
│                .sm:col-span-4.md:col-span-6.xl:row-span-2.xl:col-span-6
│       └── section.col-span-full > section > div.w-full
│           └── div[role=region]
│               ├── button.mb-24.flex.w-full.justify-between.gap-x-24.text-left
│               │        .sm:cursor-default.sm:hidden
│               │   ├── h3.text-h3  "More links"
│               │   └── span.flex.h-leading-h3.place-items-center
│               │            .transition-transform.duration-300.sm:hidden
│               │       └── svg (18 × 10 chevron, w-16)
│               └── div.sm:!block.sm:!h-auto            ← x-show / x-collapse
│                   └── ul.flex.flex-col.gap-36.pointer-fine:gap-16
│                       └── li × 3 → ArrowLink
└── #slot-5.mt-48  [grid-column: content]
    └── div.mt-48.grid.gap-x.gap-y-48.sm:grid-cols-2
        └── div.-col-end-1.grid.grid-cols-12.gap-x
            ├── div.col-span-6            → decorative graphic (svg 306 × 156, w-[92.17%])
            ├── div.col-span-6.flex.flex-col.justify-between.text-c1
            │   ├── p  (company name, 2 lines via <br>)
            │   └── svg signature (87 × 46, w-[min(8.57rem, 11.552083vw)] sm:w-[min(8.57rem, 5.95208333vw)])
            └── div.col-span-6.-col-end-1.mt-48.text-c1  → caption
```

## Computed Styles (exact @1512px)

### Main grid
- `grid-column: content` → width `1376px`, x `61`, height `312px`
- `grid-template-columns: repeat(24, 42px)`; `gap: 96px 16px` (`gap-y-24` → 24px below 1376)

### `#slot-1` — headline
- `grid-column: 1 / span 12` → width `680px`, height `64px`
- Inner: `grid-column: span 10 / span 10` → width `564px`
- `h1.text-h1`: font-size `26px`, line-height `32px`, letter-spacing `0.52px`, weight `700`,
  **font-family Traffic → Archivo [SUB]**
- `span.text-h1-light`: same size/leading/tracking, `font-weight: 400`, width `541px`, height `26px`
- Structure is `Welcome<br><span>…</span>` — one `h1`, two visual lines, second line lighter

### `#slot-2` — copy
- `grid-column: span 6 / span 6` → width `332px`, height `312px`, `gap: 16px`
- `section.copy`: `grid-column: span 5 / span 5` → width `274px`
- `.copy`: font-size `18px` / line-height `24px` / letter-spacing `0.36px` / weight `400`;
  13 lines at 274px width

### `#slot-4` — "More links"
- `grid-column: span 6 / -1` → width `332px`, x `1105`, height `312px`, `gap: 16px`
- Toggle button: `display: none` at ≥744px (`sm:hidden`); when visible `margin-bottom: 24px`,
  `display: flex`, `justify-content: space-between`, `column-gap: 24px`, `text-align: left`
- Chevron span: `height: var(--leading-h3)` (24px), `transition-property: transform`,
  `transition-duration: 300ms`; `rotate(180deg)` when expanded
- List: `display: flex`, `flex-direction: column`, `gap: 36px`; **`gap: 16px` under `pointer: fine`**
- Measured open list height at desktop: `104px` (3 × 24px + 2 × 16px)

### `#slot-5` — signature row
- `margin-top: 48px`; inner wrapper `margin-top: 48px` again → 96px total above the row
- Inner grid: `grid-template-columns: 680px 680px` (`sm:grid-cols-2`), `gap: 48px 16px`
- Right cell only (`-col-end-1`): width `680px`, x `757`, `grid-template-columns: repeat(12, 42px)`,
  `column-gap: 16px`
  - Graphic cell `col-span-6`: width `332px`, graphic rendered `306 × 156` at `w-[92.17%]`
  - Text cell `col-span-6`: width `332px`, `display: flex`, `flex-direction: column`,
    `justify-content: space-between`, height `156px`
    - `p.text-c1`: 2 lines, height `48px`
    - Signature graphic: rendered `86 × 45`, y offset `110` within the cell
  - Caption cell `col-span-6 -col-end-1`, `margin-top: 48px`, height `24px`, `.text-c1`

## States & Behaviors

### Accordion (mobile only)
- **Trigger:** click on the toggle button (Alpine `x-on:click="expanded = !expanded"`)
- **State A (collapsed):** panel `display: none; height: 0; overflow: hidden`; chevron `rotate(0)`
- **State B (expanded):** panel `display: block; height: auto`; chevron `rotate(180deg)`
- **Transition:** chevron `transform 300ms`; panel height animated by Alpine's `x-collapse`
- **At ≥744px:** button removed from the flow (`sm:hidden`), panel forced open
  (`sm:!block sm:!h-auto`). **Desktop renders no interactive state at all** — implement the
  toggle as a `useState` accordion so the mobile markup is honest, but it is invisible at desktop.

### Hover
- The three list ArrowLinks: `underline`, offset 4px, no transition. Nothing else.

## Assets **[SUB]**
Both decorative SVGs are original artwork belonging to the target and are **not copied**:
- 306 × 156 graphic → `<MediaPlaceholder ratio="306/156" label="装饰图形 306:156">`
- 87 × 46 signature → `<MediaPlaceholder ratio="87/46" label="签名图形 87:46">`

## Text Content **[SUB]** — Canton Hyland placeholders
Line counts matched to the original so the 312px block height is preserved.

| Slot | Clone text |
|---|---|
| h1 line 1 (bold) | "Welcome" |
| h1 line 2 (light) | "From a Guangdong Workshop to Specified Hardware Worldwide" |
| Copy | "Canton Hyland builds door locks and architectural hardware for people who read the submittal before they read the brochure. Mortise locks, levers, closers and exit devices — tested to ANSI/BHMA Grade 3 and produced under ISO 9001. Every family ships with the schedules, finishes and certification paperwork an overseas specifier actually has to file. Welcome to hardware that survives the approval process." (13 lines at 274px) |
| Accordion heading | "More links" |
| List | "Project Planner" · "The Canton Hyland Product Overview" · "Careers" |
| Company name | "Canton Hyland Hardware<br>Manufacturing Co., Ltd" |
| Caption | "Grip and Grain" |

## Responsive Behavior
- **≥1376 (`xl`):** `gap-y-96`; h1 block `col-span-12` / inner `col-span-10`; copy and links panes
  `col-span-6` each, both `row-span-2`; copy section `col-span-5`
- **820–1375 (`md`):** panes `col-span-6` of 24 (half the earlier width); `gap-y-24`
- **744–819 (`sm`):** panes `col-span-4`; accordion still forced open
- **<744:** everything `col-span-full` and stacked; accordion collapsed with a visible toggle;
  list `gap-36` on touch; `#slot-5` grid drops to one column
