# HYDE motion and product studies

## Goal and delivery order

1. CANCELLED by client on 2026-09-07: the three photographic zoom films did not meet the reference. Deleted the trial assets and integration before any push. Preserve the original homepage carousel. Do not restart this approach.
2. Replace the mismatched distributor/specifier, engineering and FAQ imagery with deliberately composed real-product architectural studies. Keep each image tied to its actual role; never imply a sold kit or completed project.
3. Three editable Blender product studies, evidence manifests and rendered previews. Only verified geometry may be represented as a production model. Preserve source scripts alongside assets.

## Reference anatomy

Inspected local FSB film: 1280×720, 30 fps, 1201 frames (about 40 seconds), silent. Twelve sampled frames were extracted with scripts/blender/inspect-reference-film.py into tmp/codex-fsb-film.

The sequence stays close to the dark handle profile, moves the viewing position slowly across the recessed/rounded surfaces, lets grazing highlights describe the surface, and introduces the FSB/model signature at the end. These are photographic decisions, not UI transitions. The supplied footage and brand signature are reference-only and are never copied into public assets.

HYDE thesis: the full product is a recognisable anchor; a slow detail study makes construction and finish readable; return to the whole silhouette. Charcoal/warm gray, restrained metal highlights, quiet typography below the image. No distortion, invented holes, fake assembly, simulated opening action or artificial finish changes on catalogue photographs. Simple photographic zooms were rejected; they do not deliver the reference's geometry, grazing light and directed macro cinematography.

## Accuracy and scope

9001, B024 and 70SN screenshot records do not contain all dimensions necessary for faithful solid models. The legacy lock-case Blender script still defaults bore sizes and assumes absolute vertical positions; its earlier half-size box bug is fixed. Do not reuse its unverified solid as production product imagery.

The client endorsed the three-tier geometry policy in docs/collaboration/tasks/2026-09-07-blender-undimensioned-features.md: exact published dimensions; explicitly documented neutral closure dimensions with non-featured, featureless faces; omit optional unknown features. External source drives F:/a, F:/资料 and G:/新网站资料 were unavailable on 2026-09-07. The repository catalogue remains the available source.

## Acceptance

Every remaining stage: npm run check, static output and explicit owned-path commit, push. Cloudflare purge is client-only. No trial video assets or playback integration may remain in the release export after the withdrawal.
