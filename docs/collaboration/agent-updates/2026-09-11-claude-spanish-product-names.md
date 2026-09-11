# 2026-09-11 Claude — 西语站 534 个产品页一直用类目名当产品名

**范围**：`src/data/es-glossary.ts`（新增 `PRODUCT_NAMES_ES`，59 条）、
`scripts/translate-products-es.mjs`（根因 + `--names-only`）、
`scripts/build-spanish-review-sheet.mjs`（产品名进复核表）、
`content/products/**`（659 条 `nameEs`）、`docs/collaboration/spanish-review.json`。
**测试**：lint 0、typecheck 通过、`npm test` 247/247、`deploy:prep` exit 0。
**没碰**：`src/app/es/**` 的手写西语文案（Codex 区域）、规格表译文、轮播、Cloudflare。

## 一、是什么

```
EN  <h1>001 Panic Exit Device Trim</h1>
ES  <h1>001 Barras antipánico</h1>        ← 「逃生推杆」，是类目
ES  <h1>DC02 Accesorios de herrajes</h1>  ← 「五金配件」，是类目
```

582 条记录的 `nameEs` 是它所属**类目**的西语名。`<title>` 同样中招，534 个西语标题
塌缩成约 38 个不同字符串，自己和自己竞争。一个西语规格制定者搜 `selector de cierre`，
落到一个叫「五金配件」的页面。

根因是 `scripts/translate-products-es.mjs` 里的一行：

```js
product.nameEs = glossary.categories[product.categoryPath[0]] ?? product.name;
```

当初没有西语产品名表，拿类目名做了临时顶替，然后它上线了。

## 二、为什么没人发现

因为**什么都没坏**。没有空白、没有 404、没有报错，每一页都是一个语法正确、排版正常的
西语页面，只是它声称自己是另一个东西。这类缺陷不会自己浮出来，只会被人读到。

修复后不再静默回退：术语表里没有的产品名直接让脚本抛错停下。
新产品加一行 `PRODUCT_NAMES_ES` 的成本，远低于 534 个页面自称类目的成本。

## 三、⚠ 差一点造成的更大回退（这条最重要）

第一次修是直接重跑整个翻译器。改动回来是 557 个文件、830 条规格行，抽样长这样：

```
-      "label": "Doble distancia entre ejes"
-      "value": "72 y 92 mm (con perforación para cilindro)"
+      "label": "Centre distances"
+      "value": "72mm and 92mm (cylinder hole)"
```

**已经是西语的规格行正在被改回英文。** 那些标签不在 `SPEC_LABELS_ES` 里 —— 它们是后来
人工或复核阶段翻的 —— 重新生成时落到「查不到就用英文原行」的分支，把更好的译文悄悄扔掉。

按那个改动发布，等于用一个西语缺陷换一个更大的西语缺陷。已全部撤销，改为
`--names-only`：只写 `nameEs`，规格与摘要一律不碰。

**给下一个人：`node scripts/translate-products-es.mjs --write` 全量重跑在这个目录上
已经不安全了。** 术语表落后于复核已经产出的译文，全量重跑会把复核成果冲掉。
要全量重跑，得先让 `SPEC_LABELS_ES` / `SPEC_VALUES_ES` 追上 `specsEs` 里现有的译法，
那是一件独立的任务，要单独读它自己的 diff。

## 四、第二个坑：没有规格的产品被整条跳过

改完之后还剩约 20 条仍是类目名：10 个 picaporte、门镜、暗插销、6 个玻璃门拉手。
原因是循环开头的 `if (!specsEs.length && !summary) continue;` —— 没东西可翻译被当成了
没东西要修，但**产品名是每条记录都有的字段**。已在 `--names-only` 下取消这个跳过。

最终：659 / 659 条产品拿到产品名，零条残留类目名。

（`Accesorios de baño`、`Bisagras de latón y acero`、`Cierrapuertas` 这三组产品名确实
等于类目名，那是对的，不是漏网。）

## 五、术语进了复核流程

59 条全部写进 `docs/collaboration/spanish-review.json` 的 terminology，
`kind` 为「产品名 Nombre de producto」，按**影响页数**倒序（`Lever Handle` 68 页、
`Bathroom Accessories` 66 页、`Stainless Steel Handle` 62 页）—— 复核的人按后果排序，
不按字母排序。生成器是 `scripts/build-spanish-review-sheet.mjs`，改的是生成器不是输出。

术语用的是西语五金行业的标准叫法，不是英文直译：
`cerradura de embutir`（插芯）与 `cerradura de sobreponer`（外装）是两种产品，
买错了是在门口才发现。**这 59 条仍需甲方确认。**

先发布再复核的理由：它替换掉的状态不是「未翻译」，而是「错的」—— 产品名字段里放着
类目名是一个关于这个页面是什么的事实错误。等复核再改，代价是这 534 页再错一周。

## 六、下一个人

- 甲方 2026-09-11 提供的阿里后台需求数据已落盘：
  `docs/research/2026-09-11-alibaba-product-performance.json`（43 个商品，含曝光/访客/
  询盘/转化）。里面有两条「有需求、站上没有页面」：**6068 锁体系列**（119 曝光、3 询盘、
  23% 转化）和 **Adams Rite 窄边铝合金锁体**（48 曝光、3 询盘）。两条都卡在工厂缺规格。
- 甲方已指定下一步：顺序器 DC02 做「专栏」—— 解释性文章 + 产品页强化 + 精选合集
  （形态参考首页的阿根廷 AR4 橱窗）。本次未做，是独立阶段。
- 阿里标题里有两条自称 ANSI Grade 2 / Grade 3 的商品（ID 1601770729465、1601788708674）。
  交接文档第六节第四条：证书号下来之前任何材料不得暗示我们持有 ANSI。
  **这两条阿里标题与那条纪律冲突，需要甲方确认依据。** 站上没有这个说法，我没有动它们。
