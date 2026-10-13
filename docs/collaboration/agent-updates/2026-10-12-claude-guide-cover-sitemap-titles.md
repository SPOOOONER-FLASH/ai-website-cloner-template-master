# 2026-10-12 Claude — guide cover → product, robots sitemaps, Ahrefs titles

Goal rows #168, #169.

| Change | Files |
|---|---|
| Guide cover photo opens the product it shows (matched by image file name over related, then all published products); caption gets "View product: <model> →"; `data-link-list="article-cover"` for GA4 `select_item`. All 12 guides with a product-photo cover match. Without a match the old "open original image" link stays. | `GuideCover.tsx`, `GuideArticleIntro.tsx`, `NewsDetail.tsx` |
| robots.txt no longer lists the ten RSS feeds as sitemaps — Ahrefs "sitemap has wrong format" = exactly those ten. Feeds stay linked from every layout. Test inverted deliberately. | `src/app/robots.ts`, `src/data/discover-readiness.test.ts` |
| ja seoTitles 9–15 chars → full title + "\| Canton Hyland" (2 news, 3 projects). ru 023 ETAN name shortened ("для «антипаники»"), title 75 → 65 chars via `build-product-titles.mjs --only "023 etan"`. | `content/i18n/ja/{news,projects}.json`, `content/i18n/ru/products.json` |

Tests: tsc, eslint (changed files), i18n-lint, titles:check, `npm test` 481/0.
Not touched: RAYEN lane. Risk: none known; feeds already submitted in Search Console stay submitted.
Next: Ahrefs re-crawl should drop the 10 sitemap and 5 title issues.
