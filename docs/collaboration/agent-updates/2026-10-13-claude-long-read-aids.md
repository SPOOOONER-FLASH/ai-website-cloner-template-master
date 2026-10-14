# 2026-10-13 Claude: long-read pages (rows 82–86)

Client question: long-read pages (news, guides, /company/) — do they get parallax or a scroll reveal? Answer given and confirmed: no motion on body text; the reading aids below instead, plus a light parallax on the Company page's real factory photographs.

## Stage 1 — news reads like a guide (rows 83, 86)
- `NewsDetail.tsx`: the reading computations (minutes, per-section text, models each section names, thumbnails) moved above the guides branch so both layouts share them. News now has `GuideReading` (3 px progress line, "About N min left"), `ArticleContents` (03 / 12 · 29% read) on the left, the body through `ArticleBody` (was hand-rendered inline), and `GuideModelRail` on the right that lights the models the current section names. The dateline column's "Products mentioned" text list became the guide's row of photographed model chips.
- No new strings: every label already existed for guides in all 10 locales.
- Checks: tsc clean, eslint clean on the file (unused DataTable/InlineText imports removed), 23 article tests pass; local dev render of `/news/double-fire-exit-door-hardware-set/` at 1440 and 390, no page errors, no overflow.
- Release: engineering session.
