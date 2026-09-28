# Codex — HYDE desktop, product trust and search completion (2026-09-27)

Client request: the public desktop site looks broken; find and fix the actual visual bugs, then improve SEO, AEO, GEO, SXO and AIO until the measurable work is finished. The attached acronym image is a topic prompt, not a screenshot of the broken page. This file extends the current Codex Goal; the Goal API cannot rewrite the existing objective while it is active.

## Acceptance, in priority order

- [x] Reproduce the public desktop defect at 1440px and 1920px on the homepage, Product Finder, Guides and Product Studies. Saved before/after captures and DOM measurements; scoped EN/ES/PT entrance correction and compact promo pass the final 15-scenario browser audit, including 390px mobile.
- [ ] Check critical public JS/CSS/image requests on the affected pages and the contact inquiry path; fix broken loading or layout that blocks a buyer from finding a model or sending an inquiry.
- [x] Prevent the five incorrect generated pull-handle diagrams (100/102/104/106/107) from appearing as dimensionally reliable on product pages; publish the source-image evidence and hand the catalogue/spec correction to the owner. Do not infer missing factory geometry. Verified all 15 EN/ES/PT exports and retained the verified 001 trim diagram.
- [x] Publish a repeatable audit of true HYDE product-photo occupancy, alignment and background anomalies; manually inspect the highest-impact candidates before changing any real photograph. Current integrated report: 2,432 refs / 1,647 measurable / 430 layout-review candidates. Manual inspection of 300, 100 and 564 confirms occupancy alone cannot justify reshaping or cropping a real part. No photograph edited.
- [x] Audit representative live/static HTML for indexability, canonical/hreflang, sitemap coverage, structured data matching visible facts, answer/table extractability and crawlable internal links. Integrated export semantic errors: zero; 773,711 internal links and 182,853 asset references resolve. Exact title-range, sitemap-audit and locale-interface findings are handed to their claimed owner in the 2026-09-28 findings note; these findings describe the measured baseline and require owner verification after later commits.
- [x] Verify SXO: desktop/mobile entrance and navigation layout, existing guide reading controls, product-to-contact links and inquiry feedback. Final 15-page/viewport scenarios, three delayed disclosure scenarios and four local mock inquiry scenarios passed. The passive promo no longer hides the hero CTA. Existing guide anchors, scrollable/sortable tables, FAQ and approved hero images remain.
- [ ] Run `npm run check` fully green on the exact source intended for release, commit only Codex-owned source and one handoff, push via `npm run ship`, release HYDE `out/` through `npm run release:hyde`, and verify public HTML plus referenced assets. Leave RAYEN files untouched; Cloudflare purge remains the client's step.

The search acronyms are work lenses, not five batches of speculative markup: SEO covers discovery/indexing; AEO/GEO/AIO cover clear, sourced answers from indexed pages; SXO covers the visitor's ability to understand a product and complete an inquiry. Google says AI Overviews/AI Mode need no special file or schema beyond sound Search fundamentals ([official guidance](https://developers.google.com/search/docs/appearance/ai-features)). We will not create a fabricated FAQ, AI-only text, or unsupported product compatibility to satisfy a label.

## Dependencies recorded, not inferred

- [?] Claude currently owns `HeroCarousel`, `SiteHeader`, `LocalePicker`, `SearchDialog`, motion/speed tokens and the SEO/title/content pipelines; avoid overlapping edits, provide exact reproduction and evidence instead.
- [?] Factory drawings are required for complete Blender meshes and to settle ambiguous 104/106 connector pitch and all unshown fixings. Their absence does not license a plausible drawing.
- [?] Publication is distinct from source push and from public edge verification. Do not mark the release line complete until all three are observed.

The project Stop hook is scoped to this Codex Goal session and reads only unchecked `- [ ]` items above. It allows at most one immediate continuation on an already continued turn, fails open for other sessions, and does not control Claude or RAYEN work. The persistent Goal remains the authority for later autonomous continuation.

## 2026-09-28 checkpoint

Goal status tool currently reports `usageLimited`, which only the user/system can resume. This work continues in the user-requested turn. The project hook is configured and synthetic-tested (3/3), but runtime trust/activation has not been observed and it cannot bypass account limits. Review instructions are in the current client runbook.

Desktop/mobile generator: `node scripts/audit-hyde-desktop-rhythm.mjs --base http://127.0.0.1:8766`; final 15/15 scenarios passed. `--page home --width 390,1440,1920 --settle-ms 11000 --check-promo` passed all three widths, including dismissal while expanded and the next offer starting collapsed. The browser interaction option is localhost-only. Tracked evidence: `docs/design-references/2026-09-28-desktop-verification/`.

Inquiry generator: `node scripts/audit-hyde-inquiry-feedback.mjs --base http://127.0.0.1:8766`; 4/4 mock success/failure scenarios passed at 390/1440px, including required-field validation, success focus, confetti stop, form reset and email fallback. The script rejects public domains and blocks external HTTP: zero real Web3Forms requests and no email delivery assertion.
