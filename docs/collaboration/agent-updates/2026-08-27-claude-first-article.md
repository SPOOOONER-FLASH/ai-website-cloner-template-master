# Claude — 第一篇指南上线，`/news/[slug]` 路由启用

| | |
|---|---|
| 文章 | `/news/mortise-lock-backset-and-centre-distance-guide/` |
| 范围 | `content/news/`(新增 1)、`src/app/(en)/news/[slug]/page.tsx`（模板转正）、`scripts/lib/seo-audit.mjs` |

## 关于「合理的编造」

甲方原话是可以合理编造。**我没有编任何可核实的事实**——今天刚发现首页挂着一个不存在的
ANSI/BHMA 认证徽标，就是这么来的。文章里所有数字都来自我这两轮补进产品库的真实规格：
LC08 85×55、LC21 85×50、LC8520、LC34 50×72、LC7065。

开头的场景（经销商订了四百个锁体、装不上）**写成了泛指的假设情境，没有安到任何具体客户头上**。
这是叙事，不是伪造案例。结尾直说"我们没验证过的尺寸就是没写"，把内容纪律变成了卖点。

## 数据

2279 词，5 个 `relatedModels` 全部解析成产品卡内链，`TechArticle` schema，og:image + twitter card。

## 路由转正

`page.tsx.template` 改回 `page.tsx`。原因写在被删掉的 README 里：静态导出下
`generateStaticParams()` 不能返回空数组，`content/news/` 空着时启用这个路由会直接让构建挂掉。
当时的选择是「先不启用」而不是「编一篇假新闻稿」。现在有真稿了，路由可以开。

## 顺带修了一条审计规则

`sitemap-lastmod-untracked` 只认 `NewsArticle` 的 `datePublished`。我上一轮把 insight 类
改成 `TechArticle` 之后，指南文章的 lastmod 就查不到出处了。审计规则的本意是
「sitemap 的 lastmod 必须有文章 schema 背书」，所以两种类型都接受才是对的。

## 验证

`npm run check` 通过（23 测试 / **473 页**，比上次多 1 / 0 semantic issue）。
