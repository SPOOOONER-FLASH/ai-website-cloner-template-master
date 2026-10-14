# 2026-10-13 Claude: long-read pages (rows 82–86)

Client question: long-read pages (news, guides, /company/) — do they get parallax or a scroll reveal? Answer given and confirmed: no motion on body text; the reading aids below instead, plus a light parallax on the Company page's real factory photographs.

## Stage 1 — news reads like a guide (rows 83, 86)
- `NewsDetail.tsx`: the reading computations (minutes, per-section text, models each section names, thumbnails) moved above the guides branch so both layouts share them. News now has `GuideReading` (3 px progress line, "About N min left"), `ArticleContents` (03 / 12 · 29% read) on the left, the body through `ArticleBody` (was hand-rendered inline), and `GuideModelRail` on the right that lights the models the current section names. The dateline column's "Products mentioned" text list became the guide's row of photographed model chips.
- No new strings: every label already existed for guides in all 10 locales.
- Checks: tsc clean, eslint clean on the file (unused DataTable/InlineText imports removed), 23 article tests pass; local dev render of `/news/double-fire-exit-door-hardware-set/` at 1440 and 390, no page errors, no overflow.
- Release: engineering session.

## Stage 2 — key points and margin figures (rows 84, 85)
- New optional article field `readingAids` (`types.ts`), per language like `faq`: `keyPoints` (a ruled table above the text) and `figures` (one number per section, matched by heading text, floated into the text's right margin; full width on phones). A locale without its own entry shows neither, so the 7 overlay locales show the article as before.
- `ArticleBody` renders both (`KeyPoints`, `MarginFigure`); both news and guide layouts pass the locale's aids. Styles in `ArticleReading.module.css`; `.body h2` now clears floats.
- First article: `double-fire-exit-door-hardware-set` in en/es/pt — "The set at a glance" (lines 1–2, 3, 4–5, 6; models; what sizes each) and figures 1110mm, 35–55mm, 45–85kg, 55–100kg, each copied from that language's body.
- Guard: `src/data/article-reading-aids.test.ts` (in `npm test`) fails if a figure's heading is not a heading of that language's body or its value is not written in it, or a key-points row has the wrong cell count.
- Checks: tsc, eslint, `npm test` 487/0, `npm run content`, i18n-lint, titles:check; local render en/es/pt with 4 figures + 1 table, fr with none, no page errors, no overflow at 1440/390.
- Next: other long articles get aids only when their copy is reviewed; Company photo parallax (row 82).
