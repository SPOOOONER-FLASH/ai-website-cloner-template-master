# Claude · 2026-09-29 · 地弹簧 24 条：英文写错了产品；补齐西语；HYDE 上架的真实成本

**Scope**: `content/products/*floor-spring*.json`、`*top-pivot*.json`（24 条）、
`scripts/fix-floor-spring-copy.mjs`（新）、`package.json`。

**⚠️ 中立 lane，影响 RAYEN 渲染**：这 24 条是 `sites: ["rayen"]`，本次改的是它们的
`summary` / `summaryEs` / `summaryPt` / `nameEs` / `namePt` / `specsEs` / `specsPt`。
**雷茵的英文页今天就在显示错的产品描述**，见下。雷茵那边可自行决定何时发布。

## 起因

甲方 2026-09-29：「地弹簧放到 HYDE 网站上」。

## 先发现的问题：24 条的英文 summary 描述的是另一种产品

| 型号 | 英文（错） | 葡语（对） |
|---|---|---|
| D-1031 | `45# steel pull handle.` | `Mola de piso.` |
| D-3012 | `304 Stainless Steel pull handle.` | `Mola de piso em aço inoxidável 304.` |

**24 条全部如此。** 一批拉手记录用 `"{material} pull handle."` 套出来，名词没改。
葡语是另外写的，所以是对的 —— 两种语言在同一条记录上互相矛盾。而且 `t()` 在缺字段时
回落英文，所以这句错话也会是西语站要印的那句。

这跟 trinco/lingueta 是同一天的同一类问题：**一个事实有不止一个家，其中一个家错了。**

## 改了什么

`npm run copy:floor-springs` 从**记录自己的字段**推导三语 summary：`material`、
`doorTypes`、以及工厂发布的规格行（`Double action`、`Max door weight`、`Body size`）。

```
D-1031  EN  45# steel double-action floor spring for glass doors. Max door weight 60kg / 100kg.
        ES  Muelle de piso de doble acción de acero 45# para puertas de vidrio. Peso máx. de puerta 60kg / 100kg.
        PT  Mola de piso de duplo sentido em aço 45# para portas de vidro. Peso máx. da porta 60kg / 100kg.
D-3010  EN  304 Stainless Steel top pivot for timber and metal doors. Body 30 × 12 × 157mm.
```

**没有一个字是编的。** 五条顶轴只发布了 `Body size`，它们的句子就只说 body size，
不借邻居的重量 —— 「写不知道的，比写一个像样的数字便宜」这条规矩用在散文上。
同时补齐了 24 条缺失的 `nameEs` / `summaryEs` / `specsEs`。

## 两个守卫当场抓到我

1. **`normalize-us-spelling.mjs` 把我的查表 key 改了。** key 原本按记录写成 aluminium
   的英式拼法；规范器把它改成美式 —— 按它自己的职责是对的，它分不出查表 key 和句子。
   记录没被改（这些产品不在 HYDE 范围内），于是 map 对不上数据，下次运行直接抛异常。
   **这和 `<language>` 取 `LOCALE_TAG`、和 trinco/lingueta，是同一个错误低一层的版本：
   为一个用途维护的值，被另一个用途读走了。** 已改成大小写与拼写都不敏感的查表。
2. **`regional-terms` 要求 piso 不要 suelo。** 我写的是 `Muelle de suelo`（伊比利亚说法），
   拉美用 **`Muelle de piso`**。已改。

守卫是对的，两次都是。

## 「放到 HYDE 上」的真实成本 —— 本次**没有**做

把 24 条的 `sites` 加上 `hyde` 只是一行。我试着加上去跑了一遍全量测试，**9 项失败**，
这才是真实账单：

| 失败项 | 要做什么 |
|---|---|
| `every published category has a buying guide` | `floor-springs-and-pivots` 要一份选购指南（正文＋FAQ，三语）——**这是最大的一块** |
| `every category that does have products is built` | 该目录页要建（线上现在 404） |
| `faq.json claims 521 published models; has 545` | FAQ 的数字，两种语言 |
| `every counted catalog claim in an article matches` | 文章里写死的目录数字，三语（AGENTS.md 第 4 条） |
| `HYDE coverage articles use site-filtered counts` | 同上 |
| 规格覆盖率报告、em dash、拼写、register | 四个现成脚本，各一条命令 |

HYDE 已发布数会从 **588 → 612**。所以这不是「翻个开关」，是一个目录的上架工作。
**已 revert `sites`，只留这次的文案修复**（它本身就该做，与 HYDE 无关）。
下一步做哪一块等甲方定。

## 测试

`npm test` 447 passed；lint 0 errors；typecheck clean。
`copy:floor-springs --check` 已进 `test:export`。未发布。
