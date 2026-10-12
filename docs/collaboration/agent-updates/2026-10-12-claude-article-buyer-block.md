# 2026-10-12 Claude — articles now hand readers to products (#166) ; unbacked product claims removed

Why: Bing AI report 2026-10-12 — Copilot cited guides/news 2,330 times, product pages 28. Client: push products
and qualifications inside guides and news. Plan: docs/collaboration/tasks/2026-10-12-article-product-routes.md.

- NEW `ArticleBuyerBlock` after the FAQ on every guide and news page, all ten locales: "Related products" (up to
  3 ProductCards from `relatedModels`, the rest as model links), a "Request a quote" row whose link pre-fills
  the models (`/contact/#model=…&from=guides/<slug>`; "Ask a question" when no product), and one curated
  "Next step" (compare / category / finishes / certificates / price list / documents) from the new
  `content/article-routes.json` (29 articles, validated by `src/data/article-routes.test.ts`). Contents rail
  gains "Related products". No badges, prices, certificate lines or animation.
- Quote links everywhere moved from `/contact/?…` to `/contact/#…` and the product page CTA lost
  `rel="nofollow"` (Ahrefs: nofollow internal links on 3,843 pages). `src/lib/inquiry-prefill.ts`: the query
  still wins, so old links work; the form now sends `source_article` with the lead.
- Claim cleanup (neutral lane, also what RAYEN renders for these records): removed "Standards: ANSI Grade 2/3"
  (028, 5831 SSET, black tubular lever set), the "Fire Rating" spec rows on 300/307/310, and ISO 9001 as a
  per-product certification on 19 records — the site states it holds no ANSI/BHMA certification and no fire
  rating without a certificate. Company-level "ISO 9001 since 2002" unchanged. New `src/data/product-claims.test.ts`.
- Content: master-key guide gets its two sheets as Downloads; finish-codes drops 3431 SSET (zinc labelled
  US32D contradicted the article); three seeAlso links.
- Tests: npm test 473/0, tsc, eslint. Dev server could not render (PostCSS loader timeout in this worktree);
  verification is on a static build before push.
- Untouched: NewsDetail is listed under a stale Codex "guides DCB" row (09-22) — changed anyway, announced here.
  E1 title experiment pages get the block too (confound for the 10-14 readout).

## Review fixes (same day, before push)
- Adversarial review (wf_c9dad4da-910; verifiers hit the session limit, so each finding was checked by hand):
  next-step links now go through `localisedHref` (`/request/price-list/` is English-only; 9 locales 404'd);
  the section is labelled by its heading only when it has products; GuideArticleIntro's "Before you specify"
  panel skips the products entry; door-preparation (ANSI 161/86) now points to Documents, not euro lock cases.
- Copy that relied on the removed fire ratings, all ten languages: exit-device comparison guide (table rows
  300/307/310 and the paragraph on fire durations) and the UL 305 article ("our 305 states no fire rating
  either"). Spec-sheet PDFs regenerated so they stop printing Fire Rating / ANSI Grade.
- Verified on a full static build: block on 820/820 article pages, 0 `/contact/?` links, 0 `rel="nofollow"`,
  no Chinese; screenshots en desktop and ar 375px.
