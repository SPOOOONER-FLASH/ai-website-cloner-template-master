# Two reference-derived image libraries

Created for Spooner's two local style folders, with 20 final images in each library. The original folders are used only as visual references. This directory is a design library, not a published product catalogue or a list of real architectural projects.

## Review

- [20 real-product still lifes](products-contact.webp) — final files in `product-final-composites/`.
- [20 original architectural scenes](architecture-originals-contact.webp) — final files in `architecture-originals/`.
- [20 empty studio stages](product-stage-backgrounds-contact.webp) — compositing intermediates in `product-stage-backgrounds/`.
- [Real product source selection](product-sources-contact.webp) and [SHA-256 provenance](product-provenance.json).

The product geometry comes only from existing photographs in `public/images/products/`. Built-in image generation created **empty** stages, then `scripts/compose-scene-plate.mjs` cut out and placed each photographed object. No model was asked to draw a lock, hinge, lever, fastener, or fitting. Source photographs may show several parts of one published product; the composite does not claim that those parts form a separately orderable kit. The architectural scenes are invented locations. They must never be captioned as HYDE installations, real customer projects, or dimensional/installation evidence.

## Image prompts and variants

Built-in `image_gen` was used once for each empty stage and once for each architectural scene. The stage prompt used the first reference folder only for material, camera, light, and restrained still-life language. Its shared direction was: “Original 16:10 engineering still-life background; gently elevated three-quarter camera; at least 55% empty central landing zone; one soft source high-left; natural wood, stone, paper, cork or cardboard props at outer edges; no metal, hardware, tools, writing, logos or people.” The twenty scene variants were:

1. Limestone worktable, oak block, blank sheet.
2. Charcoal paper table, empty black tray, white vellum.
3. Travertine slab, walnut block, blank notebook.
4. Gray microcement, blank folded drawing, cork.
5. Dark graphite plinth, archival card, kraft box.
6. Cool concrete table, oak blocks at rear corners.
7. Gray limestone, closed kraft box and blank paper.
8. Charcoal fiber paper, folded vellum.
9. Pale plaster worktop, oak sample slab.
10. Gray felt underlay, pale stone sample.
11. Light limestone, empty black sleeve.
12. Dark charcoal stone, ivory paper.
13. Warm oak tabletop, gray mineral block.
14. Ivory microcement, empty black presentation tray.
15. Basalt tabletop, blank archival card.
16. Pale terrazzo, two oak blocks.
17. Cool concrete, rolled blank drawing.
18. Black fiber paper, walnut block.
19. Taupe plaster, stone cube.
20. Charcoal slate, cream card and cork.

The architecture prompt used the second reference folder only for quiet material, orthogonal framing, natural light, and editorial restraint. Its shared direction was: “Completely original 16:10 landscape architectural editorial photograph, physically plausible construction, gentle available daylight, subtle film grain, crop-safe geometry; no people, text, logos, recognizable landmarks or visible hardware; no glossy CGI or dramatic sunset.” The twenty scene variants were:

1. Coastal limestone vestibule and muted sea.
2. Concrete covered walk around a planted court after rain.
3. Oak civic atrium with clerestory light.
4. Ribbed-glass gallery and patterned light.
5. Pale brick cloister and gravel court.
6. Terracotta-plaster courtyard with deep portals.
7. Basalt entrance in northern daylight.
8. Limestone museum hall and framed garden.
9. Oak-lined corridor ending in a daylight court.
10. Rammed-earth pavilion and desert planting.
11. Travertine stair hall and skylight.
12. Zinc-clad passage beside concrete.
13. White lime-plaster garden court and olive tree.
14. Slate court and reflecting pool.
15. Polycarbonate corridor and soft daylight.
16. Fair-faced concrete library atrium and oak slats.
17. Sandstone colonnade and winter trees.
18. Brick conversion passage and limewashed vault.
19. Frosted-glass stairwell and terrazzo.
20. Sea-facing concrete gallery.

`node scripts/build-codex-style-library.mjs --prepare` rebuilds the contact sheets from the preserved generated files. `node scripts/build-codex-style-library.mjs --compose` rebuilds the 20 product composites and their provenance manifest from the real catalogue photographs and staged backgrounds. The 20 architecture originals and 20 stages are preserved here, so the contact sheets do not require an image service to rerun. This imagery is for review and selection; site integration needs a separate visual and factual QA pass.
