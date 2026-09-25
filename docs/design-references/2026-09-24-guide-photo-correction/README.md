# Rejected guide image correction — 2026-09-24

The client rejected all 20 product composites in `../2026-09-09-style-batches/product-final-composites/`: a real catalogue cutout on a generated tabletop is still a false-looking photograph. Contrary to the earlier handoff, all 20 had already been imported into `public/images/editorial/guides/` as guide hero images. They were not merely dormant references.

`restore.mjs` replaces **only those 20** guide WebPs with the exact original photographed catalogue WebP bytes recorded in their provenance sidecars. It leaves the 13 fictional architecture guide images and every `content/guides` record untouched. The guide URLs and model-specific captions remain valid. The replacement is intentionally a truthful **stopgap**, not a claim that white-background catalogue images equal the client's preferred in-camera charcoal product photography.

Run from the repository root:

```powershell
node docs/design-references/2026-09-24-guide-photo-correction/restore.mjs
node docs/design-references/2026-09-24-guide-photo-correction/restore.mjs --write
```

The script preflights all 20 source SHA-256 values before the first write and fails if the set is incomplete. After `--write`, each sidecar records the source hash, the rejected composite hash, the new method and the guide it serves. `scripts/import-guide-heroes.mjs --write` is blocked so that an older command cannot silently restore the rejected images.

## Premium reshoot and motion, not AI reconstruction

The two acceptable dark-ground examples — `public/images/editorial/hyde-real-cylinder-dark.webp` and `hyde-real-lever-set-dark.webp` — are client-supplied photographs taken against charcoal in camera. They demonstrate a useful grammar: real contact shadow, one large soft light from above-left, controlled edge highlights, whole recognizable silhouette, and detail that is physically present. They are **not interchangeable model evidence** for the 20 guides.

For each of the 20 guide subjects, photograph the **actual listed SKU and finish** on the same matte charcoal surface. Capture (1) a complete 3/4 view with hardware resting naturally, (2) an orthographic top/front view showing real fixing faces, and (3) one restrained macro detail. A grey card and unchanged light/camera distances make the series consistent. Keep loose parts only when they are truly included with that SKU; do not add, remove or duplicate screws, holes or accessories in retouching. Verify the SKU, included parts and finish against the physical sample and product record before selecting a hero. The 20 source/model mappings remain in `../2026-09-09-style-batches/product-provenance.json`.

For an FSB-like product film, the reference is a slow camera/light study of a **physical product**. Shoot a real lever or lock with a macro slider and moving softbox, plus a stable whole-product frame; edit and grade the footage in Jianying/CapCut or Blender. Blender can also render exact factory CAD after dimensions and visible geometry are approved. No paid generation API is needed for either route. The current partial Blender exterior studies are *not* complete CAD; a still photo cannot reveal unseen sides, mounting holes or changing specular highlights. The earlier photographic push-in experiment was expressly cancelled in `../2026-09-07-hyde-motion/BRIEF.md`, so do not repackage that as a product film. The FSB video is for pacing and lighting analysis only; never publish its frames, logo or footage in HYDE assets.
