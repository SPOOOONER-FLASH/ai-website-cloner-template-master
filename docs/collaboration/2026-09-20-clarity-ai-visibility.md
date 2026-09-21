# Clarity AI Visibility 读数（2026-09-20，最近 7 天）

> **口径警告（先读这一段）**
>
> 本文所有数字是**从 Clarity 控制台界面逐个抄下来的**，不是脚本算出来的。
> 按 `AGENTS.md` 的生成器规则，这样的数字会过期而且没人知道它过期了 ——
> 所以本文每一节都注明了「用什么命令能重新得到它」，重跑之前不要引用这里的数字做决策。
>
> **和 `2026-09-18-ai-citations.md` 不是同一份数据，不要混。**
>
> | | 那一份 | 本文 |
> |---|---|---|
> | 来源 | Bing Webmaster Tools → AI Page Stats 导出 | Clarity → AI Visibility（Microsoft Copilot and partners） |
> | 窗口 | 累计 | **最近 7 天** |
> | 引用数 | 135 | 33 |
> | 可重跑 | `npm run audit:citations -- <csv>` | Clarity 控制台右上角下载按钮 → 同一个脚本 |

---

## 一、Citation：33 条引用，全部来自文章，产品页 0 条

| 指标 | 数值 | 怎么读 |
|---|---|---|
| Citations | **33** | 7 天内 Copilot 在回答里引用我们页面的次数 |
| Share of authority (SoA) | **24.63%** | 在这些问题的全部 134 条引用里我们占 33 条，其余 101 条属于别人 |
| AI referral traffic | **25 个会话 / 占全站 6.89%** | 被引用之后真的点进来的人 |
| Branded | **0%（0 条）** | **没有一个人是搜「Canton Hyland」找到我们的** |
| Non-branded | 24.63%（33 条） | 全部 33 条来自不带品牌名的问题 |

### 被引用的 8 个页面

| # | 页面 | 引用 |
|---|---|---|
| 1 | `/news/push-bar-or-touch-bar-panic-exit-devices/` | **10** |
| 2 | `/news/master-key-systems-how-many-levels-you-need/` | 6 |
| 3 | `/news/fitting-a-euro-cylinder/` | 6 |
| 4 | `/news/finish-codes-us26d-626-630/` | 6 |
| 5 | `/news/door-coordinator-double-fire-door/` | 2 |
| 6 | `/es/news/door-coordinator-double-fire-door/` | 1 |
| 7 | `/news/mortise-lock-backset-and-centre-distance-guide/` | 1 |
| 8 | `/es/news/deadbolt-d101-d102-and-the-rim-alternative/` | 1 |

**八个全部是 `/news/`。519 个产品页一条都没有。** 这和 Bing 那份的结论（文章 81%）
方向一致，但 Clarity 这份更极端 —— 7 天窗口里产品页是 **0**。

### 触发引用的问题（Grounding queries）

| # | 问题 | 引用 | SoA |
|---|---|---|---|
| 1 | standard euro cylinder installation manual | 6 | 30.00% |
| 2 | mechanical advantages box-style exit device vs touch-bar | 4 | **44.44%** |
| 3 | paanic touch bar vs push bar *(买家拼错了)* | 3 | 33.33% |
| 4 | steel finish code 626? | 3 | 23.08% |
| 5 | can chrome metal finish be satin | 3 | 33.33% |
| 6 | panic touch bar vs push bar | 3 | 33.33% |
| 7 | how many master and change keys can be provided in a grand master key system | 3 | 33.33% |
| 8 | how many future master and change keys should be planned for in a grand master… | 3 | 23.08% |

**第 1 条值得单独记一笔。** `fitting-a-euro-cylinder` 是 2026-09-13 为了替掉「把 MIWA 的
安装说明放我们站上」那个想法而自己写的（`OPEN-ITEMS.md` 第五节第 7 条）。写它的理由是
「新加坡那个 ChatGPT 来的真人在下载页停了 5 分 14 秒、0 点击，因为下载页没有可下的技术资料」。
**七天之内它就成了引用榜第三、并且是全站 SoA 最高的问题之一。** 抄 MIWA 拿不到这个结果 ——
被引用的是我们自己的句子。

---

## 二、Bot activity：爬虫预算花在了不产引用的地方

Provider: Cloudflare · Traffic type: AI bots · 最近 7 天 · 约 3,267 次请求

### 响应状态

| 状态 | 占比 | 次数 | 含义 |
|---|---|---|---|
| Successful | 65.78% | 2,149 | 正常 |
| **Redirected** | **26.05%** | **851** | 跳转规则在替我们接住旧地址 |
| **Unsuccessful** | **8.17%** | **267** | ⚠ **要查的就是这 267 次** |

**Redirected 26% 是那些 nginx 301 规则值得一直维护的又一个证据** —— 每四次 AI 抓取就有
一次落在旧 URL 上。规则一停，这 851 次直接变成死链。

**Unsuccessful 267 次是本文唯一一条明确的待办。** Clarity 不说是哪些地址失败的，
所以下一步是从 Clarity 的下载按钮导出明细，或者按 `2026-09-18-ai-citations.md` 的办法
逐个请求验证。⚠ 在拿到明细之前**不要猜是什么原因** —— 上一次「Google 报 30 个视频不在
观看页面上」就是靠排除法逐条排掉四种可能才定位到 `preload="none"` 的。

### 请求的内容类型

| 类型 | 占比 | 次数 |
|---|---|---|
| HTML | 79.58% | 2,600 |
| Image | 7.25% | 237 |
| Unknown | 4.16% | 136 |
| Text | 3.95% | 129 |
| JavaScript | 2.48% | 81 |
| Other | 2.57% | 84 |

### 爬虫把时间花在哪一类页面上 —— 这张表和第一节的表对不上

| 页面类型 | 爬虫请求占比 | 次数 | 同期产生的引用 |
|---|---|---|---|
| Product | **49.46%** | 1,414 | **0** |
| Homepage | 22.95% | 656 | 0 |
| Unknown | 13.19% | 377 | — |
| Contact Us | 7.49% | 214 | 0 |
| **News & Articles** | **4.51%** | **129** | **33（全部）** |
| Other | 2.41% | 69 | — |

**爬虫把一半的预算花在产品页上，拿到 0 条引用；花 4.5% 在文章上，拿到全部 33 条。**

这不是「要挡住爬虫抓产品页」。这是 `2026-09-18-ai-citations.md` 第四节第 3 条的同一件事
换一个角度：**没有数字的页面不会被引用，因为它没有可引用的东西。** 产品页被抓了 1,414 次，
每一次引擎都看了一遍，每一次都决定不引用。工厂欠的那六个订单码、五个板尺寸、
执手孔位 —— 代价现在有了一个七天的量。

### 转介

OpenAI 是唯一有转介记录的提供方：**14 次转介，比例 2:1**。

---

## 三、Topic insights：「Fire safety compliance」我们是 0

第一份主题报告（2026-09-20 生成，每周 10 份配额用掉 1 份）：

| 指标 | 我们 |
|---|---|
| share of all page citations | **0%** |
| cited across prompts | **0%** |
| content sourced from your pages | **0%** |
| Your top content to AI responses | *No top content available* |

### 这个话题上谁在被引用（共 124 条）

| 域名 | 占比 | 引用 |
|---|---|---|
| cdfdistributors.com | 12.90% | 16 |
| usmadesupply.com | 8.87% | 11 |
| danddhardware.com | 5.65% | 7 |
| watersonusa.ai | 4.84% | 6 |
| topfirefighting.com | 4.84% | 6 |
| 其余全部 | 62.90% | 78 |

按类别：Other 98.39%（122）· Competitor 1.61%（2）· **You 0%（0）**

### Clarity 指出的三个内容缺口

1. **Fire door compliance frameworks** — cdfdistributors / keymanlock / dndhardware / watersonusa / usmadesupply / shopulstandards / danddhardware
2. **International standards comparisons** — cdfdistributors / dndhardware / watersonusa / n1ck.ch / **assaabloy** / usmadesupply / shopulstandards
3. **Fire door hardware selection** — fireresist.co.uk / americanlocksets / cochranedoors / usmadesupply

### 结论：第 2 条是我们的，第 1、3 条不是

榜上全是**北美分销商**，因为这个话题的问题是按北美框架问的（UL 列名、NFPA 80、ANSI）。
`docs/hyde/2026-09-11-weekend-handoff.md` 第六节第 4 条已经写死了这件事：

> 五家竞品全部持有 ANSI A156.3 Grade 1 + UL 逃生器械列名，我们一项没有；
> 我们有 EN 1125 + CE，五家一项没有。**在证书号下来之前，任何材料都不得暗示
> 我们已持有 ANSI 或 UL。**

所以第 1 条（合规框架）和第 3 条（防火门五金选型）**我们不能去抢** —— 抢它就要谈
我们没有的列名。

**但第 2 条「International standards comparisons」正好是我们唯一有独家发言权的题目。**
仓库里已经有两篇：`en-1125-or-ansi-which-standard-your-project-needs`、
`ansi-grade-1-vs-en-1125-exit-devices`。它们**没有出现在这份报告里的任何一个位置**。
两种可能，要先分清是哪一种再动手：

- 引擎没抓到／没认为它们回答了这些问题 → 是内容和结构问题
- 这份报告的 10–15 条 prompt 本来就没问到标准对比 → 是**报告的问题，不是内容的问题**

⚠ 报告用的是 Clarity 自动生成的 prompt（卡片上标着 `AI-generated content`），
我们没有看过那 15 条原文。**在看到 prompt 原文之前，不要据此断定文章写得不好。**

---

## 四、一条工作方法上的教训（原本这里写错了一个结论）

初稿的第四节断言「线上那一版源码不在这个仓库里」，依据是
`git rev-list --count HEAD..origin/main` 返回 0。**那个 0 是假的** ——
那次 `git fetch` 因为仓库有 1.8GB 的 `.git`，在 120 秒超时被切到后台并没有跑完，
`origin/main` 还停在本机上次同步的位置（9-11）。我拿一个没更新的 ref 做了结论。

重新 fetch 完之后：

```
origin/main        = 5e5d6d8a4ed《全量移交：86132 那台 → johns 那台》
HEAD..origin/main  = 168
origin 上 src/app/pt                      存在
origin 上 content/news                    35 篇
origin 上 scripts/audit-ai-citations.mjs  存在
```

**仓库是完整的，是这台机器落后 168 个提交。** 那几份微信文档说的
「仓库已同步到线上」是对的。

保留这一节而不是删掉，是因为教训本身有用，而且和 `OPEN-ITEMS.md`
「搜索后台的数字是历史，不是现状」是同一类错误的新形态：

> **一个超时被切到后台的命令，它的退出码和它的副作用是两回事。**
> `git rev-list` 成功返回了，但它读的是一个 `git fetch` 还没写完的 ref。
> 在这个仓库里，任何依赖 `origin/*` 的判断，都要先确认那次 fetch 真的结束了。

顺带一条给下一个会话的事实：**这个仓库 fetch 一次要超过两分钟。**
Bash 工具默认 120 秒超时，所以 `git fetch` / `git pull` / `git push`
都必须显式加大 timeout，否则会拿到半个结果。

## 五、待办（按能不能自己做排序）

| # | 做什么 | 卡在谁 |
|---|---|---|
| **0** | **这台机器 `git pull`，落后 168 个提交**（第四节） | 自己 |
| 1 | 导出 Clarity bot 明细，查那 **267 次 Unsuccessful** | 自己（先做 #0） |
| 2 | 生成另外两份主题报告（配额 9/10，见下） | 自己，在 Clarity 控制台 |
| 3 | 看到 Fire safety 那份报告的 15 条 prompt 原文，再判断标准对比文章为什么没被引 | 自己 |
| 4 | 产品页补具体数字 | **工厂** —— 六个订单码、五个板尺寸、执手孔位 |

---

## 附：Clarity 是怎么装在站上的

**没有用 `@microsoft/clarity` 这个 npm 包，也不需要用。**

站上用的是官方内联 tag，写在 `src/components/site/Analytics.tsx`，项目 ID
`y8utyrgvv0` 在 `src/data/site.ts`。两点是刻意的，改的时候不要弄丢：

- `strategy="afterInteractive"` —— 不和产品照片抢首屏那一秒
- 整个组件被 `indexable` 挡着 —— 预览域名不会污染生产数据
