# News catalogue framing — 16 September 2026

Client reference: KANEE 2025 catalogue, 108 pages, inspected pages 8 and 25, plus
the client's marked RAYEN catalogue screenshot. Reference for composition and
material backgrounds only; no competitor product photographs reused.

`src/data/news-visuals.json` records the original photograph, its pixel dimensions,
reviewed subject viewport, whole-photograph rotation and background tone for each
article. `NewsVisual.tsx` composes these in the browser without redrawing metal.
The same component serves English/Spanish index cards and article heroes.
Multiply blending integrates the original white photographic field with a pale
material background; it is an editorial display treatment, not a finish swatch.
Product detail catalogue photographs remain unchanged.

Generated asset: **empty background only**, no product, text or logo.
Tool: image_gen. Source: `empty-stone-background.png`.
Re-export: `node scripts/publish-news-background.mjs`.

Prompt: Create a photorealistic EMPTY premium hardware catalogue photography
backdrop, no products, no hardware, no text, no logo, no objects. A continuous pale
warm-grey fine limestone studio surface viewed straight on / flat lay with
extremely subtle fine mineral grain, broad directional soft daylight, one gentle
diagonal soft shadow near upper left edge, central eighty percent evenly lit and
clear. Quiet architectural material quality inspired by premium door handle
catalogues. Do not add podiums or blocks or horizons. Landscape 16:9, designed as
a subtle backdrop behind separately overlaid real product photographs.

Replaced marked exhibition wall with 307; imagined finish set with 607 PBBK;
OEM closer composition with a real 607 SSET reverse photograph; incorrect floor
spring on DS011 article with the actual DS011 flush bolt. 311 uses its HYDE source
instead of the old oval-logo frame. Older 305 news covers now use distinct 307/311
photographs. Removed floor hinge from the home/products overview.
