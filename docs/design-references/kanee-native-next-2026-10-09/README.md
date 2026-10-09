# 564 MB — two photographic treatments, 2026-10-09

Two new **field/framing versions of one genuine product photograph**, not two new models or changed camera angles. Client authorized continuing review samples and feeding back factual issues; this is not live-image approval. Video and the frozen 33 Products plates remain out of scope.

| Treatment | Preview | Intended role |
|---|---|---|
| Pale continuous field | [PNG](564-mb-pale/preview/564-mb-pale-source-shadow.png) / [WebP94](564-mb-pale/preview/564-mb-pale-source-shadow.webp) | 835×835 quieter catalogue plate, visible supplied grounding |
| Charcoal closer framing | [PNG](564-mb-close/preview/564-mb-close-source-shadow.png) / [WebP94](564-mb-close/preview/564-mb-close-source-shadow.webp) | 835×705 editorial close plate, only 130px of empty top margin removed |

All product geometry, parts, native size, source metallic highlights and source shadow positions are retained. The previously liked 564 benchmark is unchanged. The built-in image tool generated **empty surfaces only**; the saved full prompts are in [empty-fields/prompts.json](empty-fields/prompts.json). This is native-photo restoration/compositing, not new-view 3D rendering or full AI metal regeneration.

## Two separate gates — apply before every next image

1. **Source/model gate before production:** identify model, version, photographed finish and parts, plus critical model-specific structure (pins, holes, spindle, latch etc.). Cross-check native views and existing factual records; source-to-output fidelity does not prove that the original is the current factory SKU. Unknowns remain labelled review-only. A real contradiction stops that source; obtain the correct genuine original, never redraw/remove a feature to force agreement.
2. **Fidelity gate after composition:** compare full outline, hole positions/count, keys, threads, parts, native scale and photographic shadow registration against the selected source. Opaque RGB/retained-region comparisons plus enlarged visual QA. A zero-difference result passes photographic fidelity only, not factory verification or client aesthetic acceptance.

[sources/preflight.json](sources/preflight.json) records the distinction for this batch. 564 has consistent source/model, black case and two photographed parts; this is not a claim that the photograph shows the full sold kit or verifies every internal feature. Current factory version certification remains pending.

The first candidate, **45 BNIK**, was held *before a finished product image was produced*: its base photo omits fixing-hole/front-disc details present in separate visible PSD patches and some catalogue views. Neither five visible circular positions nor an empty specs array settles the variant. Do not transplant those patches or publish the incomplete base as the verified SKU. The product-free charcoal field was reused for 564 instead. Cases 140/110/1121 and exit-device 305 were not expanded because their cached ground-photo evidence is insufficient.

## Source preservation and crop recipe

G:/新网站资料 is not mounted. Retained genuine input PNG hashes are freshly checked; the original PSD SHA is a **previously recorded** value. No fresh original-drive scan or factory approval is claimed.

The close version keeps original width and every product pixel. The original source has no pixel below luma245 in the removed top130px; body, keeper and meaningful supplied ground shading remain. Product layer position changes from [41,188] to [41,58]; the reviewed keeper-inner-face restore seed changes from [650,495] to [650,365]. No product resize, independent component movement or shadow extrapolation.

Re-create the derived field using the already installed sharp dependency, from repository root:

```powershell
node --input-type=module -e 'import sharp from "sharp"; await sharp("docs/design-references/kanee-native-next-2026-10-09/sources/source-full-photo.png").extract({left:0,top:130,width:835,height:705}).png().toFile("docs/design-references/kanee-native-next-2026-10-09/sources/source-full-photo-topcrop.png");'
```

Reproduce both plates using the **existing unchanged renderer**, writing to your own ignored scratch area:

```powershell
node --test scripts/build-kanee-source-shadow.test.mjs
node scripts/build-kanee-source-shadow.mjs docs/design-references/kanee-native-next-2026-10-09/564-mb-pale/spec.json tmp/codex-native-next/pale
node scripts/build-kanee-source-shadow.mjs docs/design-references/kanee-native-next-2026-10-09/564-mb-close/spec.json tmp/codex-native-next/close
```

Compare generated PNG SHA against each preview/provenance.json. Each plate preserves 157,692 opaque native-product pixels and 1,045 reviewed restored keeper pixels with zero RGB differences. PNG is the fidelity master; lossy WebP is not pixel-equality evidence. shadow-transmission.png is diagnostic only, never a product image.

## Shared delivery

Review branch: codex/kanee-564-photo-review. Claude/Kimi may retrieve this pack; do not replace public SKU/Products imagery before per-image acceptance and model-specific confirmation. No application, renderer, product-record, shared export or RAYEN changes are required. Full check and independent QA results are recorded in the dated handoff.
