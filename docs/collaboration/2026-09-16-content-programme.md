# 博客与技术文章：目标、选题、写法

生成的：`npm run brief:content`。所有数字都是从仓库现算的，改了内容重跑就更新。

---

## 零、目标

**让买家在 AI 回答里看到我们，而不是只在搜索结果第二页看到我们。**

这不是一句口号，它现在有基线数据了。2026-09-15 甲方给的两张后台截图：

| 来源 | 现状 |
|---|---|
| Bing 生成式引用 | 8 月 9–23 日**全零**；9 月 6 日起变成台阶，峰值 **16 次引用 / 4 个页面** |
| Bing 落地查询 | 抽样里只有 **1 条**：`mechanical advantages box-style exit devi…`，引用份额 **50%** |
| Google AI 功能 | 前 10 个页面里有 **4 个是旧 `index.php` 网址** |

### 三件事从这两张图里读得出来

**1. 已经在发生了，不是从零开始。** 9 月 6 日之后是台阶不是尖峰，峰值 16 次引用落在 4 个
页面上——平均每页被引 4 次。同一批页面被反复取用，不是偶然撞见。

**2. 被引用的那篇，一个关键词都没写对。** `push-bar-or-touch-bar` 全文里
`mechanical` 出现 0 次、`box` 0 次、`leverage` 0 次。模型是**按意思**匹配到那两段机构
描述的。这条决定了整个写法：**AI 不是在匹配关键词，是在找能回答问题的具体段落。**

**3. Google 的 AI 正在引用我们已经 301 掉的旧网址。** 这说明重定向那批活直接喂给了 GEO ——
旧网址攒的权重会随 301 合并到新页面上。

### 目标（90 天，可验证）

| 指标 | 现在 | 目标 | 怎么看 |
|---|---|---|---|
| Bing 被引用页面数 | 4 | **15** | Bing 站长 → 生成式 AI → Cited Pages |
| Bing 落地查询条数 | 1 | **10** | 同上 → List By: Grounding Queries |
| 被引用页面里是产品页的 | 0 | **≥3** | 现在被引的全是文章，产品页一个都没有 |
| 长尾词有对应文章的 | 22 / 31 | **31 / 31** | `npm run brief:content` 重跑 |

⚠ **前三条我们控制不了，只能影响。** 没有任何人能保证被 AI 引用；能做的是把「被引用的
条件」做足。第四条是我们完全能控制的，所以它是真正的工作量指标。

---

## 一、什么样的页面会被引用 —— 从我们自己那篇反推

我们手上有一个**确定被引用过**的样本，所以不用猜。把它拆开看：

| 它做对的事 | 具体在哪 |
|---|---|
| 回答的是一个**有歧义的选择题** | 「推杠还是触杠」——买家真的分不清，而供应商不主动说 |
| 给了**机构层面的解释**，不是形容词 | 「两条枢转臂」「走 3–4 厘米」「压进通长外壳」 |
| 有**可引用的独立段落** | 每段自成一个完整答案，不依赖上一段 |
| **承认边界** | 结尾直接说某竞品标注的 EN 1205 不存在，是 EN 1125 的笔误 |
| 有**具体数字** | 42 台设备、3–4 厘米、EN 1125 |

### 反过来，什么不会被引用

- 「我们拥有先进的生产设备和专业的团队」—— 没有任何一句可以被当作答案摘出来
- 一篇什么都讲一点的综述 —— 模型要的是**一段**能回答问题的话，不是一个目录
- 只有形容词没有数字的产品介绍
- 把别人网页上的说法抄过来 —— 那段话已经有来源了，不会引用我们

### 所以每篇文章的硬性结构

1. **标题就是那个问题**，而且用买家的词（不是我们的词）
2. **第一段给答案**，不铺垫
3. **中间每段一个可独立引用的事实**，带数字或型号
4. **必须有一段写「我们不知道什么」或「这里容易错」** —— 这是最常被引用的一段
5. **不写价格**（甲方长期规矩），不写没有依据的数字

---

## 二、第一批五篇：长尾技术文

`north-america-longtail.json` 里 51 个词，31 个我们答得了。其中 **4 个在 35 篇文章里一次都没被写过**：

| 词 | 意图 | 归属页面 |
|---|---|---|
| `fire rated panic bar 2.5 hours` | qualifying | /products/panic-exit-devices/307-panic-exit-device/ |
| `ggmk gmk mk change key hierarchy` | informational | content/news/master-key-systems-how-many-levels-you-need |
| `keying chart door schedule template` | informational | article (to write) |
| `lock case 85mm centre 60mm backset` | transactional | /products/lock-cases/ |

再叠上 Search Console 三个月里**真实出现过**的查询（都是 1 次曝光 0 点击 ——
意思是排名在第二页，不是没人搜）：

```
ul 305 panic hardware          fire door panic hardware
rim nightlatch                 us cylindrical locks market
latches doors and frames       brass piano hinge / 钢琴铰链供应商
oval lock                      zamak inyectado
sa32806 panic hardware
```

### 选出来的五篇，以及为什么是这五篇

| # | 标题方向 | 证据 | 数据够不够 |
|---|---|---|---|
| 1 | **US26D、626、630：表面代号不是颜色** | `us26d vs 626 finish difference` + `us cylindrical locks market` | `src/lib/bhma-finish.ts` 已经把逻辑写透了，77 条记录能出号，442 条出不了且每条有理由 |
| 2 | **UL 305、EN 1125、ANSI A156.3 不是同一个测试** | `en 1125 vs ul 305` + 实际查询 `ul 305 panic hardware` | 全站 24 篇里 `UL 305` 出现 **0 次** |
| 3 | **夜锁与 rim lock：564 和 1073 的实际尺寸** | `564 night latch dimensions` + 实际查询 `rim nightlatch` | 564 有 14 行规格，1073D/S 各 13 行 |
| 4 | **有人 / 无人：卫生间指示锁** | `indicator bolt occupied vacant washroom` | 200 / 400 / 500 三个型号，200 有 8 行规格 |
| 5 | **推杠长度：900 到 1110mm，哪一根配你的门** | `exit device 1000mm push bar` | 全线实际长度值都在记录里 |

⚠ **落选的两个，说明理由**：

- **钢琴铰链** 中英文都有真实曝光，但 `brass-piano-hinge` 这条记录自相矛盾 ——
  型号写 Brass Piano Hinge，材质写 Stainless Steel 304，宽度写成 `1"1-1/4 "2 "、3"`。
  **先问工厂，再写文章。** 拿一条自己打架的记录去写技术文，正是这个站最不该做的事。
  → ✅ **2026-09-16 甲方答了：做的是铁的。** 记录已改（材质 Iron，宽度 1"/1-1/4"/2"/3"，
  表面哑黑或亮金），并写成第十一篇 —— 「brass」是表面不是金属，和表面代号那篇同一个坑。
- **GGMK / 钥匙分级表** 已经有 `master-key-systems-how-many-levels-you-need`，
  GGMK、GMK、change key、chart 都在里面。再写一篇是自己跟自己抢。

---

## 三、第二批五篇：优品推荐

甲方 2026-09-16 指定的 30 个型号。先把它们在目录里的实际情况数出来：

| 型号 | 类目 | 表面/变体数 | 有照片 | 规格行合计 |
|---|---|---:|---:|---:|
| **564** | night-latches-rim-locks | 2 | 2 | 37 |
| **587** | knob-locks | 11 | 8 | 116 |
| **1073** | night-latches-rim-locks | 3 | 3 | 28 |
| **607** | knob-locks | 14 | 7 | 173 |
| **9014** | stainless-steel-handles | 4 | 4 | 22 |
| **9008** | stainless-steel-handles | 2 | 2 | 6 |
| **9007** | stainless-steel-handles | 3 | 3 | 10 |
| **70** | lock-cylinders | 19 | 19 | 15 |
| **80** | lock-cylinders | 6 | 6 | 3 |
| **D101** | deadbolts | 6 | 6 | 73 |
| **5831** | knob-locks | 5 | 5 | 14 |
| **592** | knob-locks | 6 | 5 | 66 |
| **598** | knob-locks | 5 | 5 | 59 |
| **60** | lock-cylinders | 5 | 5 | 0 |
| **LH853** | lever-handles | 8 | 5 | 83 |
| **575** | knob-locks | 4 | 4 | 51 |
| **578** | knob-locks | 4 | 4 | 44 |
| **5807** | knob-locks | 6 | 4 | 35 |
| **5870** | knob-locks | 6 | 4 | 54 |
| **808** | lever-handles | 4 | 4 | 48 |
| **90** | lock-cylinders | 4 | 4 | 0 |
| **9210** | knob-locks | 4 | 4 | 0 |
| **LH852** | lever-handles | 5 | 4 | 66 |
| **LH855** | lever-handles | 4 | 4 | 41 |
| **45** | lock-cylinders | 3 | 3 | 3 |
| **D102** | deadbolts | 3 | 3 | 36 |
| **54** | lock-cylinders | 2 | 2 | 1 |
| **595** | knob-locks | 2 | 2 | 22 |
| **609** | knob-locks | 2 | 2 | 24 |
| **6491** | lever-handles | 3 | 2 | 30 |

合计 **155 个变体**，其中 **135 个有照片**（87%）。

### 分成五篇，按「买家一次坐下来决定什么」分，不按型号多少分

| # | 文章 | 覆盖型号 | 变体数 |
|---|---|---|---:|
| 1 | 圆筒锁（knob / cylindrical） | 587 · 607 · 5831 · 592 · 598 · 575 · 578 · 5807 · 5870 · 9210 · 595 · 609 | 69 |
| 2 | 欧标锁芯（euro cylinders） | 70 · 80 · 60 · 90 · 45 · 54 | 39 |
| 3 | 执手锁（lever handles） | LH853 · 808 · LH852 · LH855 · 6491 | 24 |
| 4 | 不锈钢拉手（pull handles） | 9014 · 9008 · 9007 | 9 |
| 5 | 插芯与夜锁（deadbolts / night latches） | D101 · D102 · 564 · 1073 | 14 |

**为什么不按型号数量平分**：一个在选圆筒锁的买家，那个下午不会同时选锁芯。
一篇同时讲两样的文章，两样都没答好。

### 优品推荐这五篇和普通产品页不一样的地方

产品页回答「这个型号是什么」。这五篇回答「**这一类里我该选哪个，为什么**」——
而这正好是 AI 回答最常被问到的问题形状。所以每篇必须有：

- 一张**把同类型号并排比**的表（背距、中心距、门厚、表面数）
- 一段讲**什么情况下不要选这一类**（这一段最可能被引用）
- 每个型号都点名，型号是可检索的实体
- **不写价格**

---

## 四、节奏与不做什么

| | |
|---|---|
| 频率 | 一周 2–3 篇，英西双语同步 |
| 长度 | 8–10 段，每段 3–5 句 |
| 署名 | 沿用现有 author 结构（真实姓名、职务、学历、LinkedIn）—— E-E-A-T 靠这个 |
| 结构化数据 | `kind: "insight"` 会输出 schema.org **TechArticle**，不需要额外改组件 |

### 明确不做

- **不做「50 篇关键词文章」**。写一篇没有具体数字的文章，等于给模型一段它不会引用的话
- **不为了 SEO 编数字**。这个站的信任是靠「不知道就写破折号」建起来的
- **不抄别人的技术解释**。已经有来源的段落不会引用我们
- **不动架构**（甲方 2026-09-15 定）

---

## 四之二、已经写完的 11 篇

| 发布 | 标题 | 段数 | 点名型号 |
|---|---|---:|---|
| 2026-09-16 | A Brass Piano Hinge Is Usually Not Brass | 8 | Brass Piano Hinge · BL027 · IH01 |
| 2026-09-16 | Entrance, Privacy, Passage: Choosing Between Twelve Cylindrical Locks | 9 | 607 ACBK · 587 MBET · 5807 SSCL · 5870 ACET · 592 SSET |
| 2026-09-16 | A 25mm Throw and a Collar That Spins: Deadbolts D101 and D102 | 9 | D101 DSPB · D102 AC · 564 · 1073D |
| 2026-09-16 | 45 to 90: Reading Our Euro Cylinder Range | 8 | 70 SNDK · 80 SNKT · 45BN · 65SN |
| 2026-09-16 | 650 to 1110mm: Which Push Bar Length Your Door Takes | 8 | 307 · 311 · 305 |
| 2026-09-16 | US26D, 626, 630: A Finish Code Is Not a Colour | 9 | 5870 ACET · 607 SSET · 3431 SSET |
| 2026-09-16 | 200,000 Cycles: What the LH Lever Range Is Actually Rated For | 9 | LH853 CPBK · LH852 SSET · LH855 SNET · 808 ABET · 6491 SSET |
| 2026-09-16 | Occupied or Vacant: What a Washroom Indicator Actually Has to Do | 8 | 200 · 400 · 500 |
| 2026-09-16 | The Rim Night Latch: What 564 and 1073 Actually Measure | 8 | 564 · 564 MB · 1073D · 1073S |
| 2026-09-16 | Lever Length, Rose Diameter, Projection: The Stainless 9000 Levers | 8 | 9014 · 9007S · 9008S · 9008E |
| 2026-09-16 | UL 305 Is a Listing, Not a Grade | 8 | 305 · 307 · 311 |

长尾词未覆盖数从 **9 降到 4**。这个数字是上面第二节现算出来的，不是手写的 —— 它每次重跑都会自己更新。

⚠ 剩下的 4 个之所以还在，理由在第二节的「落选」里：钢琴铰链等工厂确认记录，
钥匙分级表已经有文章。**不是漏了。**

---

## 五、怎么验收

发完之后不要马上看 Bing —— 索引和引用有滞后。

| 时间 | 看什么 |
|---|---|
| 发布当天 | `npm run seo:indexnow` 推给 Bing；Search Console 手动提交（手册第 3 节）|
| 2 周后 | Search Console：这几个词有没有出现曝光 |
| 4–6 周后 | Bing 站长 → 生成式 AI → Cited Pages 有没有新页面进来 |
| 90 天 | 对着第零节那张表打分 |

⚠ **一条现在就能做的**：Bing 的落地查询表有「Download all」。每个月导一次存进
`docs/research/`，否则那是抽样数据，过了就查不回来了。
