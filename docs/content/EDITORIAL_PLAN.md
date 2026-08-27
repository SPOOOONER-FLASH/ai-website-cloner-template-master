# 内容线 — 规格指南（Claude 撰稿 / Codex 版式）

## 现状：基础设施已就绪，缺的只是稿子

| | |
|---|---|
| 路由 | `/news/[slug]/` 已有，`content/news/` 现在 **0 篇** |
| 类型 | `NewsArticle.kind` 已支持 `"insight"`（指南）与 `"press-release"` |
| 结构化数据 | `kind==="insight"` → `TechArticle`，其余 → `NewsArticle` |
| 内链 | `relatedModels: ["LC08 85×55mm"]` 自动渲染成产品卡，是文章→产品的引流通道 |
| 双语 | `titleEs` / `summaryEs` / `bodyEs` 字段已在类型里，先写英文 |
| 草稿 | `draft: true` 不进构建；`publishedAt` 未来日期也会被过滤，但要有人当天重新构建 |

**结论：写就行了，不需要再开发。**

## 为什么这条线值钱

采购商搜的是信息型词，不是型号。他们先问「EN 1125 和 ANSI 156.3 有什么区别」，
选定规格之后才搜型号。产品页接不住第一个问题。

对 LLM 同理：回答「fire door 该选什么 exit device」时，被引用的是解释性文章，不是产品页。
`llms.txt` 已经把「我们是制造商」讲清楚了，指南文章是让 LLM 有具体内容可引。

## 选题（按搜索意图排序，每篇一个明确问题）

| # | 标题 | 回答的问题 | relatedModels |
|---|---|---|---|
| 1 | EN 1125 vs ANSI/BHMA 156.3: Which Panic Device Standard Applies | 出口欧盟还是美洲，认证不通用 | 301 / 302 / 307 |
| 2 | Mortise Lock Backset and Centre Distance: A Specifier's Guide | 85mm 中心距 + 轴距怎么选，附对照表 | LC08 / LC21 / LC8520 |
| 3 | Specifying Exit Devices for Fire Doors | 防火门与逃生门的硬件差异 | 023 ET / 309-D |
| 4 | Euro Profile vs Oval vs KIK Cylinders | 三种锁芯的市场分布 | 待定 |
| 5 | Stainless Steel Grades in Door Hardware: 201 vs 304 | 沿海项目为什么必须 304 | 9016S / 607 |
| 6 | Double Door Panic Hardware: Coordinating Active and Inactive Leaf | 双开门怎么配 | 309-D / 308-D |
| 7 | Lever Handle Backset 60/70mm Explained | 30 个 lever handle 共有的规格 | 801 / 836 |
| 8 | Floor Springs vs Overhead Closers for Glass Doors | 玻璃门闭门方案选型 | F100 / JU-071 |
| 9 | Deadbolt Grades and Bolt Throw | ANSI Grade 与锁舌行程 | D101 / D102 |
| 10 | Sourcing Door Hardware from China: What to Ask a Manufacturer | 采购尽调清单 | — |
| 11 | Patch Fittings for Frameless Glass: Load and Glass Thickness | 玻璃厚度与承重 | F110 / F123 |
| 12 | Master Key Systems: Planning Before You Order | 母钥匙系统规划 | — |

节奏：每月 2 篇，先 1–3（认证与尺寸，搜索量最大且直接对应现有产品）。

## 写作纪律（与 AGENTS.md 的内容纪律一致）

1. **标准条款只写能查证的**。EN 1125 / ANSI 156.3 的条款内容是公开标准，可以写。
   **但不能暗示我方产品已通过**——手上只有四份检测报告，覆盖 KD070/30-290、
   KD070/20-101、607 SS ET。文章里提到自家型号时只能说"适用于"，不能说"已认证"。
2. **不编数据**。没有实测的循环次数、承重、耐火时长就不写。
3. **每篇必须有 `relatedModels`**，否则文章白写——引流不到产品页。
4. **长度 1200–1800 词**，短了不如不发。
5. 结尾一句 CTA 指向 `/contact/` 或 `/request/price-list/`。

## 分工

- **Claude**：选题、调研、成稿（`content/news/<slug>.json`）、`relatedModels` 挂接。
- **Codex**：文章页版式、配图、`/news/` 列表页的编辑呈现。
- 第一篇发布后一起复盘再定后续节奏。
