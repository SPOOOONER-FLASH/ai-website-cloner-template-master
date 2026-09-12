# 2026-09-11 Claude — 把阿里店铺赢我们的三件搬回自己站上

甲方看了自家阿里橱窗后问「我们能不能做得更好」。逐条对照后，阿里赢站上的是三件，
三件都不需要工厂给新数据，本次全部做掉。

**范围**：`content/products/`（5 条 MOQ）、`content/categories.json`（6 个类目图）、
`content/i18n/zh-terms.json`、`src/components/site/ProductCard.tsx`。
**测试**：lint 0、typecheck 通过、`npm test` 247/247。
**素材来源**：`docs/research/2026-09-11-alibaba-storefront.json`（甲方提供的截图落盘）。

## 〇、先说一个比三件事更重要的发现

交接文档第五节把 **MOQ / 交期** 和 **退货 / 质量保证条款** 列为卡在工厂的两条，
理由都是「站上一个字没有」。

**但甲方在自家阿里店铺上已经把它们公开了。** 橱窗十个商品全部标着 MOQ，
全部挂着 "Easy Return"。

这两条的性质因此变了：**不是工厂没给数字，是我们没把甲方已经公开的数字搬到自己站上。**
买家在阿里看得到 MOQ，在我们自己的站上看不到 —— 这是把自己的优势让给平台。

## 一、MOQ 上站（5 条）

| 型号 | MOQ |
|---|---|
| 307 | 50 pieces |
| 311 | 50 pieces |
| 305 | 200 pieces |
| 301 | 500 pieces |
| 564 | 1000 pieces |

写成 `specs` 里的 `Minimum order` 行，英西同步（`Pedido mínimo`），
并记 `specSources.alibaba` + `basis: client-published`。

**没有做的三条，以及为什么：**

- **`310+015` 的 MOQ 100 没有拆到两个单品上。** 阿里那条卖的是「推杆 + 外执手」
  一个配套商品，MOQ 100 是这个配套的起订量。拆到 310 和 015 各自的页面上，
  就是在声称阿里没说过的事。
- **90MM 门舌**：目录里 L001 / L004 / L015 三个候选都可能对应，对不唯一，不猜。
- **主匙**：同样对不唯一。

⚠ **价格没有上站。** 阿里有 €9.46 / €8.60 / €7.73 这类阶梯报价，站上的策略是走询价，
且阶梯价随时会变。

⚠ **给甲方：这 5 条 MOQ 需要你确认是当前有效值。** 阿里页面可能几个月没更新过。
另外「Easy Return」是阿里平台的服务标识，不等于我们自己的退货条款 ——
**我们实际的退货 / 质保政策是什么？** 拿到就能补上卡在工厂的第六条。

顺带一个好处：`Minimum order` 的值形如 "50 pieces"，正好命中
`audit-geo-citability.mjs` 的 CONCRETE 正则（`pieces?`），所以这 5 页各多一个可引用数字。
这是顺带的，不是目的 —— 没有为了命中正则去改任何东西。

## 二、视频标识

292 条产品有演示视频，但**卡片上完全看不出来**，目录里最强的资产在你选中页面之前
是隐形的。`FinderProduct` 本来就带 `videos` 字段，所以这是纯展示改动，没有动数据管线。

**做成文字而不是播放按钮，是刻意的。** 甲方的阿里卡片用的是盖在照片上的播放圆标；
这里不抄，理由有二：

1. 播放标压在产品照片上 —— 那是卡片上买家唯一真正要看的东西；
2. 它承诺了这张卡给不了的播放行为，片子在它背后那一页上。

meta 行里加一个词「· Video / · Vídeo」做同样的承诺，但是诚实的，不占照片上的像素，
屏幕阅读器也按正确顺序读到。AGENTS.md「专业而非装饰 / 克制即自信」那条。

## 三、类目图换成真实照片（6 个类目）

类目图原本全是白底零件切图（`/images/products/cat-*.webp`），这同时违反了纪律第四条
「白底图只放在 product finder」。

换成 6 张 **来源可核实** 的真实照片：

```
panic-exit-devices  -> hyde-hero-panic      lever-handles  -> hyde-hero-lever
knob-locks          -> hyde-hero-knob       brass-steel-hinges -> hyde-hero-hinge
lock-cylinders      -> hyde-hero-cylinder   lock-cases     -> hyde-hero-lockcase
```

旁注文件写明：`kind: real-photograph-on-editorial-field`，
`productGeometry: "Original pixels retained. Uniform resize and complete-object crop
only — no redraw, no restyle, no recombination."`，源文件是真实产品照，
只加了渐变底和**由物体自身轮廓生成的**投影 —— 落在「清理真实照片」允许的范围内。

### ⚠ 没有换另外 10 个类目，原因要记下来

`hero-civic-corridor`、`hero-cultural-entrance`、`hero-warm-residential-entry`、
`architecture-*` 这些真正的「实景」图**没有来源旁注文件**，我无法核实它们是真实照片
还是生成场景。类目实景图里必然出现门和门上的五金件，用一张来源不明的图，正好撞上
「永远不要生成想象出来的金属产品」那一条。

**这 10 个类目留给 Codex 或甲方**：要么补上这些图的来源旁注，要么提供实拍照片。
在那之前它们保持现状，不用来源不明的图去换。

比例从 `1 / 1` 改成 `8 / 5`：这 6 张是 1600×1000，套进方形框会被 `object-cover`
裁掉两端 —— 一根被裁断的推杆看起来就是「这家供应商不懂自己的产品」。
比例是 `categories.json` 里的数据，`MediaPlaceholder` 直接消费，没有改 CSS。

## 四、下一个人

- 阿里数据里还有两条「有需求、站上无页面」：**6068 锁体**（119 曝光 / 3 询盘 / 23% 转化，
  阿里上连 330mm 板长和 MOQ 100 都已公开）和 **Adams Rite 窄边锁体**（48 曝光 / 3 询盘）。
  都卡在工厂缺规格，但阿里页面上已经有了一部分 —— 值得拿着阿里页面去问工厂补齐。
- **310+015 配套**（134 曝光排第二、100 sold 全橱窗最多）在阿里是一个商品，
  站上是两个独立页面，没有配套概念的页面。和 DC02 那个配套包是同一形状，
  可以直接照做第 5 个 project 包。
- 甲方的 311 阿里主图上直接印着 `Center Distance 92 mm` —— **把规格印在产品图上**
  这个做法站上完全没有。79 张尺寸线图已经有了，但产品卡片上的图仍是纯照片。
