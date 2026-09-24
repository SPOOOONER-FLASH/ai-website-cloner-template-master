# 2026-09-24 · Claude · 卫浴配件规格统一：一个事实，原来有四种写法

文案会话报了 BH05/06/07 的 `Application: "living room,bathroom..."`（逗号后无空格、结尾省略号）。
查下去不止三条，也不止这一个毛病。

## 实际情况

`"living room,bathroom..."` 出现 **4 次**不是 3 次。而同一个事实，卫浴配件品类里有**四种写法**：

| 写法 | 记录数 |
|---|---|
| `bathroom` | 4（BH01–04） |
| `living room,bathroom...` | 4（BH05–08） |
| `Living room/Bathroom` | 6（BH09–14） |
| `bathroom, living room` | 7（BH36–42、BH54） |

还有：BH05/06/07 各有一行 `Options` 与 `Feature` 说同一件事（钩子数量）；BH06 的 `Applications`、
BH07 的 `Use` 又把房间那行重说一遍；BH05–08 的 `Installation` 是小写 `wall-mount`。

甲方的原话是「一致性本身就是论据」——十五块产品牌照同样的拍法说明这是一家有流程的工厂，
拍法各不相同就说明这些图是从各处凑来的。二十一条记录把同一句话写四遍，是同一个问题。

## 改了什么

- `Application` 统一：BH01–04 → `Bathroom`（它们本来只说 bathroom，**没有扩大声称**）；
  其余 17 条 → `Bathroom, living room`
- 删掉重复行：BH05/06/07 的 `Options`、BH06 的 `Applications`、BH07 的 `Use`
- `wall-mount` → `Wall-mount`（目录里其他 `Installation` 都是句首大写）
- `1-8 hooks available` → `1–8 hooks available`（范围用短破折号，与 `45–50mm` 一致）
- 039 的非标准标签 `Use = "Paired with panic bar"` → `Used with = "Panic exit devices"`，
  与 072 的 `Used with = "307 panic exit device"` 同一个模式

标签取舍按全目录用量：`Application` 236 次、`Feature` 58 次是标准；
`Applications` 1 次、`Use` 2 次、`Options` 3 次全部只出现在这几条上。

## 差点自己制造一次孤儿

统一英文写法之后跑翻译，`Bathroom, living room` / `Wall-mount` / `1–8 hooks available` 全部变成未映射——
因为**那四种旧写法在术语表里各自都有键**（`"living room,bathroom..." → "Sala, baño y otros ambientes"` 等），
我一改英文，这些键就全成了孤儿。这正是我这两天一直在提醒别人的那件事，自己照样撞上。

已为新的标准写法补键，译名沿用旧键已有的，没有重新翻译。补完两边都是 **0 未映射**。

## 顺带修掉一个会反复发作的源头

pt 术语表里有三条欧洲葡语拼写：`"Lever section" / "Grip section" / "Bar section" → "Secção…"`。
重新生成 BH41 时它把 `secção` 写进了记录，被 `regional-terms` 测试拦下。
`normalize-regional-terms.mjs` 认识 `secção → seção`，所以每次都能清掉——但源头在术语表，
只清记录的话下次重新生成又会回来。三条已改成巴西葡语 `Seção`。

## 重新生成时的防护

用 `--only` 圈这 22 条，跑完之后把 `summaryEs` / `summaryPt` / 四个 SEO 字段从 HEAD 还原了——
确认过生成器确实改写了它们（039 的 `summaryEs`、22 条的 `seoTitlePt` / `seoDescriptionPt`）。
最终 diff **只有规格行**，三种语言同步，文案字段一个字没动。

这就是上一份更新里说的那件事的实例：规格值的退回风险清掉了，摘要与 SEO 那一路还在，
所以任何重新生成都要么先备份文案字段，要么别碰。

## 测试

`spec-table-parity`、`regional-terms`、`portuguese-brazilian`、`product-dashes`、
`us-spelling`、`product-naming`、`hardware-terms` 共 11 项通过。

## 没做

- `Bathroom Hotel`（16 条）没并进来：那是「酒店卫浴」，与「卫生间、客厅」不是同一个声称。
- 卫浴配件里 21 条产品名全叫 `Bathroom Accessories`，彼此无法区分。这是产品命名问题，
  不是规格问题，留给命名那一轮。
