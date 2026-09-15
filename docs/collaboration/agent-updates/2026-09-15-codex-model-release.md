# Codex — model release export

Source commit: 93c861c5b6. `npm run deploy:prep` completed with exit 0. All 1,815 static routes generated; export tests, SEO/dead-link checks and source freshness check passed. `check-product-model-export.mjs` passed for six EN/ES product pages, both download libraries and exact exported Blender/GLB/scope bytes. Restored-photo regression check passed, including full asset paths across 420 RAYEN pages.

The earlier dev-only Spanish 404 did not reproduce in the production export: the exact 9004S Spanish product URL loaded and its 3D preview rendered in the browser without console errors. Checked narrow viewport with no horizontal overflow, and exercised the viewer's ArrowRight control. All three models rendered in the English library. The public files remain partial exterior references with explicit omissions, not installation/manufacturing CAD.

Complete out/ and out-rayen/ exports are included in this release. Original product photography is preserved. Existing generator rewrites to public/images/door-prep have no semantic diff and are not part of this change. Production origin pull is separate from Git push; Cloudflare purge remains client-only.
