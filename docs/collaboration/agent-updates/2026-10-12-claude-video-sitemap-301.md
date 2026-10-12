# 2026-10-12 Claude — 301s for renamed video watch pages and old sitemap names; logo link label

- From the client's Ahrefs 404 list (reported by the 产品数据库 session): `/video/<from>/` of every
  productMerges rename whose `/video/<to>/` is in the export now 301s (23 merges × 2 slash forms),
  incl. dc01-panic-exit-device and hy-0ss-lock-case. `/sitemap_cn.xml` → `/sitemap-index.xml`,
  `/sitemap_es.xml` → `/es/sitemap.xml`. Both in scripts/build-taxonomy-redirects.mjs; the server's
  deploy script installs the conf on its next pull (nginx -t first).
- Header logo link gets `aria-label="HYDE"` (Semrush counted it as a link with no anchor text).
  SiteHeader is shared; RAYEN uses its own header components.
- npm test 462/0, tsc, taxonomy conf --check.
