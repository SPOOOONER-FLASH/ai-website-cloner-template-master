# 2026-09-28 · Claude · 十个语种各一条 RSS（此前只有英文，es/pt 根本不存在）

甲方待办里写着「在 Search Console 提交 /es/feed.xml 和 /pt/feed.xml」，并说三条 feed 各 82 篇。

## 先说发现：那两条当时并不存在

仓库里只有 `src/app/feed.xml`（英文），`0ace1fb2063` 建的。`/es/feed.xml` 和 `/pt/feed.xml`
**没有路由**，当天提交上去只会拿到 404，并且会在 Search Console 里留下一条失败记录。

所以先把它们做出来，而且一次做满十个——不是三个。十个语种的文章数和翻译覆盖都核过：

    英文文章 82 篇（guides 45 + news 37）
    fr de ja ko tr ru ar   译标题 82/82（content/i18n/<code>/）
    es pt                  译标题 82/82（记录上的 titleEs / titlePt）

## 做了什么

`src/lib/locale-feed-xml.ts` 一个构建器，十条路由都走它，所以西语 feed 不会和英文 feed 跑偏。

- 英文 `src/app/feed.xml/route.ts` 改成调用它（原逻辑搬进库里，输出不变）
- `es` / `pt` 手写路由（这两个 locale 树不归 scaffold 管）
- 其余七个加进 `scripts/scaffold-locale-routes.mjs` 的模板，跟 `sitemap.xml` 同一个写法——
  **以后再加语种，feed 自动就有了**，不用记得回来补一行。这条是 `language-choices.ts` 用 645 个
  葡语页面换来的教训：手写的清单不会知道新表面出现了。
- 每个 locale 的 `<head>` 声明自己那条 feed，`robots.txt` 十条全列

标题和摘要走 `t(article, field, locale)`，与文章页同一个覆盖读取器，所以 feed 和它链接的页面
不可能不一致；链接走 `localisedHref`，与页脚和语言面板同一个函数。

## 一个只有测过才会发现的坑

`localisedHref("/feed.xml", "fr")` 返回的是 **`/feed.xml`**，不是 `/fr/feed.xml`——
那个函数只映射站点真实路由的路径，而 feed 不在其中。如果照抄它来写 `rel="self"`，
**十条 feed 会全部自称是英文那条**，而 `rel="self"` 正是阅读器和 Search Console 用来判断
「我在看哪条 feed」的字段。改成直接拼 `/${locale}/feed.xml`，并在代码里写明了为什么不能用那个函数。

## 验证到哪一步

`npm test` 418 项、`lint`、`typecheck`、`npm run test:export` 全通过（export 那条会把
7698 个页面的内链、hreflang、canonical、JSON-LD 全爬一遍）。

**逐条 feed 的 XML 输出没有在本地跑起来验证**：`locale-feed-xml.ts` 经 `src/data/site.ts`
引到 `content/navigation.json`，`node --test` 不带 import attribute 读不了——就是
`locale-picker.ts` 头部记的那个限制。内容层的风险已用叶子模块核过（译标题覆盖 82/82、
`localisedHref` 的逐语种文章 URL 正确）；路由层与 `sitemap.xml` 同构，那条已在线上跑了。
**发布后请抓一条 `/ja/feed.xml` 看一眼 `<language>` 和首条 `<link>`。**

## 待甲方提供，没有编

- **审稿人署名**：技术指南加「审稿：某某，职位」和 JSON-LD 的 `reviewedBy`，需要真实姓名和职位。
  甲方说「正在要」，拿到再加。
- 作者页照片另见同日的 `2026-09-28-claude-author-photo.md`。
