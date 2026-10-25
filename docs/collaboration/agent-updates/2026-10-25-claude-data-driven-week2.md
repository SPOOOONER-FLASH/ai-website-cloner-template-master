# 2026-10-25 · Claude · Data-driven week 2: API readout, one article in ten languages, E2, and a heading bug on the ja/ko/ar pages

Client (10-25): 「根据数据 写文章推送吧 全部你自己完成，或者网站其他的优化，依据数据行事，不断提升」.

Data came from the API pull, `docs/research/analytics/2026-10-25/raw/api/`, plus the Bing AI export from 10-19. The conclusions are in `docs/collaboration/2026-10-25-数据结论-API首期与本周动作.md` (Desktop 02) and in DATA-DASHBOARDS 本期结论.

## Decisions, and why

- **E1 readout (it was due 10-14 and nobody had read it).** `scripts/build-e1-readout.mjs`:
  - HS codes, English: 3/1,111 → 0/814.
  - 161/86, English: 2/235 → 0/194.
  - Rank stayed at 4–5.
  - Conclusion: title rewrites do not move clicks on answer-type queries. No more title-only experiments.
- **Week-2 candidates cut against the data.**
  - Dropped #8, box vs touch-bar mechanics. The existing push-bar article already ranks 2.9 for the exact question and answers it in its FAQ.
  - Dropped #10 as a separate "master key chart" article. The levels article already holds the chart and earns the most clicks on the site (22). A second chart page would split it.
- **Written: `content/news/master-keying-a-campus-5000-openings`.**
  - Why: the Bing AI query "master keying hierarchy university 5000 openings" has 39 citations, and GSC shows "master key plan" (93 @16) and "great grand master key" (32 @18.5).
  - Angle: campus scale only. Zoning by building, taking the perimeter off the mechanical system, keyway families, cores vs whole-cylinder rekeying, key control at scale, growth.
  - The worked example is labelled illustrative.
  - Claims stay inside the hierarchy guide's "what we confirm" boundary; no "we build N levels".
  - Hero: real catalog photo 60 CPDK (audit type `photo`, no confidence flag), framed via `build-framed-heroes` TARGETS.
- **E2 (starts 10-25, read 11-15).**
  - Changed: the seoDescription only, on `guides/door-hardware-hs-codes-2026` and `news/finish-codes-us26d-626-630`, in English plus the seven overlays. Each now gives half the answer and names what only the page holds.
  - Titles unchanged.
  - Control: `/es/guides/door-hardware-hs-codes-2026/` (seoDescriptionEs untouched).
  - Baseline (28 days): English HS 2,181 impressions / 1 click; English finishes 1,984 / 5; Spanish HS 498 / 0.
- **FR overlay:** the `en-1125-vs-en-179-2026` seoTitle is now « Différence entre EN 179 et EN 1125 ». The French query (25 impressions) was landing on the ANSI news page, not the guide.

## Bug found and fixed: headings on ja / ko / ar article pages

- **Data.** 490 overlay headings had lost their "## ": 160 each in the ja, ko and ar guides, 8 in de, 2 in ru.
- **Renderer.** `articleBlocks()` also promotes short ALL-CAPS lines to headings, and uncased scripts always equal their upper case. On ko/ar the lost headings still rendered. On **ja the same rule rendered 1,053 short paragraphs as `<h2>`** (verified live on /ja/guides/backset-door-thickness-chart-2026/: eight sentence-long h2s) and lost 107 real headings.
- **Fix, data side.** `scripts/i18n-restore-heading-markers.mjs --write` restored all 490 markers by position against the English. None were skipped; all bodies are the same length as the English. Spot-checked in ja, ar, ko and de.
- **Fix, renderer side.** `src/lib/article-layout.ts` adds `isAllCaps()`: the capitals rule now needs every letter to be `\p{Lu}`. `ArticleBody` `data-caps` uses the same function. There is a new test in `article-layout.test.ts`.
- **Guard.** `scripts/i18n-lint.mjs` now fails when an overlay heading marker is missing or misplaced. That runs in test:export, so it is a release gate. Verified by removing one marker: lint reported it.
- **Also fixed.** The hierarchy guide table in ko, ja and ru said "grand grand master" for GGMK; it now uses the news articles' term (그레이트 그랜드 마스터 / グレートグランドマスター / Главный гранд-мастер-ключ).
- **Not RAYEN.** zh pages do not use NewsDetail/articleBlocks, so RAYEN renders exactly as before.

## Tooling

- `scripts/pull-analytics-api.mjs` adds GA4 landing×source and page×event reports.
- `scripts/build-seo-opportunities.mjs` reads `raw/api/gsc-*.json` when present. Two new columns: the ranking page per striking-distance query, and ⑤ AI-assistant landing pages.
- `npm run share-images` regenerated six stale share images as a side effect: the five week-1 articles (their heroes had been reframed after the share images were made) and importing-door-hardware-china-mexico.

## Tests

- i18n-lint clean.
- titles:check passed.
- Heading-marker check passed.
- `i18n-batch` reports 0 stale and 0 untranslated for guides and news in all seven locales.
- `npm test`: 499 tests, 483 passed, 2 failed. Both failures are environmental: the sparse worktree borrowed the 10-05 `public/downloads` (spec-sheet manifest), and the redirect targets need a full export. The same two fail without this change.
- `tsc`: no errors in the files changed here; the remaining errors come from paths missing in the sparse worktree.

## Terminology conflicts the translators found (not fixed here; one pass each)

- **fr.** GGMK is « grand passe général » in news and « Passe grand général » in guide/ui. Keying schedule is « plan de combinaison » in one place and « tableau d'organigramme » in another. « contrôle des clés » is used in the bitting article where the guides say « maîtrise des clés ».
- **de.** The guide's level names are shifted one level against the news: guide GMK = Generalschlüssel and MK = Hauptschlüssel; news GMK = Hauptschlüssel. So "Hauptschlüssel" means two different levels. The fix is to align the guide to the news, which uses the common Generalhauptschlüssel → Hauptschlüssel → Gruppenschlüssel → Untergruppenschlüssel. **Done the same day:** see `2026-10-25-claude-data-driven-week2-stage2.md`.
- **ar.** In the levels article المفتاح الرئيسي الأعلى is GMK; in the guide it is GGMK. The schedule and bitting articles call the change key المفتاح الفرعي, which collides with SMK.
- **ru.** The levels article summary says «генеральный мастер-ключ» while its body says «главный гранд-мастер-ключ».
- **es/pt.** The hierarchy guide uses calques «gran gran maestra» / «grande grande mestra», and its pt contains European Portuguese («serralheiro»).

## Release

The engineering session releases. Message sent after push.
