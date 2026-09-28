# 2026-09-28 Claude — 菜单列全栏目；内链摆位审查

**甲方**：「有粘连……信息不够清晰，把所有内链都找出来放进去……/product-studies/ 别的地方都看不见……必须确保每条内链都有显眼可达的位置……有没有审查捕捉机制和脚本」

| 改动 | 文件 |
|---|---|
| 抽屉菜单分四组（Products / Knowledge / Evidence / Buying），英文列全部 24 个栏目；es/pt 只列有镜像的 | `menu-experience.ts` |
| 邮箱和 WhatsApp 原来是两个 inline-block，粘成「…comWhatsApp」；现在分成两行 | `SiteMenuDrawer.tsx`、`EditorialCatalogue.module.css` |
| 页脚补上 Configurator、Hardware in focus、FAQ、Price list、BAU 2027；es/pt 补配置器、产品特写、FAQ | `SiteFooter.tsx` |
| 7 种语言补 3 个标签：Knowledge、Buying、BAU 2027 Munich | `content/i18n/*/ui.json`，并运行了 `npm run i18n:keys` |

**审查机制**（两层）：
1. **源码层**：`src/components/site/internal-link-placement.test.ts`，已加入 `npm test`。
   - `src/app/(en)/` 下每个栏目必须同时出现在抽屉菜单里，以及服务端渲染的页头或页脚里。
   - 抽屉只在打开时才渲染，爬虫看不到它，所以两处都要有。
   - 例外只能写进 `EXEMPT` 并注明原因。目前只有 collections、compare、video 三个。
2. **构建层**：`npm run seo:placement`（`scripts/audit-link-placement.mjs`），读取 `out/`，统计每个栏目被多少个页面链接。
   - 少于 5 个页面就判为 WEAK，退出码 1。可用 `--locale es` 检查单个语言。
   - 在 r13 的发布包上实测，正好抓出 bau-2027（1 页）、product-studies（1 页）、request/price-list（1 页）、configurator（2 页）。

**测试**：`npm test` 418/418 通过；tsc 通过。本地 1440 和 390 截图核对了抽屉，fr 和 de 的链接都正确本地化。

**没动**：RAYEN。
