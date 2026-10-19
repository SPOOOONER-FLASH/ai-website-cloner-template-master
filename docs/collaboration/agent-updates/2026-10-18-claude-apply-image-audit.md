# Claude · 2026-10-18 · Failed images taken off the site (task 97)

The client replied "CONTINUE" to the 10-14 audit's handling order, so I applied it.

- **New script `scripts/apply-image-audit.mjs`** (`--write`). It takes every image whose verdict in `verdicts.json` is 不通过 off its product page.
  - If a failed hero has a photograph in the same gallery, that photograph becomes the hero.
  - The files stay in `public/` and only the product records change, so this can be undone.
- **Result: 225 images off 168 product pages.** The list is in `docs/research/image-audit/removed-2026-10-18.csv`.
  - The 19-130MM hero is now its photo -3 (the drawing shows 4 holes).
  - The 6068 hero is now photo -2.
  - 28 records serve both HYDE and RAYEN, so some of these removals also change what RAYEN shows. RAYEN releases on its own schedule.
- **Not done; waiting on the client:**
  - The S564 hero carries the watermark of STAHLOCK, the client's own sub-brand.
  - The X2 hero shows the wrong part.

  No other real photo exists for either one.
- **Handed to Codex:** 20 editorial and scene images, including 3 on the homepage. See `docs/collaboration/tasks/2026-10-18-codex-replace-failed-editorial-images.md`.
- **Still open:** the explanatory notes on the 5835 and 5836 dimension drawings contradict the specs. Rerunning `build-dimension-drawings.mjs` rewrites every drawing, so it was not run.
- **Correction:** the 10-14 report called STAHLOCK a "third-party" brand. Per NOW.md it is the client's sub-brand, and `notes.md` now says so.
- **Report** regenerated: 2,584 images and 25 failures left. Three of those failures are `concepts/` images that come from the old `out/`; they are already gone from the source and will drop out after the next release.

**Tests:** `npm test` 491 pass, i18n-lint clean. titles:check flags 037 PS SEO fields, which the engineering session regenerated on origin and the merge brings in.

**Not touched:** `out/`, RAYEN.

**Release:** goes through the engineering session.
