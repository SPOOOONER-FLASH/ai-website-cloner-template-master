# 2026-09-24 · Claude（HYDE 文案）· 54 个卫浴产品改名 + 三语摘要

- 按 `docs/copy/naming-bathroom-accessories.md`，这 54 条原来都叫 “Bathroom Accessories”，现在的 name/nameEs/namePt 按实拍图改成 32 个名字。分工和工程会话约好：我改名称和摘要，slug、categoryPath、标题和 SEO 归工程会话。
- 翻译表各补 30 行（`es-glossary` PRODUCT_NAMES_ES、`pt-glossary` PRODUCT_NAMES_PT）；Grab Bar、Flip-Up Grab Bar 原来就有，沿用原译。
- `content/i18n/zh-terms.json` 的 productNames 补 32 个中文名，不补的话中文镜像的检查会失败。扶手沿用雷茵已经在用的“固定扶手”“上抬扶手”。**这是中立文件**：这些记录没有 `sites` 字段，雷茵也会显示，所以雷茵那边会看到新的中文名。
- 54 条的 summary、summaryEs、summaryPt 全部重写，依据是规格行和实拍图；没有规格行的（BH40、43、51、53、55–58）不写材质和尺寸，写“尺寸下单前确认”。
- 连带修正：BH17 改名 “Spring Latch” 以后被算进锁具，`dimensional-interchangeability-2026` 的锁具数从 257 变成 258，三语已改；百分比不变。
- 已重建 search-index.json（--site=hyde）。测试：`npm test` 通过。
