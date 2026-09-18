# 产品特性列表 216/216，产品名与摘要跟着语言走

**agent**: Claude · **日期**: 2026-09-17 · 接 `2026-09-17-claude-pt-full-path.md`

## 特性列表：全部 545 行译完

`src/data/pt-features.ts` 从 167 条补到 **545 条**，
`scripts/translate-product-features-pt.mjs` 现在在 **216 / 216** 条记录上写
`featuresPt`。

规则不变：**一条记录的每一行都能解析时才写。** 四条葡语项目符号加两条英文的列表
看起来做完了，其实没有。脚本的报告按「能解锁多少条记录」排序而不是按出现频次 ——
一行用了十次但它所在的记录另外还被六行卡住，那它在那六行做完之前一分钱不值。

**两条故意没翻，因为它们不是翻译问题:**

```
"Electroplatingbhgh."                         源数据里的错字，不是术语
"Fabricada en lámina de acero 1.2 mm…"        英文规格字段里坐着一段西语
```

把错字翻成三种语言只是把缺陷洗白。这两条是**记录所有者的数据 bug**，
已写进 `SPEC_VALUES_PT` 上方的注释里，不会被下一个会话当成词表活。

## 产品名和摘要:`(es && …)` 只对西语答对

```
const name    = (es && product.nameEs)    || product.name;
const summary = (es && product.summaryEs) || product.summary;
```

这两行在葡语页面上取英文分支 —— **葡语规格表旁边挂着英文标题和英文首段**。
光是摘要就 24 个页面。同样的写法还在：

| 位置 | 影响 |
|---|---|
| `ProductDetail` | 产品名 + 首段摘要 |
| `ProductIndexList` | 型号索引「305 — Fire Door Panic Exit Device」9 页 |
| `ProductCard` | 「Reference available on request」18 页 |
| `CategoryCard` | 分类名与分类摘要 |
| `NewsDetail` | 文章里「提到的产品」列表 |
| **`JsonLd` 的 Product schema** | **标记里的名字、描述和规格表全是英文** |

最后一条最值得说：**标记必须和页面说的一致。** 一个葡语页面的 Product schema
带着英文名字和英文规格表，等于在告诉搜索引擎可见文字是别的东西 ——
和 Google 处理「FAQ 标记里的答案页面上没有」是同一类不匹配，只是换了一个 schema。

## 文章作者职务

`Digital Communications, Canton Hyland` 在 35 个葡语文章页上是英文的。
`roleEs` 早就有，`rolePt` 没有。已补，页面和 JSON-LD 的 `jobTitle` 同时改。

## 规格值

`SPEC_VALUES_PT` 补了 96 条（尺寸、材料组合、包装、颜色、公差串）。
`translate-products-pt.mjs` 的英文残留从 **991 行降到 342 行**，
剩下的基本是单条记录的长尾。

## 数字

| | 早上 | 现在 |
|---|---|---|
| 有英文的葡语页面 | **675 / 680** | **116 / 690** |
| 葡语页面上的英文短语（不重复） | **7,281** | **370** |
| `featuresPt` | 0 / 216 | **216 / 216** |
| 规格行英文残留 | 991 行 | **4 行**（就是那两条数据 bug） |

`npm test` 331/331。`deploy:prep` 全绿。

## 规格行：991 → 4

`SPEC_VALUES_PT` 和 `SPEC_LABELS_PT` 一路补到底。`translate-products-pt.mjs`
现在报：

```
2 distinct terms left in English, across 4 rows
```

**那两条就是上面故意不翻的两条数据 bug。** 规格数据这一块到此为止，
剩下的不是翻译工作。

### 顺带发现一个会静默失败的坑

三个尺寸串的「mm」前面是 **U+202F（窄不换行空格）**，不是普通空格：

```
"110 mm (L) × 66 mm (W)"   ← 110 后面是 U+202F
```

在任何编辑器里它和 `110 mm` 看起来一模一样，但它是**另一个字符串** ——
用普通空格敲的词表条目永远匹配不上，那个值就一直安静地留在英文。
已写进 `SPEC_VALUES_PT` 上方的注释：**复制，不要重新敲。**

## 还剩

- 剩下的英文短语基本是**单条记录的产品文案长尾**和上面那两条数据 bug。
- **西语的 `featuresEs` 仍然是 0** —— 那些项目符号从上线起就没在西语页面显示过。
  现在渲染是按语言各取各的列表，所以西语补上译文就会自动出现，不用再改组件。
- 甲方还欠：六个订单码、五个尺寸、308-S/308-D 的端盒问题；GSC 的跳转规则要跑
  那两行命令才生效。
