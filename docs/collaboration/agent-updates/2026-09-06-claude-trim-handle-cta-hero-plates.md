# Claude — Trim Handle 术语、深场主图、CTA 多入口、锚文本审计

**范围**：`content/products/`（18 个）、`src/lib/product-faq*`、`src/data/es-glossary.ts`、
`src/data/home*.ts`、`src/components/site/ProductDetail.tsx`、
`src/components/site/menu-experience.ts`（只有 2 行图片路径）、
`public/images/editorial/hyde-hero-*`、`scripts/add-trim-handle-type.mjs`、
`scripts/audit-anchor-text.mjs`、`package.json`。

## ⚠ 没有提交 out/，也没有碰 Codex 正在改的文件

提交前发现 `SiteMenuDrawer.tsx`、`ProductsEditorialOverview.tsx` 已被修改，
`EditorialAtlas.tsx` 与 `EditorialCatalogue.module.css` 是新建未跟踪 —— 都是 Codex 在飞的活，
和他 `2026-09-06-codex-editorial-direction-review.md` 里写的下一步一致。

因此：

- **`out/` 不提交**。我这一轮跑过一次 `deploy:prep`，那次构建里含 Codex 半成品的抽屉，
  提交它会把一个没人打算发布的中间状态钉进发布产物。
- `npm test` 现在 6 条失败，**全部在 `header-shelf.test.ts` 与 `home-accent.test.ts`**，
  断言的是旧抽屉里的字面量（`alibaba-hard-cta`、`Buy it now`、`current-nav`）。
  HEAD 版本的 `SiteMenuDrawer.tsx` 三条都有，工作区版本没有 —— **不是我造成的，也不该由我修**。
  Codex 改完抽屉后连带更新这两个测试即可。
- 我改的 `menu-experience.ts` 只有两行图片路径，和他的抽屉改动不在同一处。

## 一、Trim Handle：加术语，不改路由

`abs-015` 是全站最大关键词（Bing 169 次展示）。我们叫 Panic Exit Device，甲方自己的
stahlock 叫 Trim Handle —— 不是同义词，买家搜逃生推杠点进来看到的是外装执手。

改名是贵的：那个 URL 正在排名，移动它要配 301、页面历史重置，而依据只是另一个站的标题。
所以按甲方指示两头都要：**URL、H1、排名一个不动**，在规格表首行加一条 `Type`，
把 `Trim handle · outside lever for panic exit devices` 变成页面上可搜索的文字，
同时进 Product schema 的 `additionalProperty`。18 个型号，中西双语。

**顺带修了我自己注释里的一句错话。** 我在脚本里写「productFaqItems 会自动接住 `Type`」，
其实问题表里根本没有这一条。补上了，而且放第一个 —— 「这到底是个什么件」正是从推杠搜索
落到这一页的买家的第一个问题。

## 二、深场主图

甲方：首页和 /products 不要白底，白底只留 product finder。六张已接入
（9001 执手、B024 黄铜合页、70SN 锁芯、305 防火推杠、587 球形锁、LC14 锁体），
场由零件自身亮度自动选，全部是实拍换场，像素不动。alt 一并重写 ——
旧的 alt 描述的是旧图片，一个描述错图片的 alt 比没有 alt 更糟，
因为它是给唯一无法自己核对的读者的一个自信的错答案。

## 三、CTA 三入口

产品页原来只有 Request a quote + Ask a technical question。加了第三个：下载导出目录 PDF。
B2B 买家到达时的准备程度不同，一个要价、一个要先离线读完再拉人进来、一个要找个人；
只有一个 Contact us，后两种要么走了要么走错门。一主两辅，不是四个等权按钮。

## 四、锚文本审计：本来就是干净的

`npm run seo:anchors`，读构建产物。**1,028 页、71,843 条内链，零条空锚文本**
（learn more / click here / 详情 之类）。这条外部建议我们已经做到了，
固化成脚本是为了防止以后退化，不是因为现在有问题。

型号开头的锚文本永远不算违规 —— 那正是这条审计想要的形状；面包屑豁免，它短是设计使然。

## 五、一个测试的不变量改对了

`product-faq.test.ts` 原来断言「两个语言对同一产品出块与否必须一致」。它在 027 上失败：
英文有三条装箱规格、西文没有（那五个标签正是我给译者标的缺口），于是英文出块西文不出。

**相等是错的不变量。** 西语合法地可以比英语少 —— 术语表里没有的词，生成器留英文而不猜。
不允许的是西语比英语**多**，因为到达那里的唯一途径是在西语侧编了一个词。改成 `es <= en`。

同时把那五个装箱标签补进术语表（`Piezas por caja` 等），并在译者工作簿里标为待确认：
这一条是机械的贸易西语，不是会误导规格师的术语决定，而留着英文的代价是整页 markup。

## 测试

`typecheck`、`lint`、`npm run seo:anchors` 通过；`product-faq.test.ts` 5/5 通过。
`npm test` 的 6 条失败见上，属于 Codex 在飞的抽屉。**没有跑发布，没有提交 `out/`。**

## 给 Codex

- 你笔记里说 atlas 把 keyhole escutcheon 放在了 lever 的位置 —— 那是 `compose-hyde-real-atlas.mjs`
  的问题，我没动它，留给你。
- `scripts/lib/product-cutout.mjs` 我这一轮改过（`fbd9d71170`）：会吃掉被困的白纸，
  并且深场请求在原片带烘焙投影时自动降级到浅场。你重新生成 atlas 时会受益。
- 抽屉改完请顺手更新 `header-shelf.test.ts` 与 `home-accent.test.ts`。
