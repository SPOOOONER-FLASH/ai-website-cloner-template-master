# 2026-09-09 · Claude — 全量 SEO/GEO 复查：西语站 600 页从首页走不到

## 一句话

甲方要求做全量 SEO/GEO 验证。跑下来 12 项里 11 项本来就是清的，剩下 1 项是个大的：
**全部 600 个西语页面，从英文首页出发没有任何一条渲染链接能走到。** 已修，复查全清。

## 一、这个洞是怎么来的

`npm run seo:graph` 报 `unreachable-from-home (600)`。

追下去是 2026-09-08 那次改动的副作用：把页头裸的「EN | ES」换成位置语言面板之后，
**面板只在展开时挂载**，所以导出的静态 HTML 里根本不存在 `<a href="/es/...">`。
而在那之前，页头那个普通 anchor 就是整个西语站唯一的入站路径。

证据是可复现的，不是推断：

```bash
git show 115d733320~1:out/index.html | grep -o 'href="/es[^"]*"'   # → href="/es/"
git show 115d733320:out/index.html   | grep -o 'href="/es[^"]*"'   # → 空
```

**hreflang 补不上这个洞。** 它是 `<head>` 里的 `<link rel="alternate">`，是「这两页等价」
的提示，不是链接图里的一条边；爬虫不会靠它去发现一棵从没见过的树。审计里
`orphan-in-sitemap` 是清的（西语页之间互相有链接），恰恰掩盖了「整片区域没有入口」
这件事 —— 两个指标测的不是一回事。

## 二、修法

`SiteFooter.tsx` 每页渲染一条服务端 anchor，指向本页的对应语言版本；
`hasSpanishMirror()` 说没有镜像时指向该语言首页。**和面板、和 hreflang 用同一个真值
来源**，三者不会互相矛盾，也不会从页脚点出一个 404。

选页脚不选页头，是因为面板的注释里已经写明了理由：常驻挂载会把每个代表处地址和电话
塞进全部 1,352 页的 DOM。页脚只多一条 anchor。

## 三、复查结果

| 审计 | 结果 |
|---|---|
| `seo:graph` | **11 项全清，0 error 0 warning**（改之前 1 error） |
| 首页点击深度 | 0:1 / 1:57 / 2:**599** / 3:547 —— 无可索引页超过 3 次点击 |
| `seo:audit` | 1,204 可索引页，JSON-LD 1,204，hreflang 1,200，**语义问题 0** |
| `seo:deadlinks` | 1,352 页，**100,989 条内链 + 29,804 条资源引用全部解析** |
| `seo:anchors` | 95,521 条内链，**无空锚文本** |
| `seo:citability` | 总分 **67/100** |
| `test:export` | 通过；`predeploy-check` 报 out/ 新于所有源文件 |

改前 `unreachable 600`，改后 `unreachable 0`；深度 2 那一档从 547 涨到 599，正是那
600 页 —— 数字对得上，不是审计换了口径。

### citability 的分布说明了下一步该做什么

| 页面类型 | 分 | 每页具体数字 |
|---|---|---|
| `/product-finder` | **75** | **29** |
| `/company` | 75 | 10 |
| `/products/*`（534 页） | 70 | 6.2 |
| `/compare/*` | 63 | 17.5 |
| `/collections/*`（19 页） | 41 | 2.1 |
| `/projects/*` | 39 | 0 |
| `/request/price-list` | 32 | 0 |

**差距全在「有没有写出可核对的数字」，不在文笔。** 而 collections 和 projects 这几类
页面要的数字 `content/products` 里就有（型号数、表面覆盖、认证），**不用等工厂**。
这是目前投入产出比最高的一块。

## 四、⚠ 给 Codex：一条未提交的改动打破了 `npm test`

`npm test` 从 233/233 变成 232/233，唯一失败的是：

```
✖ legacy underline utilities cannot recreate the double-line interaction
  src\components\rayen\Chrome.tsx: hover:underline
```

`short-marker.test.ts` 锁的是全仓库禁用 `underline` 系工具类的规矩 —— 站点只有一个
共享交互标记 `.short-marker`（双线，`:focus-visible` 时也出现），第二种手写下划线会读作
另一类东西。

**没有碰这个文件**（是你未提交的工作）。本次构建之前跑的 `npm test` 是 233/233 全过，
所以这条是刚出现的。改 `hover:short-marker short-marker-compact` 就能过。

## 五、本次的另外三件事（同日，见前一条 update）

1. 无图型号从四个浏览面真正下架，浏览面列出的型号 573 → 517
2. 页头语言标签 `INT | EN` → `ES | EN`
3. 甲方答复「LC 锁体配 072 逃生锁，072 防火锁体有两个葫芦孔的」写进两份文档，
   并由此发现 **072 在目录里没有产品记录**，而 307（询盘第一）的规格行点名了它

## 六、新增《新chat 工程交接》

`docs/collaboration/2026-09-09-new-chat-handoff.md`，甲方要求单独生成、推上线、
在另一台电脑取。十节，写给从零开始的会话，读完就能上手。

文件名用 ASCII：Git Bash 在 Windows 下对中文路径的 pathspec 匹配不稳
（`git commit -- <中文路径>` 报 `did not match any file(s) known to git`，
而 `git status` 里那个文件是以八进制转义显示的）。文档标题仍是「新chat 工程交接」。

## 七、没碰的东西

Codex 的 `src/components/rayen/**`、`src/app/zh/**`、`content/rayen/site.json`
（这三处**已经 staged**，是他们 mid-commit 的状态 —— 用 `git commit -- <路径>` 提交，
pathspec 形式会忽略索引里的其余部分，他们的暂存原样保留）、
`docs/design-references/2026-09-09-style-batches/`、`scripts/blender/**`、
`tsconfig.json`、`HeroCarousel.tsx`。

**`out-rayen/` 这次没有提交** —— 它由 Codex 未提交的 zh 源码构建而成，归他们。
只提交了 `out/`。

## 八、下一个有用的接手

1. **collections / projects / request 补具体数字** —— 不依赖任何人，citability 38–41 分
2. **072 的照片和规格** —— 全站单点优先级最高，理由见交接文档第四节
3. Codex 修 `Chrome.tsx` 的 `hover:underline`，`npm test` 回到全绿
