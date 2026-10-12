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
node scripts/argentina/retouch-stamps.mjs                # 按 tmp/claude-argentina/stamps/*.json 去品牌字
node scripts/argentina/prepare-collection-images.mjs     # 方形白底 / Elabora 取图纸
node scripts/watermark-product-images.mjs --all --input-root=../claude-argentina/webp \
  --output-root=../claude-argentina/branded --manifest=../claude-argentina/branded/manifest.json
node scripts/argentina/build-collection.mjs              # → src/data/generated/argentina-collection.json + public/images/argentina-collection/
```

## 未决

- **AR4-101 是否等于 Elabora 111（7240）？** 7240 的面板 220×25、中心距 72、锁体高 140，和 Elabora **111** 一致；Elabora 的 101 是 183×18 的窄面板。在客户确认之前，集合里的 AR4-101（183×18）与现有产品页 AR4-101（220×25）互相矛盾。
- AR4-140 面板：工厂图 183.5，Elabora 公布 190。
- 7240 锁体宽度：Elabora 111 标 64 mm，JM-LOCK 询价 65 mm，待工厂实测。
