# Claude — 菜单底栏：阿里巴巴和联系我们改成按钮；社媒加 eBay（2026-10-14）

甲方：「ebay 也链接到社媒那边吧……这底下的也太小了……contact alibaba 很重要 但是这么不显眼」。

- 全屏菜单（SiteMenuDrawer）的底栏原来全是 13px 小字：
  - 「Buy on Alibaba」改成深色实心按钮，带硬阴影；
  - 「Contact」改成描边按钮；
  - 两个按钮都是 16px、高 48px，悬停有位移；尊重 reduced-motion 设置。
  - 社媒链接仍然是小字，靠右。
  - 样式写在 EditorialCatalogue.module.css 的 .footerCta / .footerCtaSecondary。
- content/site-settings.json 的 social 加了 eBay（https://www.ebay.com/usr/hydecantonlock）。全站页脚「Social Media」栏、菜单底栏和 JSON-LD 的 sameAs 都会自动带上。
- 测试：npm test 491 通过；eslint 通过；tsc 只有一个既有错误（共享 node_modules 里没装 lenis），与本次改动无关。本地预览因为同一原因起不来，没有截图；上线后需要抽查菜单底栏。
- 风险：eBay 店铺的公开评价大多来自服装转卖（Margiela、Carhartt 等），只有 1 个五金商品。已在回复里提醒甲方。
