# Design Tokens — www.fsb.de/en/

All values extracted via `getComputedStyle()` at viewport 1512×900 (scrollbar-less width 1497px).

> **Substitution policy for this clone** (per client brief): fonts, copy, imagery and the accent
> colour are deliberately replaced. Substitutions are marked **[SUB]**. Everything else is 1:1.

## Root font size

`html { font-size: 10px }` — the site uses a 10px root so `1rem = 10px` and every token below is
written in `rem` at 1/10 of its pixel value. **The clone reproduces this** (`html { font-size: 62.5% }`)
so the token numbers stay identical to the original.

Note: media queries always resolve `rem` against the *initial* 16px, not the 10px root — this is why
the breakpoint rem values below look inconsistent with the spacing scale. That is the original's
behaviour and is reproduced exactly.

## Breakpoints

| Name | Original media query | px | Tailwind v4 `--breakpoint-*` |
|---|---|---|---|
| (arbitrary) | `(max-width: 24.5625em)` | 393 | used as `max-[24.5625em]` |
| `xs` | `(min-width: 40rem)` | 640 | `--breakpoint-xs: 40rem` |
| `sm` | `(min-width: 46.5rem)` | 744 | `--breakpoint-sm: 46.5rem` |
| `md` | `(min-width: 51.25rem)` | 820 | `--breakpoint-md: 51.25rem` |
| `lg` | `(min-width: 64.5rem)` | 1032 | `--breakpoint-lg: 64.5rem` |
| `xl` | `(min-width: 86rem)` | 1376 | `--breakpoint-xl: 86rem` |
| `2xl` | `(min-width: 94.5rem)` | 1512 | `--breakpoint-2xl: 94.5rem` |

Matches the client-specified set exactly: 393 / 640 / 744 / 820 / 1032 / 1376 / 1512.

Also in use: `(hover: hover)` → `hover-hover:` variant, `(pointer: fine)` → `pointer-fine:` variant.

## Colours

| Token | Original | Clone | Note |
|---|---|---|---|
| `--c-white` | `255 255 255` | same | |
| `--c-black` | `0 0 0` | same | body text, borders |
| `--c-highlight` | `244 255 113` (#F4FF71) | **`26 26 26` (#1A1A1A)** | **[SUB]** brand accent |
| `--c-gray` | `246 246 246` (#F6F6F6) | same | |
| `--c-aluminum` | `231 231 231` (#E7E7E7) | same | |
| `--c-stainless-steel` | `214 212 208` (#D6D4D0) | same | |
| `--c-bronze` | `189 165 130` (#BDA582) | same | |
| `--c-red` | `255 0 0` | same | |

Stored as space-separated RGB triples so they compose with `/ <alpha>` (the original uses
`bg-gray/50` for modal scrims).

**Accent contrast consequence [SUB]:** the original top banner is black text on #F4FF71. With the
accent at #1A1A1A that pairing is unreadable, so the banner uses white text on #1A1A1A. This is the
only place the substitution forces a foreground change.

## Typography

**[SUB] Font families.** Original: `Trade Gothic Next LT Pro` (body, weights 400/700) and `Traffic`
(H1 display only, weights 400/700) — both commercially licensed, **not downloaded**. The clone maps
both roles to **Archivo** (Google Fonts CDN, weights 400/600/700). Metrics differ slightly from Trade
Gothic; every size/leading/tracking token below is the original's value, unchanged.

| Token | font-size | line-height | letter-spacing | weight | Family |
|---|---|---|---|---|---|
| `--text-h1` | `clamp(2.4rem, 2.3249rem + .191vw, 2.6rem)` → 24–26px | `3.2rem` / 32px | `.052rem` / 0.52px | 700 | Archivo **[SUB]** (was Traffic) |
| `.text-h1-light` | same as h1 | `3.2rem` | `.052rem` | 400 | Archivo **[SUB]** |
| `--text-h2` | `clamp(2.2rem, 2.125rem + .191vw, 2.4rem)` → 22–24px | `3.2rem` | `.048rem` | 400 | Archivo |
| `--text-h3` | `clamp(1.6rem, .191vw + 1.525rem, 1.8rem)` → 16–18px | `2.4rem` | `.036rem` | 700 | Archivo |
| `--text-c1` | `clamp(1.6rem, .191vw + 1.525rem, 1.8rem)` → 16–18px | `2.4rem` | `.036rem` | 400 | Archivo |
| `--text-c2` | `1.2rem` / 12px | `1.6rem` / 16px | `.024rem` | 400 | Archivo |

At the 1512px reference viewport h1/h3/c1 all resolve to their upper bound (26px / 18px / 18px).

Weight scale: 100 ultralight, 200 thin, 300 light, 400 regular, 500 medium, 600 semibold, 700 bold,
800 heavy, 900 black. Archivo is loaded at 400/600/700 only — the original only ever *uses* 400 and 700.

### `.copy` prose block
- Base = `--text-c1`
- Sibling spacing: `margin-top: var(--leading-c1)` (24px) between children
- Headings inside `.copy` render at `--text-h3`, `margin-top: var(--space-48)` (48px) after a sibling
- `ul`: `list-style: none; padding-left: 0`; `li { position: relative; padding-left: var(--space-20) }`
  with `li::before { content: "–"; position: absolute; left: 0; color: currentColor }`
- `p > a`: `underline`, `text-underline-offset: 4px`

## Spacing scale

`--space-N` where the value is `N/10 rem` = `N` px:
`0, 1 (max(.1rem,1px)), 2 (max(.2rem,2px)), 4, 8, 12, 16, 20, 24, 32, 36, 48, 52, 64, 84, 96, 136,
144, 192, 220, 288, 356, 384, 1920`

Named aliases: `--space-xs: 2.4rem`, `--space-s: 2.4rem`, `--space-m: 4.8rem`, `--space-l: 9.6rem`.

## Layout grid

```
--max-content-width : 144rem   /* 1440px */
--max-popout-width  : 160rem   /* 1600px */
--grid-columns      : 24
--grid-gap          : 1.6rem   /* 16px */
--layout-outset     : clamp(1.6rem, 1.5282vw + .9994rem, 3.2rem)      /* 16px → 32px */
--layout-content    : min(100vw - 2*outset, 144rem - 2*outset)         /* 1376px @ ≥1440 */
--layout-popout     : minmax(0, calc((160rem - content) * .5 - outset))
--layout-full       : 1fr
```

`.layout` is a named-line grid; children opt into a band with `grid-column: content | outset | popout | full`:

```css
.layout {
  display: grid;
  grid-template-columns:
    [full-start]   var(--layout-full)
    [popout-start] var(--layout-popout)
    [outset-start] var(--layout-outset)
    [content-start] var(--layout-content)
    [content-end]  var(--layout-outset)
    [outset-end]   var(--layout-popout)
    [popout-end]   var(--layout-full)
    [full-end];
}
```

Measured at 1497px: `0px | 28.57px | 32px | 1376px | 32px | 28.57px | 0px`.

`.grid-cols` = `repeat(24, minmax(0, 1fr))`; at content width 1376 → 24 × 42px + 23 × 16px gap.

Fractional widths used by the horizontal-snap carousels:
```css
.w-grid-1\/2 { width: calc(100% * 1/2 - 1/2 * var(--grid-gap)) }  /* 680px */
.w-grid-3\/4 { width: calc(100% * 3/4 - 1/4 * var(--grid-gap)) }
.w-grid-1\/4 { width: calc(100% * 1/4 - 3/4 * var(--grid-gap)) }
```

## Chrome heights

```
--h-main-nav-banner : 4.8rem  /* 48px  yellow → #1A1A1A [SUB] promo bar */
--h-main-nav-menu   : 9.6rem  /* 96px  (declared; measured nav row is 88px) */
--h-main-nav        : calc(4.8rem + 9.6rem)  /* 144px */
--button-height     : 4.2rem  /* 42px */
```

## Borders, outlines, radii

- **No border radius anywhere.** Every surface is a hard rectangle.
- Footer top rule: `border-top: 1px solid #000`
- Hover outline on teasers/heroes: `outline: 1px solid #000` with `outline-offset: max(-.1rem, -1px)`
- No box-shadows on any content module.

## Utilities worth reproducing

```css
.underscore { position: relative; padding-bottom: .3rem }
.underscore::after {
  content: ""; position: absolute; inset-inline: 0; bottom: 0;
  height: 1px; background-color: currentColor; opacity: 0; transition: .3s;
}
.underscore:hover::after { opacity: 1 }

.stack { display: grid }
.stack > * { grid-area: 1 / 1 }

.px-outset        { padding-inline: var(--layout-outset) }
.scroll-px-outset { scroll-padding-inline: var(--layout-outset) }
.outline-offset   { outline-offset: max(-.1rem, -1px) }
```

## Assets — not reproduced **[SUB]**

No image, video, font or SVG logo file is downloaded from the target. Per brief:
- Every `<picture>`/`<img>` becomes a flat `--c-aluminum` block at the **original aspect ratio**,
  labelled with its role and ratio (e.g. `产品图 1:1`, `工程实景 3:2`).
- The FSB wordmark (a registered trademark) is replaced by a text wordmark, "CANTON HYLAND".
- Decorative signature/artwork SVGs in the Welcome block are replaced by labelled placeholders.

Original aspect ratios preserved: hero A `2880/1391`, `2880/1481`, `2880/1920` (3:2), `2880/1757`;
hero B `1940/1293` (3:2); teaser cards `1/1`.
