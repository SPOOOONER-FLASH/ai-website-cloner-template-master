# HYDE editorial image library — 2026-09-04

This library turns the approved direction — **product-family atlas + realistic exhibition wall** — into two complementary image systems. The product images explain scope and family relationships; the exhibition images show the real-world density and physical presentation of a hardware supplier.

## What is included

- `hyde-editorial-product-range-01.webp` through `-10.webp`: ten 1536×1024 product-editorial images on one restrained warm-gray studio field.
- `hyde-editorial-exhibition-wall-01.webp` through `-10.webp`: ten 1536×1024 exhibition and showroom sample-wall images.
- Three responsive derivatives of every image at 480, 960 and 1440 pixels wide.
- A prompt/provenance sidecar beside each canonical WebP.
- `manifest.json`: subject, intended use and claim boundary for every image.
- Two generated contact sheets for review. Rebuild them with:

  ```powershell
  node docs/design-references/2026-09-04-hyde-editorial-library/build-contact-sheets.mjs
  ```

## Shared visual grammar

The product set uses one camera height, one pale warm-gray field, one soft shadow system and realistic relative scale. Long pull handles and exit devices establish hierarchy; lever handles create rhythm; cylinders, roses and strike plates act as visual punctuation. Objects remain complete and do not overlap.

The exhibition set uses dense but legible boards, believable mounting orientation and varied hardware families. The strongest range-overview image is `exhibition-wall-01`; `exhibition-wall-09` and `-10` add installed-door context so the library does not become ten interchangeable wall photographs.

## Content boundary

These are AI-generated editorial illustrations. They may support category discovery, a family introduction, a News image or an exhibition story, but they must not be presented as proof of an exact HYDE model, dimension, finish, certificate, fire rating or installed project. Product names, specifications, certifications and calls to action stay in HTML.

## Recommended first placements

- Homepage “Nine hardware families”: `product-range-10`.
- Hamburger / Product Finder: `exhibition-wall-01`.
- Hamburger / Projects: `exhibition-wall-09` or `-10` because they show installed context.
- News / exit-device standards: `exhibition-wall-02`.
- News / aluminium-door lock alignment: `product-range-02`.
- News / push bar versus touch bar: `product-range-03`.

The full Products and hamburger layouts remain decision previews until Spooner chooses one of the four directions in `../2026-09-04-products-menu-previews/`.
