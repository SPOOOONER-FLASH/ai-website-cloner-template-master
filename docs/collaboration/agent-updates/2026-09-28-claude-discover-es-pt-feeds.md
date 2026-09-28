# 2026-09-28 · Claude · Google Discover 清单第二轮：西语/葡语 RSS、文章 og 作者

甲方 09-28 又发了一组 Discover 截图（小红书两篇）。先对照 main 审计：大图、max-image-preview:large、
英文 RSS、1200×675 ≤500KB 分享图、手机文章页不弹窗、TechArticle/NewsArticle + Person 作者 + publisher，
都已由 `0ace1fb206`（见 `2026-09-28-claude-contacts-mobile.md` #96）做完，这次不重做。

## 这次补的缺口

| 缺口 | 做了什么 |
|---|---|
| 只有英文 RSS，但 82 篇文章西语、葡语标题/摘要/正文 100% 齐全 | `/es/feed.xml`、`/pt/feed.xml`，标题和描述用该语种字段，链接指向 `/es/`、`/pt/` 页面；es/pt 布局 `<head>` 声明、robots.txt 列出。生成逻辑抽到 `src/lib/article-feed.ts`，三个 route 各一行 |
| 文章 og 缺 `article:author` / `article:section` | en/es/pt 六个文章路由和 `ArticlePages.tsx`（其余语种）的 openGraph 加 `authors`（作者 LinkedIn URL）和 `section`（Guides/News） |
| main 上 `npm run check` 第一步就红：`BauColumn.tsx` 裸写 `duration-300` | 改成 `duration-[var(--motion-medium)]` |

守卫：`src/data/discover-readiness.test.ts` 新增一条，es/pt feed 路由、布局声明、robots 缺一即红。

## 不是站点改动的条目（不做）

「网站权重 ≥15」是第三方指标，不是代码；「持续输出 10–20 篇同主题」「标题有张力不标题党」「内容新鲜度」是选题与写作节奏，归内容计划。

## 提议（未做，等甲方点头）

1. **站内作者页** `/company/johnson-liu/`（三语）：只用已有字段（职位、学历、LinkedIn、他署名的 82 篇），把 schema `author.url` 从 LinkedIn 改指站内页、LinkedIn 留在 `sameAs`。E-E-A-T 的「作者实体」更完整。
2. **工程师审稿署名**：技术指南若有工厂工程师真实审过，加 `reviewedBy`。需要甲方给真实姓名和职位，不编。
3. **dateModified**：现在恒等于 publishedAt。文章改过就该更新，建议在 content JSON 加 `updatedAt`，Discover 看新鲜度。

## 触碰文件

`src/lib/article-feed.ts`（新）、`src/app/feed.xml/route.ts`、`src/app/es/feed.xml/route.ts`（新）、`src/app/pt/feed.xml/route.ts`（新）、`src/app/es/layout.tsx`、`src/app/pt/layout.tsx`、`src/app/robots.ts`、`src/components/locale-pages/ArticlePages.tsx`、`src/app/{(en),es,pt}/{news,guides}/[slug]/page.tsx`、`src/components/site/BauColumn.tsx`、`src/data/discover-readiness.test.ts`。未碰 JsonLd.tsx（HowTo 线程在改）、首页组件。

## 环境备注

`finish-downloadable-pdfs.mjs --check` 调用 Windows 的 `py` + pymupdf；Linux 云端要 `ln -s $(which python3) <dir>/py` 放进 PATH 并 `pip install pymupdf` 才能跑绿，不是代码问题。构建会改写 `out/` 和 `src/data/generated/products-zh.json`，本次都未提交。

## 下一步

HYDE 发布由 johns 机器的工程会话跑 `release:hyde`；上线后在 Search Console 把 `/es/feed.xml`、`/pt/feed.xml` 作为站点地图提交到对应属性。记得 purge。
