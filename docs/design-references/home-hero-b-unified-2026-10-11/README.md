# B hero — unified photographic treatment

The client rejected the live cutout and asked for natural, coherent light and shadow. `preview.png` is the resulting photographic review image. It is not a claim of an actual photographed installation or a product CAD render.

The entire calibrated composition received one photographic lighting/color treatment using the built-in image tool. The authoritative hardware reference remained `public/images/products-hyde/306-d-panic-exit-device-7.webp`, SHA256 `58a383a200c90fb3a2dc53c68b2587a5dd9185f9702f64ea429280964194ac9e`. Changes were requested as photographic exposure and contact-shadow integration, with no product redesign. The exact request is retained in `prompt.txt`.

Independent enlarged visual comparison found no identifiable change in the two bars, end housings, vertical rods, guides, top/bottom latches, left-leaf hinges or opening angle. This is a visual geometry review, not original-pixel identity or a manufacturing-dimension claim. Small fastener texture cannot be certified from these catalogue images.

The first treatment introduced a low wall across the outdoor view. That trial is retained only as an input. A localized correction replaces that wall with level paving, grass and distant trees. `scripts/build-home-egress-unified-preview.mjs` uses only the 201×120 outdoor patch and asserts that every pixel outside it remains identical to the reviewed photographic treatment. Thus the correction cannot change the door or hardware again. Its request is in `outdoor-repair-prompt.txt`.

Reproduce the final PNG and repair receipt:

```powershell
node scripts/build-home-egress-unified-preview.mjs
```

The generator pins both reviewed input hashes. `repair-qa.json` records the final hash and 1,549,418 frozen pixels outside the outdoor patch. No script in this pack writes public website assets.

The environment-only Blender project is retained in `../home-hero-b-light-2026-10-10/scene.blend`. It is an earlier production stage; the final photographic finish is a raster retouch, not a relightable metal model. The source search found catalogue installation images and tabletop product videos, but no verified 306-D CAD or independently proven original site photograph in the checked repository. G:/新网站资料 was unavailable. Do not present the finish as physical installation validation.
