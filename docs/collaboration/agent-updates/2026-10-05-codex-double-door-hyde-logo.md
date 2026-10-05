# Codex — HYDE logo on the 309-D home hero (2026-10-05)

- **Scope:** Replaced the left-panel `CANTON HYLAND` lettering with the approved `hyde-logo-horizontal-white.svg`. Replaced the old oval Hyland badge inside the photo with a dark badge carrying `hyde-logo-icon-white.svg`. Removed the small legacy slogan beneath it by interpolating only its 18-pixel strip in the derived hero. The original 309-D product-gallery image is unchanged.
- **Geometry:** The photo remains complete in the desktop and 4:3 mobile images. Exit devices, vertical rods and upper/lower latches were not moved, recoloured or generated. The two existing door closers remain visible.
- **Verification:** `node scripts/build-home-double-door-hero.mjs --check`, editorial srcset and mobile-crop checks, focused ESLint, and direct visual inspection of both full images and a four-times enlarged badge crop.
- **Untouched:** `HeroCarousel.tsx`, `out/`, `out-rayen/`, and all product gallery originals. The HYDE release builder retains the export baton; this source change must be included in its next full export.
