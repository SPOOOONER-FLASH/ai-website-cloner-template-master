# 2026-10-12 Claude: product page template, as in the approved preview

- **Request:** client 10-12, 「就用这个指南和产品页效果……设计的非常非常好」, approving the 307 preview. The three open questions are settled as the preview had them: keep the magnifier, keep the big model number, leave the drawings untouched.
- **What changed: layout only.** Every row, sentence, link, FAQ item, JSON-LD source, certification rule and empty state is the record's own, exactly as before. The order is now:
  - A stage gallery (`ProductGallery`): every view in one cell, with an `01 / 10` counter, arrows and thumbnails. Each view is still `ProductImageZoom`, so the pointer magnifier and dialog are unchanged. The hero comes first, uses `priority`, and stays the LCP. All views stay in the HTML.
  - A buy-box: a big model number rising from a mask, the name, the summary, the first four spec rows, variants, the watch cue, the three buttons, email and Alibaba.
  - `SectionNav`: a scroll-spy bar under the site header. It measures the header and publishes `--sticky-header`, because `--h-main-nav` counts the event banner, which scrolls away.
  - Chapters, each with its heading held at the left: Specifications (with `CopyText` for tenders, the facts not already in the table, and the features), a dark band (only from rows whose whole value is a number and unit, and only when there are at least 2), Drawings (only when a sheet, drawing or model exists; new `hasProductDrawings` / `hasSpecSheet`), Video (`#demonstration` is kept), Questions, Ordering (the four asks from `quoteNeeds` as a list, a prefilled mailto and Copy), Certifications (only when present), Next steps, Applications, Related.
- **Feature lines:** a heading line ("…Features:") and hand-typed "1." / "•" markers are dropped at render time. The words are not touched.
- **Motion:** CSS only. A view-timeline reveal under `@supports` and `prefers-reduced-motion`; the gallery cross-fades with a 1.04 settle. `motion:check` passes.
- **i18n:** 30 new en/es/pt strings. All seven overlays gain 27 translations each (three were already present); `i18n-lint` is clean.
- **Checks:**
  - npm test 481/481, tsc, eslint, `normalize-us-spelling --check`.
  - Dev-server screenshots of 307 and 3431 SSET on desktop and phone, with no horizontal overflow (`shoot-live-pages.mjs`).
  - fr, es, b025 and AR4-140 pages return 200 with the new nav.
- **Not run:** build and test:export; those are for the release session.
- **Neutral change:** ProductDetail is shared code. RAYEN has its own repo now, so nothing here is RAYEN's.
