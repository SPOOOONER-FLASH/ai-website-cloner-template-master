# 65 SNKT — repository-source review and held mask experiment

**Use the native pale photo for review only. The charcoal trial is HELD and is not a usable marketing asset.** Neither image is approved for live replacement, nor is either evidence of current factory finish or internal pin count.

[Native pale PNG](preview/65-snkt-pale-native-photo.png) · [WebP94](preview/65-snkt-pale-native-photo.webp) · [pale provenance](preview/pale-provenance.json) · [actual source](sources/65-snkt-view-3.webp)

The source is the client's genuine repository upload, `public/images/products/65-snkt-lock-cylinder-3.webp`, 1000×1000, SHA-256 `aa8f55ccb15dd7d4179d7572e25cf667feae51dc00777aefd529f1245c6f0b0a`. Its gallery record maps view3 to65 SNKT. Hero/view2 and the drawing view agree visually on the complete thumbturn, cam, body, front keyway and threaded opening. The record says Solid Brass, but has no finish/specification data. The photographed silver-tone surface does not establish a finish code. Five exposed circular row positions are visible plus a separate plug near the thumbturn; this is **not an internal pin-count claim**.

## Selected pale recipe

Crop x0/y160/w1000/h740, no resize/rotation or moved parts. Exclude only the separate blue-bordered supplemental view using its circular area (crop coordinates centre226/534/radius192), without touching the main assembly. Retain the original main-photo field and source shading. Apply one uniformRGBgain0.94; white255 becomes240. There is no product mask in this selected treatment, no new cast shadow, no metallic repaint and no generated product detail. 624,219 non-inset pixels retain their source coordinates and stated exposure mapping. PNG round-trip exactness is verified. Native RGB is graded, not unchanged.

Conservative catalogue/review image, not KANEE-level photographic refinement. Client aesthetic acceptance, exact finish and current factory version remain pending.

## Why charcoal is held

The built-in image tool generated **only an empty photographic field**: prompt retained in [empty-fields/prompt.json](empty-fields/prompt.json). Real sourceRGB and original photographic ground transmission were composed separately. The derived contour is a manual SVG path restricted by perimeter-connected near-white paper extraction; it is **not native alpha**.

Independent source/output QA caught an added stippled bright fringe on the thumbturn and a pale bevel/triangle at the cam foot. One localized white-matte decontamination trial changed251 optical edge pixels, leaving133,305 opaque pixels unchanged. **The defects still fail contour QA.** Zero opaque-interior differences did not validate the boundary. Do not send `65-snkt-charcoal-trial.*` as a usable image, count it as accepted or reuse the approximate contour for bulk work. Preserve it only as an internal failure record. Stop further mask-framework work on this source; selected fallback avoids that mask entirely.

[Held trial receipt](preview/provenance.json), `derived-product-mask.png`, `ground-without-inset.png` and `shadow-transmission.png` are diagnostic artifacts, not finished product assets.

## Reproduce

```powershell
node docs/design-references/kanee-65-native-photo-2026-10-09/sources/build-review.mjs tmp/codex-65-reproduce
```

Uses installedsharp and the existing source-shadow helpers without changing them. Hash guard, source/mask dimensions, supplemental inset non-overlap, PNG round-trip and opaqueRGB assertions fail before misleading success. The recipe reproduces both the selected native pale treatment and the explicitly held research trial; compare masters with their corresponding receipts. Product records, public images, application, exports, RAYEN, video and frozen33 are untouched.
