# 2026-10-12 Claude — homepage carousel: new exit-device image, two Argentina slides

- Client 10-12: replace the homepage exit-device image with the one they sent; add AR-4 and AR-5
  (Argentina collection) slides; Codex makes the final wide images.
- Slide 1 now uses `/images/editorial/home-panic-exit-double-door.webp` (client image, 1774×887). Its
  provenance is not recorded, so en/es/pt labels and OG alts no longer name 306-D. The old
  `home-panic-exit-bars.webp` and its build script stay (still checked in prebuild).
- New slides 2–3: HYDE Argentina AR-4 → `/products/argentina-ar4` (existing entry image, temporarily
  duplicated with the showcase lower on the page); HYDE Argentina Collection → `/products/argentina`
  (placeholder: real AR5-115 photo centred on white). es links into /es; pt links to the English pages
  (no pt route); overlays via ui.json (7 locales translated).
- Tests: `home-destinations` accepts market-collection routes; `locale-route-parity` checks the link
  target, not only its first segment. npm test 462/0, tsc, eslint, i18n-lint, srcset/mobile-crop checks.
- Codex hand-off: docs/collaboration/tasks/2026-10-12-codex-home-carousel-argentina-images.md.
