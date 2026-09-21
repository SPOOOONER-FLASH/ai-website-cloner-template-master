# Real-product studio background edits — 2026-09-15

User requested more studio/background treatments using real product photography and replacement of the old 305 overview subject with 311 or 307. Built-in image_gen was used, not the API/CLI. The supplied previous studio images served as mood references, not engineering evidence.

Selected: 311 warm grey and 9001 warm stone. Compared against their exact catalogue images for silhouette, components, mounting forms, openings and visible fasteners. These are edited photographs, not pixel-identical foreground composites, dimension drawings or installation evidence. Source product pages retain original photographs.

Rejected: both 307 charcoal attempts had invented/uncertain housing details; 70SN changed key details; the full-atlas attempt regenerated surrounding products. None is published. The overview instead uses the existing native HTML atlas and the unmodified HYDE-branded 311 photograph, preserving every other catalogue subject.

## Prompt set

### 311-warm-grey.png
Edit this exact real catalogue product photograph. Create a premium clean studio image on a softly lit light warm-grey seamless background, subtle realistic contact shadow. Remove only the old oval Hyland logo and blank margins. Retain the exact 311 panic exit device including both black mounting housings, both black curved arms, silver horizontal bar, all visible fasteners and the euro-profile opening in the right lower plate. Absolutely no invented geometry, no new parts, no deleted holes, no change of viewpoint, no product recolouring. Use original product pixels as a locked foreground cutout; background-only editing. Landscape 3:2 composition, full product visible with comfortable margins, no text, no logo. This is real engineering hardware, every edge and hole must remain identical.

### 9001-warm-stone.png
Edit only the background of this real 9001 stainless steel lever handle and separate square euro escutcheon photograph. Keep the exact original curved lever, nested square rose, small grub screw, separate escutcheon outline and euro opening, brushed finish and original viewpoint fully unchanged. Remove only old oval logo and blank white surroundings. Warm pale limestone studio backdrop with a soft daylight shadow and very subtle stone grain, calm luxury hardware photography. No new products or props, no mounting screws invented, no restyling. Preserve original photographic product as locked foreground. Landscape 3:2 with safe margins around both existing pieces. No text.

Re-export: `node scripts/publish-studio-20260915.mjs`. The two entries are kept separately from the existing generated study list so older gallery regeneration cannot silently discard this reviewed selection.
