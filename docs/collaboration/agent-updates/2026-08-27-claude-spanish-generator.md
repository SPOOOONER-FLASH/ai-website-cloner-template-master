# Claude — 西语生成器：429 个产品的 ES 字段

| | |
|---|---|
| 范围 | `src/data/es-glossary.ts`、`scripts/translate-products-es.mjs`（均新增）、`content/products/*.json`(429) |
| 产出 | 429 个 `nameEs` + 419 个 `specsEs` + 358 个 `summaryEs` |
| 复核件 | `docs/content/revision-terminologia-es.docx` — 给西语母语同学看的 |

## 不是翻译，是重新组装

`summaryEs()` 和 `enrich-product-specs.mjs` 里的 `summaryFrom()` **吃同一批规格行、走不同语法**。
西语把材质用 `de` 挂上去、形容词后置，所以是重新造句而不是逐词替换。

    EN  An iron mortise lock case with 85mm centre distance and 55mm backset, euro profile cylinder preparation.
    ES  Una caja de cerradura de embutir de hierro, distancia entre ejes de 85 mm y entrada de 55 mm, preparada para cilindro europeo.

术语表查不到的词**原样留英文并计数**，覆盖率因此是可见的：1004 处 → 370 处（≈91%）。
不猜，靠加词条提升。

## 三个只有真跑一遍才会暴露的坑

1. **`Cuerpo de hierro` 直接挂 `de` 会变成 `caja de cerradura de embutir de cuerpo de hierro`。**
   英语没有连接介词所以能堆叠，西语不行。材质是名词短语时要退回中心词。
2. **44 个记录的 Material 字段是整句英文**（001 的是 "304SS / 304 Stainless Steel with
   Plated and suit for Panic Exit Device."）。折进句子会得到一坨。加了长度与句读判断，
   过长的值仍然进规格表（只是难看），但不进句子。
3. **`304SS` 被 `.toLowerCase()` 变成 `304ss`。** 订货码不能小写。改成逐词判断，
   含两个以上大写字母或数字的词保持原样。

第 2 条是我做西语时才发现的，但**英文侧也有同一个问题**——HANDOFF 第七节
「44 个属性字段里的整句话要改写成值」说的就是它。

## 顺带修好一个英文语法 bug

`enrich-product-specs.mjs` 拼出过 "A deadbolt, solid brass cylinder cylinder preparation."
——值里已经带 cylinder 又追加了一次。已修生成器并回填 5 条记录。

## 复核件

`revision-terminologia-es.docx`：43 个规格标签 + 16 个分类名 + 132 个常用值 + 13 句成品，
每行留一列「¿Cambiaría algo?」。文末列了 10 个我自己拿不准的选词
（entrada / retranqueo、manija / manilla、zamak / aleación de zinc…）。
**先请人确认术语表，再铺 es 路由**——上线之后就进 sitemap 和 hreflang 了。

## 还没做

es 路由（现在只有 4 个 page.tsx）与 `SPANISH_MIRROR_PREFIXES` 加前缀。术语确认后再动。
