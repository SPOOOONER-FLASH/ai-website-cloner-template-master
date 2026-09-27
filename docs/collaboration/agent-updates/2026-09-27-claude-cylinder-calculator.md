# 2026-09-27 · Claude (Hyde 文案) · 欧式锁芯长度计算器（任务表第 12 项）

来源：甲方转来 QuickCreator 七篇文章，《工具页》和《Product-Led SEO》两篇主张把产品知识做成工具页。

| 做了什么 | 文件 |
|---|---|
| 计算逻辑，只用两篇锁芯指南已发布的规则（从固定螺丝中心量到饰板外面，27.5 起 5mm 一档，只向上取，超过 3mm 凸出算风险）；总长对应目录实际发布的 9 个长度 | `src/lib/cylinder-length.ts` |
| 测试：复现指南查表 8 行；9 个总长必须等于目录里 HYDE 锁芯型号的开头数字（目录变了测试会红） | `src/lib/cylinder-length.test.ts`（已加进 npm test） |
| 交互组件，EN/ES/PT 文案，其他语种先显示英文 | `src/components/site/CylinderCalculator.tsx` |
| 页面 `/euro-cylinder-calculator`：EN/ES/PT 手写；fr/de/ja/ko/tr/ru/ar 由 `scaffold-locale-routes.mjs` 生成（路由对等测试要求七个语种和葡语路由一致） | `src/app/**/euro-cylinder-calculator/`, `src/components/locale-pages/CylinderCalculatorPage.tsx` |
| 站点地图、西葡镜像登记、页脚链接 | `site-sitemap.ts`, `spanish-mirror.ts`, `SiteFooter.tsx` |
| 文章可挂工具入口：`NewsArticle.tool`（正文不带链接，所以做成结构化字段，样式同附件行）；两篇锁芯指南已挂 | `types.ts`, `NewsDetail.tsx`, 两篇 guide JSON |

**不说的**：每个型号的内外分段目录里没有，计算结果只给总长和“需要的两半”，并提示书面确认分段。

**验证**：`npm test` 404/404；typecheck 通过；本地 dev（3021）实测 EN/ES/FR 页面、40mm 门算出 27.5/27.5 → 订 56mm 并提示凸出、指南文末入口可见，控制台无报错。

**交给别人**：
- 多语会话：七个语种的页面文字走 `tx`，尚未翻译；组件内的标签只有 EN/ES/PT。
- 工程会话：新路由的 `seoTitle`/描述现在写在页面 metadata 里，需要时按分工接手。
- 页脚是共享组件，改动是加一行链接，RAYEN 不渲染 HYDE 页脚（如有影响请雷茵侧自行发布）。

**发布**：源码已推送，线上要等下一次 `release:hyde`。
