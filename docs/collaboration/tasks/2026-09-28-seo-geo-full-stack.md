# 全栈 SEO / GEO / AEO / SXO 优化：方案与执行记录（2026-09-28）

> 甲方 09-28：「调用你的所有能力做一下全栈 seo geo aio aeo sxo 优化，出优化方案并执行……llms.txt、robots.txt、alt、图片带 alt、H1 H2……顺便修全栈的死链和检查 bug 去修，然后把长尾词做好」。
> 方法：不装新工具，用仓库里已有的九个审计生成器量**构建产物**（不是抽样），先量后改，每一项改动都能重跑同一个脚本验证。
> 本文件是方案 + 执行台账；数字由脚本产生，改完重跑即是最新状态。

## 一、基线（本地导出 build12，7,694 页 / 7,020 可索引，10 语种）

| 检查 | 脚本 | 结果 | 判断 |
|---|---|---|---|
| 语义 SEO（canonical、hreflang 互惠、JSON-LD、OG、跳转桩） | `audit-seo.mjs` | 语义错误 **0**；4,034 条编辑质量警告（2,426 标题长度、1,608 描述长度） | 底座已满分，只剩长度 |
| 死链（内链、资源、hreflang、canonical、JSON-LD 网址） | `audit-dead-links.mjs` | 787,148 内链 + 179,665 资源 **全部可达** | 无死链 |
| 页面缺陷（h1、alt、薄内容、重复标题） | `audit-page-defects.mjs` | 缺 h1 0（/admin/ 除外）、缺 alt **0**、重复标题 0（可索引页）、短标题 420（几乎全是 7 语种的产品页）、短描述 4,590 | alt / H1 已达标；短标题是生成器问题 |
| 站点图谱（孤页、深度、sitemap） | `audit-seo-geo.mjs` | 孤页 0、最深 3 次点击、**误报 5,456 页「不在 sitemap」**（脚本只读 /sitemap.xml，7 语种各有自己的 sitemap） | 审计脚本要改 |
| AI 可引用性 | `audit-geo-citability.mjs` | 全站 **70/100**；最低：/video 197 页 32 分、collections 38–41 分、/ja 57、/ru 60 | 视频页和子类页几乎没内容 |
| 商业词覆盖（15 个品类页） | `audit-keyword-coverage.mjs` | 正文带商业词（manufacturer/supplier/wholesale）**4/15**，带交易词（quote/MOQ/lead time）**1/15** | 品类页只有「学」的词，没有「买」的词 |
| 买家问题覆盖 | `audit-question-coverage.mjs` | 170 题：答 13、半答 86、**未答 71** | 尺寸类问题答案其实都在记录里，没写成句子 |
| 文章主词重叠 | `audit-guide-keywords.mjs` | 18 对 ≥ 0.5（最高 0.71 不锈钢牌号两篇） | 工程会话 09-27 已分流 5 对 |
| 外链 | 手工 curl | 600 个去重外链：阿里巴巴、社媒、6 个展会站全部 200；LinkedIn 个人页返回 999（LinkedIn 反爬，非死链） | 无死链 |
| GSC 09-22 查询 | `analytics/2026-09-22/raw` | 「master keying system chart」153 次展示 0 点击（排 7.9）；型号查询 fb005/bh28/564mb/d102/ju093 排 3–8 名 0 点击；「brass hinges manufacturing plant cost」「china scalloped edge steel hinge」「door closer manufacturer」「china door closer」「anti panic door」「fire door with panic hardware」「patch fitting」(排 1)、「hook locks」(排 1) | 排名有、点击无：结果页那两行字没对上问题 |

**结论**：技术底座（alt、H1、canonical、hreflang、sitemap、robots、llms.txt、IndexNow、11 种结构化数据）已经齐了，本轮不需要再「补 alt 补 H1」。
差的是**页面上有没有一句能被引用、能对上买家查询的话**——品类页、子类页、视频页、术语表。

## 二、本轮做了什么（源码，同一提交）

1. **品类页「买家怎么指定」板块**（`src/components/site/CategoryBuyingGuide.tsx` + `src/data/category-buying-guides.ts` + `src/lib/category-facts.ts`）
   16 个品类各一段导语 + 2–4 组问答 + 「要报价需要什么」，用买家的搜索用语写（brass door hinge manufacturer、door closer manufacturer、patch fitting、hook locks、anti-panic door、fire door with panic hardware、door coordinator/selector、keyed alike、master key）。
   **所有数字都是构建时从产品记录算的**（型号数、backset/门厚/中心距/行程/循环次数/门宽/承重范围、材质/表面/功能清单），文案里只放 `{placeholder}`；记录不够 3 条的句子整条不印。
   页面同时输出 FAQPage JSON-LD（只含真正渲染出来的问答）。英西葡直接写；7 语种走 ui.json（102 键，七名写手翻译）。
   测试 `src/lib/category-guide.test.ts`：每个在售品类都有指南、十语种渲染后没有残留占位符、六个尺寸型品类至少保留一条尺寸答案。
2. **子类页（collections）加 H2 + 定义**（`CollectionNote.tsx`）：复用配置器的 OPTION_NOTES，13 个没有数字范围的子类页不再只是一张清单。
3. **视频页（197 页）加规格表 H2**：产品记录前 8 行规格印在视频摘要下面（原来一页只有标题 + 一句 + 两个链接，32 分）。
4. **术语表 DefinedTermSet JSON-LD**（`definedTermSetSchema`）：23 条术语在英文和 9 个语种页上都可归属到本页。
5. **范围解析 bug**：`collection-spec-range.ts` 的 `millimetres()` 对「35–55mm」「8-12mm」只取后一个数，子类页和品类页的「门厚」范围一直少了下限（如 35–45mm 的门印成 45mm）。已修，测试通过。
6. **`statedOn()` 七语种漏英文**（「stated on 12 of 19 models」）改 tx 模板。
7. **`audit-seo-geo.mjs` 读 robots.txt 声明的全部 sitemap**，去掉 5,456 页的误报。

## 三、不归本会话改、已交接的

- **产品页标题过短（420 页，几乎全是 7 语种）**：`L001 Falle | Canton Hyland`、`201 PBET | Canton Hyland`——生成器在记录没有尺寸/用途时只剩型号 + 品类。归工程会话（`build-product-titles.mjs`），已发消息附清单。
- 文章层长尾（主钥匙文章的「keying schedule」「terms used in master key systems」），文案会话在动文章，不重叠。

## 四、需要甲方提供的数据 / 决定

| 需要什么 | 为什么 | 用在哪 |
|---|---|---|
| Search Console **最近 28 天**的「网页 + 查询」导出（09-27 七语种上线后） | 现有数据是 09-22 的，只有英文站 | 决定下一轮改哪些标题/描述；看 7 语种是否开始有展示 |
| **HS 编码**（按品类，报关用） | 买家问题库里「HS code」未答；每个进口商都要 | FAQ + 品类指南 |
| **保修条款**（年限、范围） | 「What warranty」未答，通常是价格之后第二个问题 | FAQ |
| **包装数据**：每型号/每箱数量、毛重、箱规 | 「How many per carton」只有 6/435 条记录有 | 产品规格行 + 指南 |
| 备件与售后政策（能否单买锁芯/弹簧/螺丝） | 「spare parts」未答 | FAQ |
| **LinkedIn 公司页网址**（现在 Organization.sameAs 只有 YouTube/IG/FB/Pinterest/Tumblr） | 品牌权威维度 35 分 | JSON-LD sameAs |
| Bing Webmaster 与 Clarity 最新导出 | 对照 Google | 看板 |

给到即可进 FAQ 和指南（都有生成器，不用改代码结构）。

## 五、验证

- 本地：`node scripts/audit-seo.mjs --check`、`audit-dead-links`、`audit-seo-geo`、`audit-geo-citability`、`audit-keyword-coverage`、`audit-question-coverage`、`audit-locale-parity`、`npm run test:export`、`npm test`。
- 目标：品类页商业词/交易词覆盖 15/15；collections 与 video 的可引用性分数上升；七语种页面英文仍 ≤ 2%。
- 上线由工程会话 release，之后用 IndexNow 提交；GSC 数据两周后回看点击率。

## 六、执行结果（09-28 本地重建 build21，7,708 页）

| 检查 | 改前 | 改后 |
|---|---|---|
| 七语种页面英文（audit-locale-parity） | 0.4–0.8% | fr 0.3 / de 0.4 / ja 0.8 / ko 0.5 / tr 0.4 / ru 0.4 / ar 0.4%，全部「完成 是」 |
| 站点图谱（audit-seo-geo） | 1 警告（5,456 页 sitemap 误报） | **0 错误 0 警告，11 项全清**（含 830 个作者头像 alt） |
| 品类页正文带商业词 | 4/15 | **15/15** |
| AI 可引用性总分 | 70 | 72；/video 32 → 40；子类页有了 H2 + 定义 |
| 语义 SEO 错误 / 死链 / 缺 alt / 缺 h1 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 |
| 短标题（<30 字符） | 420 | 190（工程会话 ce809002491 的七语种兜底） |
| test:export / node --test | — | 绿 |

顺手修掉的构建问题：`npm run ship` 的旁路检出 `tmp/ship-merge/` 是独立 git 根，Tailwind 4 扫描它的 4.6 万页导出让 PostCSS 子进程超时、
`next build` 连续五次失败；已删除该 worktree，`globals.css` 和 `rayen.css` 加 `@source not`（后者是雷茵车道文件，只加三行扫描排除，
已在提交里用 SITE_WALL_OVERRIDE 说明）。另外本机 Claude 桌面端每分钟起两个 1.6 GB 的 `git diff` 进程比对含 out/ 的大提交，构建期间要清掉。

**还没做 / 下一批**：把 QuickCreator 会话的 `CategoryGuide` 挂到七语种（先把 `category-guide.ts` 的 `copyFor` 改 tx 模板）；
子类页可引用性（定义里没有数字，可把该子类的规格范围句写进定义）；视频页可引用性 40 仍低（197 页，加「用在哪里」一句 + 图纸链接）；
甲方数据（第四节）到了再进 FAQ。

## 七、第二批（09-28 下午）

**已做**
- 「怎么选（Choosing …）」板块挂到七语种品类页：`src/lib/category-guide.ts` 的文案从函数改成 `{placeholder}` 模板 + `fill()`、`copyFor` 改 `dict()`（英文输出逐字不变，原测试全过）；品类定位句 `category-positioning.json` 的 pitch 进提取器并走 `tx`；七语种页删掉「数据正在整理」那句（英西葡当天已删）；每页仍只有一个 FAQPage。
- 子类页 `CollectionFacts.tsx`：逐型号印出记录里带单位的规格行（最多 3 行，无测量值时印材质），加计算型问答 + FAQPage，十语种。
- 视频页（197 页，英文）：印出产品页同一组问答（`productFaqItems`）+ `ProductFaqJsonLd`。
- 七语种 52 键（7 个模板、约 40 句品类定位、1 个子类页标题）交七名写手。

**文章层长尾：等文案会话那批过了再动（建议已备好）**

文案会话在 NOW.md 的行仍开着（bodyEs/bodyPt 逐篇改写），文章 `seoTitle*` 归工程会话，所以本会话只备建议、不改文件。依据是 GSC 09-22 查询：

| 查询（展示 / 排名） | 落到哪篇 | 建议 | 归谁 |
|---|---|---|---|
| master keying system chart（153 / 7.9） | news/master-key-systems-how-many-levels-you-need | 标题 09-24 已加 Chart，**09-22 的数据还没覆盖新标题**，先等新导出再判断；正文已有层级图 | 看数据 |
| keying schedule（2 / 14）、terms used in master key systems（2 / 29） | 同上 + guides/master-key-hierarchy-planning-2026 | 两篇正文都没有 "keying schedule" 这个词：在 guide 里加一段「keying schedule 是什么、要哪几列（门号、功能、钥匙级别、数量）」，并加一问一答；news 篇加 GGMK/GMK/MK/CK 术语短表 | 文案 |
| door selector for double doors（1 / 10） | news/door-coordinator-double-fire-door | 正文和问答里补 "door selector" 这个同义词（英美两种叫法） | 文案 |
| fire exit door with panic bar double（3 / 39）、fire door with panic hardware（4 / 47） | news/double-fire-exit-door-hardware-set | 标题已对，排名低是新页；等新数据 | 看数据 |
| anti panic door（6 / 50）、cleanroom anti-panic doors（2 / 100） | 品类页 panic-exit-devices（本批已加 anti-panic door 用语） | 冷库/洁净室：317 冷库推杠已有型号页，可加一篇短文 | 文案 |
| smith and locke ironmongery catalogue、lane locks catalogue（竞品目录词） | news/cross-referencing-a-lock-you-already-buy | 不写竞品名；问答里补「从英国 ironmongery 目录换型号时核对哪几项」 | 文案 |
| latch hardware catalog（7 / 30） | collections/hardware-accessories-latches | 本批 CollectionFacts 已把每个 latch 的 backset/面板尺寸印出来 | 已做 |

**要甲方给**：GSC 09-24 之后的「网页 + 查询」导出——没有它，主钥匙文章改标题的效果无法判断，其它几条也只能按 09-22 的旧数据下判断。

**第二批结果（本地重建 build23）**：可引用性总分 72 → 73；子类页 /collections 41 → **69**、/es/collections 38 → **68**（es/pt 走独立路由，上一批漏挂定义块，本批一并补上）；视频页 40 → **66**；
七语种品类页有了「怎么选」板块（fr 例：「Parmi les serrures à mortaiser, combien de modèles Canton Hyland publie-t-il ?」），「数据正在整理」一句已删；每页 1 个 FAQPage。
audit-seo-geo 0/0、七语种页面英文 0.3–0.8%、test:export 绿、npm test 442/442。
仪器局限：/ja 58、/ru 61 偏低不是内容问题——可引用性脚本的数字正则只认拉丁 mm、句子切分只认 .!?，俄文「мм」和日文「。」都不计。
