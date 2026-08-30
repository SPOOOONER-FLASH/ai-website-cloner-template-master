# Codex — HYDE product-image identity derivatives

- **Scope:** Added a non-destructive Sharp pipeline that creates a consistent HYDE identity plate in the top-left corner of every product image. The original `public/images/products/**` files remain unchanged; the site resolves product, category and project product-image references to `public/images/products-hyde/**`.
- **Coverage:** 1,485 source WebP files produced 1,485 branded derivatives. White-background products, real application photographs, legacy Hyland-logo images, legacy diagonal-domain-watermark images and Argentina AR-4 images were sampled visually. The plate covers the old top-left identity area without covering the product.
- **Future uploads:** Run `npm run assets:watermark` after adding or replacing a source product image. `npm run assets:watermark:check` is now part of `prebuild`; a missing, stale or modified derivative fails the build with the exact source/output path.
- **Validation:** Unit tests cover geometry, path containment and runtime source mapping. The deterministic manifest records source and output SHA-256 hashes, and the full 1,485-file check passes.
- **Untouched:** The untracked Kimi SEO/Stahlock dry-run update and `docs/collaboration/reviews/` are not staged or modified. No product specification, certificate, Spanish copy or third-party source claim changed in this scope.
- **Next review:** Exact-model Stahlock specification mapping remains a separate factual-data commit; no near-model parameter inheritance is allowed.
