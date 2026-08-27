# Claude — 指南文章用 TechArticle · 内容线计划

| | |
|---|---|
| 范围 | `JsonLd.tsx`（article schema 按 kind 分流）、`docs/content/EDITORIAL_PLAN.md`（新增） |
| 未动 | 版式、图片、`content/news/` 仍为空 |

## 一处会在第一篇文章上线时才暴露的错

`newsArticleSchema` 原来无条件输出 `NewsArticle`。`kind` 已经有 `"insight"` 这一档，
但 schema 没跟着分流。指南类文章（EN 1125 对照、backset 表）是常青内容，
标成 NewsArticle 会被按新鲜度衰减，且永远拿不到它声称的 Google News 位。
改为 `kind==="insight"` → `TechArticle`。

同事的点评说"FAQ 页加 FAQPage 结构化数据、产品页确认 brand/SKU"——**这两项本来就有**
（`FaqJsonLd`、`brand`/`sku`/`mpn`/`model`/`material`/`additionalProperty` 全在）。
真正的 schema 缺口是上面这条和 Organization 的 sameAs（已在上一个提交补）。

## 内容线：不需要开发，只缺稿

`/news/[slug]/` 路由、`kind: "insight"`、`relatedModels`（文章→产品卡内链）、
`titleEs/bodyEs` 双语字段全都已就绪，`content/news/` 是 0 篇。
选题 12 条与写作纪律见 `docs/content/EDITORIAL_PLAN.md`，先写 1–3。

⚠ 写作纪律里最要紧的一条：公开标准的条款可以写，**但不能暗示我方产品已通过**。
只有四份检测报告，覆盖 KD070/30-290、KD070/20-101、607 SS ET。
提到自家型号只能说"适用于"。

## 分工

Claude 撰稿并挂 `relatedModels`，Codex 做文章页版式与配图。
