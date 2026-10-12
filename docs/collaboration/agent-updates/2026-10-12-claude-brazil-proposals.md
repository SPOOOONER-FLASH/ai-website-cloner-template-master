# 2026-10-12 · Claude · 巴西逃生锁专栏：三套设计方案（预览，未上线）

**范围**：任务与授权见 `tasks/2026-10-12-brazil-panic-bars.md`。分支 `claude/brazil-collection`，不进 main，等甲方选方案。

| 方案 | 路由（noindex，仅预览） | 分类方式 | 参照 |
|---|---|---|---|
| A 型录 | `/products/brazil-preview/a/` | 同一张白底卡片网格；按门型 / 按型号切换；插入工厂视频卡和 OEM 事实卡 | fsbna.com/products/collections |
| B 门型 | `/products/brazil-preview/b/` | 先选门（单门侧锁 / 单门天地杆 / 双门 / 外开），再选外开方式与颜色，结果行带门型立面图 | 自创（安装工按门找货） |
| C 专题 | `/products/brazil-preview/c/` | 满宽工厂视频 → 标题与导语 → 三条 OEM 事实 → 按门型分组的五金清单表 | FSB 1138 / Les Couleurs |

**数据**：`scripts/brazil/build-collection.mjs` 把商城上的一条条列表（左右手、颜色、带不带把手各算一条）归并成「模具系列 × 门型 × 款式 × 外开方式」，颜色成为选项。每个客户设计一个匿名系列号（BR1…BR9）。**品牌 ↔ 系列对照表与来源链接只在本机 `tmp/claude-brazil/`**（公开仓库；A/B 是客户端组件，数据会下发到浏览器）；脚本在公开 JSON 出现任何客户名时直接报错。

**视频**：`public/videos/stories/brazil-panic-bar.mp4`（11.7 s，371 KB，无声）= 306-S 2–7.9 s + 306-D 15–20.8 s，裁掉下方 20%（工厂片里的英/葡字幕），海报取末帧。`StoryFilm` 加了可选 `fill` 与 `buttonLabels`，原有两处调用不变。

**不做 Blender**：逃生锁只有外形图纸，按 `design-references/2026-09-30-fsb-page-study` 的规则不能建模特写；门型图是 SVG 几何示意（`DoorDiagram.tsx`），不画产品。

**检查**：eslint、tsc、impeccable detect 通过。产品图等抓取完成后统一做方形白底；上线前还要按阿根廷流程去品牌字、打 HYDE 水印。

**未做**：葡语路由（`/pt/products/brazil/`）、sitemap、PARTIAL_ROUTES——选定方案后再做。
