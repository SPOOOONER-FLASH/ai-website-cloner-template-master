# 564 MB — source-shadow restoration sample, 2026-10-08

Review only. This is one revision of the existing five-sample direction, not approval of a new batch. No live SKU, Products image, video, `src/`, `public/`, `out/` or `out-rayen/` replacement.

## Direction correction

The client requests KANEE-like photographic appearance, not mandatory CAD production. Lack of a verified complete 3D model blocks view-changing physical CGI, **not** careful restoration of a supplied photograph. The 2026-09-30 CAD-input handoff is not a prerequisite for this photographic route. KANEE's PDF shows distinct editorial still-life, installation and technical-image roles; its assembly metadata does not prove a particular photography or rendering program.

## Genuine sources and recovery

- Original library: `G:/新网站资料/7-防盗锁/564 MB/1-564 MB.psd`. G was absent this session. Both input PNGs are retained extractions from this original, not a substitute library. The original PSD hash is the previously recorded value; it was not freshly verified against the absent drive.
- `source-product.png`: native layer 11, 图层 7, PSD bounds `(25,171)`, 738×523. Hash checked against the earlier extraction receipt.
- `source-full-photo.png`: cached layer 2, 图层 1 拷贝, PSD bounds `(-16,-17)`, 835×835. Native layer alignment on this field is `(41,188)`. This larger photographic frame retains the supplied body, latch and keeper ground shadows, avoiding the native crop's truncated penumbra.
- The earlier sample displaced and blurred the entire product silhouette and added generic contact ellipses. This revision does neither. White-field luminance outside protected product alpha becomes a neutral multiply transmission at the original coordinates. No new blur, displacement or extrapolation is applied to the supplied shadow.
- Independent visual review found an old alpha omission in the keeper opening. The enclosed region seeded at `(650,495)` contains 1,045 pixels. These are restored directly from the aligned full photograph, without drawing, interpolation or geometry inference. The photographed inner face must not receive the background's texture.
- Empty neutral gray field only: generated with the built-in image tool. All metal is deterministic photographic source data. Background-only softening (0.85 px) and gain (0.86) reduce competing texture. No props, logo, watermark or white card is added.

## Reproduce and inspect

```powershell
node scripts/build-kanee-source-shadow.mjs docs/design-references/kanee-564-revision-2026-10-08/spec.json docs/design-references/kanee-564-revision-2026-10-08/preview
node --test scripts/build-kanee-source-shadow.test.mjs
```

Master: `preview/564-mb-source-shadow.png`, 835×835, native product scale and angle. Web copy: same stem `.webp`, quality 94. Receipt: `preview/provenance.json`. `preview/shadow-transmission.png` is diagnostic, **not** a publishable image.

At 100% inspect latch corners and gold texture, knob pattern, case rims and fixing hole, keeper fasteners/opening/inner face, shadow beneath the body and keeper, and full shadow falloff without a rectangular cutoff. Source resolution is retained; no claim of newly rendered metal detail or true 3D light response.

Pixel QA: all 157,692 original opaque product pixels and all 1,045 recovered pixels equal their respective photographic source RGB in the PNG master. This verifies composition integrity, not catalogue-level aesthetic acceptance or factory fit. Client review remains pending; do not expand to twenty or integrate the rejected thirty-three Products plates. Video remains canceled.

Full project verification status is recorded in the dated agent update. Neither shared export is rebuilt by this image generator.
