# Codex — adaptive HYDE product-image branding

| Item | Result |
|---|---|
| Scope | Rebuilt 1,485 non-destructive derivatives under `public/images/products-hyde/`; originals under `public/images/products/` were not changed. |
| Legacy marks | 596 old Hyland corner marks detected (517 left, 79 right), fully covered in place with the current HYDE identity. |
| Other images | 889 images use a smaller translucent black/white HYDE mark in the quietest corner; no white plate is added. |
| Technical diagrams | Adaptive corner scoring avoids headings, dimension tables and product geometry; the red/blue `Product Size` sample now keeps its title clear. |
| Manifest | Schema v2 records placement strategy, corner, colour variant, geometry and source/output hashes. |
| Verification | `assets:watermark:check` verified 1,485 files; 114 tests passed; ESLint and TypeScript passed. Visual samples covered white packshots, photo backgrounds, both legacy corners, technical diagrams and AR-4. |
| Untouched | Existing uncommitted Spanish/navigation work and the dirty `out/` release tree were not staged in this source/media commit. |
| Next | Rebuild `out/` from committed source, deploy, and inspect product pages at desktop/mobile sizes. |
