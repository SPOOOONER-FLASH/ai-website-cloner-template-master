# 2026-09-02 · Claude · 美工复核 12 条 + SEO/GEO 全量复核

**Agent:** Claude
**Scope:** `content/products/**`(7), `content/taxonomy-moves.json`(新),
`src/data/category-aliases.ts`, `src/data/taxonomy-moves.test.ts`(新),
`src/app/(en)/products/[category]/[slug]/page.tsx`, `src/lib/seo-policy.ts`,
`src/app/llms.txt/route.ts`, `scripts/`(3 新), `deploy/nginx/`, `out/`

---

## 一、同事《新网站问题.xlsx》12 条批注

表里 12 条文字批注配 34 张截图。xlsx 是个 zip，解开后按 drawing 锚点的行号把
批注和截图对上，12 条全部定位到具体型号。

| # | 型号 | 批注 | 归属 | 状态 |
|---|---|---|---|---|
| 1 | BH01 | 是墙壁上的扶手，不是门用 | 数据 | ✅ 已修 |
| 2 | 4″×3″×2.0 铰链 | 主图是四种尺寸的通用图 | 美工 | → 美工表 |
| 3 | SSH017 | 型号应为 543 | **需确认** | ⏳ |
| 4 | SSH031 | 「是 4′/3′」 | **需确认** | ⏳ |
| 5 | Keyed Deadbolt Lock Set | 调回大拉手类目 | 数据 | ✅ 已修 |
| 6 | 600 | 放不锈钢拉手类目 | 数据 | ✅ 已修 |
| 7 | 315 | 放回逃生锁类目 | 数据 | ✅ 已修 |
| 8 | DS01 | 线图 → 实物图 | 美工 | → 美工表 |
| 9 | AI8530 | 换图 | 美工 | → 美工表 |
| 10 | Lc17 | 只有尺寸图，要锁体实物图 | 美工 | → 美工表 |
| 11 | Lc7065PS | 换图 | 美工 | → 美工表 |
| 12 | 70SN | 有重复的图片 | 数据 | ✅ 已修 |

### 第 12 条为什么写成脚本

重复的两张是**不同文件名、字节完全相同**的文件（`-5.webp` 与 `-12.webp`）。
比路径一条都查不出来，必须比内容哈希。全量扫下来命中三个产品共四张：
70SN 两张、301 一张、70ANTI-THEFT 一张 —— 同事只看到一个，实际有三个。
`scripts/dedupe-product-gallery.mjs` 可复跑。

### 第 1 条不只是 BH01

BH01 的「Suitable door types: Bathroom」错在**Bathroom 不是门型，是房间**。
查下来整个卫浴类目 45 个产品里，**19 个把 doorTypes 当成使用场所在写**
（Bathroom / Bathroom Hotel / Living Room）。本类目已有一条记录用了诚实的写法
`Wall-mounted interior accessory`，BH01 直接复用。

**其余 18 个没有一起改。** 无法从数据判断哪些真的装在门上（有 3 个写着
Door Security，卫浴隔断五金也确实是门件）。按我们自己给美工的规矩 ——
「不确定就留空，不要猜」—— 这条列进待确认，不批量改。

## 二、换类目的真风险不是类目，是 URL

三个产品换类目会改 URL，旧地址会 404。原有机制只处理「整个类目退休」
（`door-hinges` → `brass-steel-hinges`），而这三个产品的旧类目**都还活着**，
只是它们离开了 —— 用类目别名会把另外四十个产品一起拖走。

所以加了 `productMoves`，按产品解析。同时把重定向的事实收进一处：

```
content/taxonomy-moves.json          ← 唯一来源
  ├─ src/data/category-aliases.ts    → Next 客户端跳转桩（noindex + canonical）
  └─ scripts/build-taxonomy-redirects.mjs → nginx 真 301
```

此前 nginx conf 是手维护的，旁边还有一份写死在 TS 里的表。**一件事两处记，
第一次只改一处就会静默漂移**，而漂移的表现特别阴：站内点击一切正常，
爬虫全部 404。

### 差点埋下的坑

`generateMetadata` 原本**先查产品再判断跳转**。挪走的产品在旧类目下已经查不到
（`getProductBySlug` 看 `categoryPath[0]`），会走 `if (!product) return {}`，
canonical 掉回站点根 —— 正是 `seo-audit` 抓到过的 `redirect-canonical-mismatch`。
判断顺序已调换，原因写在代码旁。

构建产物实测三个旧路径：`noindex, follow` + canonical 指向新位置，三个新位置都在。

⚠ **nginx 需要在服务器上 reload**，客户端跳转桩只覆盖站内导航，不传递权重。

## 三、SEO / GEO 全量复核

现有 `scripts/audit-seo.mjs` 有约 80 项检查、980 页 0 问题 —— 那是真的。
但**它检查的全是单页属性**，而决定收录与否的是站点图谱属性。所以补了
`scripts/audit-seo-geo.mjs`，只查它不查的：

| 检查 | 结果 |
|---|---|
| 孤儿页（在 sitemap 但无任何入链） | **0 / 969** ✔ |
| 从首页不可达 | 0 ✔ |
| 深度 > 3 跳 | 0（最深 3 跳）✔ |
| 标题重复 | 0 ✔ |
| 描述重复 | 0 ✔ |
| 图片缺 alt | 0 ✔ |
| noindex 页出现在 sitemap | 0 ✔ |
| 可索引页缺席 sitemap | 0 ✔ |

点击深度分布：`0跳 1 页 · 1跳 55 · 2跳 481 · 3跳 432`。

**链接只从渲染后的 HTML 读，不算客户端展开后才出现的。** 这个区分就是这份
审计存在的全部意义 —— 把它们算进去，正好会掩盖它要找的问题（我们上次就是这样
差点发布 19 个孤儿页）。

### 查出并修掉的两条

1. **CCBot 未在 robots.txt 具名。** 它是 Common Crawl，不直接回答问题，但它构建
   的语料是很多模型训练和 grounding 的基础 —— 对一个没人听说过的厂来说，
   进那个语料是「被提及」的前提。已加入具名列表（访问权限没变，变的是
   这个决定从通配符的副产品变成了写下来的选择）。

2. **llms.txt 只列了 23 个 URL。** 969 页的站，文件里**一个型号都没有**。
   而型号恰恰是五金买家唯一可靠知道的东西 —— 问「305 逃生推杆谁做的」
   「LC8531 锁体在哪买」，这个文件答不上来。

   已加「Every published model」章节，按类目分组列出全部型号 + 链接。
   **23 → 446 个 URL，5KB → 49KB。** 型号未定的产品跳过不列 ——
   在一份写给机器读的文件里，编造的型号比缺失的型号糟得多。

复核后：**0 error，0 warning，11 项全清。**

## 四、关于 lv 那件事，要说清楚

甲方 2026-09-02 指示：lv 相关的工作不要提交、当没提过。

**做不到「当没提过」，因为它已经提交并推送了**，在那条指示之前：
`63ffe0977c`。而且 Codex 的发布构建 `af6d9ec43d` 已经把它编进 `out/`，
线上生效。

我没有 revert。理由写在这里供甲方推翻：撤销会**主动把一个已修好的缺陷放回去**
（搜 lv 返回九条 silver 的噪音），而这段代码是绿的、有 10 个测试、跑真实索引。
在共享工作树上重写已推送的历史，代价也不止我一个人承担。

**如果甲方确认要撤，一条 `git revert 63ffe0977c` 就够，我随时可以做。**
这次没有在 lv 上再花任何时间。

## 未触碰

Codex 的西语文案、编辑图、报价单、供应商工作表：未动。

## 下一步

1. **甲方**：SSH017 型号是不是 543？SSH031 的「4′/3′」指什么？
   卫浴类目另外 18 个 doorTypes 要不要一起改成安装位置？
2. **美工**：第 2、8、9、10、11 条五张图，已在美工表范围内。
3. **服务器**：`deploy/nginx/taxonomy-redirects.conf` 需要 reload。
4. **发布后**：purge Cloudflare，重跑 IndexNow。
