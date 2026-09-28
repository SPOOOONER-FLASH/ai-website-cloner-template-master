# 首页与全站外壳：把“只负责显示”的部分改回服务端渲染（交 projects 会话）

甲方 2026-09-28 指派。视觉会话写任务单，projects 会话实施，工程会话发布。

## 一句话

首页有 5 个组件整个标成了 `"use client"`，浏览器要下载它们的全部代码并逐个“激活”（hydration）。其实每个组件里真正需要交互的只有一小块。把那一小块拆成独立的小客户端组件（“岛”），其余文字、图片、链接改回服务端直接输出 HTML。**页面外观和行为一个像素都不变**，只是浏览器少下载、少执行。

## 为什么做、能得到什么（先说清楚预期）

| 指标 | 现在 | 预期 |
|---|---|---|
| 首页脚本（压缩后，Lighthouse 手机） | 约 770 KB | 少几十 KB（页头页脚是全站的，所以每一页都受益） |
| 主线程阻塞 TBT（PageSpeed 线上实测） | 120 ms，已是绿色 | 再降一些；本机 Lighthouse 模拟约 1.1 s，框架激活占 3.3 s 脚本时间里的大头 |
| PageSpeed 分数 | 73（09-27，主要被 LCP 拖累，LCP 是网络/缓存问题，已由 Cloudflare 缓存规则处理） | 影响小，不要把它当成提分手段 |

**这是优化代码质量与低端手机体验的活，不是救分数的活。** 甲方已知道收益有限，仍决定做。

## 五个组件：现状和拆法（按建议顺序）

### 1. WelcomeIntro（首页开场文字）· 最简单，先做
- 现在：整个组件 `"use client"`，只因为手机上“More links”的展开/收起用了 `useState`。标题、正文、公司签名、ISO 标志都跟着被打进客户端包。
- 拆法：`WelcomeIntro` 改为服务端组件；新建 `WelcomeIntroLinksToggle`（客户端），只包“More links”按钮和它控制的链接列表的显示状态。
- 注意：文案字典 `dict` 要从 `@/lib/i18n-client` 换成服务端的 `@/lib/i18n`（服务端版本带七语种完整字典）。

### 2. SiteFooter（全站页脚）
- 现在：整个 `"use client"`，只因为用了 `usePathname()`，拿路径来 ① 判断语种；② 生成“本页的其他语言版本”链接；③ 标出当前页链接。
- 拆法：每个语种有自己的 layout（`src/app/<code>/layout.tsx`），直接把 `locale` 作为 prop 传进 `SiteFooter`，页脚主体改服务端。只有依赖当前路径的两小块（语言切换链接、当前页高亮）拆成客户端小组件 `FooterPathAware`。
- 注意：页脚里的社交链接、邮箱、WhatsApp、导航全部是静态的，应在服务端输出。

### 3. SiteFacts（首页数字栏：年份、型号数等）
- 现在：整个 `"use client"`，因为数字滚入屏幕时有“滚动计数”动画（`rollFrame` + IntersectionObserver）。
- 拆法：服务端输出最终数字和标签（这也是不开 JS、爬虫、减少动效用户看到的内容）；新建客户端小组件 `FactRoll`，只包每个数字本身，负责滚动动画。现有逻辑“已在屏幕内就不滚”“减少动效不滚”必须保留（见组件内注释）。

### 4. SiteHeader（全站页头，850 行）· 最大、最该小心
- 现在：整个 `"use client"`。交互部分：菜单抽屉（`useOverlayPresence` + 动态导入 `SiteMenuDrawer`）、搜索框（`SearchDialog`）、`LocalePicker`、导航下拉“货架”（shelf）、宽度溢出检测（`navOverflows`）、`usePathname` 当前页高亮、Esc 与焦点回退（b5f370fef08）。
- 拆法：Logo、导航链接的 HTML 在服务端输出；交互各自成岛：`HeaderMenuButton`（含抽屉）、`HeaderSearchButton`（含搜索框）、`LocalePicker`（本来就是独立组件）、`HeaderShelves`（下拉货架）、当前页高亮用一个小客户端组件给链接加 `aria-current`。
- 注意：这是全站共用组件，改动影响 8,800 多页。溢出检测、下拉货架、Esc/焦点逻辑都有测试（`header-shelf.test.ts`、`mobile-navigation.test.ts`、`menu-experience.test.ts`、`overlay-layering.test.ts`），全部要过。**建议单独一个提交、单独一次发布**。

### 5. HeroCarousel（首页轮播）· 可以不做
- 现在：自动播放、暂停条件、滑动、切换动画全在客户端，逻辑本来就是交互的主体。
- 可选拆法：第一张图和说明由服务端输出（它已经是 LCP 元素并有预加载），后两张和切换逻辑放客户端岛。收益最小、风险中等，**排最后，做完前四个再评估**。

## 规矩（必须遵守）

1. **外观、文案、动效零变化**。动效时长只用 `--motion-*` 令牌（`node scripts/check-motion-tokens.mjs` 要过）；不改任何图片。
2. **十个语种都要对**：en / es / pt（手写字典）和七个 overlay 语种（`content/i18n/<code>/ui.json`）。服务端组件用 `@/lib/i18n` 的 `dict/tx`，客户端岛用 `@/lib/i18n-client` 的；客户端岛里新增的界面句子要让 `npm run i18n:keys` 重新生成客户端子集。
3. **无障碍不能退步**：焦点顺序、`aria-expanded`、`aria-current`、Esc 关闭与焦点回退、减少动效——行为与现在一致。
4. **不依赖 requestAnimationFrame 做“挂载/显示”**：0 帧环境（后台标签、部分内嵌 webview）里功能必须仍可用（见 `src/hooks/useOverlayPresence.ts` 09-28 的修复）。
5. 不跑 `release:hyde`、不推 `out/`（09-28 起发布只由工程会话做）。推完源码给工程会话发「源码已推：<哈希>，要发布」。

## 验收（每个组件做完都要）

- [ ] `npx tsc --noEmit`、`npm test`、`npm run test:export` 全绿；`node scripts/check-motion-tokens.mjs` 通过。
- [ ] 本地构建后对比改前改后：`out/` 首页引用的 JS 总字节（压缩后）减少，并在提交说明里写出数字。
- [ ] 截图对比 en / fr / ar 首页与一个产品页，1440 和 390 两种宽度：改前改后肉眼无差别。
- [ ] 浏览器控制台无 hydration 报错（mismatch）。
- [ ] 手动走一遍：菜单开关（点击、Esc、焦点回退）、搜索开关、语言面板、手机上“More links”展开、数字栏滚动计数、轮播自动播放与悬停暂停。
- [ ] 上线后（工程会话发布）用 Lighthouse 手机测首页 3 次取中位，记录 TBT 与脚本字节，和本单“现在”一列对比。

## 建议的提交与发布节奏

1. WelcomeIntro + SiteFacts（首页局部，风险低）→ 一次发布。
2. SiteFooter（全站，风险低）→ 一次发布。
3. SiteHeader（全站，风险高）→ 单独发布，发布后重点实测。
4. HeroCarousel 视前三步的实测收益再决定。

## 参考

- 首页结构：`src/app/(en)/page.tsx`；七语种首页：`src/components/locale-pages/HomePage.tsx`。
- 浮层与动效：`src/hooks/useOverlayPresence.ts`、`src/app/globals.css` 中 `.overlay-presence / .overlay-panel / .locale-sheet`。
- 性能预算测试：`src/components/site/static-export-performance.test.ts`。
