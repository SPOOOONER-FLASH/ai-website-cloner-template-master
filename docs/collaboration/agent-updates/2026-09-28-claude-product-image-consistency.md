# 2026-09-28 · Claude · 产品图一致性审计脚本

甲方清单项「产品图一致性审计脚本（主体占比、基线）没写」。只写脚本和报告，**没有改任何图片**。

## 新增

- `scripts/audit-product-image-consistency.mjs`（`npm run audit:productimages`）：对 HYDE 目录
  （`onHydeCatalogue` 同规则）的 heroImage + gallery 逐张测量：主体占比（外框长边占画面比）、
  水平居中偏移、基线（产品下方留白占比）、底色亮度、是否场景图。读 `public/images/products/`
  原图（products-hyde 的水印会被算成主体）。
- `docs/design-references/product-image-consistency.md`：脚本生成的报告，**不要手改，重跑脚本**。

## 当前结果（521 张主图 + 1911 张图库图）

- 主图中位占比 85%（10–90 分位 74%–92%），中位基线 18%。67 个 HYDE 产品没有主图。
- 主图标记 93 张：off-baseline 48、off-centre 22、off-scale 22、cropped 4、grey-field 4、small 2。
  - grey-field / cropped 里 AR4 四张（`argentina-ar4/hyde-ar4-*`）是灰底实拍，与白底目录不一致——
    和甲方说的首页 AR4 区块「篇幅较重」是同一组图，视觉会话调版式时一起看。
  - off-baseline 多数是卫浴横向产品（挂钩排、毛巾架）：横向产品居中构图时自然「悬空」。
    **需要一个决定**：目录约定是「几何居中」还是「共同地平线」。定了之后脚本阈值随之改。
  - 最该先修的两张：`ssh015`（合页，占比 59%）、`nc182`（拉手，偏小）。
- 约 600 张原图左上角有旧供应商 logo；脚本测量时排除它，只计数不标记——
  `watermark-product-images.mjs` 在 products-hyde 副本里已用 HYDE 水印覆盖该角（已核对 615/615 有副本）。

## 为什么没接进 `npm run check`

10–20 秒；「报告过期」式检查会让每次换图都挡构建；libvips 缩放在 Windows / Linux 间不保证逐字节一致。
换完一批图后手动跑一次即可。

## 顺带

`src/components/site/BauColumn.tsx:51` 的 `duration-300` 让 `motion:check` 在 main 上就是红的
（BAU 专栏提交引入），改为 `duration-[var(--motion-medium)]`，否则 `npm run check` 无法全绿。
动效会话若另有取值，直接覆盖。

## 测试

`npm run check` 全绿（Linux 云端）：lint、typecheck、418 项测试、build、test:export。
`finish-downloadable-pdfs.mjs` 调用 Windows 的 `py` 启动器，Linux 上没有它会报「PDF 版式未设置」——
是环境问题不是 PDF 问题；用 `py → python3` 垫片 + pymupdf 跑过，两本 PDF 均 ok。构建产物（out/、
door-prep / drawings SVG）已丢弃，未提交。

## 下一步

- Codex（视觉）：按报告的 flagged 表逐张重新裁切/留白（真实照片的构图修正，允许；不生成）。
  改完跑 `npm run audit:productimages`，标记数下降即验收。
- 发布：只推源码，未构建 `out/`；发布棒在 johns 机器。
