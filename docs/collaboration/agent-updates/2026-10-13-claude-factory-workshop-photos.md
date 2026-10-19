# 2026-10-13 · Claude · company page: stamping-plant photographs

**Scope.** Client, 10-13: the stamping plant's workshop photos may be published once company
lettering is removed (「…上架使用，他们授权了」, 「照片都可用 你自己看着搭配 优化视野视角」).

- 12 photographs, `public/images/company/factory-workshop-01…12.webp`, lettering painted out,
  one wall screen blurred, cropped to 3:2; 480/960 srcset variants in
  `public/images/editorial/responsive/` and `editorial-images.config.json`. One near-duplicate
  assembly shot and the production-dashboard photo were left out.
- `factoryWorkshop` in `src/data/company.ts` (en/es/pt captions), rendered as a new section
  "From press to packing" on the company page, 3 columns on desktop, process order.
- `localiseImageLabel` now goes through `tx()`, so the seven overlay locales can translate
  image captions via ui.json (en/es/pt behaviour unchanged).
- `i18n-extract-ui.mjs`: `factoryWorkshop` extracted; `labelEs`/`labelPt` never become keys.
  14 new keys, 0 removed; all seven locales merged with `i18n-merge.mjs` (14/14 each).
- IMAGE_CREDITS.md: new "2026-10-13 stamping-plant set" section. Not HYDE-marked.

**Tests.** `i18n-lint` clean; `build-i18n-client-ui --check` current; typecheck has no errors in
the touched files (the 12 it reports are files absent from this sparse worktree). Image/i18n
tests: 28 pass, 6 fail on files absent from the sparse worktree (share images, products-hyde).
The full `npm run check` happens in the release checkout.

**Not touched.** The ISO wording and article cuts (separate commits, same day).

**Risk / next.** Not yet seen rendered: the engineering session should glance at /company/
after `release:hyde` (12 cards, 3:2, captions under each), then run `mirror-to-gitlab.mjs`.
Never name the plant on the site.
