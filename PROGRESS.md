# Canton Hyland — Progress

> Read this file first in a new session. It says where we are and what to do next.
> The full plan lives in [BUILD_PLAN.md](BUILD_PLAN.md).

---

## Current status

| | |
|---|---|
| **Phase** | **0 — Foundation** |
| **Status** | ✅ Complete |
| **Last updated** | 2026-08-15 |
| **Build** | `npm run build` passing · lint 0 errors · typecheck clean |
| **Git** | clean tree, all work committed |
| **Next phase** | 1 — Site shell and routing foundation (**not started — do not begin without being asked**) |

---

## Completed

| # | Phase | Key output files |
|---|---|---|
| — | Homepage prototype — layout reverse-engineered from `fsb.de`, pixel-exact at 1512px across 21 modules | `src/app/page.tsx`, `src/components/sites/www-fsb-de-bf263c85/**`, `docs/research/www-fsb-de-bf263c85/en-7a4ba3ba/**` |
| — | Static export — `output: "export"`, packaged to `canton-demo.zip` | `next.config.ts`, `out/` |
| — | Brand colour system — full token set, 4 binding colour rules, button spec | `src/app/globals.css`, `src/components/sites/www-fsb-de-bf263c85/shared/Button.tsx` |
| 0 | Foundation — git safety net, planning docs, content model. No page components, as specified. | `BUILD_PLAN.md`, `PROGRESS.md`, `src/data/types.ts`, `src/data/products.ts`, `src/data/categories.ts` |

### Phase 0 detail

**Git** — repository already initialised in the previous session (`1700d19`), so no
second `git init` was needed. Working tree was clean going in.

**`src/data/types.ts`** — five interfaces, no logic:
- `Product` — model, slug, name, series, `categoryPath[]` (multi-level), summary,
  `specs[]` (variable-length label/value rows), material, finishes, doorTypes,
  certifications, heroImage, gallery, attachmentIds, relatedModels, seoTitle,
  seoDescription
- `Project` — case study: location, country, year, buildingType, architect, body,
  productModels, images, SEO
- `DownloadFile` — id, title, kind, format, sizeBytes, url, language, relatedModels,
  updatedAt
- `Category` — recursive tree node
- Support types: `ImageRef`, `SpecRow`, `Certification`, `DownloadKind`

**`src/data/products.ts`** — 3 samples in 3 different categories with 5/8/10 spec rows,
so any component built on this must handle the variation from the start:
`HY007-S` (lever on rose), `BL031` (glass patch fitting), `LC04-8570` (Euro mortise lock).

**`src/data/categories.ts`** — 6 top-level categories, each with 2–3 sub-categories:
Mortise Locks / Lever Handles / Glass Door Fittings / Panic Exit Devices / Cylinders /
Accessories.

**Helpers written now because the static export will need them:** `getAllCategoryPaths()`,
`getAllProductParams()`, `findCategoryByPath()`, `getProductBySlug()`,
`getProductsByCategory()`, `getRelatedProducts()`. All pure functions, all unused so far.

---

## Next: Phase 1 — Site shell and routing foundation

The structural phase everything else sits on. In order:

1. **Move `SiteHeader` / `SiteFooter` into `src/app/layout.tsx`.** They currently render
   inside `src/app/page.tsx`, so a second page would have no navigation.
2. **Move components out of the clone namespace.**
   `src/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/` → `src/components/site/`.
   The current path records which site the layout was copied from — wrong for a real product.
3. **Point the header nav at real routes.** Every link is `href="#"` today. Set the
   `current` flag per route so the active item picks up brand red (colour rule 1).
4. **Create stub pages** for `/products`, `/projects`, `/downloads`, `/company`,
   `/contact` so nothing 404s.
5. **Done when:** every nav link lands on a real page, `npm run build` passes, and `/`
   renders byte-identically to now.

**Regression guard for step 1–2:** the homepage geometry is verified — 21 modules at
fixed offsets, document height 10838px at a 1512×900 viewport. After moving files, re-run
that check before committing. The measurement script is recorded in
`docs/research/www-fsb-de-bf263c85/en-7a4ba3ba/VISUAL_QA.md`.

---

## Open decisions — need your call

| # | Decision | Blocks |
|---|---|---|
| 1 | **The Phase 0 brief referenced a "阶段清单" that was not in the message.** The phase list in `BUILD_PLAN.md` is my draft from the route structure. Confirm or replace it. | All planning |
| 2 | How inquiry emails get delivered — a static export cannot process form submissions | Phase 8 |
| 3 | Category depth in URLs: is `/products/levers/hy007-s` enough, or do sub-categories need their own level? Sub-categories exist in the data; no route uses them. | Phase 3 |
| 4 | Flip the footer to `--color-surface-dark`? Token defined, unused. | Phase 1 |
| 5 | Delete `src/components/ui/button.tsx`? Dead shadcn scaffold, violates colour rules 3–4, name collides with `shared/Button.tsx`. | Phase 1 |
| 6 | Real domain, for canonical URLs and sitemap | Phase 9 |

---

## Known pitfalls

Things that will bite if forgotten. Full detail in [BUILD_PLAN.md](BUILD_PLAN.md).

- **Static export.** Every `[dynamic]` route needs `generateStaticParams()`. No API
  routes, no server actions, no server-side form handling.
- **Sample product data is invented** — dimensions, materials and certifications alike.
  None of it is verified. Certification claims are a legal exposure, not just a content
  bug; they must not reach a public build unreviewed.
- **Site-wide `noindex` is deliberate** (`src/app/layout.tsx`). This is an unpublished
  prototype. Removing it is a Phase 9 step, not a cleanup.
- **Spacing utilities are already pixels.** Root font-size is 62.5%, `--spacing: 0.1rem`,
  so `p-24` means exactly 24px. Do not convert these numbers.
- **Colour rules are binding.** See the top of `src/app/globals.css`. Guard command:
  `grep -rni "shadow\|gradient\|rounded" src/` should return only comments and
  `--radius-card`.
- **Promo-bar link contrast is 4.04:1**, under WCAG AA 4.5:1 for 18px text. Specified
  that way (`#E32322` on `#121212`) and left as specified. Options if it needs to pass:
  lighten the on-dark link to ~`#FF5A55` (≈5.9:1), or keep white text with a red underline.
- **`--color-surface-alt`, `--color-surface-dark`, `--color-brand-tint` are defined but
  unused.** No alternating blocks, no dark footer, no badges in the current layout.
- **Header modals unimplemented.** Language / search / mega-menu are three inert buttons.
- **Responsive below 1376px** is structurally present but has never been visually reviewed.
- **`canton-demo.zip` is gitignored** — regenerate from `out/` when you need it. Note that
  Windows `Compress-Archive` writes backslash path separators, which breaks the directory
  structure on most static hosts; build the zip with explicit forward-slash entry names.
