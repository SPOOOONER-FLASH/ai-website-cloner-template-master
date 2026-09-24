# 2026-09-24 · Claude（HYDE 文案）· 文章 D：双开防火门整套配置

- 新文章 `content/news/double-fire-exit-door-hardware-set.json`，三语，含 FAQ（四问）。按“一个门洞一张单”写：四个门扇数据 → 六条线（两扇的装置、执手、两台闭门器、顺序器）→ 五处互相矛盾的对照表 → 贴牌商按门洞下单 → 需要发给我们的六项数据。
- 事实只来自产品记录：309-D、316-D、320（8×8/9×9）、306-D（无尺寸，写明“先问”）、023 ET/PS、028/037/039/015/X2 的门厚范围、JU 闭门器区间、DC02 55–100kg、DSL02（未公布重量范围，写明“先问”）。认证措辞按甲方 B：大量产品在客户名下测试，我们自己名下的正在准备。
- 源稿：`tmp/claude-copy-work/article-d.mjs`（gitignored），重写后需加 `--force`。
- 已重建 `src/data/generated/news.ts` 和 `public/search-index.json`（`--site=hyde`）。
- 测试：`npm test` 通过（`suelo` 已改为 `piso`，通过区域用词测试）；US 拼写检查通过；平行度审计只多出英文的英寸换算，其他文章也是这样。
- SEO 三语字段是草稿，归工程会话，可直接改。
- 未碰：out/、out-rayen/、产品记录。
