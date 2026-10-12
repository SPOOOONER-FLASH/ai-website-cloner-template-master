# 2026-10-12 Claude — product meta descriptions no longer stop at ~90 characters

- Ahrefs: "Meta description too short" on 3,509 pages. Measured on out/: product pages were nearly all of it
  (en 223, es 101, pt 96, fr/de/tr/ru/ar 482–520, ja/ko all 549).
- `scripts/build-product-titles.mjs`: when a generated description is under 110 characters, add the product's
  own summary first sentence (en/es/pt from the record, the seven overlays from the translator's `summary`):
  inserted before the "Factory direct…" line, else as "model + summary", else unchanged. Sentences that trip
  the CERT guard are never used; nothing is truncated. ja/ko ceiling 90 characters (≈150 Latin widths).
- After: en 47, es 28, pt 28; fr 190, de 146, tr 128, ru 146, ar 138 still under 110 (their facts plus summary
  would exceed 150). ja/ko stay under 110 by design — Ahrefs counts characters, Google truncates CJK near 90.
- titles:check, i18n-lint, npm test 462/0.
