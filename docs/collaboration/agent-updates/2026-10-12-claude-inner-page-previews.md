# 2026-10-12 Claude: product and guide page previews (Yuangao four-in-one, inner pages)

- **Request:** 「借鉴远高的四合一 设计 产品 内页 和hyde的 其他页面有什么可以继续优化设计的，比如 产品页面 指南页 做预览让我看看」.
- **Preview:** the motion demo (`docs/design-references/2026-10-12-motion-demo`) now has three pages, chosen by hash: `#/` home, `#/product` (the 307), `#/guide` (exit-device comparison). New files are `src/Inner.jsx` and `src/inner.css`. `prep-inner.mjs` reads `content/` and copies only the HYDE-branded product images; it throws if a branded copy is missing. `shoot-pages.mjs` takes desktop and phone screenshots. The build is on the Desktop in `03-研究与方案\HYDE动效演示页-2026-10-12`.
- **Proposal:** `docs/research/2026-10-12-HYDE内页优化方案.md`, with a .docx on the Desktop. It covers live-page defects, what each section borrows, and 3 questions for the client.
- **Live defects found** (not fixed here; they belong in the template change):
  - On the product page, 8 of 10 views are hidden, the drawings are buried, and the raw "features" text renders as mixed bullets.
  - The guide hero uses the unbranded `/images/products/316-d…`, which shows the old red logo.
  - The guide has a dark-green "Before you specify" box, which is off-palette.
  - Guide H2 headings are all caps.
- **Not touched:** site code and `out/`. No release is needed.
- **Next step:** after the client answers, change the ProductDetail template, then the guide template, each as a separate release.
