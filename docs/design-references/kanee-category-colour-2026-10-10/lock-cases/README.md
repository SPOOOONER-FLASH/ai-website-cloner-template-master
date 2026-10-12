# Lock-case coloured catalogue compositions — 2026-10-10

Two current design-review previews are supplied: **140 on sage** and **1121 on petrol blue**. Complete genuine PSD-native photographic cutouts are centered on the parent pack's empty coloured fields. No product resize, rotation, repaint, geometry edit or new shadow occurs. These are catalogue compositions, not a claim of grounded still-life photography or approved live assets. The former140 terracotta file is retained as a colour iteration, not another model or a current selection.

140 is ready for colour-layout review. **1121 is HELD for final contour acceptance**: the genuine repository gallery view4 confirms an open background slit inside the rightmost keyring coil, retained pale by the native matte. The aperture's complete edge cannot be safely recovered by the existing >=247 paper threshold: much of the pale patch is below that cutoff, and widening the threshold risks the real reflective wire. The actual colour composition remains available for inspection. No RGB repaint, guessed alpha polygon or indiscriminate threshold erosion was used. The genuine reference crop is reproducible and hash-checked.

- `140/preview/140-sage.png` and `.webp`
- `1121/preview/1121-petrol-blue.png` and `.webp`
- `recipe.json`, `build-review.mjs`, per-image `preview/provenance.json` and `visual-qa.json`

140:125,525 opaque product pixels compared with zero RGB differences. 1121:119,600 opaque product pixels compared with zero RGB differences. Zero-alpha source pixels have no RGB effect on the field; the exact copied source PNG/alpha hash is checked before and after composition. PNG proves the comparison; WebP94 is lossy delivery preview only. Enlarged diagnostic crops are generated alongside the masters.

| Model | Preserved source | Native layer/frame | Grounding limitation |
|---|---|---|---|
| 140, source view 4 | `140/source-product.png` | 713×555; PSD position left44/top123 in800×800 | No separate full photograph with continuous ground shading. Hidden RGB outside the alpha includes extension strips; it is not used. The colour-only design is visually suspended rather than grounded. |
| 1121, source view 5 | `1121/source-product.png` | 712×435; PSD position left58/top229 in800×800 | Same missing native-ground limitation. `1121/repository-full-photo.webp` is genuine repository view4 of the corresponding lock and keys at1000×1000, but has no meaningful ground shadow. It is retained for identity comparison only, never shadow recovery. |

The alternative110 cache was also checked:728×294 atleft36/top283 in800×800, with only blank white, logo and product layers. Its RGB outside the native alpha is cut at the frame and vertically extended; it provides no stronger grounding evidence.

SHA-256:

- 140 native PNG: `dc9deb6ce7ecddba7c1e8d08720cecd73dba1c4ad692a85d6f17efc5d9d778b9`
- 1121 native PNG: `d7a60b546ad41e750ab9c07a8ec4f1d66c968e107a9e785be5b38d498123135b`
- 1121 repository full photo: `741b815eb073f1972bcda06ee684e12fed6b7371122606250fadc39efce9ca2b`

The copied `source-cache-layers.json` files retain original layer positions and the previously recorded original PSD path. The original files are not freshly read from an external disk. Sources came only from retained repository/cache files and match the existing native-layer provenance.

## Reproduce and review

Run `node docs/design-references/kanee-category-colour-2026-10-10/lock-cases/build-review.mjs`. The fixed recipe uses installed sharp, preserves all native alpha, asserts opaqueRGB and fully transparent-region equality, and writes the same two previews and their receipts. No shared helper or renderer was changed. Generated fields are supplied by the parent pack at `../empty-fields/`; this recipe does not regenerate them.

For a future grounded still-life, use `scripts/build-kanee-source-shadow.mjs` unchanged only after a complete aligned genuine photograph with usable ground support is identified. Do not mislabel a blank background or invalid hidden-RGB extension as `sourceFullPhoto`, and do not substitute translated silhouette/ellipse shadows.

Inspect native alpha and apertures against the genuine photograph, including fixing-hole bevels, body corners, latch/bolt edges and the1121 keys. Opaque RGB equality alone cannot approve the contour. No current finish, sold-kit composition or factory approval is inferred from the photographed parts.

Full-image and3× native-boundary inspection found no new clipping, contour redraw, background rectangle or extension strip.140's fixing holes/latch/bolt remain complete on sage.1121's pale keyring-coil slit is confirmed as background in the genuine4× reference but its alpha boundary is unresolved and explicitly held, despite unchanged native alpha and zero opaqueRGB differences. Native metal bevel/highlight edges are retained;1280px/4K relighting or commercial acceptance is not claimed. No current finish, compatibility or sold-set claim is added.

This is a local review pack only. Public images, application, product records, site exports, shared renderers and the other lane are untouched. No full site check, staging, commit or release was performed in this bounded task.
