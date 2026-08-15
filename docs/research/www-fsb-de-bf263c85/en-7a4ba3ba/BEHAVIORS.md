# Behaviors — www.fsb.de/en/

## Scroll sweep

**Findings: the page has almost no scroll choreography.** Verified at load:

| Check | Result |
|---|---|
| Smooth-scroll library (Lenis / Locomotive) | **None.** No `.lenis` / `.locomotive-scroll` class, `scroll-behavior: auto` on `html`. Native scrolling. |
| Entrance / reveal animations | **None.** Module wrappers read `opacity: 1`, `transform: none` at scroll 0 while off-screen. No `IntersectionObserver`-driven classes, no `data-animate` / `.reveal` / `.animate-*` elements on the page. |
| Page-level scroll-snap | **None.** `scroll-snap-type` is only set on the teaser carousels (axis `x`), never on the page container. |
| Parallax | None. |
| Scroll progress indicators | None. |
| Auto-cycling carousels / timers | None. The teaser tracks are user-scrolled only. |

### The one scroll behavior: sticky header

- **Element:** `div.sticky.z-10.-top-[var(--h-main-nav-banner)]` (the whole 136px header).
- **Mechanism:** pure CSS `position: sticky; top: -48px`. No JS listener, no class toggle.
- **Effect:** the 48px promo banner scrolls out of view; the 88px nav row pins to the top of the
  viewport and stays there for the rest of the page.
- **Trigger:** continuous — begins at `scrollY > 0`, fully pinned at `scrollY ≥ 48`.
- **State A (scrollY = 0):** banner visible at y 0–48, nav row at y 48–136.
- **State B (scrollY ≥ 48):** banner off-screen, nav row at y 0–88.
- **Transition:** none. There is **no** shadow, background, height or padding change between states —
  the nav row already has `bg-white` at rest. Do not add a shadow.
- **Implementation:** one `sticky` div. No `useEffect`, no scroll listener.

## Click sweep

| Control | Result |
|---|---|
| Promo banner (whole 48px bar) | link → Product Finder. Whole bar is the `<a>`; `group-hover:underline` on the label. |
| Nav links (Products / Projects / Magazine / Service + Information) | plain navigation |
| Logo | link → `/` |
| Language button | `x-on:click="openLanguage = !openLanguage"` → opens the fixed language modal (`bg-gray/50` scrim + centred `bg-white px-32 py-48` panel) |
| Search button | `openSearch = true; $nextTick(() => $refs.search.focus())` → fixed search modal, autofocuses the input |
| Menu button (`.stack`) | `openMenu = !openMenu` → the mega-menu panel below the nav row (`translate-y-full`, so it slides out *under* the bar). Two stacked SVGs (burger / close) swap via `.stack`. |
| Teaser cards | whole card is an `<a>`; navigation only, no state change |
| Hero modules | whole module is wrapped in an `absolute inset-0` `<a>`; navigation only |
| Welcome "More links" accordion | `x-data="{ active: 0 }"` + `x-show`/`x-collapse`. **Mobile only** — the toggle button is `sm:hidden` and the panel is `sm:!block sm:!h-auto`, so at ≥744px the list is permanently open and the button is gone. Chevron rotates via `:class="{ 'rotate-180': expanded }"` with `transition-transform duration-300`. |

**No tab bars, pills, or segmented controls exist on this page.** There is no per-state content to
extract — every module renders a single fixed state.

## Hover sweep

Every hover effect on the page, exhaustively:

| Element | Property | Before → After | Transition |
|---|---|---|---|
| Nav links, arrow links | `text-decoration-line` | `none` → `underline`, `text-underline-offset: 4px` | none (instant) |
| Teaser card `<a>` | `outline` | `none` → `solid max(.1rem,1px) #000`, `outline-offset: -1px` | none (instant) |
| Teaser card `<p>` | padding | already `24px` at ≥820px; `16px` below | n/a — the padding is set by `hover-hover:` (a *capability* query, not `:hover`), so it does not change on hover |
| Hero module (`.group`) | `outline` on the inner `<a>` | `none` → `solid 1px #000` with `outline-offset: max(-.1rem,-1px)` (variant A) / `outline-offset-outset` (variant B) | none (instant) |
| Hero caption link | `text-decoration` | `none` → `underline` (via `group-hover:underline`, fires from the whole module) | none |
| Promo banner label | `text-decoration` | `none` → `underline` (via `group-hover`) | none |
| Footer links (`.underscore`) | `::after` `opacity` | `0` → `1` (1px full-width bar at `bottom: 0`, `background: currentColor`) | **`transition: .3s`** |
| Accordion chevron | `transform` | `rotate(0)` → `rotate(180deg)` | `duration-300` |

Notes for builders:
- `hover-hover:` = `@media (hover: hover)` — a device-capability gate, **not** `:hover`. It is used to
  give pointer devices a padded card box; it must not be implemented as a hover interaction.
- `pointer-fine:` = `@media (pointer: fine)` — switches the teaser track from a 3/4-width snap
  carousel to a wrapped 1/2-width grid on mouse devices.
- Outlines are **instant**. Only `.underscore` and the chevron animate.

## Teaser carousel mechanics

```
scroll-snap-type   : x mandatory
scroll-padding-left: var(--layout-outset)   /* 32px @ desktop */
overflow-x         : auto
overscroll-behavior-x: contain
scrollbar-width    : none
flex-wrap          : wrap        (only under @media (pointer: fine))
```
Cards: `w-grid-3/4 min-w-grid-3/4` by default, `pointer-fine:w-grid-1/2 pointer-fine:min-w-grid-1/2`,
`scroll-snap-align: start`. On a desktop mouse the two cards therefore sit side by side at 680px each
and the track does not actually scroll; on touch it is a 3/4-width snap carousel.

## Responsive sweep

Breakpoints: 393 / 640 (`xs`) / 744 (`sm`) / 820 (`md`) / 1032 (`lg`) / 1376 (`xl`) / 1512 (`2xl`).

| Region | ≥1376 (`xl`) | 820–1375 (`md`) | 744–819 (`sm`) | <744 |
|---|---|---|---|---|
| `main` top margin | 192px (from `lg`) | 192px (from `lg` 1032) / 48px below | 48px | 48px |
| `main` child gap | 136px (from `lg`) | 136 / 48 | 48px | 48px |
| Header nav links | visible, `col-span-12` | **hidden** (`max-xl:hidden`) → burger only | hidden | hidden |
| Header breadcrumb row | visible | visible | visible | hidden below 640 (`max-xs:hidden`) |
| Hero A caption | title `col-span-6`, link `col-span-6 -col-end-1` | title `col-span-5`, link `col-span-3 -col-end-1` | stacked, `col-span-full` | stacked |
| Hero A media | `md:px-0` (bleeds to outset band) | `md:px-0` | `px-outset` inset | `px-outset` inset |
| Hero A media margin | `md:mb-48` | `md:mb-48` | `mb-16` | `mb-16` |
| Hero B | image `col-span-17`, text `col-span-7` | image `col-span-8 -col-end-1`, text `col-span-3 order-first` | stacked, image first, `mb-16` | stacked |
| Teaser cards | 2 × 680px side by side (pointer: fine) | 2 up | 3/4-width snap carousel | 3/4-width snap carousel |
| Teaser card padding | 24px | 24px | 16px | 16px |
| `text` module | two `col-span-12` halves | two `col-span-6` halves | `col-span-4` halves | stacked full width |
| Welcome grid | `gap-y-96`, h1 `col-span-10` of 12 | `col-span-6` panes | `col-span-4` panes | stacked, `gap-y-24` |
| Welcome accordion | always open, no toggle | always open | always open (`sm:!block`) | collapsed, toggle visible |
| Footer nav list | `col-span-12`, flex-wrap `gap-x-64` | `col-span-7`, flex-wrap | subgrid, `col-span-2` cells | 2-col subgrid, `gap-y-20` |
| Footer newsletter | `col-span-12`, `lg:grid-cols-2` | `col-span-7` row 2 | `col-span-4` | `col-span-2`, h3 visible (`md:hidden`) |
| Footer social | `col-span-4 -col-end-1` | `-col-end-1 row-span-2` | `col-span-4` | `col-span-2` |
| Footer gap-y | 96px (`md:`) | 96px | 48px | 48px |
| Footer top margin | 96px (`sm:`) | 96px | 96px | 48px |

**Scope note:** the client brief is desktop-only. The clone still carries the responsive classes
above because they are part of the extracted source, but only ≥1376px has been visually verified.
