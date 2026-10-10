# Perspective repair — client preview only

`preview.png` is the calibrated composition, not an approved homepage replacement. It retains the source door group and an empty Blender scene. The previous published courtyard composite was rejected by the client on 2026-10-10.

The visible recess and continuous paving now establish wall thickness, a common camera, and a level outdoor route. Whole-scene review accepted it for client preview, while explicitly retaining the remaining gray CG appearance, distant backplate appearance, and source-limited hardware clarity. No actual project, installation dimension, model compatibility or rating is claimed.

Inputs are the existing repository `306-d-panic-exit-device-7.webp`, generated stone texture, generated distant sky/trees, and an environment-only Blender scene. No door, frame or hardware was generated. The revised matte also replaces non-product border/floor pixels rather than protecting a pasted rectangle. The PNG retains 263,262 protected source RGB pixels exactly; `pixel-qa.json` records hashes and scope. This assertion is only a geometry gate.

Reproduce from the repository root, using the installed Blender:

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' -b --python scripts/render-home-egress-architecture.py --
node scripts/build-home-egress-perspective-preview.mjs
```

`scene.blend` has its environment textures packed. The camera is perspective; the projected original photo bounds are within 0.034px of the target. The photo-derived depth vanishing point is approximately (871,486) on the 1800×900 canvas. These are composition parameters, never product dimensions. The Blender scene contains no reconstructed metal and remains editable.

`held-photographic-trial.png` is a separate empty-environment finish trial. It was rejected for projection drift and is not consumed by any generator, route, or public image. Do not composite it into a marketing image without renewed camera registration.

Current review changes do not edit any live image, original SKU gallery, Guides head, product record, UI layout or production export.
