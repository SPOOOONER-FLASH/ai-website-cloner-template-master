# HYDE 葡语文风指南：写给巴西经销商和门厂

来源：[README](README.md)（Papaiz、Aliança Metalúrgica、Soprano；Pado、Stam、IMAB 有机器人验证，未抓取）。
相关：[`docs/research/2026-09-16-brazil-saga-portas.md`](../../research/2026-09-16-brazil-saga-portas.md)，巴西的实际询盘来自一家防火门维保公司。
检查：`node scripts/audit-copy-locale.mjs`。

## 1. 读者，和我们对他承诺什么

读者是经销商（revenda）、门厂、防火门维保公司。Soprano 明确写自己面向“empresa ou comércio”，也就是企业和经销店，我们的读者也是这一类。
Papaiz 的口号用 *tranquilo*（放心），对象是家庭；我们换成对采购商：**型号、尺寸、材质都对得上，到货就能装**。

## 2. 称呼：você，或不用人称

- 用 **você**，或不用人称的写法。**不用 tu 的动词形式**（现有 4 处 tens），**不用 o senhor**。
- 已经基本是巴西葡语：葡萄牙葡语用词只有 3 处 registar，改成 registrar 即可。

## 3. 数字和单位

- 毫米。**小数用逗号**：`18,5 mm`，不写 `18.5 mm`。现有内容写小数点的有 229 处、写逗号的 84 处，这是本语种**最大的一处机械错误**。型号代码里的点不改。
- 千位用点：`1.200 peças`（1,200 件）。

## 4. 产品描述模板（学 Papaiz：一句写完部件和材质）

Papaiz 的写法是一整句名词短语，依次写：功能，distância de broca（即 backset），每个部件的材质，钥匙和锁芯的材质，锁芯长度。
巴西买家读到这种句子，就知道这家厂熟悉自己的产品。

```
[Tipo], [dimensão-chave] e [dimensão-chave]; [outras medidas publicadas];
[peça] em [material], … — só o que estiver publicado.
```

LC07：

> Caixa de fechadura de embutir, entre-eixos de 85 mm e distância de broca de 45 mm; testa de 240 × 23 mm, caixa com 173 mm de altura e 72 mm de profundidade; avanço do trinco de 26 mm e da lingueta de 18,5 mm.

**现状**：HYDE 的 590 个产品里，有 207 个葡语摘要只有 4 个词以内，例如 “Fechadura de sobrepor.”（只写了“明装锁”）。
按上面的模板，从已发布的规格行重新组装（和 `scripts/enrich-product-specs.mjs` 的英文 `summaryFrom()` 同一个思路），这是提升最大的一步。

## 5. 巴西市场特有的卖点

- **沿海防腐**：Papaiz 专门写不锈钢系列适合沿海的强腐蚀环境。巴西人口集中在沿海，我们的 304/316 文章（guides/stainless-grade-selection）正好对应这一点。
- **防火门**：巴西询盘来自防火门维保公司，URL 已有 `ferragens-porta-corta-fogo`。用 porta corta-fogo，写清楚认证是针对哪种门、哪种组合，不写成笼统的“防火”。
- 不学 Aliança 博客那种“15 个真相”式的清单标题。

## 6. 术语表

| 零件 | 用 | 不用 | 依据 |
|---|---|---|---|
| backset | **distância de broca** | distância do eixo（180 处） | Papaiz 的规格句用 distância de broca → **待甲方确认，见决定 D4** |
| center-to-center | **entre-eixos** | — | |
| lock body | **caixa da fechadura** | máquina（Aliança 的口语叫法，可括注一次） | |
| faceplate | **testa** | — | Papaiz |
| strike | **contra-testa** | contra-chapa（42 处） | Papaiz 写 testa / contra-testa，两者成对 |
| latch bolt | **trinco** | — | Papaiz |
| deadbolt | **lingueta** | — | Papaiz |
| lever handle | **maçaneta** | — | |
| rose / escutcheon | **roseta / espelho** | — | Papaiz 用 espelho |
| door closer | **mola aérea** | fecha-porta | Soprano 的类目写 molas |
| panic exit device | **barra antipânico** | — | Soprano |
| pull handle | **puxador** | — | Aliança |
| finish | **acabamento** | — | |
| spec sheet | **ficha técnica** | — | Aliança 的产品页按钮 |
| reseller | **revenda** | — | Soprano |

## 7. 不写

感叹号 · “líder de mercado” · 清单式标题党 · tu 形式 · 葡萄牙葡语用词（contacto、equipa、registar、ecrã）· 编出来的材质或尺寸。
