# Canton Hyland — Progress

> Read this file first in a new session. It says where we are and what to do next.
> The full plan lives in [BUILD_PLAN.md](BUILD_PLAN.md).

---

## Current status

| | |
|---|---|
| **Phase** | **P3 — Product detail page** ⭐ ✅ |
| **Status** | ✅ Complete |
| **Last updated** | 2026-08-16 |
| **Build** | `npm run build` passing — 21 static pages, including 12 product detail pages |
| **Git** | clean tree, all work committed |
| **Next phase** | **P4 — Product overview + category pages + listing + filtering** (**not started — do not begin without being asked**) |

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
| **P3** | Product detail page — seven content blocks, 12 statically exported product routes, verified empty states and model-aware inquiry links | `src/app/products/[category]/[slug]/page.tsx`, `src/components/site/ProductDetail.tsx` |
| — | **Client asset drop** — real photography, company profile, category tree and 12 real products replace all stock and invented data | `public/images/{products,company,certificates}/`, `src/data/{products,categories,company,home}.ts`, `IMAGE_CREDITS.md`, `scripts/process-client-assets.mjs` |

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

### Client asset drop (part of P11, pulled forward)

All stock photography and all invented sample data are **gone**. Everything on the site is
now the client's own material.

**Where it came from.** The client delivered a WeChat asset pack on 2026-08-15 — 15 product
shots, 4 category shots, 4 factory photos, 4 certificate scans, 2 banners, plus an English
company profile and banner copy in .docx. That turned out to be better than scraping their
Alibaba storefront: first-party, higher resolution, no platform watermarks, no anti-bot.

**What was scraped, and what was blocked.** The Alibaba storefront *overview* and *product
list* pages read fine — that gave the real category tree and the published company figures.
**Product detail pages are captcha-protected** ("Captcha Interception"). Not retried, per
instruction. The consequence is below.

**⚠ Spec tables are empty on purpose.** Detail pages were the only source of dimensions,
materials and finishes. Rather than invent plausible numbers, `specs` carries only what the
client's own product names state (LC14 85×50 → 85 mm centres, 50 mm backset). Everything
else waits for the client's catalogue. **An empty spec table is honest; a fabricated one is
a liability.** P3 must therefore render an empty-state spec block.

**⚠ Certifications are deliberately NOT attached to products.** Each of the four certificate
scans names a specific model — KD070/30-290, KD070/20-101, 607 SS ET. None names any of the
12 products shipped. Publishing "EN 1125 certified" on model 305 because a sibling model was
tested would be a false claim. So the four reports are transcribed in `src/data/company.ts`
as **company credentials with their exact model references**, and per-product records carry
only ISO 9001 (company-wide, client-stated) and ANSI Grade 3 where the client's own product
name asserts it.

**⚠ Image quality — the client asked for a verdict on each.** Full table in
[IMAGE_CREDITS.md](IMAGE_CREDITS.md). Summary:

- 🔴 **Four images must be re-exported or reshot.** `hero-grip-handle-banner` (0.54× the
  slot width) and `hero-panic-exit-banner` (0.57×) come from 1024×397 sources and the
  browser upscales them ~2× — visibly soft, and they are the two biggest images on the
  homepage. `facility-yard` (0.71×, also looks upscaled or synthetic at source) and
  `hero-storefront-banner` (0.86×) are the other two.
- 🟡 **The 16 product shots are acceptable** — clean, sharp, correctly exposed, 1.47× the
  card size. Fine for the demo.
- 🟡 **The three factory photos are genuine and read as real**, which is their value, but
  they are 0.91× at hero size and have a phone-camera look.
- ⚠️ **Every product image carries the Hyland logo lozenge burned into the corner.** Their
  own trademark, so no licensing issue, but a glossy red-and-chrome badge repeated on every
  card is the loudest element on a page built from flat white and hairlines — and it
  duplicates the header wordmark. Ask for un-badged re-exports; usually a one-click job.

**Two placeholder slots are now filled.** The 87:46 signature slot uses
`certification-marks.svg`, a monochrome vector drawn for this project (ISO 9001 + ANSI/BHMA
Grade 3, inherits `--color-ink`). The 306:156 slot uses a hinge close-up — the brief asked
for CAD line art and the pack has none, so it is flagged in BUILD_PLAN.md for P11.

**Geometry.** Module heights shifted because the real copy is a different length from the
placeholder copy — that is content changing on purpose, not a layout regression. Structure
is intact: 21 modules, content band 1376px, 13 images, 0 placeholders.
**New baseline, document height 10766px:**
`816,848,636,96,861,384,120,48,776,288,646,288,1200,288,96,48,776,288,96,48,975`

---

## Next: P4 — Product overview + category pages + listing + filtering

Build the catalogue discovery layer using the existing real product and category data:

1. `/products` — overview of the real top-level categories.
2. `/products/[category]` — product listing for each category.
3. Sub-category values remain filters only; they do not add a URL level.
4. Reuse the P3 product-card treatment and existing site header/footer components.
5. Generate every category route for the static export and provide clear empty states.

Do not start P4 automatically; begin it only when the next session explicitly asks for
the next unfinished phase.

---

## Open decisions

| # | Decision | Blocks |
|---|---|---|
| 7 | **The "Insights" / magazine block has no route.** The homepage has two modules for it (`text3`, `hero5` in `src/data/home.ts`) and both link to `#` — the only dead internal links left. Either add `/insights` as a phase, or drop the two modules from the homepage. | Homepage completeness |
| 8 | **Imprint and Privacy Notice have no pages.** Both footer links currently point at `/company`. Real legal pages are usually a launch requirement in export markets. | Launch |
| 9 | 🔴 **Founding year and legal name conflict.** The client's English profile says *"founded in 1998"* and *"over three decades"*. Their own Alibaba storefront says *"Year Established: 2012"* and *"more than 25 years"*. The certificates are issued to *"Canton Hyland Hardware Co., Ltd"*, the profile says *"Canton Hyland Hardware (Group) Co., Ltd."*, Alibaba says *"Canton Hyland Hardware & Locks Co., Ltd."* — three names. Nothing on the site states a founding year until this is resolved; `src/data/company.ts` deliberately omits it. Overseas buyers do check this. | Company page (P6), launch |
| 10 | **Seven products have no real SKU.** They arrived as descriptive names only and are flagged `modelTbc: true` in `products.ts`. P3 displays “Reference available on request” and intentionally omits the model query parameter for them. Confirmed SKUs are still needed before P5/P11 completion. | P5, P11 |

Decisions 1–6 from P0 are answered and recorded in
[BUILD_PLAN.md](BUILD_PLAN.md#decisions).

---

## Known pitfalls

- **Static export.** Every `[dynamic]` route needs `generateStaticParams()`. No API
  routes, no server actions, no server-side form handling. The P5 inquiry form posts
  straight to Web3Forms from the browser.
- **Web3Forms key** goes in `NEXT_PUBLIC_W3F_KEY`. It is public by nature — that is how
  Web3Forms works — so do not treat it as a secret, but do keep it out of the repo.
- **Client product photos are B2B-platform material.** They are useful for an honest
  prototype but several need professional reshooting in P11 to match the minimal layout.
- **Sparse product data stays sparse.** P3 shows explicit empty states instead of
  inferring specifications, gallery views or downloads. Every certification claim still
  needs model-by-model verification against the original report before launch.
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
