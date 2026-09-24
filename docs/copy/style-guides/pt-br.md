# 葡语（巴西）市场补充：写给巴西经销商和门厂

**本文件只是补充。** 称呼（文章用 você，产品页不用人称）、语序、单位（小数用逗号）、术语，全部以 `docs/collaboration/2026-09-24-voice-en-es-pt.md` 和 `src/data/pt-glossary.ts` 为准；巴西用语由 `scripts/normalize-regional-terms.mjs` 统一并由测试守住（contra-testa、planilha、marco、registrar）。
本文件只补 [README](README.md) 那批巴西公司（Papaiz、Aliança Metalúrgica、Soprano）身上学到、那两份还没写的东西。
背景：[`docs/research/2026-09-16-brazil-saga-portas.md`](../../research/2026-09-16-brazil-saga-portas.md)，巴西的实际询盘来自一家防火门维保公司。

## 1. 读者，和我们对他承诺什么

读者是经销商（revenda）、门厂、防火门维保公司。Soprano 明确写自己面向“empresa ou comércio”，也就是企业和经销店。
Papaiz 的口号用 *tranquilo*（放心），对象是家庭；我们换成对采购商：**型号、尺寸、材质都对得上，到货就能装**。

## 2. 从本地厂商学什么

### 产品描述：一句写完部件和材质（Papaiz）

Papaiz 的规格描述是一整句名词短语，依次写：功能，distância de broca（backset），每个部件的材质，钥匙和锁芯的材质，锁芯长度。
巴西买家读到这种句子，就知道这家厂熟悉自己的产品。

```
[Tipo], [dimensão-chave] e [dimensão-chave]; [outras medidas publicadas];
[peça] em [material], … — só o que estiver publicado.
```

LC07（数据来自 `content/products`，backset 的叫法按术语表，现为 distância ao eixo）：

> Caixa de fechadura de embutir, entre-eixos de 85 mm e distância ao eixo de 45 mm; testa de 240 × 23 mm, caixa com 173 mm de altura e 72 mm de profundidade; avanço do trinco de 26 mm e da lingueta de 18,5 mm.

这个句式可以直接用于总方案第五节 A 阶段的“补齐葡语短摘要”：从已发布的规格行组装，目录里没有的材质不写。

### 巴西市场特有的卖点

- **沿海防腐**：Papaiz 专门写不锈钢系列适合沿海的强腐蚀环境。巴西人口集中在沿海，我们的 304/316 文章（guides/stainless-grade-selection）正好对应这一点。
- **经销商视角**：Soprano 写“4 千多个品项”、写获得的经销商奖项；对 revenda 来说，品类覆盖面和能不能稳定供货，比单品故事更重要。
- **历史写具体年份**：Aliança 写 1927，Papaiz 写 1952。

## 3. 不学什么

- Aliança 博客那种“15 个真相”式的清单标题
- 感叹号、“líder de mercado”
- 零售促销话术（Tramontina 的门店首页）

## 4. 待确认

backset 叫什么：Papaiz 的规格句写 *distância de broca*，我们的术语表用 *distância ao eixo*。voice 文件已经定为**先问巴西买家再改**，本文件不另作决定。
