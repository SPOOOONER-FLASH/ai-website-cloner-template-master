# Canton Hyland — Progress

> Read this file first in a new session. It says where we are and what to do next.
> The full plan lives in [BUILD_PLAN.md](BUILD_PLAN.md).

---

## Current status

| | |
|---|---|
| **Phase** | **P2 — Site skeleton** |
| **Status** | ✅ Complete |
| **Last updated** | 2026-08-15 |
| **Build** | `npm run build` passing — 9 static pages · lint 0 errors · typecheck clean |
| **Git** | clean tree, all work committed (`4c5534e`) |
| **Next phase** | **P3 — Product detail page ⭐** (**not started — do not begin without being asked**) |

---

## Completed

| # | Phase | Key output files |
|---|---|---|
| — | Homepage prototype — layout reverse-engineered from `fsb.de`, pixel-exact at 1512px across 21 modules | `src/app/page.tsx`, `src/components/sites/www-fsb-de-bf263c85/**`, `docs/research/**` |
| — | Static export — `output: "export"`, packaged to `canton-demo.zip` | `next.config.ts` |
| — | Brand colour system — full token set, 4 binding colour rules, button spec | `src/app/globals.css`, `shared/Button.tsx` |
| **P0** | Foundation — git safety net, planning docs, content model | `BUILD_PLAN.md`, `PROGRESS.md`, `src/data/types.ts`, `src/data/products.ts`, `src/data/categories.ts` |
| **P1** | Homepage imagery — 11 stock photos replace the placeholder blocks | `public/images/*.jpg`, `IMAGE_CREDITS.md`, `scripts/download-homepage-images.mjs`, `site/MediaPlaceholder.tsx`, `src/data/home.ts` |
| **P2** | Site skeleton — chrome in the layout, components out of the clone namespace, all routes and links wired, 404 | `src/app/layout.tsx`, `src/app/{products,projects,downloads,company,contact}/page.tsx`, `src/app/not-found.tsx`, `src/components/site/**`, `src/data/home.ts` |

### P1 detail

**11 photographs**, all from Pexels under the Pexels License (free commercial use, no
attribution required — photographers credited anyway). Licence verified per photo from
each photo page's JSON-LD. Full table in [IMAGE_CREDITS.md](IMAGE_CREDITS.md).

**`MediaPlaceholder` now switches on `src`:** photo when present, labelled block when
absent. Both states occupy identical space, so nothing shifts when a photo arrives. The
two decorative graphics in the Welcome block stay as placeholders on purpose — they are
brand artwork, not photography, and stock would be wrong there.

**Sizing.** Target was 2× display size under a 300 KB cap. Two large heroes could not hit
300 KB at 2× without JPEG quality collapsing into visible artefacts, so the download
script walks dimensions down before it lowers quality, with a hard quality floor of 60:

| | |
|---|---|
| All 11 files | q=78, 1 965 KB total, largest 291 KB |
| At full 2× | 9 of 11 |
| Budget-limited | `hero-product-collection.jpg` @ 1.75×, `hero-company-corridor.jpg` @ 1.5× |
| Aspect-ratio mismatches | 0 — CDN-side `fit=crop` gives each file its slot's exact ratio |

**Alt text** written for all 11 (English, descriptive) — P10's alt audit is partly done.

**Regression check:** 21 modules, 0 geometry mismatches, document height 10837px —
identical to before the images landed.

### Also done this session (housekeeping from the P0 review)

- **Certification data corrected.** `EN 12209`, `EN 1906`, `EN 1935` and `CE` removed from
  the sample products — including one that had leaked into a public-facing `seoDescription`.
  Only ISO 9001 and ANSI/BHMA Grade 3 remain, both client-confirmed as real. The file
  header now records the verification status of each standard.
- **`src/components/ui/button.tsx` deleted** (decision 5). Dead shadcn scaffold, name
  collision with `shared/Button.tsx`, violated colour rules 3–4. Build confirmed clean
  after removal.
- **`MediaSlot` is now an alias of `ImageRef`** — one image contract site-wide instead of
  two near-identical shapes drifting apart.

---

### P2 detail

**File layout now** — this is the shape to build against from here on:

```
src/app/                 layout.tsx (chrome) · page.tsx (home) · not-found.tsx
                         products/ projects/ downloads/ company/ contact/  ← stubs
src/components/site/     SiteHeader SiteFooter HeroModule PageTeaserModule
                         TextModule WelcomeIntro Spacer ArrowLink Button
                         MediaPlaceholder icons          ← flat, no sub-folders
src/data/                types products categories home
```

`src/components/sites/www-fsb-de-bf263c85/` is gone. Git recorded every move as a
rename, so `git log --follow` still works on each file.

**Layout owns the chrome; pages own their `<main>`.** The homepage's `mt-192` and module
rhythm are page-specific and deliberately not in the layout — new pages set their own.

**Active nav item.** `SiteHeader` is now `"use client"` for one reason: `usePathname()`.
No state, no effects. The current item renders `--color-brand` with `aria-current="page"`;
the others render `--color-ink`. Verified on `/products/`: `rgb(227,35,34)` vs
`rgb(18,18,18)`.

**Nav label changed:** "Insights" → "Company". `/company` is a planned route, `/insights`
is not. See the open decision below.

**Homepage regression:** 21 modules, 0 offset or height mismatches, document height
10838px. Unchanged by the restructure.

---

## Next: P3 — Product detail page ⭐

The commercially critical page, and the test of whether building this in-house is viable.
Route `/products/[category]/[slug]`, seven blocks:

1. Breadcrumb + title + model number
2. Hero image + gallery
3. Spec table — **variable row count** (the samples have 5, 8 and 10 rows)
4. Material / finishes / door types
5. Certification badges
6. Attachments (datasheets, CAD)
7. Related products

**Before writing the page:**
- `generateStaticParams()` must come from `getAllProductParams()` in `src/data/products.ts`
  — the static export cannot build a dynamic route without it.
- `getProductBySlug()`, `getRelatedProducts()` and `findCategoryByPath()` are already
  written and unused. Use them rather than writing new lookups.
- The "Request a quote" button is a `Button` from `src/components/site/Button.tsx` and
  must carry the model number into the P5 form.
- No downloads data exists yet, so `attachmentIds` resolves to nothing — build block 6
  to render an empty state rather than assuming files are there.

**Done when:** all 3 sample products render fully, including empty states for a product
with no gallery and no attachments, and the build emits 3 static product pages.

**This phase may be worth splitting a/b** — blocks 1–4 in one session, 5–7 in the next.

---

## Open decisions

| # | Decision | Blocks |
|---|---|---|
| 7 | **The "Insights" / magazine block has no route.** The homepage has two modules for it (`text3`, `hero5` in `src/data/home.ts`) and both link to `#` — the only dead internal links left. Either add `/insights` as a phase, or drop the two modules from the homepage. | Homepage completeness |
| 8 | **Imprint and Privacy Notice have no pages.** Both footer links currently point at `/company`. Real legal pages are usually a launch requirement in export markets. | Launch |

Decisions 1–6 from P0 are answered and recorded in
[BUILD_PLAN.md](BUILD_PLAN.md#decisions).

---

## Known pitfalls

- **Static export.** Every `[dynamic]` route needs `generateStaticParams()`. No API
  routes, no server actions, no server-side form handling. The P5 inquiry form posts
  straight to Web3Forms from the browser.
- **Web3Forms key** goes in `NEXT_PUBLIC_W3F_KEY`. It is public by nature — that is how
  Web3Forms works — so do not treat it as a secret, but do keep it out of the repo.
- **Stock photos are placeholders, not products.** The 11 homepage images show generic
  hardware and interiors. They must not be read as a Canton product catalogue. P11
  replaces them.
- **Sample product data is invented** — dimensions, materials, finishes, cycle ratings.
  Certifications are now correct (ISO 9001, ANSI/BHMA Grade 3 only). Every future
  certification claim must be checked against a real test report before it ships.
- **Site-wide `noindex` is deliberate** and stays until launch (decision 6). Removing it
  is a launch step, not a cleanup.
- **Spacing utilities are already pixels.** Root font-size is 62.5%, `--spacing: 0.1rem`,
  so `p-24` means exactly 24px. Do not convert these numbers.
- **Colour rules are binding.** See the top of `src/app/globals.css`. Guard command:
  `grep -rni "shadow\|gradient\|rounded" src/` should return only comments and
  `--radius-card`.
- **Promo-bar link contrast is 4.04:1**, under WCAG AA 4.5:1 for 18px text. Specified
  that way and left as specified. Fix options if it ever needs to pass: lighten the
  on-dark link to ~`#FF5A55` (≈5.9:1), or use white text with a red underline.
- **Header modals unimplemented.** Language / search / mega-menu are three inert buttons.
- **Responsive below 1376px** is structurally present but has never been visually
  reviewed. That is P9.
- **`canton-demo.zip` is gitignored** — regenerate from `out/` when needed. Windows
  `Compress-Archive` writes backslash path separators, which breaks the directory
  structure on most static hosts; build the zip with explicit forward-slash entry names.
- **Images are not rebuilt by `npm run build`.** They are committed files. Re-run
  `node scripts/download-homepage-images.mjs` only if a slot's aspect ratio changes.
