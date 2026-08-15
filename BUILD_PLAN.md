# Canton Hyland — Build Plan

> **⚠ The phase list below is a DRAFT awaiting your confirmation.**
> Your Phase 0 brief said "write the full content of the phase list below", but the
> list did not come through in the message — only the route structure did. Everything
> in **Phase list** is reconstructed from the route structure, the project background
> and the current state of the code. Correct it and it gets replaced wholesale; nothing
> downstream depends on it yet.

---

## What this project is

The English-language website for **Canton Hyland**, a Chinese manufacturer of door locks
and architectural hardware selling to overseas architects and project buyers.

Today it is a single-page prototype. The goal is a full multi-page catalogue site, built
incrementally across many short sessions.

**Current state:** homepage only, at `/`. Layout was reverse-engineered from `fsb.de`
and is pixel-exact at 1512px. Brand colour system landed. Static export working.

---

## How we work across sessions

The developer is not a programmer and each session has a limited budget. So:

1. **One phase per session.** Phases are sized to finish inside one session. If a phase
   is running long, stop at a clean commit and note where you got to.
2. **Commit at the end of every phase.** The repo is the undo button.
3. **`PROGRESS.md` is the handoff.** Read it first in a new session; it says what phase
   we are on and what to do next. Update it before finishing.
4. **`npm run build` must pass before any commit.** No exceptions.
5. **Never start the next phase without being asked.** Report and stop.

---

## Route structure

| Route | Page | Status |
|---|---|---|
| `/` | Homepage | ✅ Done |
| `/products` | Product overview — all categories | Planned |
| `/products/[category]` | Category listing | Planned |
| `/products/[category]/[slug]` | Product detail | Planned |
| `/projects` | Reference case studies, listing | Planned |
| `/projects/[slug]` | Case study detail | Planned |
| `/downloads` | Download centre | Planned |
| `/company` | About us | Planned |
| `/contact` | Contact + inquiry | Planned |

`trailingSlash: true` is set, so every route exports as `<route>/index.html`.

---

## Phase list  *(draft — see warning above)*

### Phase 0 — Foundation ✅
Git safety net, planning docs, content model. **No page components.**
- `BUILD_PLAN.md`, `PROGRESS.md`
- `src/data/types.ts`, `src/data/products.ts`, `src/data/categories.ts`

### Phase 1 — Site shell and routing foundation
The single most important structural phase; everything after it depends on it.
- Move `SiteHeader` / `SiteFooter` out of `page.tsx` into `src/app/layout.tsx` so every
  page gets them for free.
- Move components out of the clone namespace
  `src/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/` → `src/components/site/`.
  That path encodes which site was cloned; it is wrong for a real product.
- Point the header nav at real routes (every link is `href="#"` today).
- Create stub pages for all 6 top-level routes so nothing 404s.
- **Done when:** every nav link lands on a real page, build passes, `/` is unchanged.

### Phase 2 — `/products` overview
Grid of the 6 top-level categories, driven by `categories.ts`.
- Reuse the existing teaser-card pattern; no new visual language.
- **Done when:** all 6 categories render and link to their category page.

### Phase 3 — `/products/[category]`
Listing of products in a category, with `generateStaticParams()`.
- Breadcrumb, category intro, product grid.
- **Done when:** all 6 category pages build statically and list their products.

### Phase 4 — `/products/[category]/[slug]` — product detail
The most content-dense page and the commercial core of the site.
- Hero image + gallery, spec table (variable rows), material/finish/door type,
  certification badges, attachments, related products.
- **Done when:** the 3 sample products render completely, including empty-state
  handling for products with no gallery or no attachments.

### Phase 5 — `/projects` and `/projects/[slug]`
Case studies. Needs a `src/data/projects.ts` with 2–3 samples first.
- **Done when:** listing filters by building type; detail links back to products used.

### Phase 6 — `/downloads`
Download centre grouped by `DownloadKind`. Needs `src/data/downloads.ts`.
- **Done when:** grouping, file-type badges and sizes render; links resolve or are
  clearly marked as pending.

### Phase 7 — `/company`
About us — history, manufacturing, quality system, certifications.
- Mostly editorial; reuses existing hero and text modules.

### Phase 8 — `/contact` and inquiry form
⚠ **Read "Static export" under Known constraints before starting this phase.**
A static site cannot process a form submission on its own. This phase includes choosing
how inquiries actually get delivered.

### Phase 9 — SEO and metadata pass
Per-page `metadata`, `sitemap.xml`, `robots.txt`, Open Graph, structured data for
products. **Includes removing the site-wide `noindex`** — currently set in
`src/app/layout.tsx` because this is an unpublished prototype. Do not remove it early.

### Phase 10 — Content population and final QA
Swap placeholder copy and placeholder image blocks for real catalogue data and real
photography. Responsive review below 1376px. Accessibility pass.

---

## Known constraints

Each of these has already caused, or will cause, real work. Read before planning a phase.

### Static export (`output: "export"`)
`next.config.ts` sets `output: "export"`, so the whole site builds to plain files in
`out/`. Consequences:

- **Every dynamic route needs `generateStaticParams()`.** `[category]` and `[slug]` must
  be enumerable at build time. The helpers are already written:
  `getAllCategoryPaths()` in `categories.ts`, `getAllProductParams()` in `products.ts`.
- **No API routes, no server actions, no server-side form handling.** This directly
  blocks the Phase 8 inquiry form. Options, to decide then: a hosted form service
  (Formspree / Web3Forms / Tally), a `mailto:` fallback, or dropping the static export
  for a Node host. Decide before building the form, not after.
- **No `next/image` optimisation** (`images.unoptimized: true`). Images ship as-is.
- **Absolute asset paths.** The export references `/_next/...`, so it must be served from
  a domain root. A subdirectory deploy needs `basePath` + `assetPrefix` and a rebuild.

### Component namespace
Components still live under `src/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/`.
That folder name records which site the layout was cloned from — meaningless for a real
product and confusing in a multi-page codebase. Phase 1 moves them.

### Header and footer are not in a layout
`src/app/layout.tsx` renders only `<html>`/`<body>`. `SiteHeader` and `SiteFooter` are
mounted inside `src/app/page.tsx`, so a second page would have no navigation. Phase 1.

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
Root font-size is 62.5%, so `1rem = 10px` and `--spacing: 0.1rem`. This makes every
Tailwind spacing utility equal its pixel value: `p-24` is exactly 24px, `gap-64` is 64px.
Do not "convert" these numbers — they are already pixels.

### Layout grid
`.layout` is a named-line grid with bands `full | popout | outset | content`. Children
default to the `content` band (1376px at desktop); opt out with `.col-outset` /
`.col-popout` / `.col-full`. Inside content, `.grid-cols` is a 24-column grid with a
16px gap. Reuse it — do not invent a second grid system.

### Images
There is no photography. Every image slot renders through `MediaPlaceholder`
(flat block, correct aspect ratio, labelled). `ImageRef.src` is optional by design: set
it when a real asset exists and the placeholder disappears with no component change.

### Sample data is not real
`src/data/products.ts` is invented placeholder data — dimensions, materials and
**certifications** included. Nothing there has been verified. It must not reach a public
build unreviewed; certification claims are a legal exposure, not just a content bug.

---

## Open decisions

Things that need a human call before the phase that depends on them.

| # | Decision | Blocks |
|---|---|---|
| 1 | How inquiry emails get delivered from a static site | Phase 8 |
| 2 | Category depth in URLs — is `/products/levers/hy007-s` enough, or do we need `/products/levers/lever-on-rose/hy007-s`? Sub-categories exist in the data but no route uses them. | Phase 3 |
| 3 | Whether to flip the footer to `--color-surface-dark` (token defined, unused) | Phase 1 |
| 4 | Delete `src/components/ui/button.tsx`? Dead shadcn scaffold, violates colour rules 3–4, and its name collides with `shared/Button.tsx`. | Phase 1 |
| 5 | Real domain, for canonical URLs and sitemap | Phase 9 |
