# HYDE Editorial Imagery Design

## Objective

Replace the site's weakest synthetic product-in-room imagery with an original, coherent editorial image system inspired by high-end architectural publishing while preserving Canton Hyland's factual product and manufacturing evidence.

The approved visual mix is:

- 60% architectural editorial photography
- 25% industrial and material studies
- 15% warm residential and hospitality interiors
- no people in newly generated imagery

## Brand and truth constraints

- Use the supplied HYDE identity as the brand reference. Do not redesign the logo and do not render it inside generated images.
- Keep the existing official vector logo in the navigation because it is sharper and more responsive than the supplied raster reference.
- Generated images must contain no text, letters, logos, watermarks, signage, project names, certification marks, or identifiable third-party brands.
- Generated buildings are representative application concepts, not completed Canton Hyland projects. The existing representative-application disclosure remains visible on project pages.
- Do not replace technical product photography, certificate scans, or factual manufacturing evidence with generated imagery.
- Generated door hardware may appear only as a small contextual architectural detail. It must not be used for dimensional, compliance, or product-specific claims.
- Preserve every pre-existing asset; place new work in `public/images/editorial/` and update references, rather than destructively overwriting source material.

## Visual language

### Architecture

- Quiet, editorial compositions with strong geometry and controlled negative space.
- Natural overcast, early-morning, late-afternoon, or soft skylight rather than dramatic commercial lighting.
- Buildings should feel plausible and buildable: stone, concrete, timber, clear glass, brushed metal, and restrained painted steel.
- No crowds, portraits, silhouettes, reflections of people, cars as focal subjects, or lifestyle staging.
- Avoid recognizable landmark architecture and avoid closely reproducing any FSB project or photographer's composition.

### Industrial and materials

- Brushed stainless steel, darkened bronze, anodized aluminium, precision-machined components, stone, timber, and glass.
- Macro or still-life compositions should retain real surface irregularities and believable machining marks.
- Industrial scenes are atmospheric supporting images only unless they use existing first-party Canton Hyland photography.

### Warm interiors

- Warm timber, limestone, soft daylight, and calm hospitality or residential entrances.
- No staged families, hands, staff, or occupants.
- Doors and hardware are integrated into the space rather than presented as catalogue products.

## Asset set

Create fifteen distinct editorial assets:

1. `hero-cultural-entrance` — wide institutional/cultural entrance, cool neutral daylight.
2. `hero-warm-residential-entry` — wide warm residential threshold, timber and limestone.
3. `hero-civic-corridor` — wide public-building corridor and fire-egress doors.
4. `home-commercial-egress` — commercial escape-route architecture, no close product hero.
5. `home-design-context` — architectural door rhythm and material junctions.
6. `home-editorial-insight` — abstract architectural light, glass, and metal.
7. `project-commercial-egress` — representative institutional egress application.
8. `project-glass-entrance` — representative frameless-glass entrance application.
9. `project-hospitality-residential` — representative hotel/residential door application.
10. `architecture-boutique-hotel` — quiet warm hotel corridor.
11. `architecture-coastal-residence` — restrained coastal residence and landscape.
12. `industrial-precision-parts` — machined metal components as an editorial still life.
13. `material-brushed-steel` — brushed stainless macro study.
14. `material-bronze-patina` — naturally varied bronze surface study.
15. `material-metal-stone-detail` — architectural junction of metal, stone, timber, and glass.

## Page mapping

### Homepage

- Replace all three carousel scenes with assets 1–3.
- Replace the large panic-device application banner with asset 4.
- Replace the side-by-side `Designed For` image with asset 5.
- Use the real, no-person `factory-cnc-production.webp` for the factual About section.
- Replace the Insights banner with asset 6.
- Use material and architecture assets for sourcing/contact teaser cards where the card is conceptual rather than product-specific.

### Projects + Applications

- Replace each representative project hero with assets 7–9.
- Use assets 10–12 as supporting gallery images while retaining one real product image per project for technical grounding.
- Keep the existing disclosure that these are representative application studies.

### Company

- Curate the gallery toward first-party, no-person images: CNC production, showroom displays, material innovation, facility yard, and unoccupied equipment views.
- Generated imagery must not be presented as the Canton Hyland factory.

### Brand assets

- Copy the supplied `hyde-logo-stacked-black-1600.png` into the HYDE brand asset folder as the approved raster master.
- Continue rendering the header and structured-data logo from the existing official SVG assets.

## Delivery and quality

- Generate with the built-in image tool, one prompt per distinct asset.
- Store source generation outputs in the project before completion.
- Convert final website assets to WebP using Sharp, preserving each intended crop.
- Target approximately 180–450 KB per editorial image where visual quality permits.
- Verify every image visually for people, logos, letters, watermarks, distorted architecture, impossible doors, duplicate fixtures, and malformed hardware.
- Update `IMAGE_CREDITS.md` so generated editorial imagery is not described as client photography or a completed client project; record the built-in ImageGen workflow and the representative-use restriction.
- Verify English and Spanish routes, responsive crops, alt text, type checking, linting, production build, and local page screenshots.
