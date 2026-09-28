# 2026-09-27 · Claude（工程）· 长语种页头不再压 logo

**问题**（甲方截图）：/fr/ 桌面页头「Acheter maintenant」压在居中的 HYDE 标上。导航行 `whitespace-nowrap`，所在栏宽到 680px 就不再长；
实测 1700px 下各语种导航实宽：fr 859、ru 789、de 729（en 618、es 632、tr 630、pt 624、ja 574、ar 511、ko 505）。fr/de/ru 在任何宽度都放不下。

**修法**：`SiteHeader.tsx` 的 `LONG_NAV_LOCALES`（fr/de/ru）在静态 HTML 里就打上 `data-long-nav`，桌面也用紧凑导航条（和 1376–1599px 同一套），不会加载后跳一下；
另加运行时守卫：量链接实宽和半栏宽，任何语种超出都自动切换（译文改长、字体晚到也能接住）。CSS 在 `HeaderNavigation.module.css`。

**核对**：本地 dev 1600/1640/1700px：fr 已切紧凑、无横向滚动；es 632 < 680 保持宽导航；临时把 fr 移出名单，守卫在加载时自行切换（SSR 无标记、客户端有）。
后台标签页里 ResizeObserver 不触发帧，所以「页面打开后文字变长」这一路只能靠代码审查。测试：header-shelf.test.ts 新增一条。

**随后**：甲方要把 Applications / Guides / News 合并成一个下拉栏目（见下一条更新），合并后导航更短，这份守卫继续兜底。

## 追加：Applications / Guides / News 合并为「Resources」（目标 #76）

甲方：「把这三个合并到一个栏目下面，想一个新的导航名，鼠标挪到那自动向下弹出这三」。
桌面顶栏 7 项 → 5 项：Products · Product Finder · **Resources** · Company · Buy it now。Resources 是按钮，悬停/聚焦/点击都打开 `#resources-shelf`，
样式同 Company 面板：左侧一句说明，右侧三栏（Applications / Guides / News 各带一行说明）。Company 面板里重复的 Applications 去掉（5 列 → 4 列）。
手机和紧凑导航条保持三个独立链接（没有悬停，滚动条多一项不花钱）。

名字：Resources / Recursos / Recursos / Ressources / Ressourcen / 資料 / 자료 / Kaynaklar / Материалы / الموارد。
新句子写进 7 个 ui.json，`npm run i18n:keys` 重新生成 ui-keys.json 和客户端译文表（SiteHeader 是客户端组件，只读生成表）。

合并后各语种导航实宽 fr ≈603px（原 859）、ru 554、de 512，都小于 680px 栏宽，所以 `LONG_NAV_LOCALES` 清空，法/德/俄也用完整导航；运行时守卫保留兜底。
核对：本地 1600px /fr/ 导航到 716px，logo 从 801px 起，无横向滚动；面板法文完整。npm test 407 通过，i18n --check、i18n-lint 通过。

## 追加（09-28）：1376–1599px 也显示 Resources（目标 #88）

发布会话在 r8 线上实测时发现：1440 宽的页头仍显示 Guides / News，没有 Resources。这不是缓存问题。1376–1599px 用的是紧凑导航条，而我当时给导航条保留了独立链接。但这个宽度是带鼠标的笔记本，甲方要的合并下拉在这里就看不到了。
现在改为：xl（1376px）以上，导航条把 Guides、News 换成 Resources 按钮，打开的是同一个 `#resources-shelf`；xl 以下（平板、手机）仍是独立链接。Applications 在导航条里本来就不显示，可以从 Resources 面板进入。
本地实测：1440 宽时导航条为 Buy it now · Products · Product Finder · Resources · Company，点击后面板打开，无横向滚动；1000 宽仍是独立链接。
