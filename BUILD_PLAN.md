# Canton Hyland — Build Plan

The English-language website for **Canton Hyland**, a Chinese manufacturer of door locks
and architectural hardware selling to overseas architects and project buyers.

Built incrementally across many short sessions. **Domain:** `https://www.cantonlock.com`

---

## How we work across sessions

The developer is not a programmer and each session has a limited budget. So:

1. **One phase per session.** Phases are sized to finish inside one session. If a phase
   runs long, stop at a clean commit and note where you got to.
2. **Commit at the end of every phase.** The repo is the undo button.
3. **`PROGRESS.md` is the handoff.** Read it first in a new session; it says what phase
   we are on and what to do next. Update it before finishing.
4. **`npm run build` must pass before any commit.** No exceptions.
5. **Never start the next phase without being asked.** Report and stop.

---

## Phase list

*Confirmed 2026-08-15.*

| # | Phase | Status |
|---|---|---|
| **P0** | **Foundation** — git, data structures, route planning, BUILD_PLAN, PROGRESS | ✅ Done |
| **P1** | **Homepage imagery** — replace placeholder blocks with real hardware photography | ✅ Done |
| **P2** | **Site skeleton** — wire up all routes, nav links, footer links, 404 page | ✅ Done |
| **P3** | ⭐ **Product detail page** — the hardest and most commercially valuable page; 7 blocks | ✅ Done |
| **P4** | **Product overview + category pages + listing + filtering** | ✅ Done |
| **P5** | **Contact page + inquiry form** | ✅ Done |
| **P6** | **About us / company capability page** | ✅ Done |
| **P7** | **Project listing + project detail** (incl. related-products module) | ✅ Done |
| **P8** | **Download centre** | Next |
| **P9** | **Site-wide mobile responsive** | |
| **P10** | **SEO finishing** — sitemap, robots, Schema, meta, alt text | |
| **P11** | **Real assets and final content** — Canton's own product photography and signed-off copy | |

**Ordering rationale (from the client):**
- **P1 first** so the demo can be shown to management as soon as possible.
- **P3 after the skeleton but before the other pages**, because the product detail page is
  the key test of whether building this in-house is viable at all.

---

## Route structure

| Route | Page | Status |
|---|---|---|
| `/` | Homepage | ✅ Done |
| `/products` | Product overview — all categories | ✅ Done |
| `/products/[category]` | Category listing + filters | ✅ Done |
| `/products/[category]/[slug]` | Product detail | ✅ Done |
| `/projects` | Representative applications, listing | ✅ Done |
| `/projects/[slug]` | Application detail + related products | ✅ Done |
| `/downloads` | Download centre | P8 |
| `/company` | About us | P6 |
| `/contact` | Contact + inquiry | ✅ Done |
| `/es` | Spanish marketing homepage | ✅ Done (P6) |
| `/es/company` | Spanish company page | ✅ Done (P6) |
| `/es/contact` | Spanish contact + inquiry | ✅ Done (P6) |
| `/es/projects` | Spanish applications listing | ✅ Done (P7) |
| `/es/projects/[slug]` | Spanish application detail | ✅ Done (P7) |

`trailingSlash: true` is set, so every route exports as `<route>/index.html`.

**No sub-category route level.** `/products/levers/hy007-s`, never
`/products/levers/lever-on-rose/hy007-s`. Sub-categories exist in `categories.ts` as a
**filter dimension only** (used in P4), not as a URL segment. Rationale: shorter URLs read
better for SEO, far fewer static pages to generate, and — most importantly — re-organising
sub-categories later will not change any published URL, so no search ranking is lost.

---

## Phase detail

### P1 — Homepage imagery ✅
Swap the placeholder blocks on `/` for real, commercially-licensed hardware photography.
- `public/images/`, `IMAGE_CREDITS.md`, `src/components/.../content.ts`

### P2 — Site skeleton ✅
Chrome moved into `src/app/layout.tsx`; components moved to `src/components/site/` (flat);
homepage content to `src/data/home.ts`; nav, footer and homepage module links wired to real
routes; five stub pages plus a custom 404. Header is `"use client"` only to read
`usePathname()` for the active nav item.

### P3 — Product detail page ⭐ ✅
The commercial core. Seven blocks:
1. Breadcrumb + title + model number
2. Hero image + gallery
3. Spec table — **variable row count**, see the 5/8/10-row samples
4. Material / finishes / door types
5. Certification badges
6. Attachments (datasheets, CAD)
7. Related products
- Needs `generateStaticParams()` from `getAllProductParams()`.
- Includes the "Request a quote" button that carries the model number into the P5 form.
- **Completed:** all 12 verified product records export as static detail pages. Missing
  specifications, gallery images and attachments render honest empty states; products
  without a confirmed SKU do not send a made-up model value to the inquiry form.

### P4 — Product overview, category pages, listing, filtering ✅
- `/products` — grid of the 16 top-level categories on cantonlock.com.
- `/products/[category]` — product listing with **sub-category filters** (decision 3).
- `generateStaticParams()` from `getTopLevelCategories()`, top level only.
- **Completed:** 16 top-level categories from cantonlock.com, 16 statically exported
  category pages, client-side sub-category filtering, shared product cards and honest
  empty states. The client-owned Hyland mark now appears in the global header.

### P5 — Contact page + inquiry form ✅
Uses **Web3Forms** (decision 2). Static export stays.
- Access key from `NEXT_PUBLIC_W3F_KEY`; placeholder until the client supplies the real one.
- Must include: honeypot spam trap, submit success/failure states, and auto-fill of the
  product model when arriving from a product detail page's "Request a quote".
- **Completed:** static client-side submission flow, honeypot, explicit states and
  product/model query prefill. The client catalogue is downloadable from the page and
  all four supplied reports are shown with their exact documented scope.

### P6 — About us / company capability ✅
Approved 1998 company story, published company figures, manufacturing capability,
client-supplied factory/showroom gallery and four model-scoped certificates. Certificates
were moved out of Contact and into Company. A clickable Spanish marketing version now
covers the homepage, company page and inquiry flow; the product catalogue remains English
until final translation copy is approved.

### P7 — Projects ✅
Three bilingual representative application studies with statically exported English and
Spanish listing/detail routes. Each detail page links back to the actual catalogue records.
No approved customer project names, locations, dates or installation photography were
available, so every entry is explicitly marked as a representative application rather
than a completed reference.

### P8 — Download centre
Grouped by `DownloadKind`. Needs `src/data/downloads.ts`.

### P9 — Mobile responsive
Site-wide. Responsive classes exist but have never been visually reviewed below 1376px.

### P10 — SEO finishing
Per-page `metadata`, `sitemap.xml`, `robots.txt`, Open Graph, Schema.org product markup,
alt text audit. Canonical URLs on `https://www.cantonlock.com`.
**Do not remove `noindex` in this phase** — see decision 6.

### P11 — Real assets and final content  *(scope reduced — see below)*
Part of P11 was pulled forward on 2026-08-15: the client's own photography, company profile,
category tree and 20 real products are already in. **Remaining P11 scope:**
- Re-export or reshoot the four under-resolution images listed in IMAGE_CREDITS.md
  (two homepage banners at 0.54-0.57x, the facility yard, the storefront banner).
- Request un-badged product shots — every product image currently carries the Hyland logo
  lozenge burned into the corner, which fights the flat layout.
- Replace the B2B white-sweep product pack with styled photography on a neutral ground.
- Replace `company/decorative-hinge-detail.webp` (306:156 slot) with **CAD line art** —
  the brief asked for a technical line drawing and the pack contains none.
- Fill the empty `specs` tables. Alibaba product detail pages are captcha-protected, so
  dimensions must come from the client's catalogue.
- Confirm real SKUs for the twelve products flagged `modelTbc: true`.
- Verify every certification claim against a real test report, and confirm which current
  models the four existing reports cover.
- Confirm that the polished 2026-08 factory/showroom renders are faithful documentary
  images before public launch; they are accepted only as client-supplied demo material.

---

## Decisions

*Decisions 1–6 resolved 2026-08-15; decision 7 resolved 2026-08-16.*

| # | Decision | Outcome |
|---|---|---|
| 1 | Phase list | Confirmed, P0–P11 above |
| 2 | Inquiry email delivery | **Web3Forms.** Keep `output: "export"`. Free, no account system, works with a static site. Key via `NEXT_PUBLIC_W3F_KEY`. |
| 3 | URL depth | **No sub-category level.** `/products/[category]/[slug]`. Sub-categories are a filter dimension. |
| 4 | Footer background | **Stay white.** White + a single full-bleed top rule is part of the restrained all-white language; a dark footer would put a block of visual weight at the page bottom and break the rhythm. `--color-surface-dark` is reserved for possible dark card modules later. |
| 5 | `src/components/ui/button.tsx` | **Deleted** in P1. Dead code, name collision with `shared/Button.tsx`, violated colour rules 3–4. |
| 6 | Domain | `https://www.cantonlock.com` for canonical and sitemap. **`noindex` stays until launch** — the demo still carries generic placeholder content. At launch, remove the `noindex` and nothing else changes. |
| 7 | Founding year | **Use 1998 everywhere.** The client explicitly resolved the conflict in favour of the approved English company profile; older marketplace metadata is not used for this field. |

---

## Known constraints

Each of these has already caused, or will cause, real work. Read before planning a phase.

### Static export (`output: "export"`)
`next.config.ts` sets `output: "export"`, so the whole site builds to plain files in
`out/`. Consequences:

- **Every dynamic route needs `generateStaticParams()`.** `[category]` and `[slug]` must
  be enumerable at build time. Helpers are already written: `getAllCategoryPaths()` in
  `categories.ts`, `getAllProductParams()` in `products.ts`.
- **No API routes, no server actions, no server-side form handling.** The inquiry form
  posts directly to Web3Forms from the browser (decision 2).
- **No `next/image` optimisation** (`images.unoptimized: true`). Images ship exactly as
  they sit in `public/` — so they must be correctly sized and compressed *before* commit.
- **Absolute asset paths.** The export references `/_next/...`, so it must be served from
  a domain root. A subdirectory deploy needs `basePath` + `assetPrefix` and a rebuild.

### File layout (settled in P2)
```
src/app/                 layout.tsx (chrome) · page.tsx (home) · not-found.tsx
                         products/ projects/ downloads/ company/ contact/
src/components/site/     flat — SiteHeader SiteFooter HeroModule PageTeaserModule
                         TextModule WelcomeIntro Spacer ArrowLink Button
                         MediaPlaceholder icons
src/data/                types products categories home
```
`src/app/layout.tsx` renders `SiteHeader` and `SiteFooter` around `{children}`.
**Each page supplies its own `<main>`** — the homepage's `mt-192` and module rhythm are
page-specific and must not leak into other pages.

### Brand colour rules — binding
Written in full at the top of `src/app/globals.css`. Summary:
1. Brand red (`--color-brand`) **only** on clickable things: primary button fill, links,
   link hover, the current nav item, form focus borders.
2. Never red: headings, body copy, icons, dividers, decoration.
3. No gradients, metallic effects, glows or shadows. Fully flat.
4. Card radius 0–2px, no shadow. Hierarchy from whitespace and `--color-line`.

Check before each commit — this must return only comments and `--radius-card`:
```bash
grep -rni "shadow\|gradient\|rounded" src/
```

### Breakpoints
Seven custom breakpoints, defaults cleared. Media queries resolve `rem` against 16px,
not the 10px root.

| Name | Value | px |
|---|---|---|
| `xs` | 40rem | 640 |
| `sm` | 46.5rem | 744 |
| `md` | 51.25rem | 820 |
| `lg` | 64.5rem | 1032 |
| `xl` | 86rem | 1376 |
| `2xl` | 94.5rem | 1512 |
| (arbitrary) | `max-[24.5625em]` | 393 |

### Spacing scale
Root font-size is 62.5%, so `1rem = 10px` and `--spacing: 0.1rem`. Every Tailwind spacing
utility equals its pixel value: `p-24` is exactly 24px, `gap-64` is 64px. Do not "convert"
these numbers — they are already pixels.

### Layout grid
`.layout` is a named-line grid with bands `full | popout | outset | content`. Children
default to the `content` band (1376px at desktop); opt out with `.col-outset` /
`.col-popout` / `.col-full`. Inside content, `.grid-cols` is a 24-column grid with a 16px
gap. Reuse it — do not invent a second grid system.

### Images
`ImageRef.src` is optional by design. When it is set the photo renders; when it is absent
the slot falls back to `MediaPlaceholder` (flat block, correct aspect ratio, labelled).
This means pages can be built before their photography exists, and adding a photo later
needs no component change. Homepage photography landed in P1; the rest of the site still
runs on placeholders.

### Certification data is a legal exposure
Verified and usable today:
- **ISO 9001** — continuously certified since 2002
- **ANSI/BHMA Grade 3**

Not yet verified, removed from the sample data until the client confirms: **EN 12209**,
**CE**. Every certification claim must be checked against a real test report before it
reaches a public build. This is not a content bug, it is a compliance risk.

---

## Open decisions

None outstanding. New questions get added here as they come up.
