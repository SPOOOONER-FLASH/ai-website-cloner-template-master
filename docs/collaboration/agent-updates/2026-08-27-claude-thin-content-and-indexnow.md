# Claude — 规格表填充 · robots · IndexNow 提交

| | |
|---|---|
| 范围 | `content/products/*.json`(36)、`scripts/enrich-product-specs.mjs`、`scripts/indexnow-submit.mjs`、`src/app/robots.ts`、`package.json` |
| 未动 | `src/app/es/**`、设计与图片、`src/data/**` |

## 诊断（推翻了 HANDOFF 的旧假设）

471 页 canonical **全部自指、0 例外**，所以 GSC 525「重复网页」不是 canonical 写错。
真因是正文本身重复：33 个产品 summary 都是 "Lock case."、44 个规格表全空、107 个只有 1 行。
Bing「内容过少 25」与 GSC 525 是同一个病。

## 改了什么

- 44 个空规格表 → 18 个。只用两个来源：型号本身的命名规则（LC + 中心距 + 轴距，
  由已有人工记录 LC14 85×50 与甲方自己的 worldbid 文案双向印证）、甲方自己发布的
  worldbid 商品文案（每条都带 listing id 可复查）。**没有任何一行是编的**，
  推不出来的留空并在脚本末尾列出。
- 33 个 "Lock case." → 36 条按型号生成的句子。
- robots.txt 删掉 `Host:` —— Bing 的 robots 测试器把它报为 error（Yandex 扩展，Google 忽略）。
- 新增 `npm run seo:indexnow`：**之前 IndexNow 是空转的**，只放了 key 文件，
  从来没有 POST 过任何 URL。脚本读 `out/sitemap.xml`（467 条），推送后再跑。

## 验证

`npm run check` 通过（47 测试 / 472 页 / 0 semantic issue）；`deploy:prep` 通过；
`out/robots.txt` 已无 `Host:`；`indexnow-submit --dry` 读出 467 条。

## 结论与建议

- **finish 后缀（SNET/PBET/SSET）不可推断**：21 个可校验样本里 4 个与记录矛盾
  （5870 ACET、8827 SSET 等的 finishes 是可选范围不是单一色）。已放弃，不要再试。
- 剩下的重复正文靠数据解决不了，需要甲方：32 个 stainless-steel-handles、
  30 个 lever-handles、18 个 bathroom-accessories 的 summary 完全相同，
  各自只有 1 行 Material。**要么甲方给尺寸/用途，要么把它们合并成一个带变体的页面**——
  这是产品决策，等甲方定。
- 建成品里 title <40 字符 19 页、description <110 字符 14 页
  （`/contact/` 74、`/company/` 82、`/products/knob-locks/` 91、`/downloads/` 98），
  比 Bing 报的 26/25 少，差额是旧站 `index.php?...` URL，301 后会自然消失。
