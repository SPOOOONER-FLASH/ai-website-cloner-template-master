# 2026-09-07 · Bing 与 Google 数据核查

> **给赶时间的人：不需要你做任何服务器操作。** Bing 报的七类问题几乎全是旧 PHP 站的，
> 而旧站的 301 早在 09-04 就生效且映射正确 —— 报表里那些 200 是 7、8 月的抓取快照。
> 唯一要动手的一件事在第二节：GSC 里点「验证修复」。

甲方送来 Bing Site Scan、SiteExplorer URL 导出、AI Performance 截图与 Top Recommendations。
下面每一条都是从那些文件里读出来或在构建产物上量出来的，不是推断。

---

## 一、Bing 抓的大多不是我们的网站（但这已经不是问题了）

`cantonlock.com_SiteExplorerUrls_2026_9_7.csv` 里 **381 个 URL**：

| | 数量 | HTTP |
|---|---|---|
| **旧 PHP 站 `index.php?...`** | **372** | 371 个返 **200** |
| 新站 | **9** | 全部 200 |

新站被 Bing 抓到的，只有这九页：

```
/            imp=64 clicks=28      /company     imp=15 clicks=2
/product-finder imp=4 clicks=1     /events      imp=2
/services  /newsletter  /contact  /certifications  /faq   ← 全部 0 展示
```

**我们建的 1,089 页里，Bing 只知道 9 页。** 它把大部分抓取预算花在了旧 PHP 站的
URL 上 —— 不过下一节会看到，那些 URL 现在已经全部 301 到新站，Bing 只是还没重抓完。

### 所以 Site Scan 那七条讲的是旧站

我写了 `scripts/audit-page-defects.mjs`，用**同样的判据**量我们自己的构建产物：

| Bing 报的问题 | Bing 计数 | 我们 1,088 页实测 |
|---|---|---|
| 缺 `<h1>`（高严重性） | 4 | **0**（下方说明） |
| 许多页面标题相同 | 42 | **2 组** |
| meta description 过短 | 21 | **3** |
| 页面标题过短 | 17 | **1** |
| 内容不足 | 11 | **7**（下方说明） |
| `<img>` 缺 alt | 4 | **0** |

审计初报「缺 h1 7 页 / 内容不足 7 页」，逐个打开后是**同一批文件，而且它们是对的**：
`/products/door-hinges/` 这类是 taxonomy 改名留下的重定向存根，页面里写着

```
NEXT_REDIRECT;replace;/products/brass-steel-hinges/;308
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="https://cantonlock.com/products/brass-steel-hinges/">
```

它们从不渲染，只跳转，`noindex` 已经把它们排除在索引之外。**不是缺陷。**
剩下的 `/admin/`、`/404/`、`/_not-found/` 同理。

### ⚠ 更正：那 371 个 200 是过期快照，重定向其实是好的

本文初稿的结论是「旧 PHP 站还活着，需要你上服务器做 301」。**那是错的**，
而且是会让你白跑一趟宝塔的那种错。逐条实测之后：

| 实测的旧 URL | 结果 |
|---|---|
| `/index.php` | 301 → `/` |
| `/index.php?lang=es` | 301 → **`/es/`** |
| `/index.php?...&tid=118&lang=cn` | 301 → `/products/` |
| `/index.php?...&aid=488` | 301 → `/products/hardware-accessories/dv07-door-viewer/` |
| `/index.php?...&aid=297&lang=en` | 301 → `/products/glass-door-accessories/f112-glass-door-patch-fittings/` |

**重定向不但生效，而且是逐条精确映射的** —— 产品页跳到对应产品页，不是一股脑
扔到 `/products/`；西语跳西语。这正是 `CLIENT-RUNBOOK.md` 第 1b 节要的效果，
说明你 2026-09-04 那次改动做成了。

那 CSV 里的 200 是怎么回事？**是 Bing 的最后抓取时间。** 按日期分布：

```
2026-07  110 个     2026-08  212 个     2026-09  7 个
```

**322 个是 7–8 月抓的，早于 09-04 的修复。** 而 9 月重抓的那 7 个里，
**6 个返回 301**；唯一显示 200 的那条抓取于 09-03，也在修复之前。

**所以这件事不需要你做任何操作。** Bing 重抓完这批 URL，那些计数会自己降下去。
唯一要做的是等，以及别把这份 CSV 当成当前状态 —— 它是一年的抓取历史叠在一张表上。

**方法上的教训记一笔**：站长工具导出的 HTTP 状态是「最后一次抓取时的状态」，
不是「现在的状态」。把它当现状读，就会像我这样得出一个反的结论，并据此建议
客户去动生产服务器。判断线上状态要 curl，不要读报表。

---

## 二、「在 Search Console 里对那三个桶点『验证修复』」是什么

那是 **Google Search Console → 网页（索引编制）** 里的流程，不是 Bing 的。

页面被排除时 GSC 会按原因分桶，例如「已抓取 — 尚未编入索引」「重复网页，Google
选择了不同的规范网页」「网页会自动重定向」。修好之后，**点那个桶里的「验证修复」
按钮**，Google 会重新抓一批样本；通过了整桶标记为已修复，并且会优先重抓，
比等它自己发现快很多。

**「那三个桶」现在可以点了。** 初稿说要等旧站处理完再点 —— 那是基于上面已更正的
错误前提。旧 URL 的 301 早在 09-04 就生效并且映射正确，所以三个桶背后的成因都已经
消失，剩下的只是 Google 还不知道。「验证修复」就是去告诉它。

点了之后 Google 会分批重抓，通常几天到两周出结果。**期间不要反复点** ——
验证在进行中时重复提交不会加速，而验证失败一次，GSC 会拉长下一次的重试间隔。

---

## 三、robots.txt 与图片 sitemap：都是通的

**robots.txt** 明确列出**六个**具名 AI 爬虫并全部 `Allow`：
`GPTBot`、`ClaudeBot`、`Claude-User`、`PerplexityBot`、`Google-Extended`、`CCBot`，
另有通配 `*`（通配不是爬虫，不计入六个之内）。只 `Disallow` 了 `/admin/`、`/cdn-cgi/` 和 `*.txt$`
（后者挡的是 Next.js 的 RSC 数据文件；`llms.txt` 和站点验证文件用更具体的 `Allow` 放行，
按最长匹配优先规则它们是通的）。Sitemap 已声明。

**图片 sitemap**：`out/sitemap.xml` 的 882 个 `<url>` 里共 **3,274 条 `<image:image>`**，
指向 **1,637 张不同的图片**（同一张图出现在英西两个语言版本，所以条目数是图片数的两倍）。

> 初稿这里写的是 6,548，那是把 `<image:image>` 的开标签和闭标签都数了一遍。
> 正确的数字是 3,274 条 / 1,637 张。

---

## 四、Bing AI Performance：14 次引用，被引最多的是一篇技术文章

| 页面 | 引用数 |
|---|---|
| `/news/reading-door-hardware-model-numbers/` | **7** |
| `/products/panic-exit-devices/` | 3 |
| `/products/lock-cylinders/70sn-lock-cylinder/` | 3 |

**一篇技术文章的引用数，是整个逃生推杠类目页的两倍多。** 这条数据直接支持继续写
技术稿件：答案引擎引用的是解释性内容，不是目录页。

---

## 五、Top Recommendations 里唯一我们该在意的一条

> 「你的网站没有足够的来自高质量域的入站链接」

其余五条上面都核过了，是旧站的。这一条是真的，而且是唯一一条代码解决不了的：

- 首页 98 条反向链接，`index.php?lang=en` 4 条，**其余 379 个 URL 全部 0 条**。
- 新站 1,089 页，外部链接基本为零。

这需要的是 PR、行业目录、展会页面、经销商站点回链 —— 不是站内优化。

---

## 六、我以买家身份走了一遍，三条意见

**一、首页说清了「有什么」，没说清「凭什么」。** 数据带给了 361 个型号、15 个类目、
ISO 9001、1998 年建厂 —— 都是规模。但一个要下一个柜的采购看完这些，仍然不知道
出错了怎么办：换货怎么算、样品多久、验货能不能第三方。这些答案在 `/faq` 里，
但首页没有一条通往它的路。

**二、435 个型号，没有一条「帮我选」的入口在第一屏。** 配置器和 Product Finder 都做好了，
但都在导航第二层。买家的第一个动作是找自己那扇门配什么，不是浏览类目。

**三、最强的资产埋得最深。** 被 AI 引用最多的那篇文章在 `/news/` 底下，
首页没有任何位置提到它。79 张尺寸线图分散在 79 个产品页里，没有索引，
甲方自己都问「CAD 图在哪我怎么找不到」—— 买家更找不到。

---

## 七、复现

```bash
node scripts/audit-page-defects.mjs      # 本文第一节的实测数字
node scripts/audit-seo-geo.mjs           # 0 错 0 警告 11 项通过
npm run seo:anchors                      # 零空锚文本
npm run seo:citability                   # 总分 71
```
