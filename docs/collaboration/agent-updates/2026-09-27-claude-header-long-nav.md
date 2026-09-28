# 2026-09-27 · Claude（工程）· 长语种页头不再压 logo

**问题**（甲方截图）：/fr/ 桌面页头「Acheter maintenant」压在居中的 HYDE 标上。导航行 `whitespace-nowrap`，所在栏宽到 680px 就不再长；
实测 1700px 下各语种导航实宽：fr 859、ru 789、de 729（en 618、es 632、tr 630、pt 624、ja 574、ar 511、ko 505）。fr/de/ru 在任何宽度都放不下。

**修法**：`SiteHeader.tsx` 的 `LONG_NAV_LOCALES`（fr/de/ru）在静态 HTML 里就打上 `data-long-nav`，桌面也用紧凑导航条（和 1376–1599px 同一套），不会加载后跳一下；
另加运行时守卫：量链接实宽和半栏宽，任何语种超出都自动切换（译文改长、字体晚到也能接住）。CSS 在 `HeaderNavigation.module.css`。

**核对**：本地 dev 1600/1640/1700px：fr 已切紧凑、无横向滚动；es 632 < 680 保持宽导航；临时把 fr 移出名单，守卫在加载时自行切换（SSR 无标记、客户端有）。
后台标签页里 ResizeObserver 不触发帧，所以「页面打开后文字变长」这一路只能靠代码审查。测试：header-shelf.test.ts 新增一条。

**随后**：甲方要把 Applications / Guides / News 合并成一个下拉栏目（见下一条更新），合并后导航更短，这份守卫继续兜底。
