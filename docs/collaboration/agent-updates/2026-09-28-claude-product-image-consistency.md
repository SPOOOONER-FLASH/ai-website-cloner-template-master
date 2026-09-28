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

## 甲方决定：共同地平线（2026-09-28）

甲方选「共同地平线」，不选几何居中。脚本已改：`HORIZON = 18%`（产品最低点距画面底边，取当日目录中位数，
**写死为常量**，修图时目标不随之漂移），容差 ±6%。报告每行写明「raise / lower 多少」。

- 结果：521 张主图里 276 张在地平线上，**245 张 off-baseline**（其中偏低 ~150 张，多为锁体、逃生门锁等竖长产品，
  它们要靠**整体缩小**站上地平线，而不是出框；偏高 ~90 张，多为卫浴横向产品）。主图标记总数 93 → 265。
- 这是一个真实的修图清单，不是阈值太严：地平线一旦定下，竖长品类的主体占比会随之下降，这是预期结果。
  `off-scale` 仍按品类中位数判定，所以同品类之间比例依旧一致。
- 修图（Codex）：真实照片的平移 / 等比缩放 / 留白，不生成、不改产品。

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
- 发布：甲方 09-28 要求构建 out/。本会话是 Linux 云端，按 AGENTS.md 与甲方同日规定，HYDE 发布只在 johns 机器从
  `origin/main` 跑 `npm run release:hyde`；本 PR 合并前 main 上没有这次改动，而且除 BAU 专栏一处悬停时长外不改任何页面，
  所以**本会话未构建、未提交 out/**。合并 #6 后由 johns 机器发布，发布后记得 Cloudflare purge。
