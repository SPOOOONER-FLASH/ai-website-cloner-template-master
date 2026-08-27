# 西语铺开 —— 能批量翻译，但要分两类做

**回答甲方的问题：能。** 464 个页面里 **约 450 个可以机器批量生成且质量可靠**，
剩下十几个是散文，必须人写。原因是这两类文本性质完全不同。

## 为什么产品页可以批量做

产品页几乎没有散文。一个产品页的可译文本只有这些：

| 元素 | 数量 | 处理方式 |
|---|---|---|
| 型号 | 431 | **不译**，型号是订货码 |
| 分类名 | 16 个唯一值 | 人工定一次术语表 |
| 规格标签 | **32 个唯一值**（Material / Backset / Finish…） | 人工定一次术语表 |
| 规格值 | 有限词汇（Stainless steel / Euro profile / Fire door…） | 术语表覆盖 |
| summary | 一句话，多数已由规格生成 | **用同一批规格重新生成西语句子** |
| seoTitle / seoDescription | 由模板拼装 | 西语模板重拼 |

关键在最后两行：`scripts/enrich-product-specs.mjs` 里的 `summaryFrom()` 是**从规格行组装句子**，
不是翻译现成句子。写一个西语版的组装函数，输出的就是地道西语，
而不是英译西的机翻腔——**这不是机翻，是用另一套语法重新生成**。

例：
- EN `An iron mortise lock case with 85mm centre distance and 55mm backset, euro profile cylinder preparation.`
- ES `Caja de cerradura de embutir de hierro, distancia entre ejes de 85 mm y entrada de 55 mm, preparada para cilindro europeo.`

术语表一共只有 **约 80 个词条**要人工敲定，之后 431 个产品页全自动。

## 必须人写的部分

`/company`、`/contact`、`/faq`、`/downloads`、首页文案、项目案例正文——**十几页散文**。
其中 7 页已经有人写好的西语了。FAQ 的商业性答案本来就空着，等甲方填。
这部分归 Codex（`src/app/es/**` 是它的地界）。

## 工程上还差什么

1. **路由**：`src/app/es/` 现在只有 4 个 page.tsx。要镜像
   `products/`、`products/[category]/`、`products/[category]/[slug]/`、`product-finder/`、`news/`。
2. **前缀**：`SPANISH_MIRROR_PREFIXES`（`src/data/site.ts`）加 `/products` 等，
   hreflang 与 sitemap 会自动跟上——这部分已经建好了。
3. **字段**：`types.ts` 里已有 13 个 `*Es` 字段（`nameEs`/`summaryEs`/`bodyEs`…），
   够用，不需要改数据模型。

## 建议顺序

1. 敲定 80 条术语表（1 次人工，之后复用）
2. 写 `scripts/translate-products-es.mjs`，生成 431 个产品的 `*Es` 字段
3. 加 es 路由 + 前缀，构建后 471 → 900+ 页，hreflang 自动配对
4. Codex 补十几页散文

**风险**：西语页一旦上线就进 sitemap 和 hreflang，机翻腔会同时伤 SEO 和信任。
所以术语表必须先人工确认，不能跳过第 1 步直接跑第 2 步。
