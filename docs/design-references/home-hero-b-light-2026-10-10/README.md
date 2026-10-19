# Environment-light study — intermediate, not the finished hero

The calibrated environment was refined with a narrow warm-gray stone palette, recessed slab joints, small environmental bevels, finer paving joints and broader diffuse daylight. The source camera and door group stay at the preceding calibrated position. These scene units are composition parameters, never installation dimensions.

This study still reads as a photographic cutout in a render. The client specifically rejected that visual approach on October 11. Keep it as an editable environment reference, not as the approved homepage image. The photographic continuation is in `../home-hero-b-unified-2026-10-11/`.

Reproduce with the installed Blender, then the native-photo composer:

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' -b --python scripts/render-home-egress-architecture.py --
node scripts/build-home-egress-perspective-preview.mjs docs/design-references/home-hero-b-light-2026-10-10
```

`scene.blend` contains the editable environment and packed textures; it contains no product CAD. The texture and distant backdrop remain in the preceding perspective pack. The compositor asserts 263,262 unchanged source RGB pixels; that does not establish a coherent photographic result.
