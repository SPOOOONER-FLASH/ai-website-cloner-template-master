# 2026-09-23 Claude：Kimi 成果复查 + 分界墙第二半（数据按站点读）

**甲方**：「kimi 做好的你要检查效果，不好的要优化；和雷茵之间要做出分区并线工作设计，互不干扰。」

## 一、Kimi 三项成果复查

| 项 | 结论 | 处理 |
|---|---|---|
| robots `Disallow: /*/__next.` | **有效，但漏了首页那一层**。Google 规则里 `/*/` 至少要一级目录，根目录的 `/__next._tree.txt`、`/__next._full.txt` 拦不住 —— 而首页是被抓最多的页 | 需在 `src/lib/seo-policy.ts` 的 disallow 加一条 `/__next.`。**本次未改**：seo-policy.ts 是 Kimi 的改动面，且改 robots 需随发布生效；留给下一次 HYDE 发布前一并做，已记入 TODO-MASTER 第 12 项 |
| JS 瘦身（SearchDialog / SiteMenuDrawer / Promo 按需加载） | 体积确实降了（guides 696→648 KB）。**副作用**：按需加载要等第一次点击才下载代码。搜索的「快速关再开」加载问题就是这样来的（Codex `0fab9a363ce` 已修）；手机菜单同一风险仍在：慢网络下第一次点菜单有停顿 | **给 Codex**（SiteHeader / SearchDialog 在你们的认领里，我不改）：在按钮的 `pointerenter` / `touchstart` / `focus` 上预先 `import()` 对应模块，或空闲时 `requestIdleCallback` 预取。代价几行，第一次打开就不再等网络 |
| llms.txt 加厚 | 结构好（关键事实、品类、问答、指南、全部型号、给摘要者的说明）。**两处错**：开头「17 个品类」下面只列 15 个（自相矛盾）；品类描述里有雷茵的货（闭门器「含地弹簧」、执手「管状和插芯」、不锈钢类「玻璃门拉手」） | 已修：数字改用实际列出的品类数；六条品类描述三语改写为 HYDE 实况（见第三节） |

## 二、分界墙的第二半：共用数据要按站点读

今天上午的三道墙（各自发布、提交不跨线、两根接力棒）防的是**提交和构建撞车**。
下午暴露的是另一类：**HYDE 的页面引用了雷茵的货**，四处同时发生，没有一条路径规则看得见：

1. 五篇 HYDE 文章按全目录计数（924 条 / 105 条合页 / 120 条执手），实为 590 / 29 / 64；
   还把雷茵门吸型号推荐给 HYDE 买家。→ 已改正，守卫 `src/data/article-catalogue-claims.test.ts`
2. 共用的 `content/categories.json` 英西葡描述按全目录写，HYDE 品类页和 llms.txt 印出雷茵的货。→ 已改写
3. HYDE 站内搜索列出 17 个品类，其中 2 个（扶手、地弹簧）在 HYDE 没有页面，点进去 404。→ 按 HYDE 有货过滤
4. HYDE 每跑一次 `npm run content` 就改写雷茵的两个搜索索引，提交时被墙拦下，只能手工撤回。→ `--site=hyde`

规则已写进 AGENTS.md「The RAYEN / HYDE wall」第 4–6 条并同步各 agent 配置。

## 三、改动清单（本提交）

- `scripts/build-search-index.mjs`：`--site=hyde|rayen`；品类按 HYDE 有货过滤；**补上指南**
  （/guides/ 9-21 开栏后搜索从未收录，41 篇搜不到）。只收标题、摘要、小标题、型号，索引 633→675 KB
- `package.json`：`content` 改为只写 HYDE 索引；`prebuild` 不变，两站发布照旧重建两份
- `content/categories.json`：闭门器、执手、不锈钢执手、夜锁、插销锁、卫浴六条三语描述按 HYDE 实况改写
  （**雷茵不读这段**，见 build-rayen-site.mjs 第 318 行注释）
- `src/app/llms.txt/route.ts`：品类数用实际列出数

**未碰雷茵任何文件。** 雷茵的搜索索引、页面、数据均未改；`prebuild` 行为不变。
