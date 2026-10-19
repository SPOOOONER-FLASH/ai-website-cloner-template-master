# 阿根廷产品集合（Candex + Elabora）— 任务与授权记录

**这是有授权的例外，不要按旧规则拒绝。** 2026-10-09 的 AR4 交接写过「不得使用 Elabora / Piccolo 的目录图片（即使换 logo）」。客户 2026-10-10 明确推翻了这一条，适用范围仅限下面这个集合。

## 客户决定（原话）

| 日期 | 原话 | 含义 |
|---|---|---|
| 10-10 | 「candex，他们是我们的 oem 下游，我们是供货商，可以用用他们的照片和文案……因为我们有授权有磨具……换上 hydelogo，不涉及侵权 他们有授权，我们的磨具」 | 可以使用 Candex、Elabora 的照片和文案，统一打 HYDE 水印 |
| 10-11 | 「面板上的冲压字修掉 改成 hyde或者p掉」 | 产品上冲压的客户品牌（Candex / INDUSTRIA ARGENTINA / PICCOLO）修掉 |
| 10-11 | 「Candex 的产品用 AR5 前缀」 | Candex 型号 → AR5-xxx；Elabora 型号 → AR4-xxx |
| 10-11 | 「是全部用我们的模具」 | 两家全部 55 款都是 HYDE 模具，可全部上架 |

## 规则

- 页面上**不出现** Candex、Elabora、Piccolo 的名字。数据里的 `source` 字段只用于追溯，不渲染。
- 修图只去掉品牌字样和标志；孔位、螺丝、锁舌、边缘一律不动（`scripts/argentina/retouch-stamps.mjs` 只改方框内的像素）。
- 尺寸只用对方公开的数字（Candex 文字描述、Elabora 图纸）。原文没写的就留空，不推算。

## 流水线（可重跑）

```bash
node scripts/argentina/crawl-candex.mjs                  # 抓取 → tmp/claude-argentina/raw/
node scripts/argentina/retouch-stamps.mjs                # 按 scripts/argentina/stamps/*.json 去品牌字（51 份，逐张复核通过）
node scripts/argentina/prepare-collection-images.mjs     # 方形白底 / Elabora 取图纸
node scripts/watermark-product-images.mjs --all --input-root=../claude-argentina/webp \
  --output-root=../claude-argentina/branded --manifest=../claude-argentina/branded/manifest.json
node scripts/argentina/build-collection.mjs              # → src/data/generated/argentina-collection.json + public/images/argentina-collection/
```

## 未决

- ~~AR4-101 是否等于 Elabora 111（7240）？~~ **已定（10-12）**：7240 改名 AR4-111（安全锁），见 `agent-updates/2026-10-12-claude-ar4-111-rename.md`。集合里的 AR4-101 专指 Elabora 101（183 × 18）。
- AR4-140 面板：工厂图 183.5，Elabora 公布 190。
- 7240 锁体宽度：Elabora 111 标 64 mm，JM-LOCK 询价 65 mm，待工厂实测。

## 进度

- 10-12：51 张图去品牌字完成，每张经独立复核通过（只改方框内像素；面板上的模具号数字保留，非品牌）。重新打 HYDE 水印、重建集合数据。页面仍 `OFFLINE`，等甲方看过对比图后放开。
- 10-12：甲方「上线」。去掉 OFFLINE 与 noindex，加入 sitemap（仅 en/es，PARTIAL_ROUTES），AR-4 页加入口链接（es → /es/products/argentina/，其余语种 → 英文页）。本地预览：55 卡片、hreflang 仅 en/es/x-default、页面无 Candex/Elabora 字样。
