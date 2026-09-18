# AI 引用报告：135 条引用告诉我们什么

**日期**: 2026-09-18 · 数据来源：Bing Webmaster Tools → AI Page Stats 导出
（`cantonlock.com_AIPageStatsReport_9_18_2026.csv`，26 个页面 135 条引用）

**可重跑**：`npm run audit:citations -- <导出的.csv>`，加 `--check` 会逐个请求
验证每条被引用的 URL 还能不能打开。本文所有数字都是那个脚本算出来的，没有一个是手打的。

---

## 一、三个数字

| | |
|---|---|
| **文章拿走 81%** | 35 篇文章拿到 **110** 条引用；519 个产品页拿到 **13** 条 |
| **西班牙语拿走 20%** | 27 条。而且 `/es/news/handing-left-right-and-universal/` 拿到 **17 条，是英文原版（6 条）的近三倍** |
| **葡萄牙语拿走 0** | 那棵树 9-16 才上线，9-17 才补完翻译。这是唯一一个「还没开始」的数字 |

### 第二条值得停下来看

同一篇文章，西语 17 条、英语 6 条。不是西语写得更好 —— 是
**「mano izquierda o derecha」这个问题在西语世界里几乎没有人回答过，
而 "door handing" 在英语世界里有一百个人回答过。**

翻译不是给西语市场的礼貌，**它是一个独立的、可能比原版更容易被引用的资产**。
而葡语市场比西语更空。

---

## 二、被引用的页面全都还能打开（已逐个验证）

```
Every cited URL resolves.
```

**但有 11 条引用（8%）指向已经不存在的 URL** —— 带 `www.` 的、
`index.php?m=home&c=View&a=index&aid=1602` 这种旧 DedeCMS 地址。它们靠 301 活着：

```
www.cantonlock.com/index.php?...aid=1602  →  cantonlock.com/index.php?...aid=1602
                                          →  /products/hardware-accessories/dc02-door-coordinator/  200
```

**这就是那些跳转规则值得一直维护的全部理由**：一个 2023 年学到这个 URL 的引擎，
2026 年还在往那里送人。规则一停，这 8% 直接变成死链。

---

## 三、这次改了什么

### 对比页从「零个可引用的事实」变成会报数字

`npm run seo:citability` 里，15 个对比页是全站最低分的页面类型之一 ——
`/compare/lock-cylinders/` **7 个句子里 0 个具体事实**，而它下面那张表里
装着 45 个型号的每一个数字。**表格是网格，引擎引的是句子。**

现在每个对比页在表格上方先报这一族到底横跨了什么，三种语言，全部是数出来的：

```
LO QUE ABARCA ESTA GAMA
Medidas    30–80mm                                      indicado en 10 de 45 modelos
Material   Latón macizo, Acero templado (HRC58)         indicado en 13 de 45 modelos
Acabado    Latón pulido (PB), Cromado (CP), …           indicado en 10 de 45 modelos
```

「45 个里有 10 个报了这个数」也印出来，读者自己掂量分量 —— 这比一个漂亮的整数可信。

同一个块此前只在 19 个 collections 页上有（内联写了三遍）。现在抽成
`SpecRangeList` 一个组件，六个页面共用，**一个事实一个地方**。

对比页分数 63 → 65/66，具体事实 17.5 → 20.1 条/页。

---

## 四、接下来最值钱的三件（按杠杆排序）

### 1. 让葡语被发现 —— 624 个 URL 还没推给 Bing

葡语在 sitemap 里是完整的（624 个 URL，36 个文章页），hreflang 互指也在。
缺的只是「被抓到」。仓库里有 `npm run seo:indexnow`，
**而出这份引用报告的正是 Bing**。

⚠ 这是对外动作（把 URL 推给 Bing/Yandex），**等甲方点头再跑**。

### 2. 文章是唯一在产引用的资产，而 23 篇还没拿到过引用

已拿到引用的 12 篇，每一篇都在回答一个**决策问题**，不是在介绍一个产品：

```
push-bar-or-touch-bar…        34   推杆还是触摸杆
handing-left-right…           23   左手还是右手
reading-door-hardware-model…  14   这个型号号怎么读
door-coordinator-double-fire  10   双扇门为什么要顺序器
```

没拿到引用的 23 篇里，有一半是**产品族介绍**（`lever-handle-range-lh852…`、
`stainless-lever-range-9007…`）。不是它们写得差，是**「介绍」不是一个问题**。
下一批选题应该继续挑「A 还是 B」「这个数怎么看」，而不是「我们有什么」。

完整清单在脚本输出里，每次导出都会重算。

### 3. 产品页 519 个只拿到 13 条

被引用的那几个产品页（AR4-110、AR4-101、70SN）都有**完整的规格表**。
这与「工厂还欠六个订单码、五个尺寸、执手孔位」是同一件事的两面：
**没有数字的页面不会被引用，因为它没有可引用的东西。**

---

## 五、一个纪律

这份报告本身就是证据：**每月把导出丢给 `npm run audit:citations` 跑一遍，
比读一遍 CSV 多告诉你三件事** —— 语言分布、旧 URL 的比例、以及哪些文章
在榜外待了多久。第三件只有跨月对比才有意义，所以从这次开始存档。
