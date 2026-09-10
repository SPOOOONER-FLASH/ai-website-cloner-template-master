# 2026-09-10 · 北美规格市场：认证能说什么，以及小红书那三条逐个回答

给 Spooner 与 Codex。起因是甲方 2026-09-09 的两条：

> 这都是美国的厂家，客人搜到我们这来了。
> 那就更加需要把资料做好。做清晰。让客人看到专业性。
> 特别是我们的 027、028 这个是就是专门针对美国市场的，质量好，可靠。美国要求高，量也大。
> 接下来我们要自己做认证。用自己公司名做认证。

以及一条要求：把竞品的功能、信息、认证全部收集过来，
「甚至可以宣传我们要做他们有的所有认证资质，就是吹牛皮，boast，全部吸取过来」。

竞品数据在 `docs/research/2026-09-10-competitor-certification-matrix.md`
（由 `scripts/build-competitor-matrix.mjs` 生成，改数据重跑即可）。

---

## 零、先把「吹牛皮」这条说清楚

**收集竞品认证 —— 做了，全表在上面那份文件里。**
**说我们要去拿这些认证 —— 可以写，而且应该写，因为那是真的（见第二节路线图）。**
**把没拿到的证写成已经持有 —— 不能做，而且理由不是道德，是这行的验证机制。**

| 认证 | 买家怎么核实 | 核实要多久 |
|---|---|---|
| UL 305 / UL 10C | UL Product iQ 在线目录，按厂名查 | 30 秒 |
| ANSI/BHMA A156.3 | BHMA 认证产品目录，按厂名查 | 30 秒 |
| California SFM | 加州消防局在线列表，按证号查 | 1 分钟 |
| Miami-Dade NOA | 迈阿密戴德郡 NOA 数据库，按证号查 | 1 分钟 |

**这四个全部是公开可查的数据库。** 规格制定者的工作流程里就有这一步 —— 他要把证号
写进送审文件（submittal），写不出证号这一关就过不去。所以一个查不到的声明不是
「暂时没被发现」，是**在他最认真看我们的那一分钟被发现**。

而且这是逃生器械。UL 305 是消防安全声明，写进 IBC 国际建筑规范。谎报安全认证在美国
公共建筑项目上不是营销问题，是责任问题 —— 出事时那张假证是证据。

`src/data/company.ts` 里已经写死了这条：「There is no ANSI/BHMA certification.
The client has confirmed this outright, so no product record may carry an ANSI grade.」
这不是我加的限制，是之前甲方自己确认过的。

### 那怎么说才既真实又有力

反过来用。**知道差别本身就是专业信号**：

> Tested to EN 1125 by Intertek (report 130722068GZU-001). We are not ANSI/BHMA
> certified — certification under our own name is in progress, and we will publish the
> certificate number when it is issued, not before.

一个能准确说出自己**没有**什么证、并且说得出证号格式的供应商，比一个什么都说有的
供应商更让人放心 —— 这正是甲方老板那句「工厂给人专业感觉，他们会睡得安稳」的机制。
反过来，买家抓到一个编造的认证，会把站上**所有**数字都打折，包括那些真的。

### 现在就能说、而且是真的

| 可以说 | 依据 |
|---|---|
| ISO 9001，2002 年至今 | `src/data/company.ts` |
| EN 1125 由 Intertek 检测，报告号 130722068GZU-001，2013-11-07，型号 KD070/30-290 | 证书扫描件在手 |
| 607 SS ET 管状锁耐久性测试，Intertek 报告 140306043GZU-001，2014-04-28 | 同上 |
| CE 符合性证书 EN 1125:2008，意大利 CELAB，2010 | 同上 |
| 1998 年建厂，101–200 人，3,000–5,000 m² | 公司数据 |
| 307 / 311 是自有模具，单套模具费 10 万元以上 | 甲方 |

> ⚠ 三份报告的**扫描件不能发布** —— Intertek 与 CELAB 都有再分发限制条款，且要求
> 书面许可才能在广告中使用其名称。但「标准 + 签发方 + 报告号 + 型号 + 日期」这五项
> 不算再分发，已经公开在 /certifications 上。要发扫描件，先拿书面许可。

---

## 一、差距：全表五家竞品都有 A156.3，我们没有

> 下表是 `docs/research/2026-09-10-competitor-certification-matrix.md` 的摘录，
> 那份由脚本生成、逐条带来源。**两边不一致时以那份为准。**

| | Von Duprin | Yale/Accentra | Cal-Royal | Detex | Klacci | **我们** |
|---|---|---|---|---|---|---|
| ANSI/BHMA A156.3 Grade 1 | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| UL 305 逃生器械 | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| UL 10C 防火逃生 | ✅ | ✅ | ✅ | ✅ | ✅ | — |
| EN 1125 / CE | — | — | — | — | — | ✅ |

**读法**：我们不是「认证少」，是**在两个不同的体系里**。EN 1125 在欧洲、中东、
东南亚是硬通货；在北美它一文不值，因为规范引用的是 UL 305 和 A156.3。

所以北美买家拿着 32D 来问的时候，我们能给他产品、给他尺寸、给他价格，
**给不了他送审文件需要的那一行**。这就是目前北美订单的天花板。

---

## 二、拿证路线图：Klacci 已经走通了这条路

**Klacci（台湾 I-TEK 公司）是全表里最该研究的一家** —— 一家亚洲工厂，持有和美国品牌
完全相同的那套证，卖进同样的规格书。他们公开的结构就是路线图：

| 步 | 内容 | 我们的状态 |
|---|---|---|
| 1 | ISO 9001 质量体系 | ✅ **2002 年就有了** |
| 2 | 自建检测室，符合 **ISO 17025** | ❌ 这是最大的一步 |
| 3 | 请 **Intertek** 做持续复检（continuous re-inspection） | 部分 —— 2013/2014 用过 Intertek，是单次检测不是持续计划 |
| 4 | **ANSI/BHMA A156.3-2014 Grade 1 循环测试** | ❌ |
| 5 | **ANSI/UL 305** 逃生器械列名（防火再加 UL 10C） | ❌ |
| 6 | 加入 **BHMA**，进认证产品目录 | ❌ |
| 7 | 持续的工厂跟踪检查（follow-up surveillance） | ❌ |

### A156.3 Grade 1 的测试门槛（这是可以准备的）

- **50 万次循环**，每次包含推杠全行程、开门、回到闭锁位
- 2014 版新增**预载**：门扇摆动方向施加 20–22 lbf，作用点距锁边 3 英寸、离地 40 英寸 ——
  模拟密封条、气压、门框不正等真实工况
- UL 305 的循环要求是 **10 万次**
- BHMA 的第三方认证计划**对所有厂商开放**，不限于 BHMA 会员，由 Intertek 等实验室
  按不定期抽检执行

**建议先送 307 或 311**：自有模具（改设计不用求人）、询盘第一、已经有 EN 1125 的
测试经验。一个型号拿下 Grade 1，整个 300 系列的对话就变了。

### 顺带提醒两个北美的区域门槛

Detex 是全表唯一公开这两项的：**California SFM**（加州公共建筑）与
**Miami-Dade NOA**（佛州沿海抗飓风）。**UL 305 不覆盖它们**，是两张单独的证。
如果目标市场包括加州或佛州，这两项要单独排期。

---

## 三、027 / 028：甲方点名的美国市场产品，站上原来看不出来

甲方说 027、028 是专门针对美国市场的。查目录发现两件事：

1. **它们不是推杠，是外执手**（027 的 Type 行：Trim handle · external handle for
   panic bar systems），却和推杠一样叫「Panic Exit Device」。同类目 46 条里有 18 条
   名不副实，已按各自 Type 行改名（见 2026-09-10 的提交）。
2. **027 的规格是全类目最完整的**：执手长 122mm、面板 75 × 77.5mm、固定中心距
   52.5mm、执手下沉 58mm、方轴 60mm、20 支/箱、箱规 37×29×41cm、0.044 m³。
   这套数据正是北美规格制定者要的，之前埋在一个叫「Panic Exit Device」的页面里。

**下一步（不用等工厂）**：给 027/028 补北美词汇。规格制定者搜的是
`exit device lever trim`、`night latch trim`、`rim device outside trim`，
不是 `panic exit device`。

---

## 四、小红书那三张图，逐条对照我们的实际情况

### ① 用 ChatGPT 批量挖长尾关键词

**这条我们不该照做，因为我们的处境比它的前提好。**

那篇文章的场景是「没有数据，所以让 AI 编 50 个可能的词」。我们有 **44 个国家的真实
查询数据** —— Google Search Console、Bing、以及 111 次 Google AI 曝光里的真实提问，
包括 EAN 条码、一条 Hindalco 的 BOM 行、葡语和印尼语查询、竞品名、以及拼错的词。
用编出来的 50 个词替换真实数据，是把已知换成猜测。

**但这条有一半是对的，而且指向我们真正的缺口**：我们在**北美词汇上排不到任何东西**。
不是关键词不够多，是我们说的不是他们的语言：

| 他们写的 | 我们站上现在写的 |
|---|---|
| rim exit device / mortise exit device / surface vertical rod | panic exit device |
| wide stile / narrow stile | （没有） |
| lever trim / pull trim / night latch trim | panic exit device（改名后：trim） |
| 630、32D、626 | SSS、CP |
| Grade 1 / Grade 2 | （没有） |
| dogging / hex dogging / cylinder dogging | （没有） |
| request-to-exit (RX) | （没有） |

**已做**：`src/lib/bhma-finish.ts` 把表面码翻译成 BHMA/US 号，517 条已发布记录里
77 条拿到号，并进产品 FAQ（同时进可见文本和 FAQPage 结构化数据）。
**待做**：其余几行词汇。Grade 和 dogging 要等工厂确认，其余是文案。

### ② 用 AI 写真正能被 Google 收录的产品页内容

那篇给的公式是：**应用场景 + 技术参数 + 认证资质 + 客户痛点回应 + 工厂实力背书**。

对照我们：

| 模块 | 我们的状态 |
|---|---|
| 技术参数 | ✅ 460/584 条有规格表，FAQ 从规格自动生成，进 FAQPage 结构化数据 |
| 工厂实力背书 | ✅ 1998、ISO 9001、自有模具、产能链 |
| 客户痛点回应 | ✅ 19 篇文章，AI 引用前四里有三篇是文章 |
| 应用场景 | ⚠️ 薄 —— Yale 会写「最小门梃宽 114mm」这种装配约束，我们大多只有 backset |
| **认证资质** | ❌ **卡在第二节的路线图上** |

**它说的「别把 MetaDescription 写成产品广告」我们已经做到**：meta 从规格生成，
`npm run seo:audit` 里 1,204 页语义问题 0。

**最该动的是「应用场景」**，而且有现成的量化：`npm run seo:citability` 的分数就是
每页具体数字的密度。

| 页面类型 | 分 | 每页具体数字 |
|---|---|---|
| `/product-finder` | 75 | 29 |
| `/products/*` | 70 | 6.2 |
| `/collections/*` | **41** | **2.1** |
| `/projects/*` | **39** | **0** |
| `/request/price-list` | **32** | **0** |

**collections 和 projects 不需要工厂，数据在 `content/products` 里就有** ——
合集页可以写清这个合集有几个型号、覆盖哪些表面、最小/最大尺寸。这是目前
投入产出比最高的一块。

### ③ 用 AI 做内部链接策略图

**这条我们已经做了，而且比它描述的更进一步 —— 它是脚本，不是一次性咨询。**

`npm run seo:graph` 每次都重跑全站链接图，11 项断言。2026-09-09 那次跑出来
**600 个西语页面从英文首页走不到** —— 正是这条说的「页面之间互相不链接，权重
无法传递」。原因是位置语言面板只在展开时挂载，导出的 HTML 里没有 `<a href="/es/">`。
修好后：

```
unreachable-from-home   600 → 0
首页点击深度            0:1 / 1:57 / 2:599 / 3:547
                        没有任何可索引页超过 3 次点击
```

**一次性的建议清单会过期，脚本不会。** 这是这个仓库和那篇文章的方法差别。

### ④ 第一张图里的另外三条

| 它说的 | 我们的状态 |
|---|---|
| 按页面类型用不同 Schema，让 Claude 批量生成 JSON-LD | ✅ 已有 Product / FAQPage / ContactPoint / Article，1,204 页带 JSON-LD |
| 用 ScreamingFrog 扫全站，清掉低价值页面（那个站约 30% 页面价值不高） | ✅ 机制已有：无主图即不发布，1,352 页里**有意保留不索引 134 页**（10%），且不被任何页面链接（`src/data/withheld-products.test.ts` 断言） |
| 「生成后一定要人工检查」 | ✅ 这就是 `npm test` 里那些断言在做的事 —— 不是人工抽查，是每次都查 |

---

## 五、结论：三件事，优先级从高到低

1. **认证路线图排期**（甲方决策）。307 或 311 送 A156.3 Grade 1 + UL 305。
   在拿到之前，站上按第零节的写法说 —— 说清楚我们有什么、没有什么、正在做什么。
2. **collections / projects 补具体数字**（不用等任何人，citability 39–41 分）。
3. **北美词汇**：027/028 先行，其余按第四节①的表补。

---

## 六、来源

竞品数据逐条来源见 `docs/research/competitor-certifications.json` 的 `sources` 字段。
主要几条：

- Von Duprin 98/99 — <https://www.vonduprin.com/en/products/exit-devices/98-99-series.html>
- Accentra (Yale) 7100 — <https://www.trudoor.com/yale/7100-rim-exit-device/>
- Cal-Royal 9800 — <https://www.cal-royal.com/files/04-20-Catalog-Exit-Devices-9800-2.pdf>
- Detex 出口控制锁 — <https://www.detex.com/wp-content/uploads/2020/01/Exit-Control-Locks.pdf>
- Klacci 30 系列 — <https://www.klacci.com/30-series-exit-devices/>
- Klacci 公司资质 — <https://www.klacci.com/about-us/>
- A156.3 Grade 1 循环与预载要求 — <https://idighardware.com/2016/03/decoded-change-to-bhma-standard-for-exit-devices-may-2016/>
- BHMA 第三方认证计划 — <https://buildershardware.com/ANSI-BHMA-Standards/Hardware-Highlights/A1563-2025-Exit-Devices>
- BHMA 表面码与基材 — <https://www.trudoor.com/pages/hardware-finishes>
