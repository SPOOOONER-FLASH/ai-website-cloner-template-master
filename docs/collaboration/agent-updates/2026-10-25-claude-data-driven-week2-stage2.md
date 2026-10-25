# 2026-10-25 · Claude · Week 2, stage 2: "institutional grade" in ten languages, German master-key level names

Second stage of the client's 10-25 request (「根据数据 写文章推送吧……依据数据行事」). Stage 1 is `2026-10-25-claude-data-driven-week2.md`.

## 1. "Institutional grade" section in `guides/cycle-testing-durability-grades-2026`

**Why.** The Bing AI query "institutional grade hardware durability test" has 26 citations, and our share is 22% (export of 10-19). The guide never used the word.

**What changed.**
- A new H2 and four paragraphs, placed before "What the cycle count does not cover".
- A new FAQ entry, fourth in the list (inserted at index 3).
- One added clause in the summary.
- Languages:
  - English, Spanish and Portuguese are on the record.
  - The seven overlays went through `i18n-batch --stale` and `i18n-merge`; 0 stale afterwards.
- All ten locales now have the same structure: 8 headings and 7 FAQ entries. This was checked with `articleBlocks()`.
- seoTitle and seoDescription were not touched. They belong to the engineering session, and E1 showed that titles do not move clicks.

**Facts used, and where each comes from.**
- **ANSI/BHMA cycle counts and grades:** already in the guide.
- **"Normally read as ANSI/BHMA Grade 1":** this is how the phrase is used in North American trade practice (distributor and manufacturer literature), and the text says so; it is not presented as a standard.
- **"Institution" lock function:** the same trade source. Both levers are always fixed, and the latch is withdrawn by key from either side.
- **EN 1906 category of use 3 and 4:** paraphrased, not quoted, from the category-of-use descriptions that manufacturers' literature reproduces. They agree with `lever-return-and-en-1906-2026` body[13] and body[21].
- **"None of our product records states an ANSI/BHMA grade or an EN 1906 category of use":**
  - Checked over all 616 HYDE records: name, summary, description, specs, features and certifications.
  - No HYDE record has a non-empty `certifications` array.
  - The only hit was an image filename: `ansi-grade-3-keyed-deadbolt.webp`.
  - The sentence is now registered in `src/data/article-catalogue-claims.test.ts` with an assertion. If a record ever states a grade, the test fails and names it.
- **No new claims:** no new count and no new commitment. The closing advice is the guide's existing boundary: ask which test report covers the model before it goes into a submittal.

## 2. German master-key level names

The conflict was recorded in stage 1: "Hauptschlüssel" meant MK in the guide and GMK in the news.

- **`content/i18n/de/guides.json`, `master-key-hierarchy-planning-2026`:** 19 edits in 15 strings, made one at a time against the English.
  - Level names now match the news: GGMK Generalhauptschlüssel, GMK Hauptschlüssel, MK Gruppenschlüssel, SMK Untergruppenschlüssel, change key Einzelschlüssel.
  - A master key of no particular level is now "übergeordneter Schlüssel", which is the keying-schedule article's usage.
  - Generic compounds are kept: Hauptschlüsselanlage, -ebene, -fähigkeit, -regeln.
- **`content/i18n/de/news.json`, `master-key-systems-how-many-levels-you-need`:** body[19] said Gruppenschlüssel/Hauptschlüssel for SMK/MK. It now says Untergruppenschlüssel/Gruppenschlüssel, matching its own table.
- **`src/components/site/MasterKeyHierarchyFigure.tsx`:**
  - The German labels and caption now follow the new table.
  - The ja, ko and ru GGMK labels now match their guide tables (those tables were corrected in stage 1).
  - Box text still fits; it is checked by the `fit()` estimate.

Not changed: the ja/ko `ui.json` value for "Grand grand master (GGMK)". Nothing in `src` reads that key any more; `src/data/feature-columns.ts` used it and no longer exists. It should go in the next ui prune.

## Tests

- i18n-lint, titles:check, `stamp-article-revisions --check` and `i18n-restore-heading-markers --check`: all clean.
- `article-catalogue-claims` plus 33 related tests: all pass.
  - The claims test reads `public/images/drawings` and `public/images/door-prep`, which are outside this sparse worktree. They were borrowed by junction and the junctions were removed afterwards.
  - **Note for sparse worktrees:** a junction under a sparse path clears the skip-worktree bits. After removing it, run `git sparse-checkout reapply`, or git reports 181 deletions.
- `npm test`: 461 of 484 pass and 9 fail. Every failure is environmental:
  - ENOENT on `public/` paths outside the sparse cone: drawings, door-prep, downloads, `admin/config.yml` and `.well-known/security.txt`. The real `security.txt` expires 2027-09-25.
  - One redirect test that needs a full export.

## Release

The engineering session releases. A message goes to it after the push.
