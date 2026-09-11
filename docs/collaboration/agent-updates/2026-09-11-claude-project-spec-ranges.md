# 2026-09-11 Claude — 项目页规格幅面，以及它顺带查出的三个错数字

**范围**：`src/lib/collection-spec-range.ts`、`src/components/site/ProjectDetail.tsx`、
新增 `src/lib/collection-spec-range.test.ts`（并注册进 `package.json` 的 test 清单）。
**测试**：lint 0、typecheck 通过、`npm test` 247/247（原 242 + 新增 5）。
**没碰**：collections 页面的文案、hero 轮播、`src/app/es/**` 的西语文案、Cloudflare。

## 为什么做这件事

9.11 交接文档第七节第一件：`/projects` 41 个可索引页里每页 0 个具体数字，citability 39 分。
拆解四个页面的失分项后，账很清楚：

```
40  /projects/commercial-fire-egress-hardware/
    concrete 0 / substance 15 / faq 0 / entity 15 / schema 10 / hedge 0   sentences=13
```

`concrete` 一项满分 40，这四页一分没拿。不是文案写得不好 —— 是十三句话里一个数字都没有。

## 做法：复用，不新造

`src/lib/collection-spec-range.ts` 已经为 collections 页写好了「从页面上的产品算出这一族
覆盖什么」的推导，`ProjectDetail.tsx` 里的 `relatedProducts` 已经是解析好的 Product 数组。
所以这里没有新机制，只是把同一个推导指向项目自己的产品集，EN/ES 共用一个 locale 参数。

`MIN_STATED = 3` 原样保留。结果是玻璃门入口那一页**什么都不显示** —— 它的三个产品
`specs` 全是空数组。这是对的：AGENTS.md「不知道的写破折号」，一个由单条记录代言的数字
比没有数字更贵。

三页实际产出：

| 页面 | 产出 |
|---|---|
| commercial-fire-egress-hardware | Size 650–1110mm（4 条全部记录）、Material 3 个值 |
| hospitality-residential-door-package | Backset 60–70mm、Door thickness 35–45mm、Cycle life 200,000 cycles（各 3 条记录） |
| glass-entrance-hardware-package | 无。三个产品没有任何 specs |

## 顺带查出来的三个错数字（这才是重点）

把推导指向新数据集，立刻逼出了三个**已经在线上 collections 页面印着**的错误。三个都不是
崩溃，都是「渲染正常、数字是错的」—— 也就是没人会用眼睛在规格表里发现的那一类。

### 1. `Bar Length` 不在 FIELDS 里，于是幅面漏掉了最长的那根

逃生器械族把同一个测量分在两个标签下：305 是 `Length: 1040mm`，314 是
`Length: 650mm / 800mm / 1000mm`，而 309-D 是 `Bar Length: 1110mm`。只读 `Length`
的结果是印出 **`Size 650–1040mm`** —— 等于告诉规格制定者我们最长做到 1040mm，
而 1110mm 的那根就躺在同一个合集里、下面一行。

**一个排除了已记录值的幅面，比没有幅面更糟**：那是买家能用我们自己的目录推翻的数字。

### 2. 千分位逗号被当成分隔符，`200,000 cycles` 印成 `200, 000 cycles`

非数值字段按 `[,;]` 切分是为了拆「Satin Stainless, Powder-Coated Black」这种多值表面处理。
表面处理行永远不带数字，所以这条规则跑了这么久没出事 —— 直到 `Cycle life` 进来。
改成「逗号两边同时是数字就不切」。切表面处理的能力有测试锁着，没有回退。

### 3. 英西同一份数据，算出两个不同的幅面

英文记 `650mm / 800mm / 1000mm`，西班牙文记 `650 / 800 / 1000 mm` —— 单位只写在末尾，
这是正确的西班牙文，也是正确的目录写法。而 `millimetres()` 只认「数字紧跟 mm」，
于是英文站读到三个值、西班牙站只读到一个，两边印出 **650–1110mm 对 1000–1110mm**。

⚠ **`npm run copy:parity` 查的是文案里的数字，查不到组件算出来的数字。**
这一条是这次最值得记住的：我们有英西数字一致性的检查，但它只覆盖写在文案里的数字；
任何由组件从结构化数据推导出来的数字，都在那张网之外。下一个往页面上加派生数字的人请注意。

修法是把末尾单位分配回它收尾的那一串。

## 为什么 collections 没有一起改

拆解 19 个 collections 页之后，结论是**它们的分数不是文案问题，改文案也救不了**：

```
38  /collections/hardware-accessories-door-flush-bolts/   figures: ["30 days"]
38  /collections/hardware-accessories-house-numbers/      figures: ["30 days"]
38  /collections/hardware-accessories-indicators/         figures: ["30 days"]
```

唯一的数字是交期。这些页面印不出规格，因为**目录里没有规格可印** —— 正是卡在工厂那七条的
第一条（275 条产品没记录表面处理）。

把 `MIN_STATED` 从 3 降到 1 能立刻把这些页面的分数拉上去。**不要这么做。**
那是让一条记录替整族代言，是第九节第二坑（「检测器自己也要被检测」）的同一个错误：
为了满足仪器去改被测的东西。这些页面的分数要等工厂的数据，不等我们的文案。

同理，我没有把 `cycles` 加进 `audit-geo-citability.mjs` 的 CONCRETE 正则。
`Cycle life` 是买家真正会问的耐久数字，值得印给人看；但一边想抬高某个度量、一边去改那个
度量的定义，是把仪器改成自己想要的样子。分数留在原处，数字照印。

## 下一个人

- **本次没有跑 `seo:citability` 的构建后对比**：见下方状态。项目页每页新增 2–3 个
  `mm` 数字，按 `concrete × 3` 估计 40 → 46 上下，不会到满分 —— 因为满分要 13 个数字，
  而这些产品记录里没有 13 个。想让它更高，路径同样是工厂数据，不是文案。
- `substance` 一项这四页是 15/20，差在句子数（13 句，需要 16 句）。这是可以靠内容补的，
  但要补的是买家真的需要的内容，不是凑句子。
- 玻璃门入口那三个产品（Glass Door Patch Fitting Set / Stainless Steel Glass Door Pull
  Handle / Wooden Door Floor Hinge）`specs` 全空，可以并进
  `docs/collaboration/2026-09-08-questions-for-factory.md` 的问题清单。
