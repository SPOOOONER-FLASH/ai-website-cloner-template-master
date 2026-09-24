# 西语（拉美）市场补充：墨西哥、阿根廷、秘鲁

**本文件只是补充。** 称呼（usted，产品页不用人称）、句法、单位（小数用逗号）、术语，全部以 `docs/collaboration/2026-09-24-voice-en-es-pt.md` 和 `src/data/es-glossary.ts` 为准；地区用语由 `scripts/normalize-regional-terms.mjs` 统一，并由测试守住（manija、perilla、entrada、cerradero、planilla）。
本文件只补 [README](README.md) 那批本地公司（Truper、Phillips、Kallay、Trabex、Fratelli Currao、Cantol、Forte）身上学到、那两份还没写的东西。

## 1. 读者，和我们对他承诺什么

读者是进口商、五金批发商、建筑商的采购。
三国本地品牌的承诺都落在同一个词上，*tranquilidad*（安心）：Kallay 写在品牌口号和使命里，Cantol 的口号是 *Vive tranquilo*。它们是对家庭说“家里安全”；我们对采购商说的是**订单上的尺寸、材质和文件都不会出错**。
这个词可以用，但对象要换：例如写 `tranquilidad en el pedido`（下单安心），不要写成“守护您的家人”。

## 2. 从本地厂商学什么

| 学什么 | 谁在这么写 | 怎么用到 HYDE |
|---|---|---|
| **按部件写材质** | Phillips 的产品页逐条列“部件 + 材料 + 作用” | 产品有公开材质时，按部件列；没有就不写 |
| **规格优先，门厚写成区间** | Truper 的技术规格页 | 适用门厚写在第一行 |
| **产地直说** | Truper 在每份规格页写明在中国制造、按 Truper 的规格生产 | 平实地写在中国自有工厂生产，重点写按什么规格、谁来检验 |
| **历史写具体年份** | Kallay 1946、Currao 1964、Trabex 70 多年 | 只写能核实的年份；不知道的问甲方 |
| **产品线按材质分** | Currao：高端黄铜、经典黄铜、铝和不锈钢 | 类目页可以这样组织 |

## 3. 不学什么

- 感叹号标题（Phillips 的零售文案）
- vos（Trabex、Currao、Easy 都用）：墨西哥和秘鲁读者会觉得这是一条阿根廷本地广告
- “líder del mercado”、“la más alta calidad”（Trabex、Kallay）
- 生活方式散文（Helvex）

## 4. 待甲方决定：picaporte

`normalize-regional-terms.mjs` 把西班牙的 *resbalón*（锁舌）统一成了 *picaporte*，现在文章里有 106 处。
**在阿根廷口语里，picaporte 指的是门执手**（包括 Kallay 的母语市场）。阿根廷读者读到“picaporte 的伸出量”，可能会以为说的是执手。

| 选项 | 效果 |
|---|---|
| A. 保持 picaporte | 墨西哥和秘鲁读者读得顺；阿根廷读者可能误解 |
| B. 改成 pestillo（Kallay 的筛选项就写 pestillo reversible，可换向锁舌） | 三国都不会误解，但要确认 pestillo 在别处没有被当作 deadbolt 用 |

Claude 建议选 B，但要先找一位阿根廷买家看一眼再批量改。
