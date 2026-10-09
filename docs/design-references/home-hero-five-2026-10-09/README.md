# Homepage hero — five environment previews, 2026-10-09

Client rejected the ordinary grey-door photograph with charcoal graphic sidebars and requested several choices in the original restrained architectural direction. Review only: no homepage, SKU photograph, Guides head, Products plate, video or live export is replaced.

## Choices

| ID | Direction | Visual judgment |
|---|---|---|
| A | Warm limestone, soft side daylight | First recommendation; closest to existing pale stone hero mood |
| B | Pale civic lobby, diffuse daylight | Quiet public-building alternative; more central composition |
| C | Warm oak ribs and pale plaster | Second recommendation; strongest continuity with timber imagery |
| D | Charcoal stone with pale portal | Darker architectural alternative; less continuity with current daylight sequence |
| E | Soft evening limewash | Warm alternative; daylight source remains cooler than its surroundings |

Individual 1800 × 900 PNGs are under `previews/`. Each is a distinct architectural background, with the same complete customer double-door photograph preserved as one unit.

## Source and limits

- Model: **306-D**, customer catalogue application view 7, retained at `C:/hyde-photo-work/tmp/ship-merge/public/images/products-hyde/306-d-panic-exit-device-7.webp`.
- Exact retained source hash and safe frame crop are pinned in `spec.json`. Original 800 × 800 source is kept under `source/`; no original was overwritten.
- Client's G:/新网站资料 library was not mounted during this session. This source is the previously retained customer catalogue application image, **not independently verified field-installation photography**.
- Source frame includes open left leaf and its device, closed right leaf with push bar and upper/lower vertical rods, frame, hinges and end latches. Parts are not copied, swapped, recoloured, stretched or reassembled.
- No unpublished dimensions, door material rating, certification, project identity or site claim is added.
- A drinking-water dispenser and plant remain inside the source corridor. They were already in the supplied image; erasing them would change the intact source rectangle.
- ImageGen saw only empty rectangular architecture guides. All hardware is added afterward by native compositing. Generated original fields and exact prompts are retained.

## Reproduce and verify

From repository root:

```powershell
node scripts/build-home-hero-previews.mjs prepare
node scripts/build-home-hero-previews.mjs compose
```

The compositor verifies the pinned source hash, protects against clipping, copies the 596 × 660 door frame at original scale, and asserts equality of **393,360 source RGB pixels in every PNG**. `pixel-qa.json` records zero changed source pixels. Rectification is limited to the generated surroundings so the aperture and floor meet the real source frame.

Independent visual QA reviewed every sample and confirmed complete hardware and no invented components. A–D were rechecked after background-only aperture correction: the projecting rectangular bases are resolved, with a visible but plausible floor-material transition. E retains a warmer ambient palette than the source.

Not checked in this direction-selection pack: homepage text overlay, final responsive crop, final WebP compression or project installation identity. These are reviewed after client chooses a direction. They are not production-ready assets or client-approved designs.
