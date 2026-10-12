# CONTROL coloured source-photo review batch — updated 2026-10-12

Review-only files. No live images or product records changed. Clean masters contain no baked-in labels. The isolated full project check passed; its generated exports are excluded from the review commit.

## Current visual disposition

| Category | Model | Field | Disposition |
|---|---|---|---|
| brass-steel-hinges | SSH016 | petrol-blue | HELD: bright countersink versus source paper needs further review |
| brass-steel-hinges | B024 | sage | Ready for client preview; catalogue portrait, no ground claim |
| door-closers | JU-061 | burgundy | Ready for client preview; catalogue portrait |
| door-closers | JU-093 | sage | Ready for client preview; catalogue portrait |
| bathroom-accessories | BH05 | petrol-blue | Held: soft contour and small hook-tip artifacts |
| bathroom-accessories | BH08 | terracotta | Held: broad white source edge unsafe to remove |
| glass-door-accessories | 100 | terracotta | Held: exterior paper reaches real white specular tube stripe |

Parent ../review.json is the current disposition authority, superseding old receipts. Technical provenance remains separate from visual disposition. PREVIEW is not client aesthetic approval or installation certification.

B024/SSH016 now remove connected source-paper regions, not entire circles. B024
regression assertions protect real metal at (612,423) and remove paper at (640,423).

## Reproduce and verify

From this retained worktree root:

    node docs/design-references/kanee-category-colour-2026-10-10/control/recipe.mjs

Pass one or more sample IDs to reproduce only those folders. Existing installed sharp is used; no package install or image model. The only generated field images are the already supplied empty fields in ../empty-fields/; all hardware RGB comes from public/images/products/. Parent source assets are not modified.

Each sample retains a byte-identical source.webp, photographic-matte.png, alpha-mask.png, shadow-transmission.png, PNG and WebP output, source/output 3x comparisons and provenance.json. Protected opaque RGB is asserted exactly; partial edge white-paper decontamination count is recorded. This assertion does not detect an incorrectly removed part, hence the independent visual QA.

Only SSH016 has a reviewed source-ground window, reused through the existing build-kanee-source-shadow functions. All other samples are catalogue portraits with no fabricated ground, offset silhouette, new shadow or product relighting. No resizing/rotating/recolouring of the product was used.

## Remaining assigned models

All ten additional models are now composed. PREVIEW: 881 SS, 300, 301, 112, BH57,
DS01, FB001. HELD: S03, BH56, F100 SS (source ground remnants). 881 SS uses the genuine
back mechanism view, not a complete kit claim; FB001 front/back counts as one model.
A genuinely distinct second HYDE floor/pivot model is unconfirmed; wooden-door-floor-hinge
is the same F100 assembly and must not count twice. D3010 is RAYEN-only and excluded.

BH56/BH57 real neutral photographs exist, but the current records file them under bathroom-accessories; older retained records explicitly map them to care-grab-bars. That taxonomy repair is not implemented by this image-only batch. Finish descriptions remain photographic appearance, not newly inferred specifications.
