# 2026-09-07 · Claude · 产能链滚动段 + Tailwind 扫描范围修复

## 范围

甲方要求「把生产能力、OEM、外贸能力做成滚动/动画」。Codex 已在认领板上占了
HeroCarousel 与首页动效数据，所以首页不动，能力段落做在 `/company` 与 `/es/company`
—— 那是 Bing 里我们展示量第二高的页面，也是买家评估供应商时真正会读的一页。

## 交付

| 文件 | 作用 |
|---|---|
| `src/data/capability.ts` | 七步产线的文案与数字（纯函数） |
| `src/components/site/CapabilityChain.tsx` | 滚动推进的呈现层 |
| `src/data/capability.test.ts` | 6 项断言 |
| `src/components/site/CompanyOverview.tsx` | 插入一行 |
| `src/app/globals.css` | Tailwind 不再扫描构建产物 |
| `scripts/audit-page-defects.mjs` | 对 `out/` 复现 Bing 报的缺陷判据 |
| `docs/collaboration/2026-09-07-seo-audit-findings.md` | Bing/Google 数据核查结论 |

七步：开模 → 冲压 → 抛光 → 表面处理 → 装配 → 检验 → 包装出口。

**动效刻意做小。** 只有两件事在动：左栏标题随滚动固定，进度线随之填充。没有视差、
没有淡入、没有数字滚动。理由不是审美 —— 甲方原则是「不需要花里胡哨，给别人专业的
感觉」，而一个内容靠动画才出现的页面，在 JS 关闭时就是空的。七步全部在首屏 HTML 里，
`curl` 可验证。

## 三个数字，以及为什么只有三个

`361 models in production`（数出来的）、`ISO 9001 certified since 2002`、
`30 days minimum lead time`（甲方 2026-09-01 确认，FAQ 已发布）。

冲压、抛光、装配三步**没有数字**，因为我们没有可举证的压机吨位、线体数或不良率。
更值得记一笔的是第四步：`normaliseFinishes` 跑全目录会得到 76 个不同值，写上去毫不
费力 —— 但 `configurator.ts` 自己的注释就说 `finishes` 是目录里最脏的字段，未映射的
码原样透传，所以那 76 是 15 个有据可查的商品名加 61 个没人核过的原始串。
**在一个唯一目的就是取信的段落上发布这种数字，正是那条诚实纪律要防的事。** 撤掉了。

## 顺手修掉的一个真 bug（不是我引入的）

`next dev` 全站 500，`globals.css` 解析失败：

```
.border-\[var\(--color-li"\]\)\<\/script\>\<script\>self\.__next_f\.push\(...
```

Tailwind v4 自动探测源文件，跳过 `.gitignore` 列出的路径 —— 但 `out/` 和 `out-rayen/`
是**提交进仓库的**，于是约 2,350 个生成 HTML 被当成了源码。其中恰好一个文件
（`out-rayen/products/stainless-steel-handles/index.html`）里，`border-[var(--color-line)]`
落在 RSC `self.__next_f.push([1,"...")` 的分片边界上被截断，Tailwind 把截断串当候选类
提取，生成了非法 CSS，PostCSS 随后无法解析自己刚拿到的样式表。

**一个生成文件里的一个截断字符串，让本地整站挂掉，而源码一行没改。** 修法是
`@source not "../../out"` / `"../../out-rayen"`。这同时修掉一个隐患：扫描自己的构建产物
是循环的 —— 删掉的类名永远不会真正离开 CSS。

## 过程中改对的一处

高亮最初读 `IntersectionObserver` 回调里的 `entry.target`。`entries` 是批次，顺序不是
滚动顺序，取批次里最后一个相交项会乱跳：实测滚到第 3 步亮 05、第 5 步亮 02、第 7 步亮
04。静态截图看不出来，是连读七个滚动位置才发现的。改成按几何判定（哪一步的盒子中心
离视口中线最近），并换成 rAF 节流的 passive scroll 监听。改后七步 1:1 对上，进度条
14.29% → 100%。

## 验证

- `npm run typecheck` / `npm run lint` 干净
- `npm test` 209 项全过（新增 6 项）
- EN 与 ES 两页均服务端渲染出全部七步与三个数字（curl 核对）
- 桌面 1440 宽 sticky 生效、七步映射正确；375 宽 sticky 关闭、进度读数隐藏、无横向溢出

## 没碰的东西

`out/`（6,665 项变更）与 `out-rayen/`（2,872 项）都脏 —— **发布接力棒在 Codex 手上**，
我没有构建也没有暂存任何产物。本次只提交源码，上线需要由持棒者重新构建 `out/`。

## 下一步

同一批任务里还剩：三篇新文章、全项目未完成事项审计、以及客户视角评审。

记得 purge。
