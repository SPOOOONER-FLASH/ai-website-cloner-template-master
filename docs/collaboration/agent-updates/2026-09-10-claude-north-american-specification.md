# 2026-09-10 · Claude — 逃生器械改名、BHMA 表面码、竞品认证对照

## 一句话

甲方给的两条事实（「中心距就是72」「027、028 专门针对美国市场」）牵出一个比它们
都大的问题：**逃生器械类目 46 条记录里 18 条名不副实**，包括 307 规格行点名的
全部三个配件。改完之后，那套配套关系第一次在站上看得见。

## 一、我上一轮报错了：072 一直在站上

上一轮我说「072 在目录里没有产品记录」。**说错了。** 它在，型号写作 `72`，
名字叫 `Panic Exit Device`，而它自己的 `Type` 行写着
`Profile lock case for panic exit devices`，features 里写着 `Center Distance: 72mm`、
`Backset: 65mm`、`Iron bar 9×9×130mm` —— 正是甲方 2026-09-09 说的「中心距就是72」。
有主图、4 张图库、1 个视频。

我上次搜的是字符串 `072`，它写作 `72`，就没搜到，然后我把「搜不到」当成了「不存在」。
教训写在这里：**型号搜索必须同时试补零和不补零的写法**。

## 二、18 条记录名不副实，其中 15 条已改

| 实际是什么 | 条数 | 处理 |
|---|---|---|
| 外执手 / 外装置（Type 行写着 outside lever / trim） | 16 | 14 条改名 `Panic Exit Device Trim`；016 与 023 ETAN 名字本来就对 |
| 锁体（Profile lock case） | 1 | 改名 `Panic Exit Device Lock Case`，型号 `72` → `072` |
| 误报 | 1 | **305 是真推杠**，我的启发式在摘要里读到 "outside lever trim" 误判，没动 |

**为什么这件事重要**：307 的规格行写着 `Handle: 015 or 9080E`、`Lock Case: 072`。
这三个零件全在这批错名记录里。整套配套关系一直在目录里，只是三个零件都叫同一个
名字，所以谁也拼不出来 —— 这正是 `2026-09-09-top20-image-brief.md` 里说的
「照片里把三件摆在一起、页面上说不出它们为什么在一起」的根因。

每条都留了 301。

## 三、rename-product-slug.mjs 的 bug（已修，并写了修复脚本）

`retarget()` 把含旧 slug 的字符串全部重写，而它被作用在一个 `slug` 已经设成新值的
对象上。**新 slug 以旧 slug 为前缀时，新值自己也被重写**：

```
old  001-panic-exit-device
new  001-panic-exit-device-trim
out  001-panic-exit-device-trim-trim   ← 写进了 record.slug
```

文件名是对的、记录里是错的，页面全部 404。DS011 那次（2026-09-08）没触发，因为它
替换的是描述部分而不是追加。这次 15 条里中了 13 条。

**是 `npm run content` 的 slug/文件名校验抓到的**，不是我看出来的 —— 那条校验值回票价。

修法：脚本里改成先 `retarget(record)` 再赋 `name`/`slug`。既有记录由
`scripts/repair-panic-trim-rename-20260910.mjs` 修复，幂等。

`023 PS` 另外还半途崩了（资产改了名、记录没改、301 没写），怀疑是 Windows 文件锁
（errno -4094）—— 脚本先改资产再写记录且没有回滚，中途失败正好落在这里。
同一个修复脚本补齐，**删重复文件前逐个比对 md5**。

## 四、BHMA / US 表面码：让北美规格制定者能读懂目录

拿竞品编号 `rxfse25r510l32d3` 来问的买家，编号里的 `32D` 是美国表面码。我们的目录
用 `SSS`/`MB`/`CP` 这类自家代码，那个买家读不了。

`src/lib/bhma-finish.ts` + 10 条测试 + `scripts/audit-bhma-finishes.mjs`。
**517 条已发布记录里 77 条（15%）拿到号**，并进产品 FAQ —— 同时进可见文本和
FAQPage 结构化数据。

### 这个模块大半篇幅在讲什么时候拒绝回答

**BHMA 码把基材编进去了**：626 是黄铜镀铬，652 是钢镀铬，630 是实心不锈钢。
626 和 652 外观一模一样、不是同一个产品（耐蚀、价格、寿命都不同）。规格写 626
收到 652 就是替换，公共建筑上等于送审被退。所以裸的表面码不能映射，必须同时看材质。

**我自己差点踩进去**：第一版把 622「Flat Black Coated」当成与基材无关的涂层 ——
它是粉末喷涂，底下是什么金属有什么关系？查 BHMA 表，622 只列在基材 A（钢）下。
黄铜或不锈钢上的哑黑是我们真在卖的表面，而它不是 622，所以它拿不到号。
**模块自己的表把自己的错抓了出来**，测试里留了这一条。

**锌合金 56 条、铝 4 条拿不到号**，因为 A156.18 的基材只有钢/黄铜/不锈钢。这不是
我们的数据缺口，是零件的事实，而且是北美规格制定者要在打样之前知道的事：规格要
黄铜基材的 626，锌合金压铸件颜色再接近也顶不上。

`--gaps` 把没拿到号的原因分组打印，所以剩下的是**一张工作清单**而不是一个谜：
**275 条根本没记录表面**，是要问工厂的第一条。

## 五、竞品认证对照（数据 + 生成器）

`docs/research/competitor-certifications.json` → `scripts/build-competitor-matrix.mjs`
→ `docs/research/2026-09-10-competitor-certification-matrix.md`。改数据重跑即可。

Von Duprin / Yale(Accentra) / Cal-Royal / Detex / Klacci 五家，逐条带来源。

**结论一句话：五家全部持有 ANSI/BHMA A156.3 Grade 1 与 UL 逃生器械列名，我们一项没有；
我们有 EN 1125 与 CE，五家一项没有。** 不是「认证少」，是在两个体系里。

**Klacci（台湾 I-TEK）是最该研究的一家** —— 亚洲工厂，持有和美国品牌完全相同的
那套证。他们公开的结构就是路线图，写在
`docs/collaboration/2026-09-10-north-american-strategy.md` 第二节。

生成器的匹配规则也修过一次：第一版用 `UL ?305` 匹配，而 Yale 写的是
"UL and cUL panic exit listing"、Cal-Royal 写的是 "UL and ULC listed for panic",
两家都没写 305 却都持证 —— 结果表里给了两个破折号，**低估了竞品，也让我们自己的
差距看起来比实际小**。改成匹配「主张」而不是某一种拼法。

## 六、关于甲方那句「就是吹牛皮，boast」

策略文档第零节整节在回答这个，一句话版本：

**竞品认证全部收集了；说我们要去拿这些认证可以写而且应该写；把没拿到的证写成已经
持有不能做 —— 理由不是道德，是 UL Product iQ、BHMA 目录、加州消防局列表、
Miami-Dade NOA 数据库这四个都是公开可查的，而规格制定者的工作流程里就有这一步**
（他要把证号写进送审文件）。查不到不是「暂时没被发现」，是在他最认真看我们的那
一分钟被发现。

而且 `src/data/company.ts` 里本来就写死了「There is no ANSI/BHMA certification.
The client has confirmed this outright」—— 这是之前甲方自己确认的。

文档里给了强而真实的写法：说得出自己**没有**什么证、并说得出证号格式的供应商，
比什么都说有的更让人放心。

## 七、小红书三张图逐条回答

在策略文档第四节。摘要：

| 那篇说的 | 我们 |
|---|---|
| ① 用 ChatGPT 编 50 个长尾词 | **不该照做** —— 我们有 44 个国家的真实查询数据，用编的替换已知是倒退。但它指向真缺口：北美词汇（rim exit device、wide stile、dogging、Grade 1、630），已做表面码那一行 |
| ② 产品页公式：场景+参数+认证+痛点+背书 | 五项我们做到四项，缺的正是认证。最该补的是「应用场景」，citability 已经量化了：collections 41 分、projects 39 分 vs product-finder 75 分 |
| ③ 用 AI 做内部链接策略图 | **已经做了而且更进一步** —— `npm run seo:graph` 是脚本不是一次性咨询，昨天正是它抓出 600 个西语页走不到 |
| ④ Schema / 清低价值页 / 人工检查 | 三项都已有机制，低价值页 10% 而不是那篇说的 30% |

## 检查

`npm run lint` 0 problem · `npm run typecheck` 通过 · `npm test` **230/233**。

三条失败**全部来自 Codex 正在进行的工作**，没有碰：
`flip-up-grab-bars` 新类目缺封面图（1）与配置器定义（1），
`src/components/rayen/Chrome.tsx` 未提交的 `hover:underline`（1）。

## 没有构建

`out/` 当时有 **10,004 个脏文件**、27 个 node 进程在跑 —— **接力棒在 Codex 手上**。
按 `AGENTS.md` 的脏树规则，只提交源码，构建归他们。源码已推送（7dad3d8556）。

## 下一个有用的接手

1. **认证路线图排期**（甲方决策）：307 或 311 送 A156.3 Grade 1 + UL 305
2. **275 条没记录表面的产品** —— 问工厂，这是 BHMA 覆盖率从 15% 往上走的唯一路
3. **collections / projects 补具体数字** —— 不用等任何人
4. 027/028 补北美词汇（`exit device lever trim` 而不是 `panic exit device`）
