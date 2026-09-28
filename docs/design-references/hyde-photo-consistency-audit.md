# HYDE catalogue-source photo consistency audit

Generated from `content/products/*.json` (HYDE or shared records), their hero/gallery image references, and the original files under `public/images/products/`. Run `node scripts/audit-hyde-photo-consistency.mjs --write` to regenerate; `--check` compares both reports without changing files. No images or product records are modified.

- HYDE/shared product records: **588**; **521** have referenced hero/gallery images, totaling **2432** image references.
- Measured on a strictly white or transparent edge: **1645** (including **1095** with a documented legacy-logo exclusion).
- Needs human review because the background or silhouette is uncertain: **787**.
- Measured images with at least one layout review flag: **444**; flagged hero images: **189**. These are **review candidates, not defects**.

## What the measurements mean

The source is resized to a 256×256 analysis grid. Transparent images require a nearly clear edge; white images require ≥98% near-white edge pixels. For a white image, foreground means pixels below RGB 238 or with color spread above 12. Tiny compression specks are ignored. The existing watermark manifest supplies exact legacy-logo rectangles to exclude; suspected unlisted corner marks and logo exclusions touching the silhouette go to manual review. The bounding-box area and darker/color foreground area are percentages of the canvas; the visual baseline is the bottom of the visible silhouette as a percentage of canvas height. Detached keys, escutcheons, shadows and labels can change this visual measure. It is **not** an engineering dimension, product area, physical baseline, or proof that an image is a factory photograph.

Review flags are intentionally loose triage rules: bounding box below 30%, visual baseline above the 22% lower margin, center offset over 10%, or silhouette touching the image edge. Different product shapes and orientations cannot be compared by one occupancy target. Open the actual photograph before changing crop or padding. The existing `scripts/audit-image-fit.mjs` checks cropping in fixed site frames; it does not segment a product, measure its margins, or verify a white background. This report fills that measurement gap without changing that build guard.

## Manual-review reasons

| Reason | Images |
|---|---:|
| edge is not uniformly white or transparent | 705 |
| known logo exclusion may touch product | 44 |
| possible separate corner logo or label | 34 |
| not a catalogue-source product image | 4 |

## First flagged hero images to inspect

| Model | Source | Box area | Baseline | Flags |
|---|---|---:|---:|---|
| 300 | `/images/products/300-panic-exit-device.webp` | 20.3% | 63.7% | small bounding box, high visual baseline |
| 310 | `/images/products/310-panic-exit-device.webp` | 20.5% | 62.5% | small bounding box, high visual baseline |
| 47BSIK | `/images/products/47bsik-lock-cylinder.webp` | 26.2% | 77.7% | small bounding box, high visual baseline |
| 559 | `/images/products/559-night-latch-and-rim-lock.webp` | 40.7% | 74.6% | high visual baseline, touches canvas edge |
| 564 MB | `/images/products/564-mb-night-latch-and-rim-lock.webp` | 28.9% | 68.8% | small bounding box, high visual baseline |
| BH07 | `/images/products/bh07-hook-rail.webp` | 29.2% | 67.2% | small bounding box, high visual baseline |
| BH09 | `/images/products/bh09-hook-rail.webp` | 27.9% | 67.2% | small bounding box, high visual baseline |
| BH10 | `/images/products/bh10-robe-hook.webp` | 24.4% | 76.2% | small bounding box, high visual baseline |
| BH11 | `/images/products/bh11-robe-hook.webp` | 24.4% | 75.8% | small bounding box, high visual baseline |
| BH15-100mm | `/images/products/bh15-100mm-barrel-bolt.webp` | 27.9% | 63.7% | small bounding box, high visual baseline |
| BH16 | `/images/products/bh16-flat-slide-bolt.webp` | 22.3% | 66.0% | small bounding box, high visual baseline |
| BH27 | `/images/products/bh27-wire-soap-dish.webp` | 28.9% | 71.9% | small bounding box, high visual baseline |
| BH33 | `/images/products/bh33-towel-shelf.webp` | 26.4% | 67.6% | small bounding box, high visual baseline |
| BH41 | `/images/products/bh41-robe-hook.webp` | 23.7% | 76.6% | small bounding box, high visual baseline |
| BH51 | `/images/products/bh51-shower-shelf.webp` | 23.3% | 65.6% | small bounding box, high visual baseline |
| BH56 | `/images/products/bh56-flip-up-grab-bar.webp` | 21.5% | 60.5% | small bounding box, high visual baseline |
| DV12-S | `/images/products/dv12-s-door-viewer.webp` | 18.0% | 69.1% | small bounding box, high visual baseline |
| Night Latch & Rim Lock | `/images/products/night-latch-rim-lock.webp` | 26.2% | 69.5% | small bounding box, high visual baseline |
| Stainless Steel Wall Hook | `/images/products/stainless-steel-wall-hook.webp` | 23.6% | 66.8% | small bounding box, high visual baseline |
| Tubular Knob Lock | `/images/products/tubular-knob-lock.webp` | 27.1% | 75.4% | small bounding box, high visual baseline |
| 001 | `/images/products/001-panic-exit-device-trim.webp` | 11.1% | 84.4% | small bounding box |
| 023 ET | `/images/products/023-et-panic-exit-device-trim.webp` | 45.0% | 75.8% | high visual baseline |
| 035 | `/images/products/035-panic-exit-device-trim.webp` | 52.1% | 100.0% | touches canvas edge |
| 039 | `/images/products/039-panic-exit-device-trim.webp` | 54.7% | 97.3% | off-center |
| 072 | `/images/products/072-panic-exit-device-lock-case.webp` | 20.6% | 88.3% | small bounding box |
| 100 | `/images/products/100-glass-door-handle.webp` | 16.1% | 94.9% | small bounding box |
| 102 | `/images/products/102-glass-door-handle.webp` | 16.0% | 94.1% | small bounding box |
| 104 | `/images/products/104-glass-door-handle.webp` | 18.4% | 95.7% | small bounding box |
| 105 | `/images/products/105-glass-door-handle.webp` | 12.6% | 93.4% | small bounding box |
| 106 | `/images/products/106-glass-door-handle.webp` | 18.7% | 94.5% | small bounding box |

The complete image-by-image evidence is in [hyde-photo-consistency-audit.csv](hyde-photo-consistency-audit.csv). CSV values are estimates suitable for prioritising a visual review. Product authenticity, correct model/finish, hole positions, and product-set compatibility still require Product Finder or factory source evidence.
