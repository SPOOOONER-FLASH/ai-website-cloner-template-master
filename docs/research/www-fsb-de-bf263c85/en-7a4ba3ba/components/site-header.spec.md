# SiteHeader Specification

## Overview
- **Target file:** `src/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/SiteHeader.tsx`
- **Interaction model:** static + CSS-only sticky (see BEHAVIORS.md). No JS scroll listener.
- **Total height:** 136px (48 banner + 88 nav row)

## DOM Structure
```
div.sticky.z-10.flex-grow-0.bg-white   style: top: calc(-1 * var(--h-main-nav-banner))
└── div (layout-full)
    ├── a.layout.group.relative  h-[var(--h-main-nav-banner)] w-full bg-highlight   ← promo banner
    │   └── div.grid.w-full.grid-cols-1.lg:grid-cols-4.items-center.gap-16  [grid-column: content]
    │       └── span.-col-end-1.text-c1.underline-offset-4.group-hover:underline.max-lg:text-center
    └── div.layout.z-30.bg-white                                                     ← nav row
        └── div.relative.grid.w-full.grid-cols.items-center.gap-x.gap-y-24.pt-32.pb-8  [grid-column: content]
            ├── div.col-span-full.max-xl:hidden.sm:col-span-4.md:col-span-6.xl:col-span-12
            │   └── nav.flex.gap-64 → 4 × a.text-c1.underline-offset-4.hover:underline
            ├── div.col-span-full.grid.grid-cols-2.content-start.justify-between.gap-x.gap-y-24.xl:col-span-12
            │   ├── a[href="/"].flex-shrink-0 → wordmark
            │   └── nav.flex.flex-grow.justify-end.gap-32
            │       ├── button.flex.items-center.gap-8.underline-offset-4.hover:underline → GlobeIcon + span.text-c2
            │       ├── button → SearchIcon
            │       └── button.stack → MenuIcon (two stacked SVGs)
            └── div.col-span-full.max-[24.5625em]:hidden → nav.flex.items-center.gap-4.text-c2 (empty on /)
```

## Computed Styles (exact, from getComputedStyle @1512px)

### Sticky wrapper
- position: `sticky`; top: `-48px`; z-index: `10`; background-color: `rgb(255,255,255)`
- height: `136px`; width: `1497px` (full)

### Promo banner `<a>`
- height: `48px`; width: `100%`; display: `grid` (`.layout`)
- background-color: **`#1A1A1A`** — **[SUB]** original was `rgb(244,255,113)`
- color: **`#FFFFFF`** — **[SUB]** original `rgb(0,0,0)`; forced by the accent substitution for legibility
- Inner grid: width `1376px`, x `61px`, display `grid`, `grid-template-columns: repeat(1,…)` →
  `lg:grid-cols-4`, `align-items: center`, `gap: 16px`
- Label span: `grid-column: -2 / -1` (`-col-end-1`), width `332px`, x `1105`, height `24px`, y `12`
  - font-size `18px`, line-height `24px`, font-weight `400`, letter-spacing `0.36px`

### Nav row
- height `88px`; background `rgb(255,255,255)`; z-index `30`; display `grid` (`.layout`)
- Inner: width `1376px`, x `61`, y `48`; display `grid`;
  `grid-template-columns: repeat(24, 42px)`; `gap: 24px 16px`; `align-items: center`;
  `padding: 32px 0px 8px`

### Nav links
- Container `nav`: display `flex`, `gap: 64px`; block width `680px` at x `61`, height `24px`, y `80`
- Each link: font-size `18px` / line-height `24px` / weight `400` / letter-spacing `0.36px`,
  color `rgb(0,0,0)`, `text-underline-offset: 4px`

### Right cluster
- Container: width `680px`, x `757`, y `80`, height `24px`; display `grid`;
  `grid-template-columns: repeat(2, …)`; `justify-content: space-between`; `gap: 24px 16px`
- Wordmark: `h-16 w-auto pr-8 sm:h-24` → 24px tall at ≥744px
- Icon nav: display `flex`, `flex-grow: 1`, `justify-content: flex-end`, `gap: 32px`
- Language button: display `flex`, `align-items: center`, `gap: 8px`;
  label `span.text-c2` → font-size `12px` / line-height `16px` / letter-spacing `0.24px`

### Breadcrumb row
- `grid-column: 1 / -1`, width `1376px`, y `128`, height `0` (empty on the home route)
- hidden below 393px (`max-[24.5625em]:hidden`)

## States & Behaviors

### Sticky pin
- **Trigger:** CSS `position: sticky; top: -48px`. Continuous; fully pinned at `scrollY ≥ 48`.
- **State A (scrollY 0):** banner y 0–48, nav y 48–136
- **State B (scrollY ≥ 48):** banner off-screen, nav pinned y 0–88
- **Transition:** none. No shadow / background / height change. **Do not add one.**
- **Implementation:** a single `sticky` div. No `useEffect`, no scroll handler.

### Hover states
- Nav link: `text-decoration: none → underline`, offset 4px, no transition
- Banner label: `underline` on `.group:hover` (whole 48px bar is the group), no transition
- Language button: `underline` on hover, offset 4px

### Modals (original behaviour, out of scope for this prototype)
Language / search / mega-menu panels exist in the source but render `display: none` at rest and are
driven by Alpine.js. This prototype renders the three buttons as **inert visual controls** — the
brief is a visual prototype, and the panels are never visible in the desktop reference state.
Document this as a known gap rather than faking a partial implementation.

## Assets
- **[SUB]** FSB logo SVG is a registered trademark — **not copied**. Replaced by a text wordmark
  `CANTON HYLAND`, Archivo 700, `letter-spacing: 0.05em`, sized to 24px cap height at ≥744px.
- Icons: `GlobeIcon`, `SearchIcon`, `MenuIcon` — redrawn as generic 24px line icons in
  `shared/icons.tsx`. Not traced from the target.

## Text Content **[SUB]** — placeholder, Canton Hyland
Lengths mirror the original so line-breaking and column widths behave the same.

| Slot | Original (reference, not shipped) | Clone |
|---|---|---|
| Banner label | "Product Finder" (14 ch) | "Product Finder" (14 ch) |
| Nav 1 | "Products" (8) | "Products" (8) |
| Nav 2 | "Projects" (8) | "Projects" (8) |
| Nav 3 | "Magazine" (8) | "Insights" (8) |
| Nav 4 | "Service + Information" (21) | "Service + Downloads" (19) |
| Language | "DE \| EN" | "ZH \| EN" |

## Responsive Behavior
- **≥1376 (`xl`):** nav links visible (`col-span-12`), right cluster `col-span-12`
- **820–1375:** nav links **hidden** (`max-xl:hidden`); burger is the only navigation
- **744–819 (`sm`):** left block `col-span-4`; wordmark 24px
- **<744:** wordmark 16px; breadcrumb row hidden below 393px
