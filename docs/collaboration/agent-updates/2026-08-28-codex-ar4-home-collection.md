# Codex — HYDE Argentina AR-4 homepage + collection

- **Scope:** inserted the seasonal Argentina AR-4 showcase immediately after the HYDE welcome block and before the permanent panic-exit flagship; added EN/ES collection pages, exact-path hreflang, sitemap, ItemList/Breadcrumb JSON-LD and llms.txt discovery.
- **Products/assets:** the four AR4 product records, cleaned WebPs, responsive editorial variants and catalogue pagination were committed concurrently in `1355af2b1` while Claude held the release-build baton. This commit completes their routes and presentation without rewriting Claude's product/news work.
- **Tests:** `npm run check` passed — 51 unit tests, 484 static routes, 23 export/SEO tests, 0 semantic SEO issues and 0 editorial warnings. Browser QA passed on desktop and 390 px mobile; four cards render, no horizontal overflow, A+D rest/hover states match the agreed contract, and EN/ES canonical/hreflang are reciprocal.
- **Untouched:** no price, MOQ, lead-time, certification, door-thickness, handing or compatibility claims were inferred. Generated `out/` is intentionally committed separately as the release artifact.
- **Risk / next assist:** reconcile nominal catalogue dimensions against the factory drawings before producing a downloadable technical datasheet; add exact Alibaba listing URLs when supplied.
