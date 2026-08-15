# Canton Hyland — Progress

> Read this file first in a new session. It says where we are and what to do next.
> The full plan lives in [BUILD_PLAN.md](BUILD_PLAN.md).

---

## Current status

| | |
|---|---|
| **Phase** | **P1 — Homepage imagery** |
| **Status** | ✅ Complete |
| **Last updated** | 2026-08-15 |
| **Build** | `npm run build` passing · lint 0 errors · typecheck clean |
| **Git** | clean tree, all work committed |
| **Next phase** | **P2 — Site skeleton** (**not started — do not begin without being asked**) |

---

## Completed

| # | Phase | Key output files |
|---|---|---|
| — | Homepage prototype — layout reverse-engineered from `fsb.de`, pixel-exact at 1512px across 21 modules | `src/app/page.tsx`, `src/components/sites/www-fsb-de-bf263c85/**`, `docs/research/**` |
| — | Static export — `output: "export"`, packaged to `canton-demo.zip` | `next.config.ts` |
| — | Brand colour system — full token set, 4 binding colour rules, button spec | `src/app/globals.css`, `shared/Button.tsx` |
| **P0** | Foundation — git safety net, planning docs, content model | `BUILD_PLAN.md`, `PROGRESS.md`, `src/data/types.ts`, `src/data/products.ts`, `src/data/categories.ts` |
| **P1** | Homepage imagery — 11 stock photos replace the placeholder blocks | `public/images/*.jpg`, `IMAGE_CREDITS.md`, `scripts/download-homepage-images.mjs`, `shared/MediaPlaceholder.tsx`, `en-7a4ba3ba/content.ts` |

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

## Next: P2 — Site skeleton

The structural phase everything else sits on. In order:

1. **Move `SiteHeader` / `SiteFooter` into `src/app/layout.tsx`.** They currently render
   inside `src/app/page.tsx`, so a second page would have no navigation.
2. **Move components out of the clone namespace.**
   `src/components/sites/www-fsb-de-bf263c85/en-7a4ba3ba/` → `src/components/site/`.
3. **Point the header nav at real routes.** Every link is `href="#"` today. Set the
   `current` flag per route so the active item picks up brand red (colour rule 1).
   The flag is already wired in `SiteHeader.tsx` — only the data needs filling in.
4. **Footer links to real routes.**
5. **Custom 404** at `src/app/not-found.tsx`.
6. **Stub pages** for `/products`, `/projects`, `/downloads`, `/company`, `/contact`.
7. **Done when:** every nav and footer link lands on a real page, build passes, and `/`
   still renders identically.

**Regression guard for steps 1–2:** the homepage geometry is verified — 21 modules at
fixed offsets, document height 10837px at a 1512×900 viewport. Re-run that check before
committing; the script is in
`docs/research/www-fsb-de-bf263c85/en-7a4ba3ba/VISUAL_QA.md`.

---

## Open decisions

None outstanding. All six from P0 were answered and are recorded in
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
