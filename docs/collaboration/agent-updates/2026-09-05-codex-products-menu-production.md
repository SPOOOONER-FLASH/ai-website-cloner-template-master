# Codex — Products A+B+C+D / Hamburger D + A backup

## Implemented

- EN/ES Products share ProductsEditorialOverview: real-photo atlas, nine canonical family
  links with catalogue counts, Engineered by Canton Hyland, application/construction,
  downloads/contact. All 15 comparison categories and the complete product index remain.
- D is live via MENU_VARIANT = rfq-concierge in menu-experience.ts. A is a compiled
  specify-source-company branch, not hidden duplicate DOM. To switch, change that constant,
  run npm run check and npm run deploy:prep, commit source/out and push. Expected: A shows
  Specify / Source / Company with two real-photo cards on desktop. Stop if checks fail.
- Menu restores focus to its actual opener, traps Tab, handles Escape, restores body scroll;
  mobile full-category list starts collapsed. Existing configurator work is incorporated.
- Nine deterministic real-photo assets + source-hash sidecars + 19 responsive derivatives.
  Generator: scripts/compose-hyde-real-atlas.mjs. Six home editorial images and the three
  latest News hero sources no longer use generated hardware. No product geometry invented.

## Evidence

- npm run check passed: 190 unit tests, 25 export tests, 1029 HTML pages; zero semantic
  errors and dead links. Three existing report-only title/description length warnings.
- Impeccable detector on changed UI: []. No new dependency.
- Chromium: EN/ES 1440×950 and 390×844, nine category entries, no horizontal overflow,
  Tab containment, Escape and opener focus passed. Existing unused image preload warnings
  remain; no browser runtime errors. Captures in .impeccable/review/ (local QA artifacts).
  Capture runner: scripts/capture-products-menu.playwright.js, consumed by playwright-cli
  run-code --filename after serving out/ on 127.0.0.1:3017.
- Independent finish review: ship, scoped to three resolved findings (caption contrast,
  redundant heading/index decoration, and contradictory old imagery policy). Captions now
  meet 5.07:1 contrast. PRODUCT.md / DESIGN.md and the descriptive sidecar preserve the
  actual built system. Static release status is recorded below after completion.

## Boundaries / next useful work

- No FSB video embedded and no homepage animation implemented this round. Later motion
  should use actual photos/footage; accurate unseen angles require real CAD/3D sources.
- The old WeChat exhibition temporary paths no longer resolve. Actual source-pack push/pull
  mechanism photograph is used instead, never claimed to be an installed project or exhibition.
- Historical generated imagery remains in the archive and older untouched surfaces; this is
  not a claim of a whole-site provenance cleanup. Claude's 35 light-field studies remain
  unintegrated; inspect their actual source preservation before any later replacement.
- Claude's scene/compositing and Spanish-workbook commits were left intact. No Cloudflare
  access or purge was attempted. Codex keeps the out/ claim until the release commit.

## Release closure — 2026-09-06

- Source: 2cc2c226ec. Claude completed the client-directed full out/ release in 014f385582,
  rebuilding with the committed catalogue PDF; see his release-build-for-codex handoff.
- Latest integrated source/out commit 46b86a60c1 matches remote main (git ls-remote).
  Worktree was clean on resumption. No redundant rebuild or UI changes in this closure.
- Direct HTTPS origin check (43.131.27.225 with cantonlock.com hostname) returned 200
  for /products/; downloaded HTML was checked for the approved brand line and real atlas.
  No Cloudflare access, edge-cache investigation or purge.
- Removed the obsolete Codex NOW claim. Products/menu release is complete; animation
  remains deferred and must explain real products, not invent unseen hardware geometry.
