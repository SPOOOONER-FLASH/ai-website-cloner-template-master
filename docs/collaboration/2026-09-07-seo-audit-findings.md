# 2026-09-07 · Bing 与 Google 数据核查：一个问题比列出来的所有问题都大

甲方送来 Bing Site Scan、SiteExplorer URL 导出、AI Performance 截图与 Top Recommendations。
下面每一条都是从那些文件里读出来或在构建产物上量出来的，不是推断。

---

## 一、Bing 抓的根本不是我们的网站

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

**我们建的 1,089 页里，Bing 只知道 9 页。** 它把全部抓取预算花在了一个已经不用的 PHP 站上。

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

### 唯一该做的事，在服务器上，不在代码里

**旧 PHP 站还活着，371 个 URL 返 200。** 它在和新站抢抓取预算、抢关键词，而且
Site Scan 报的重复标题、薄内容、缺 h1 全部是它的。

处理办法只有两个，二选一，都得在宝塔那边做：

1. **整站 301 到新站对应页**（能对上的对上，对不上的指到 `/products/`）；
2. 或者**关掉 PHP 站**，让那些 URL 返 410。

第 1 个更好：那些 URL 累了三年的信号，301 能把它们传过来。
**这一步没做，新站的收录就一直是现在这个样子。** 已写进
`docs/collaboration/CLIENT-RUNBOOK.md`。

---

## 二、「在 Search Console 里对那三个桶点『验证修复』」是什么

那是 **Google Search Console → 网页（索引编制）** 里的流程，不是 Bing 的。

页面被排除时 GSC 会按原因分桶，例如「已抓取 — 尚未编入索引」「重复网页，Google
选择了不同的规范网页」「网页会自动重定向」。修好之后，**点那个桶里的「验证修复」
按钮**，Google 会重新抓一批样本；通过了整桶标记为已修复，并且会优先重抓，
比等它自己发现快很多。

「那三个桶」指的是我们之前定位的三类。**现在能点的只有一类** ——
其余两类的成因是上面第一节那件事（旧站还在返 200），**在旧站处理掉之前点验证会失败**，
而失败一次 GSC 会拉长下次重试的间隔。所以顺序是：先处理旧站，再点验证。

---

## 三、robots.txt 与图片 sitemap：都是通的

**robots.txt** 明确列出**六个**具名 AI 爬虫并全部 `Allow`：
`GPTBot`、`ClaudeBot`、`Claude-User`、`PerplexityBot`、`Google-Extended`、`CCBot`，
另有通配 `*`（通配不是爬虫，不计入六个之内）。只 `Disallow` 了 `/admin/`、`/cdn-cgi/` 和 `*.txt$`
（后者挡的是 Next.js 的 RSC 数据文件；`llms.txt` 和站点验证文件用更具体的 `Allow` 放行，
按最长匹配优先规则它们是通的）。Sitemap 已声明。

**图片 sitemap**：`out/sitemap.xml` 里有 **6,548 条 `<image:image>`**。图片都在。

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
