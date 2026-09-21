# 葡语站在 UI 上无法抵达 — 已修复

**agent**: Claude · **日期**: 2026-09-17

## 甲方的问题

> 全站葡萄牙语言去哪了

截图里语言面板只有 English / Español。

## 它一直都在，只是没有一条路通到它

9-16 上线的 645 个 `/pt/` 页面全部存在、可访问、hreflang 三向互指、sitemap 里也有。
**没有任何一个渲染出来的链接指向它们。** 读 `out/pt/index.html` 才看得见，因为：

| 位置 | 原来的写法 | 后果 |
|---|---|---|
| `languageChoices()` | 手写的两元素数组 | 面板只列 en / es |
| `triggerLabel()` | 字面量 `"ES \| EN"` | 页眉不提葡语 |
| `SiteFooter` | 一条硬编码的 EN↔ES `<a>` | **全站唯一的跨语言渲染链接**，指不到 /pt |
| `SiteHeader` | `isSpanish = pathname.startsWith("/es/")` | 每个 /pt/ 页面算出 `locale = "en"`：英文标签，而且 "Products" 指向 `/products/`，把葡语读者送出葡语站 |
| `SiteMenuDrawer` | `isSpanish: boolean` 这个 prop 形状 | 一个布尔值表达不了第三种语言 |

这正是 2026-09-09 西语那次事故（600 个页面无法从首页抵达）原样重演，只是换了一棵树。
**没有任何一项检查会失败**：构建通过、`npm test` 313/313 全绿、死链审计 1370 页通过 —— 
这些检查没有一个在问「读者能不能走到这棵树」。

## 改法：一律从 `locales` 推导，不再手写

- `src/data/locales.ts` 新增 `localeFromPath()` / `englishPathOf()`，所有站点框架共用。
- `src/lib/language-choices.ts`（新，叶子模块）：`languageChoices` / `triggerLabel` 从
  `locales` map 出来。拆出来的原因是 `locale-picker.ts` 要 `siteSettings`，链到
  `content/navigation.json`，`node --test` 加载不了 —— 也就是说**那个决定 645 个页面
  是否可达的列表，此前根本没有测试能碰到它**。
- `src/lib/spanish-mirror.ts` 新增 `mirrorHref()`：页脚锚点和面板语言列用同一个函数，
  两份列表不可能再各算各的。
- `SiteFooter` 现在每种其他语言各渲染一条 `<a>`。
- `SiteHeader` / `SiteMenuDrawer` / `PromoDialog` / `HeroModule` / `EditorialAtlas`
  改用 `localeFromPath`；补齐葡语文案、`labelPt`（导航与分类已 100% 覆盖）。

## 顺带修掉的一个 404

`/pt/ferragens-porta-corta-fogo/` 是巴西市场专写的单语页面，没有英文原版。
页脚的 "English" 指向 `/ferragens-porta-corta-fogo/` —— 一个从未存在过的 URL，
而这正是 SAGA Portas 询盘进来的那个落地页。新增 `LOCALE_ONLY_ROUTES` + `soleLocaleOf()`。

## 测试

`src/lib/language-choices.test.ts`，7 条。两条是真正的守卫，不是断言复述代码：

1. **源码守卫**：站点框架里不准再出现 `startsWith("/es")` 这类嗅探。
   已验证它在**提交前的** SiteFooter 上会触发（`SiteFooter.tsx:44`）。
2. **文件系统守卫**：`src/app/pt/**` 下每个没有英文对应目录的路由，必须登记在
   `LOCALE_ONLY_ROUTES` 里，否则页脚会再次链到 404。

`npm test` 324/324。`npm run deploy:prep` 全绿：2037 页，154824 条内链、47436 个资源
引用全部可解析；legacy 301 无链；段载荷可移植。

## 数字

| | 修复前 | 修复后 |
|---|---|---|
| 指向 `/pt/` 的已渲染页面 | 0 | 2034 |
| /pt/ 页面上的导航语言 | 英文 | 葡文 |
| /pt/ 页面上 "Products" 指向 | `/products/` | `/pt/products/` |

## 没动的

`out/` 之外的 Codex 归属文件；NOW.md 上 Codex news studio 那行（我只加了自己的一行，
已在本次提交里删除）。`EditorialAtlas.tsx` 我只改了语言前缀那一行，没碰图像选择。

## 还没做（甲方列的四条里的另外三条）

- 剩余 28 篇文章的问答块
- 35 篇文章的葡语正文（现在 0%）
- 工具清单评估 doc

`factory-cnc-machining.webp` 的来源矛盾已由甲方 2026-09-17 口头确认：**是我们厂**。
记录同一次提交更新。
