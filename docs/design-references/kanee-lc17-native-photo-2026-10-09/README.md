# LC17 — repository-source photographic review

Client, 2026-10-09: use genuine repository uploads and the HYDE website; do not depend on the external drive. This review uses the repository's unbranded gallery photograph, not a HYDE-branded derivative and not an imagined metal product.

[PNG master](preview/lc17-pale-native-photo.png) · [WebP94](preview/lc17-pale-native-photo.webp) · [source](sources/lc17-view-3.webp) · [provenance](preview/provenance.json)

1000×850, sRGB. Crop only the top150px separate logo/empty field; preserve original product size, arrangement and grounding. A uniform RGB gain0.94 gives a quiet pale-gray field (white255 becomes240); **native RGB is deliberately graded, not unchanged**. No cutout, repaint, AI metal, synthetic shadow, sharpening, new view or resized component. All850,000 retained pixels have a tested one-to-one source mapping.

## Two gates

- **Source/model:** `content/products/lc17-lock-case.json` explicitly maps view3 to LC17. The photograph shows the lock case, cylinder and keys together; preserve them as photographed. Exact photographed finish, individual cylinder model, internal pin count and sold-kit composition remain unconfirmed. Do not describe it as a verified complete set or infer the finish from the record's general availability list.
- **Photographic fidelity:** independent enlarged visual QA found no clipped faceplate, hook, case openings/internal faces, cylinder, threaded opening, ring or key blade. Native contact shading remains registered. Independent exact comparison of3,400,000 RGBA channels passes the stated crop/gain recipe. The lossy WebP is not pixel-equality evidence.

## Aesthetic limit

Usable conservative catalogue/review plate, **not KANEE-level premium photography**. The genuine original has compressed fine detail, soft keys/uneven focus and flat pale illumination. This treatment improves framing and consistency; it does not manufacture missing metal detail or change reflections. Client aesthetic acceptance and current factory/version approval are pending. Do not replace any live SKU image from this pack.

## Reproduce

From repository root with its installed Node/sharp:

```powershell
node --test scripts/build-kanee-lc17-review.test.mjs
node scripts/build-kanee-lc17-review.mjs tmp/codex-lc17-reproduce
```

The pinned original is retained in this pack; source SHA-256 is `2dbb3cee9f1b486bf7cc280e4f6da5348deb2a8723e2bbfc9d76fe5c587a9af3`. The builder refuses a different source. Compare PNG SHA-256 with provenance. Video, frozen33 Products plates, public images, product records, application routes and both sites' exports are unchanged.
